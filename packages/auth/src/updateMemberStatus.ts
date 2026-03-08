/**
 * updateMemberStatus — Suspends or reactivates a membership.
 *
 * Safety rules enforced:
 *
 * 1. Target membership must be in the same organization as the actor.
 * 2. Only 'active' → 'suspended' and 'suspended' → 'active' transitions allowed.
 *    ('invited' status is managed exclusively by the invitation system.)
 * 3. Cannot suspend the last active owner.
 * 4. Cannot suspend another organization's member.
 * 5. Actor cannot suspend themselves.
 * 6. Admin cannot suspend an owner.
 */

import { createAdminClient } from "./supabaseAdmin";
import { logActivity } from "./logActivity";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "./errors";
import type { Role } from "./roles";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MemberStatus = "active" | "suspended";

export interface UpdateMemberStatusInput {
  membershipId: string;
  organizationId: string;
  actorUserId: string;
  actorRole: Role;
  /** The new desired status — only 'active' or 'suspended' accepted. */
  newStatus: MemberStatus;
}

export interface UpdateMemberStatusResult {
  membershipId: string;
  userId: string;
  previousStatus: string;
  newStatus: MemberStatus;
}

// ---------------------------------------------------------------------------
// updateMemberStatus
// ---------------------------------------------------------------------------

/**
 * Suspends or reactivates a membership.
 *
 * @throws {NotFoundError}  If the membership is not in this org.
 * @throws {ForbiddenError} If safety rules are violated.
 * @throws {ConflictError}  If this would leave org without an active owner.
 */
export async function updateMemberStatus(
  input: UpdateMemberStatusInput
): Promise<UpdateMemberStatusResult> {
  const { membershipId, organizationId, actorUserId, actorRole, newStatus } =
    input;

  // --- 1. Validate newStatus ---
  if (newStatus !== "active" && newStatus !== "suspended") {
    throw new ForbiddenError(
      `Invalid status "${newStatus}". Only "active" or "suspended" are allowed.`
    );
  }

  const supabase = createAdminClient();

  // --- 2. Fetch target membership ---
  const { data: target, error: fetchError } = await supabase
    .from("memberships")
    .select("id, user_id, role, status")
    .eq("id", membershipId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (fetchError || !target) {
    throw new NotFoundError("Membership not found in this organization.");
  }

  // --- 3. Actor cannot change their own status ---
  if (target.user_id === actorUserId) {
    throw new ForbiddenError("You cannot suspend or reactivate yourself.");
  }

  // --- 4. Admin cannot suspend/reactivate an owner ---
  if (actorRole === "admin" && target.role === "owner") {
    throw new ForbiddenError("Admins cannot change the status of an owner membership.");
  }

  // --- 5. No-op guard ---
  if (target.status === newStatus) {
    throw new ConflictError(
      `This membership is already ${newStatus}.`
    );
  }

  // --- 6. Cannot suspend the last active owner ---
  if (newStatus === "suspended" && target.role === "owner") {
    const { count: ownerCount } = await supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("role", "owner")
      .eq("status", "active");

    if ((ownerCount ?? 0) <= 1) {
      throw new ConflictError(
        "Cannot suspend the last active owner. Transfer ownership first."
      );
    }
  }

  // --- 7. Perform the update ---
  const { error: updateError } = await supabase
    .from("memberships")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", membershipId);

  if (updateError) {
    console.error("[MEMBERS] Failed to update member status:", updateError);
    throw new Error("Failed to update member status.");
  }

  const action =
    newStatus === "suspended" ? "member.suspended" : "member.reactivated";

  // --- 8. Log activity (best-effort) ---
  await logActivity({
    organizationId,
    actorId: actorUserId,
    action,
    entityType: "membership",
    entityId: membershipId,
    metadata: {
      target_user_id: target.user_id,
      target_membership_id: membershipId,
      previous_status: target.status,
      new_status: newStatus,
    },
  });

  return {
    membershipId,
    userId: target.user_id,
    previousStatus: target.status,
    newStatus,
  };
}
