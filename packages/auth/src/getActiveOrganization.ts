/**
 * getActiveOrganization — Resolves the active organization for a user session.
 *
 * Priority order:
 *   1. Explicit `organizationId` parameter (passed directly by caller).
 *   2. Cookie: "active_organization_id" (user has previously selected an org).
 *   3. Fallback: first membership found for this user.
 *
 * IMPORTANT: Resolution never bypasses membership verification. An organization
 * ID obtained from a cookie or parameter is always cross-checked against the
 * memberships table before being returned.
 */

import { cookies } from "next/headers";
import { ForbiddenError, NotFoundError } from "./errors";
import { createAdminClient } from "./supabaseAdmin";
import type { Role } from "./roles";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ACTIVE_ORG_COOKIE = "active_organization_id";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActiveOrganization {
  /** The resolved organization's UUID. */
  organizationId: string;
  /** The organization name. */
  organizationName: string;
  /** The user's role inside this organization. */
  role: Role;
  /** The membership record's UUID. */
  membershipId: string;
}

// ---------------------------------------------------------------------------
// getActiveOrganization
// ---------------------------------------------------------------------------

/**
 * Resolves the active organization for a given user, verifying membership.
 *
 * @param userId         - The authenticated user's UUID (from auth.users).
 * @param organizationId - Optional explicit organization ID to resolve.
 *
 * @throws {NotFoundError}  If the user has no memberships at all.
 * @throws {ForbiddenError} If the user is not a member of the requested org.
 *
 * @example
 * const { organizationId, role } = await getActiveOrganization(userId, explicitOrgId);
 */
export async function getActiveOrganization(
  userId: string,
  organizationId?: string | null
): Promise<ActiveOrganization> {
  const supabase = createAdminClient();

  // --- Path A: explicit organizationId provided ---
  if (organizationId) {
    return resolveAndVerifyMembership(supabase, userId, organizationId);
  }

  // --- Path B: check cookie for previously active org ---
  const cookieStore = cookies();
  const cookieOrgId = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;

  if (cookieOrgId) {
    // Verify membership before trusting the cookie value.
    try {
      return await resolveAndVerifyMembership(supabase, userId, cookieOrgId);
    } catch {
      // Cookie contains a stale/invalid org — fall through to fallback.
    }
  }

  // --- Path C: fallback — user's first membership ---
  const { data: memberships, error } = await supabase
    .from("memberships")
    .select("id, organization_id, role, organizations(id, name)")
    .eq("user_id", userId)
    .order("joined_at", { ascending: true })
    .limit(1);

  if (error) {
    console.error("[AUTH] Failed to fetch memberships for fallback:", error);
    throw new ForbiddenError("Could not resolve organization membership.");
  }

  if (!memberships || memberships.length === 0) {
    throw new NotFoundError(
      "This user does not belong to any organization. Complete onboarding first."
    );
  }

  const m = memberships[0];
  const org = m.organizations as unknown as { id: string; name: string } | null;

  if (!org) {
    throw new ForbiddenError("Organization data could not be resolved.");
  }

  return {
    organizationId: org.id,
    organizationName: org.name,
    role: m.role as Role,
    membershipId: m.id,
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Fetches the membership for (userId, organizationId) and verifies it exists.
 * This is the single verification point — always called before returning an org.
 */
async function resolveAndVerifyMembership(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  organizationId: string
): Promise<ActiveOrganization> {
  const { data: membership, error } = await supabase
    .from("memberships")
    .select("id, role, organizations(id, name)")
    .eq("user_id", userId)
    .eq("organization_id", organizationId)
    .single();

  if (error || !membership) {
    throw new ForbiddenError(
      "You are not a member of the requested organization."
    );
  }

  const org = membership.organizations as unknown as { id: string; name: string } | null;

  if (!org) {
    throw new ForbiddenError("Organization data could not be resolved.");
  }

  return {
    organizationId: org.id,
    organizationName: org.name,
    role: membership.role as Role,
    membershipId: membership.id,
  };
}
