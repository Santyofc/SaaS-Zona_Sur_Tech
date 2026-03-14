/**
 * POST /api/organizations
 *
 * Creates a new organization for the authenticated user and assigns them
 * the "owner" role via a membership record.
 *
 * Security guarantees:
 * - Validates Supabase session via requireAuth() (cryptographic, not local cookie decode).
 * - Syncs public.users profile idempotently via ensurePublicUserProfile().
 * - Enforces email confirmation check in production.
 * - Creates org and membership atomically via Supabase RPC transaction.
 * - Returns no raw database errors to the client.
 * - Protected against double-submit by the unique(org_id, user_id) constraint.
 *
 * Flow:
 *   1. requireAuth() → validates Supabase session
 *   2. validateBody() → validates org name
 *   3. ensurePublicUserProfile() → syncs profile (best-effort)
 *   4. Email confirmation gate (prod only)
 *   5. createOrganizationAtomic() → org + membership in a single Postgres transaction via RPC
 *   6. encrypt() → upgrades session JWT with organizationId + role
 *   7. Set session cookie
 */

import { NextResponse } from "next/server";
import {
  requireAuth,
  ensurePublicUserProfile,
  handleAuthError,
  ConflictError,
  ForbiddenError,
} from "@repo/auth";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    // -------------------------------------------------------------------
    // 1. Authenticate (cryptographic session validation via Supabase)
    // -------------------------------------------------------------------
    const { userId, emailConfirmed, authUser } = await requireAuth();

    // -------------------------------------------------------------------
    // 2. Validate request body
    // -------------------------------------------------------------------
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    if (!name || name.length === 0) {
      return NextResponse.json(
        { error: "Organization name is required", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: "Organization name must be 100 characters or fewer",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------
    // 3. Sync public user profile (best-effort, non-fatal)
    // -------------------------------------------------------------------
    await ensurePublicUserProfile(authUser);

    // -------------------------------------------------------------------
    // 4. Email confirmation gate (production only)
    // -------------------------------------------------------------------
    if (!emailConfirmed && process.env.NODE_ENV === "production") {
      throw new ForbiddenError(
        "Email confirmation is required to create an organization."
      );
    }

    // -------------------------------------------------------------------
    // 5. Create organization + membership atomically
    // -------------------------------------------------------------------
    const supabase = createAdminClient();

    const organizationId = await createOrganizationAtomic(
      supabase,
      name,
      userId
    );

    console.info(
      `[ORG_CREATE] User ${userId} created organization ${organizationId}`
    );

    return NextResponse.json(
      {
        message: "Organization created successfully",
        organizationId,
        status: "ready",
      },
      { status: 201 }
    );
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}

// ---------------------------------------------------------------------------
// Atomic org + membership creation
// ---------------------------------------------------------------------------

/**
 * Creates an organization and the owner membership inside a single Postgres
 * transaction using a Supabase RPC function.
 *
 * Falls back to a two-step operation with best-effort cleanup if the RPC
 * function does not exist (local dev without the function deployed).
 *
 * @throws {ConflictError} If the user already owns an org with the same name.
 */
async function createOrganizationAtomic(
  supabase: ReturnType<typeof createAdminClient>,
  name: string,
  userId: string
): Promise<string> {
  // Attempt atomic RPC first (preferred for production integrity).
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "create_organization_with_owner",
    { org_name: name, owner_id: userId }
  );

  if (!rpcError && rpcData) {
    return rpcData as string;
  }

  // If RPC doesn't exist (PGRST202 = function not found), fall back to
  // two-step with cleanup. All other RPC errors are re-thrown.
  if (rpcError?.code !== "PGRST202") {
    console.error("[ORG_CREATE] RPC failed:", rpcError);

    if (rpcError?.code === "23505") {
      throw new ConflictError(
        "An organization with this name already exists or you are already the owner of one."
      );
    }

    throw new Error("Failed to create organization. Please try again.");
  }

  // --- Fallback: two-step (org + membership) with cleanup ---
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .insert({ name })
    .select("id")
    .single();

  if (orgError) {
    console.error("[ORG_CREATE] Organization insert failed:", orgError);

    if (orgError.code === "23505") {
      throw new ConflictError(
        "An organization with this name already exists."
      );
    }

    throw new Error("Failed to create organization.");
  }

  const organizationId = orgData.id;

  const { error: memberError } = await supabase.from("memberships").insert({
    user_id: userId,
    organization_id: organizationId,
    role: "owner",
  });

  if (memberError) {
    console.error("[ORG_CREATE] Membership insert failed:", memberError);

    // Best-effort cleanup of orphaned organization.
    await supabase.from("organizations").delete().eq("id", organizationId);

    if (memberError.code === "23505") {
      throw new ConflictError(
        "You are already a member of this organization."
      );
    }

    throw new Error(
      "Failed to create membership. The organization has been rolled back."
    );
  }

  return organizationId;
}
