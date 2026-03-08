/**
 * setActiveOrganization — Sets the active_organization_id cookie.
 *
 * This is the ONLY place in the codebase that should write this cookie.
 * It always verifies active membership BEFORE setting the cookie, so
 * there is no way to privilege-escalate by crafting the cookie value.
 *
 * Use cases:
 * - After accepting an invitation (auto-switches to the new org)
 * - Explicit org switch by the user via POST /api/organizations/switch
 *
 * Security:
 * - Membership is verified against the DB every time.
 * - The cookie value cannot bypass membership verification at read time
 *   (getActiveOrganization always re-checks on every request).
 * - Cookie is httpOnly, sameSite=lax, secure in production.
 */

import { cookies } from "next/headers";
import { ACTIVE_ORG_COOKIE } from "./getActiveOrganization";
import { createAdminClient } from "./supabaseAdmin";
import { ForbiddenError } from "./errors";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SetActiveOrganizationResult {
  organizationId: string;
  organizationName: string;
}

// ---------------------------------------------------------------------------
// setActiveOrganization
// ---------------------------------------------------------------------------

/**
 * Verifies that the user is an active member of `organizationId` and then
 * sets the `active_organization_id` cookie.
 *
 * @param userId         - The authenticated user's UUID (from auth.users).
 * @param organizationId - The organization to switch to.
 *
 * @throws {ForbiddenError} If the user is not an active member of the org.
 *
 * @returns The organization's id and name for response confirmation.
 */
export async function setActiveOrganization(
  userId: string,
  organizationId: string
): Promise<SetActiveOrganizationResult> {
  const supabase = createAdminClient();

  // Verify active membership — the status check is critical here.
  const { data: membership, error } = await supabase
    .from("memberships")
    .select("id, organization_id, status, organizations(id, name)")
    .eq("user_id", userId)
    .eq("organization_id", organizationId)
    .single();

  if (error || !membership) {
    throw new ForbiddenError(
      "You are not a member of the requested organization."
    );
  }

  if (membership.status !== "active") {
    throw new ForbiddenError(
      "Your membership in this organization is not active."
    );
  }

  const org = membership.organizations as unknown as
    | { id: string; name: string }
    | null;

  if (!org) {
    throw new ForbiddenError("Organization data could not be resolved.");
  }

  // Set the cookie — httpOnly, not accessible from JavaScript.
  const cookieStore = cookies();
  cookieStore.set(ACTIVE_ORG_COOKIE, organizationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // 30 days — the user's org preference persists across sessions.
    maxAge: 60 * 60 * 24 * 30,
  });

  return {
    organizationId: org.id,
    organizationName: org.name,
  };
}
