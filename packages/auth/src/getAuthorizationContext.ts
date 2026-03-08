/**
 * getAuthorizationContext — Loads and returns a full authorization context.
 *
 * This is the lowest-level helper directly combining membership resolution with
 * permission computation. Use this when you need the full authorization picture
 * (membership record + permissions + has() helper) without the automatic
 * session validation from requireAuth.
 *
 * Typically you will use `requirePermission()` instead of this directly.
 */

import { createAdminClient } from "./supabaseAdmin";
import { ForbiddenError } from "./errors";
import { getPermissions, hasPermission, type Permission } from "./permissions";
import type { Role } from "./roles";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MembershipRecord {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
  joinedAt: string;
}

export interface AuthorizationContext {
  /** The raw membership record. */
  membership: MembershipRecord;
  /** All permissions held by this membership's role. */
  permissions: readonly Permission[];
  /**
   * Ergonomic helper: returns true if the current role has the given permission.
   *
   * @example
   * const ctx = await getAuthorizationContext(userId, orgId);
   * if (!ctx.has("projects:delete")) throw new ForbiddenError();
   */
  has(permission: Permission): boolean;
}

// ---------------------------------------------------------------------------
// getAuthorizationContext
// ---------------------------------------------------------------------------


/**
 * Loads and returns the authorization context for a (userId, organizationId) pair.
 *
 * Steps performed:
 *   1. Loads the membership row from the database.
 *   2. Verifies the membership exists (implicitly verifies the user is a member).
 *   3. Resolves the permission set from the role.
 *   4. Returns a context object with the membership, permissions, and has() helper.
 *
 * @param userId         - The authenticated user's UUID (from auth.users).
 * @param organizationId - The organization's UUID.
 *
 * @throws {ForbiddenError} If no membership exists for this user/org pair.
 *
 * @example
 * const ctx = await getAuthorizationContext(userId, organizationId);
 * if (!ctx.has("billing:update")) {
 *   throw new ForbiddenError("You do not have permission to update billing.");
 * }
 */
export async function getAuthorizationContext(
  userId: string,
  organizationId: string
): Promise<AuthorizationContext> {
  const supabase = createAdminClient();

  const { data: membership, error } = await supabase
    .from("memberships")
    .select("id, user_id, organization_id, role, status, joined_at")
    .eq("user_id", userId)
    .eq("organization_id", organizationId)
    .single();

  if (error || !membership) {
    throw new ForbiddenError(
      "You are not a member of this organization or your membership could not be verified."
    );
  }

  // Verify membership is active — suspended/invited members cannot act.
  if (membership.status !== "active") {
    throw new ForbiddenError(
      "Your membership in this organization is not currently active."
    );
  }

  const role = membership.role as Role;
  const permissions = getPermissions(role);

  const membershipRecord: MembershipRecord = {
    id: membership.id,
    userId: membership.user_id,
    organizationId: membership.organization_id,
    role,
    joinedAt: membership.joined_at,
  };

  return {
    membership: membershipRecord,
    permissions,
    has(permission: Permission): boolean {
      return hasPermission(role, permission);
    },
  };
}
