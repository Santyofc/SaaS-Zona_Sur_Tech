/**
 * POST /api/invitations      — Create a new invitation (members:invite)
 * GET  /api/invitations      — List invitations for active org (members:read)
 */

import { NextResponse } from "next/server";
import {
  requirePermission,
  createInvitation,
  listInvitations,
  handleAuthError,
  isValidRole,
  getRoleRank,
  type Role,
} from "@repo/auth";
import { rateLimit, logger } from "@repo/platform";
import { sendInvitationEmail } from "@repo/email";

// ---------------------------------------------------------------------------
// POST /api/invitations
// Creates a new pending invitation for a user to join the active organization.
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    // Require members:invite permission.
    const ctx = await requirePermission("members:invite");

    // Rate Limit by User ID (50 invites per hour)
    const rateLimitResult = await rateLimit(`invite:create:${ctx.userId}`, {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimitResult.success) {
      logger.warn(`[RATE_LIMIT] User ${ctx.userId} exceeded invitation creation limit.`);
      return NextResponse.json(
        { error: "Too many invitations sent. Please try again later.", code: "RATE_LIMITED" },
        { status: 429 }
      );
    }

    // Parse and validate body.
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const email =
      typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const role =
      typeof body.role === "string" ? (body.role as Role) : "member";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        {
          error: `Invalid role "${role}". Valid roles: owner, admin, member, viewer, billing.`,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // Prevent inviting with a role higher than the actor's own role.
    // (e.g., a member cannot invite someone as admin)
    const actorRoleRank = getRoleRank(ctx.role);
    const targetRoleRank = getRoleRank(role);
    if (targetRoleRank < actorRoleRank) {
      return NextResponse.json(
        {
          error: "You cannot invite someone with a higher role than your own.",
          code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    const { invitation, token } = await createInvitation({
      organizationId: ctx.organizationId,
      email,
      role,
      invitedByUserId: ctx.userId,
    });

    // Build the invitation accept URL.
    const baseUrl =
      process.env.NEXT_PUBLIC_DASHBOARD_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3001";

    const inviteUrl = `${baseUrl}/invitations/accept?token=${token}`;

    const emailResult = await sendInvitationEmail({
      to: email,
      organizationName: ctx.organizationName,
      inviterName: ctx.authUser.user_metadata?.display_name ?? ctx.email,
      role,
      inviteUrl,
    });

    if (emailResult.error) {
      logger.error(`[EMAIL] Failed to send invitation email to ${email}`, emailResult.error);
    } else {
      logger.info(`[EMAIL] Sent invitation email to ${email}`);
    }

    logger.info(
      `[INVITE] ${ctx.userId} invited ${email} to org ${ctx.organizationId} as ${role}`
    );

    return NextResponse.json(
      {
        message: "Invitation created and email task submitted.",
        invitation,
        // Return the invite URL so callers can send it via email.
        inviteUrl,
      },
      { status: 201 }
    );
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}

// ---------------------------------------------------------------------------
// GET /api/invitations
// Lists all invitations for the active organization (tenant-scoped).
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    // members:read is sufficient for listing.
    const ctx = await requirePermission("members:read");

    const invitations = await listInvitations(ctx.organizationId);

    return NextResponse.json({ invitations });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
