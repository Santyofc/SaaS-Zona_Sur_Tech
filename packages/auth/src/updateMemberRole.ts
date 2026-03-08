/**
 * updateMemberRole — Updates a membership's role with enforced safety rules.
 *
 * Safety rules enforced:
 *
 * 1. Target membership must be scoped to the same organization as the actor.
 * 2. Actor cannot change their own role (use transferOwnership for that).
 * 3. An admin cannot modify an owner's role.
 * 4. A non-owner cannot promote someone to owner (use transferOwnership).
 * 5. Cannot change role of the last active owner (they must transfer first).
 * 6. New role must be a valid Role.
 *
 * Policy: Ownership changes must go through transferOwnership(), which is
 * atomic. Setting role='owner' via this helper is blocked.
 */

import { createAdminClient } from "./supabaseAdmin";
import { logActivity } from "./logActivity";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "./errors";
import { isValidRole, getRoleRank, type Role } from "./roles";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UpdateMemberRoleInput {
  /** The membership UUID to update. */
  membershipId: string;
  /** Must be the same organization as the actor's active org. */
  organizationId: string;
  /** The actor performing the update. */
  actorUserId: string;
  /** The actor's current role (already resolved by requirePermission). */
  actorRole: Role;
  /** The new role to assign. */
  newRole: Role;
}

export interface UpdateMemberRoleResult {
  membershipId: string;
  userId: string;
  previousRole: Role;
  newRole: Role;
}

// ---------------------------------------------------------------------------
// updateMemberRole
// ---------------------------------------------------------------------------

/**
 * Updates a membership's role, enforcing all safety constraints.
 *
 * @throws {NotFoundError}  If the membership is not in this org.
 * @throws {ForbiddenError} If safety rules are violated.
 * @throws {ConflictError}  If this would orphan the org (last owner).
 */
export async function updateMemberRole(
  input: UpdateMemberRoleInput
): Promise<UpdateMemberRoleResult> {
  const { membershipId, organizationId, actorUserId, actorRole, newRole } =
    input;

  // --- 1. Validate the new role ---
  if (!isValidRole(newRole)) {
    throw new ForbiddenError(`"${newRole}" is not a valid role.`);
  }

  // --- 2. Block promotion to owner via this helper ---
  // Ownership transfer must use transferOwnership() which is atomic.
  if (newRole === "owner") {
    throw new ForbiddenError(
      "Use the transfer-ownership endpoint to promote a member to owner."
    );
  }

  const supabase = createAdminClient();

  // --- 3. Fetch target membership, scoped to same org ---
  const { data: target, error: fetchError } = await supabase
    .from("memberships")
    .select("id, user_id, role, status, organization_id")
    .eq("id", membershipId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (fetchError || !target) {
    throw new NotFoundError("Membership not found in this organization.");
  }

  // --- 4. Actor cannot change their own role ---
  if (target.user_id === actorUserId) {
    throw new ForbiddenError("You cannot change your own role.");
  }

  const targetCurrentRole = target.role as Role;

  // --- 5. Admin cannot modify owner ---
  if (actorRole === "admin" && targetCurrentRole === "owner") {
    throw new ForbiddenError("Admins cannot modify the role of an owner.");
  }

  // --- 6. Cannot assign a role higher than the actor's own role ---
  // (getRoleRank: lower index = higher privilege, owner=0)
  if (getRoleRank(newRole) < getRoleRank(actorRole)) {
    throw new ForbiddenError(
      "You cannot assign a role with higher privilege than your own."
    );
  }

  // --- 7. Last-active-owner guard ---
  // If target is currently an owner, check they aren't the last one.
  if (targetCurrentRole === "owner") {
    const { count: ownerCount } = await supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("role", "owner")
      .eq("status", "active");

    if ((ownerCount ?? 0) <= 1) {
      throw new ConflictError(
        "Cannot demote the last active owner. Transfer ownership first."
      );
    }
  }

  // --- 8. Perform the update ---
  const { error: updateError } = await supabase
    .from("memberships")
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq("id", membershipId);

  if (updateError) {
    console.error("[MEMBERS] Failed to update member role:", updateError);
    throw new Error("Failed to update member role.");
  }

  // --- 9. Log activity (best-effort) ---
  await logActivity({
    organizationId,
    actorId: actorUserId,
    action: "member.role_updated",
    entityType: "membership",
    entityId: membershipId,
    metadata: {
      target_user_id: target.user_id,
      previous_role: targetCurrentRole,
      new_role: newRole,
    },
  });

  return {
    membershipId,
    userId: target.user_id,
    previousRole: targetCurrentRole,
    newRole,
  };
}
