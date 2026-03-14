/**
 * GET /api/auth/me
 *
 * Returns the authenticated user's profile, active organization context,
 * and all active memberships (for workspace switching).
 *
 * Security:
 * - Session validated via requireAuth() (cryptographic Supabase check).
 * - Role resolved from database memberships, not session cookie.
 * - Memberships query uses service-role admin client (no RLS bypass needed from client).
 */

import { NextResponse } from "next/server";
import {
  requireAuth,
  getActiveOrganization,
  getPermissions,
  handleAuthError,
} from "@repo/auth";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Validate Supabase session.
    const { userId, email, emailConfirmed, authUser } = await requireAuth();

    const displayName =
      authUser.user_metadata?.display_name ||
      authUser.user_metadata?.full_name ||
      email.split("@")[0];

    // 2. Attempt to resolve active organization (non-fatal if user has none yet).
    let organizationContext: {
      id: string;
      organizationId: string;
      organizationName: string;
      role: string;
      permissions: readonly string[];
    } | null = null;

    try {
      const orgCtx = await getActiveOrganization(userId);
      organizationContext = {
        id: orgCtx.organizationId,
        organizationId: orgCtx.organizationId,
        organizationName: orgCtx.organizationName,
        role: orgCtx.role,
        permissions: getPermissions(orgCtx.role),
      };
    } catch {
      // User hasn't completed onboarding — return profile without org context.
    }

    // 3. Load all active memberships for the workspace switcher.
    let memberships: Array<{
      membershipId: string;
      organizationId: string;
      organizationName: string;
      role: string;
      status: string;
    }> = [];

    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("memberships")
        .select("id, organization_id, role, status, organizations(name)")
        .eq("user_id", userId)
        .eq("status", "active");

      memberships = (data ?? []).map((row) => {
        const orgName = Array.isArray(row.organizations)
          ? (row.organizations[0] as { name?: string } | undefined)?.name ?? "Unknown"
          : (row.organizations as { name?: string } | null)?.name ?? "Unknown";

        return {
          membershipId: row.id,
          organizationId: row.organization_id,
          organizationName: orgName,
          role: row.role,
          status: row.status,
        };
      });
    } catch {
      // Non-fatal — workspace switcher will show limited view.
    }

    return NextResponse.json({
      user: {
        id: userId,
        email,
        emailConfirmed,
        name: displayName,
        role: organizationContext?.role ?? null,
      },
      organization: organizationContext
        ? {
            id: organizationContext.organizationId,
            name: organizationContext.organizationName,
          }
        : null,
      memberships,
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
