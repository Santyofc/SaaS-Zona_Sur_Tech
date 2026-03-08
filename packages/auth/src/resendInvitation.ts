/**
 * resendInvitation — Refreshes a pending invitation's token and expiry.
 *
 * Only pending invitations can be resent. Accepted/revoked/expired
 * invitations cannot be resent — create a new invitation instead.
 *
 * What "resend" does structurally:
 * - Generates a new secure random token (invalidates the old link).
 * - Resets expires_at to 7 days from now.
 * - Does NOT change status (remains 'pending').
 * - Returns the new token and a fresh invite URL for the caller to
 *   pass to an email-sending service.
 *
 * Email sending is NOT implemented here — this is intentional.
 * See INTEGRATION_POINT below for the hook point.
 *
 * Arguments:
 * - invitationId   : UUID of the invitation to resend.
 * - organizationId : Tenant scope — prevents cross-org access.
 * - actorId        : The user performing the resend (for audit log).
 */

import crypto from "crypto";
import { createAdminClient } from "./supabaseAdmin";
import { logActivity } from "./logActivity";
import {
  ConflictError,
  NotFoundError,
} from "./errors";
import type { InvitationSummary, RawInvitationRow } from "./invitations";

// Re-export the mapper type so we can import it from invitations.ts safely.
// We duplicate the mapper here because mapToSummary is not exported from invitations.ts.
function mapToSummary(row: RawInvitationRow): InvitationSummary {
  return {
    id: row.id,
    organizationId: row.organization_id,
    email: row.email,
    role: row.role as InvitationSummary["role"],
    invitedBy: row.invited_by,
    status: row.status as InvitationSummary["status"],
    expiresAt: row.expires_at,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
  };
}

const INVITATION_EXPIRY_DAYS = 7;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ResendInvitationResult {
  invitation: InvitationSummary;
  /**
   * The new invitation token.
   * The caller must construct the invite URL and pass it to an email service.
   *
   * @example
   * const inviteUrl = `${baseUrl}/invitations/accept?token=${result.token}`;
   * await emailService.send({ to: result.invitation.email, inviteUrl });
   */
  token: string;
  /**
   * INTEGRATION_POINT: Pass this URL to your email provider.
   * This package does not send emails — that concern belongs to an email
   * provider like Resend, SendGrid, or AWS SES, wired in the route handler.
   */
  inviteUrl: string;
}

// ---------------------------------------------------------------------------
// resendInvitation
// ---------------------------------------------------------------------------

/**
 * Refreshes the token and expiry of a pending invitation.
 *
 * @throws {NotFoundError}  If the invitation is not found in this org.
 * @throws {ConflictError}  If the invitation is not in 'pending' state.
 */
export async function resendInvitation(
  invitationId: string,
  organizationId: string,
  actorId: string
): Promise<ResendInvitationResult> {
  const supabase = createAdminClient();

  // --- 1. Fetch invitation, scoped to org ---
  const { data: invite, error: fetchError } = await supabase
    .from("org_invitations")
    .select(
      "id, organization_id, email, role, invited_by, status, expires_at, accepted_at, created_at, updated_at"
    )
    .eq("id", invitationId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (fetchError || !invite) {
    throw new NotFoundError("Invitation not found in this organization.");
  }

  // --- 2. Only pending invitations can be resent ---
  if (invite.status !== "pending") {
    throw new ConflictError(
      `Cannot resend an invitation with status "${invite.status}". Create a new invitation instead.`
    );
  }

  // --- 3. Generate new token + expiry ---
  const newToken = crypto.randomBytes(32).toString("hex");
  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + INVITATION_EXPIRY_DAYS);

  // --- 4. Update the invitation ---
  const { data: updated, error: updateError } = await supabase
    .from("org_invitations")
    .update({
      token: newToken,
      expires_at: newExpiresAt.toISOString(),
    })
    .eq("id", invitationId)
    .select(
      "id, organization_id, email, role, invited_by, status, expires_at, accepted_at, created_at, updated_at"
    )
    .single();

  if (updateError || !updated) {
    console.error("[INVITE] Failed to resend invitation:", updateError);
    throw new Error("Failed to resend invitation.");
  }

  // --- 5. Build invite URL ---
  const baseUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3001";

  const inviteUrl = `${baseUrl}/invitations/accept?token=${newToken}`;

  // --- 6. Log activity (best-effort) ---
  await logActivity({
    organizationId,
    actorId,
    action: "invitation.resent",
    entityType: "invitation",
    entityId: invitationId,
    metadata: { email: invite.email, role: invite.role },
  });

  return {
    invitation: mapToSummary(updated as RawInvitationRow),
    token: newToken,
    inviteUrl,
  };
}
