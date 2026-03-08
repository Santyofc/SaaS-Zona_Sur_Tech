/**
 * POST /api/invitations/[id]/revoke
 *
 * Revokes a pending invitation by its UUID.
 * Only invitations scoped to the active organization can be revoked.
 * Requires members:invite permission.
 *
 * HTTP status codes:
 *   200 — revoked successfully
 *   401 — not authenticated
 *   403 — not permitted (missing members:invite)
 *   404 — invitation not found in this org
 *   409 — invitation is not in pending state
 */

import { NextResponse } from "next/server";
import {
  requirePermission,
  revokeInvitation,
  handleAuthError,
} from "@repo/auth";

interface RouteParams {
  params: { id: string };
}

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const invitationId = params.id;

    if (!invitationId) {
      return NextResponse.json(
        { error: "Invitation ID is required.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    // members:invite permission required to revoke.
    const ctx = await requirePermission("members:invite");

    await revokeInvitation(
      invitationId,
      ctx.organizationId,
      ctx.userId
    );

    console.info(
      `[INVITE] ${ctx.userId} revoked invitation ${invitationId} in org ${ctx.organizationId}`
    );

    return NextResponse.json({
      message: "Invitation revoked successfully.",
      invitationId,
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
