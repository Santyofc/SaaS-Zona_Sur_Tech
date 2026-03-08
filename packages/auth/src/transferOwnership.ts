/**
 * transferOwnership — Atomically transfers organizational ownership.
 *
 * Policy:
 * - Only the current owner can initiate a transfer.
 * - Target must be an active member (any role) in the same org.
 * - After transfer: new owner becomes 'owner', previous owner becomes 'admin'.
 * - Atomic: the `transfer_org_ownership` Postgres RPC executes both UPDATE
 *   statements in a single transaction with row-level locking.
 *
 * Why a dedicated helper instead of updateMemberRole:
 * - Ownership transfers require two simultaneous row updates.
 * - A non-atomic implementation would leave a window with no owner.
 * - The RPC eliminates that window entirely.
 * - This also enforces the policy that only owners can initiate transfers
 *   at the domain layer, not just at the route layer.
 */

import { createAdminClient } from "./supabaseAdmin";
import { logActivity } from "./logActivity";
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "./errors";
import type { Role } from "./roles";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TransferOwnershipInput {
  organizationId: string;
  /** UUID of the current owner performing the transfer. */
  fromUserId: string;
  /** The current owner's role — must be 'owner' or we reject early. */
  fromUserRole: Role;
  /** UUID of the target user (must be active member of same org). */
  toUserId: string;
}

export interface TransferOwnershipResult {
  organizationId: string;
  previousOwnerId: string;
  newOwnerId: string;
  /** Previous owner is now this role. Policy: always 'admin'. */
  previousOwnerNewRole: "admin";
}

// ---------------------------------------------------------------------------
// transferOwnership
// ---------------------------------------------------------------------------

/**
 * Transfers organizational ownership atomically via Postgres RPC.
 *
 * @throws {ForbiddenError} If the actor is not currently an owner.
 * @throws {NotFoundError}  If the target is not an active member.
 * @throws {ConflictError}  If the target is already the owner.
 */
export async function transferOwnership(
  input: TransferOwnershipInput
): Promise<TransferOwnershipResult> {
  const { organizationId, fromUserId, fromUserRole, toUserId } = input;

  // --- 1. Application-layer owner check (defense in depth) ---
  // The RPC also checks this, but we fail fast here with a clear message.
  if (fromUserRole !== "owner") {
    throw new ForbiddenError(
      "Only the organization owner can transfer ownership."
    );
  }

  if (fromUserId === toUserId) {
    throw new ConflictError("You are already the owner of this organization.");
  }

  const supabase = createAdminClient();

  // --- 2. Verify target is an active member ---
  const { data: targetMembership, error: fetchError } = await supabase
    .from("memberships")
    .select("id, user_id, role, status")
    .eq("user_id", toUserId)
    .eq("organization_id", organizationId)
    .eq("status", "active")
    .maybeSingle();

  if (fetchError || !targetMembership) {
    throw new NotFoundError(
      "Target user is not an active member of this organization."
    );
  }

  // --- 3. Execute atomic transfer via RPC ---
  const { error: rpcError } = await supabase.rpc("transfer_org_ownership", {
    p_organization_id: organizationId,
    p_from_user_id: fromUserId,
    p_to_user_id: toUserId,
  });

  if (rpcError) {
    const msg = rpcError.message ?? "";

    if (msg.includes("TRANSFER_NOT_OWNER")) {
      throw new ForbiddenError(
        "Only the organization owner can transfer ownership."
      );
    }
    if (msg.includes("TRANSFER_NO_TO_MEMBERSHIP")) {
      throw new NotFoundError(
        "Target user is not an active member of this organization."
      );
    }
    if (msg.includes("TRANSFER_ALREADY_OWNER")) {
      throw new ConflictError("The target user is already an owner.");
    }
    if (msg.includes("TRANSFER_SELF")) {
      throw new ConflictError("You are already the owner of this organization.");
    }

    console.error("[MEMBERS] transfer_org_ownership RPC failed:", rpcError);
    throw new Error("Failed to transfer ownership. Please try again.");
  }

  // --- 4. Log activity (best-effort, but treat as important) ---
  await logActivity({
    organizationId,
    actorId: fromUserId,
    action: "ownership.transferred",
    entityType: "organization",
    entityId: organizationId,
    metadata: {
      previous_owner_id: fromUserId,
      new_owner_id: toUserId,
      previous_owner_new_role: "admin",
    },
  });

  return {
    organizationId,
    previousOwnerId: fromUserId,
    newOwnerId: toUserId,
    previousOwnerNewRole: "admin",
  };
}
