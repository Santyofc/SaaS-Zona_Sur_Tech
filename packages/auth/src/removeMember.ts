/**
 * removeMember — Removes (deletes) a membership from an organization.
 *
 * Delegates to the `remove_org_member` Postgres RPC for atomic execution
 * with a guaranteed last-owner guard enforced at the DB level.
 *
 * Safety rules enforced:
 *
 * 1. Target membership must belong to the same organization.
 * 2. Cannot remove the last active owner (enforced in RPC).
 * 3. Self-removal is allowed ONLY when another active owner exists
 *    (also enforced by last-owner guard in RPC).
 * 4. Admin cannot remove an owner.
 * 5. If the removed member's active org was this org, the cookie is
 *    NOT cleared server-side here — the client handles redirect.
 *    (The cookie will be corrected on next request via getActiveOrganization.)
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

export interface RemoveMemberInput {
  membershipId: string;
  organizationId: string;
  actorUserId: string;
  actorRole: Role;
}

export interface RemoveMemberResult {
  membershipId: string;
  removedUserId: string;
  /** True if the actor removed themselves. */
  isSelfRemoval: boolean;
}

// ---------------------------------------------------------------------------
// removeMember
// ---------------------------------------------------------------------------

/**
 * Removes a membership from an organization, with last-owner guard.
 *
 * @throws {NotFoundError}  If the target membership is not in this org.
 * @throws {ForbiddenError} If safety rules are violated.
 * @throws {ConflictError}  If this would remove the last active owner.
 */
export async function removeMember(
  input: RemoveMemberInput
): Promise<RemoveMemberResult> {
  const { membershipId, organizationId, actorUserId, actorRole } = input;

  const supabase = createAdminClient();

  // --- 1. Fetch target membership to get user_id and role for pre-checks ---
  const { data: target, error: fetchError } = await supabase
    .from("memberships")
    .select("id, user_id, role, status")
    .eq("id", membershipId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (fetchError || !target) {
    throw new NotFoundError("Membership not found in this organization.");
  }

  const isSelfRemoval = target.user_id === actorUserId;

  // --- 2. Admin cannot remove an owner (non-self case only) ---
  if (!isSelfRemoval && actorRole === "admin" && target.role === "owner") {
    throw new ForbiddenError("Admins cannot remove an owner membership.");
  }

  // --- 3. Delegate to atomic RPC ---
  // The RPC enforces the last-owner guard atomically.
  const { error: rpcError } = await supabase.rpc("remove_org_member", {
    p_organization_id: organizationId,
    p_membership_id: membershipId,
    p_actor_id: actorUserId,
  });

  if (rpcError) {
    const msg = rpcError.message ?? "";

    if (msg.includes("REMOVE_NOT_FOUND")) {
      throw new NotFoundError("Membership not found in this organization.");
    }
    if (msg.includes("REMOVE_LAST_OWNER")) {
      throw new ConflictError(
        "Cannot remove the last active owner. Transfer ownership first."
      );
    }

    console.error("[MEMBERS] remove_org_member RPC failed:", rpcError);
    throw new Error("Failed to remove member.");
  }

  // --- 4. Log activity (best-effort) ---
  await logActivity({
    organizationId,
    actorId: actorUserId,
    action: "member.removed",
    entityType: "membership",
    entityId: membershipId,
    metadata: {
      target_user_id: target.user_id,
      target_membership_id: membershipId,
      target_role: target.role,
      is_self_removal: isSelfRemoval,
    },
  });

  return {
    membershipId,
    removedUserId: target.user_id,
    isSelfRemoval,
  };
}
