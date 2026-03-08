/**
 * POST /api/invitations/accept
 *
 * Accepts a pending invitation by token.
 *
 * The authenticated user's email MUST match the invitation email.
 * Membership creation and invitation status update happen atomically
 * inside the `accept_org_invitation` Postgres RPC.
 *
 * After acceptance, sets the active_organization_id cookie so the
 * user is immediately placed in the new organization context.
 *
 * Lifecycle states:
 *   pending → accepted  (success)
 *   pending → expired   (if past expires_at — returns 410 Gone)
 *   revoked             (returns 409 Conflict)
 *   accepted            (returns 409 Conflict — already used)
 */

import { NextResponse } from "next/server";
import {
  requireAuth,
  ensurePublicUserProfile,
  acceptInvitation,
  setActiveOrganization,
  logActivity,
  handleAuthError,
} from "@repo/auth";

export async function POST(request: Request) {
  try {
    // 1. Validate session — user must be logged in to accept.
    const authUser = await requireAuth();

    // 2. Parse body.
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!token) {
      return NextResponse.json(
        { error: "Invitation token is required.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    // 3. Ensure user has a public profile (best-effort, non-fatal).
    await ensurePublicUserProfile(authUser.authUser);

    // 4. Accept invitation atomically (RPC handles: token lookup, email check,
    //    expiry, status guard, membership upsert, invitation status update).
    const { organizationId } = await acceptInvitation(
      token,
      authUser.userId,
      authUser.email
    );

    // 5. Set active organization cookie — user is now in the new org.
    const { organizationName } = await setActiveOrganization(
      authUser.userId,
      organizationId
    );

    // 6. Log org switch (best-effort).
    await logActivity({
      organizationId,
      actorId: authUser.userId,
      action: "organization.switched",
      entityType: "organization",
      entityId: organizationId,
      metadata: { trigger: "invitation_accepted" },
    });

    console.info(
      `[INVITE] User ${authUser.userId} accepted invitation and joined org ${organizationId}`
    );

    return NextResponse.json({
      message: "Invitation accepted successfully.",
      organizationId,
      organizationName,
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
