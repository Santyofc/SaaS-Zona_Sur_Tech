/**
 * invitations.ts — Invitation domain logic for the multi-tenant auth layer.
 *
 * Provides typed helpers for:
 *  - Creating invitations (with duplicate + existing-member protection)
 *  - Listing invitations (tenant-scoped)
 *  - Revoking invitations (permission-gated)
 *  - Accepting invitations (atomic, via RPC)
 *
 * All write operations log to org_activity_logs via logActivity().
 *
 * Invitation lifecycle:
 *
 *   pending  ──accept──►  accepted
 *     │
 *     └──revoke──►  revoked
 *     └──expires──►  expired  (handled by DB trigger + RPC)
 *
 * Design decisions:
 * - Invitations never replace memberships as the source of authorization.
 *   An invitation's only job is to bootstrap a membership.
 * - The `accept_org_invitation` Postgres RPC owns the atomic accept.
 * - Emails are always lowercased+trimmed before storage and comparison.
 * - Duplicate pending invites for (org, email) are prevented by a partial index.
 */

import crypto from "crypto";
import { createAdminClient } from "./supabaseAdmin";
import { logActivity } from "./logActivity";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  AuthError,
} from "./errors";
import { isValidRole, type Role } from "./roles";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default invitation expiry window. */
const INVITATION_EXPIRY_DAYS = 7;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  role: Role;
  invitedBy: string | null;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Public-safe view — omits the raw token. */
export interface InvitationSummary {
  id: string;
  organizationId: string;
  email: string;
  role: Role;
  invitedBy: string | null;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export interface CreateInvitationInput {
  organizationId: string;
  email: string;
  role: Role;
  invitedByUserId: string;
}

export interface CreateInvitationResult {
  invitation: InvitationSummary;
  /** The raw token — caller uses this to build an invite link. */
  token: string;
}

// ---------------------------------------------------------------------------
// A. createInvitation
// ---------------------------------------------------------------------------

/**
 * Creates a new pending invitation for the given org/email/role.
 *
 * Protections:
 * - Validates role.
 * - Normalizes email (lowercase, trim).
 * - Prevents inviting existing active members.
 * - Handles duplicate pending invites: returns the existing one safely.
 * - Generates a 32-byte hex token (64 chars, secure random).
 * - Sets expiry to INVITATION_EXPIRY_DAYS days from now.
 * - Logs the event to activity log (best-effort).
 *
 * @throws {ConflictError} If the user is already an active member.
 */
export async function createInvitation(
  input: CreateInvitationInput
): Promise<CreateInvitationResult> {
  const { organizationId, invitedByUserId } = input;
  const email = input.email.toLowerCase().trim();
  const role = input.role;

  // --- 1. Validate role ---
  if (!isValidRole(role)) {
    throw new ForbiddenError(`Invalid role: "${role}".`);
  }

  const supabase = createAdminClient();

  // --- 2. Prevent inviting existing active member ---
  // We look up by email in public.users first, then check membership.
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser?.id) {
    const { data: activeMembership } = await supabase
      .from("memberships")
      .select("id, status")
      .eq("user_id", existingUser.id)
      .eq("organization_id", organizationId)
      .eq("status", "active")
      .maybeSingle();

    if (activeMembership) {
      throw new ConflictError(
        `${email} is already an active member of this organization.`
      );
    }
  }

  // --- 3. Check for duplicate pending invitation ---
  const { data: existingInvite } = await supabase
    .from("org_invitations")
    .select("id, token, status, expires_at, email, role, invited_by, accepted_at, created_at, updated_at, organization_id")
    .eq("organization_id", organizationId)
    .eq("status", "pending")
    .ilike("email", email)
    .maybeSingle();

  if (existingInvite) {
    // Return the existing pending invite — idempotent.
    return {
      invitation: mapToSummary(existingInvite),
      token: existingInvite.token,
    };
  }

  // --- 4. Generate secure token ---
  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

  // --- 5. Insert invitation ---
  const { data: newInvite, error } = await supabase
    .from("org_invitations")
    .insert({
      organization_id: organizationId,
      email,
      role,
      invited_by: invitedByUserId,
      token,
      status: "pending",
      expires_at: expiresAt.toISOString(),
    })
    .select(
      "id, organization_id, email, role, invited_by, token, status, expires_at, accepted_at, created_at, updated_at"
    )
    .single();

  if (error) {
    // Partial unique index violation — concurrent duplicate request.
    if (error.code === "23505") {
      throw new ConflictError(
        "A pending invitation already exists for this email."
      );
    }
    console.error("[INVITE] Failed to create invitation:", error);
    throw new Error("Failed to create invitation. Please try again.");
  }

  // --- 6. Log activity (best-effort) ---
  await logActivity({
    organizationId,
    actorId: invitedByUserId,
    action: "invitation.created",
    entityType: "invitation",
    entityId: newInvite.id,
    metadata: { email, role },
  });

  return {
    invitation: mapToSummary(newInvite),
    token: newInvite.token,
  };
}

// ---------------------------------------------------------------------------
// B. listInvitations
// ---------------------------------------------------------------------------

/**
 * Returns all invitations for the given organization, sorted newest first.
 * Tokens are never returned in listing — use only for UI display.
 *
 * @param organizationId - The tenant scope. Never trust from client without auth.
 */
export async function listInvitations(
  organizationId: string
): Promise<InvitationSummary[]> {
  const supabase = createAdminClient();

  // Auto-expire stale invitations before listing (best-effort).
  try {
    await supabase.rpc("expire_org_invitations");
  } catch {
    // Non-fatal — listing still works even if the expire RPC is unavailable.
  }

  const { data, error } = await supabase
    .from("org_invitations")
    .select(
      "id, organization_id, email, role, invited_by, status, expires_at, accepted_at, created_at, updated_at"
    )
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[INVITE] Failed to list invitations:", error);
    throw new Error("Failed to retrieve invitations.");
  }

  return (data ?? []).map(mapToSummary);
}

// ---------------------------------------------------------------------------
// C. revokeInvitation
// ---------------------------------------------------------------------------

/**
 * Revokes a pending invitation. Only `pending` invitations can be revoked.
 *
 * @param invitationId   - The UUID of the invitation to revoke.
 * @param organizationId - Tenant scope — prevents cross-org revocation.
 * @param actorId        - The user performing the revoke (for audit log).
 *
 * @throws {NotFoundError} If the invitation is not found in the org.
 * @throws {ConflictError} If the invitation is not in `pending` state.
 */
export async function revokeInvitation(
  invitationId: string,
  organizationId: string,
  actorId: string
): Promise<void> {
  const supabase = createAdminClient();

  // Fetch scoped to organization to prevent cross-tenant revocation.
  const { data: invite, error: fetchError } = await supabase
    .from("org_invitations")
    .select("id, status, email, role")
    .eq("id", invitationId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (fetchError || !invite) {
    throw new NotFoundError("Invitation not found in this organization.");
  }

  if (invite.status !== "pending") {
    throw new ConflictError(
      `Cannot revoke an invitation with status "${invite.status}". Only pending invitations can be revoked.`
    );
  }

  const { error: updateError } = await supabase
    .from("org_invitations")
    .update({ status: "revoked" })
    .eq("id", invitationId);

  if (updateError) {
    console.error("[INVITE] Failed to revoke invitation:", updateError);
    throw new Error("Failed to revoke invitation.");
  }

  // Log activity (best-effort).
  await logActivity({
    organizationId,
    actorId,
    action: "invitation.revoked",
    entityType: "invitation",
    entityId: invitationId,
    metadata: { email: invite.email, role: invite.role },
  });
}

// ---------------------------------------------------------------------------
// D. acceptInvitation
// ---------------------------------------------------------------------------

/**
 * Accepts an invitation. Delegates to the `accept_org_invitation` Postgres RPC
 * for atomic membership creation and invitation status update.
 *
 * Security:
 * - The RPC validates token, email match, expiry, and status atomically.
 * - The caller's email is verified before the RPC is called.
 * - Membership is created or activated inside the same DB transaction.
 *
 * @param token  - The raw invitation token from the accept URL.
 * @param userId - The authenticated user's UUID.
 * @param email  - The authenticated user's email (must match invitation email).
 *
 * @throws {NotFoundError}  If the token does not match any invitation.
 * @throws {ForbiddenError} If the invitation email doesn't match the user's.
 * @throws {ConflictError}  If the invitation has already been accepted.
 * @throws {AuthError}      If the invitation is expired or revoked.
 *
 * @returns The organization UUID for cookie-setting by the caller.
 */
export async function acceptInvitation(
  token: string,
  userId: string,
  email: string
): Promise<{ organizationId: string }> {
  const supabase = createAdminClient();
  const normalizedEmail = email.toLowerCase().trim();

  // Delegate to atomic RPC.
  const { data: orgId, error } = await supabase.rpc("accept_org_invitation", {
    p_token: token,
    p_user_id: userId,
    p_email: normalizedEmail,
  });

  if (error) {
    const msg: string = error.message ?? "";

    if (msg.includes("INVITATION_NOT_FOUND")) {
      throw new NotFoundError("Invitation not found or link is invalid.");
    }
    if (msg.includes("INVITATION_EXPIRED")) {
      throw new AuthError("This invitation has expired. Please request a new one.", 410, "INVITATION_EXPIRED");
    }
    if (msg.includes("INVITATION_INVALID")) {
      throw new ConflictError("This invitation has already been used or was revoked.");
    }
    if (msg.includes("INVITATION_EMAIL_MISMATCH")) {
      throw new ForbiddenError(
        "This invitation was sent to a different email address."
      );
    }

    console.error("[INVITE] accept_org_invitation RPC failed:", error);
    throw new Error("Failed to accept the invitation. Please try again.");
  }

  const organizationId = orgId as string;

  // Log activity (best-effort).
  await logActivity({
    organizationId,
    actorId: userId,
    action: "invitation.accepted",
    entityType: "invitation",
    metadata: { email: normalizedEmail },
  });

  return { organizationId };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

export type RawInvitationRow = {
  id: string;
  organization_id: string;
  email: string;
  role: string;
  invited_by: string | null;
  status: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at?: string;
  token?: string;
};

function mapToSummary(row: RawInvitationRow): InvitationSummary {
  return {
    id: row.id,
    organizationId: row.organization_id,
    email: row.email,
    role: row.role as Role,
    invitedBy: row.invited_by,
    status: row.status as InvitationStatus,
    expiresAt: row.expires_at,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
  };
}
