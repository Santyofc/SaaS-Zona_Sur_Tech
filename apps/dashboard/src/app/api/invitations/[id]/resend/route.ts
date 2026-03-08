/**
 * POST /api/invitations/[id]/resend
 *
 * Resends a pending invitation by generating a new token and extending expiry.
 *
 * Permission required: members:invite
 *
 * Only pending invitations can be resent. Other statuses return 409.
 *
 * This endpoint does NOT send email. It returns the new inviteUrl which
 * the caller must pass to an email provider.
 *
 * INTEGRATION_POINT: Wire an email service here or in the frontend
 * by consuming the returned `inviteUrl`.
 *
 * Body: (none — invitation identified by [id] route param + active org cookie)
 */

import { NextResponse } from "next/server";
import {
  requirePermission,
  resendInvitation,
  handleAuthError,
} from "@repo/auth";

interface RouteParams {
  params: { id: string };
}

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const ctx = await requirePermission("members:invite");

    const invitationId = params.id;
    if (!invitationId) {
      return NextResponse.json(
        { error: "Invitation ID is required.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const result = await resendInvitation(
      invitationId,
      ctx.organizationId,
      ctx.userId
    );

    console.info(
      `[INVITE] ${ctx.userId} resent invitation ${invitationId} in org ${ctx.organizationId}`
    );

    // Return inviteUrl for the caller to use with an email provider.
    // The raw token is intentionally included so the caller can build
    // custom links or pass to a transactional email template.
    return NextResponse.json({
      message: "Invitation resent successfully.",
      invitation: result.invitation,
      inviteUrl: result.inviteUrl,
      // INTEGRATION_POINT: Use result.token with your email provider:
      // await emailProvider.send({ to: result.invitation.email, inviteUrl: result.inviteUrl });
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
