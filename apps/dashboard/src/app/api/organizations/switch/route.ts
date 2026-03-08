/**
 * POST /api/organizations/switch
 *
 * Switches the authenticated user's active organization context.
 *
 * Security:
 * - Requires authentication.
 * - Verifies the user has an ACTIVE membership in the target organization.
 * - Membership status is checked server-side — cookie value cannot bypass this.
 * - Sets the active_organization_id cookie (httpOnly).
 * - Logs the switch to org_activity_logs.
 *
 * Body: { organizationId: string }
 *
 * HTTP status codes:
 *   200 — switched successfully
 *   400 — missing organizationId
 *   401 — not authenticated
 *   403 — not an active member of the target organization
 */

import { NextResponse } from "next/server";
import {
  requireAuth,
  setActiveOrganization,
  logActivity,
  handleAuthError,
} from "@repo/auth";

export async function POST(request: Request) {
  try {
    // 1. Validate session.
    const { userId } = await requireAuth();

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

    const organizationId =
      typeof body.organizationId === "string"
        ? body.organizationId.trim()
        : "";

    if (!organizationId) {
      return NextResponse.json(
        {
          error: "organizationId is required.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // 3. Verify active membership AND set cookie atomically.
    //    setActiveOrganization throws ForbiddenError if not an active member.
    const { organizationName } = await setActiveOrganization(
      userId,
      organizationId
    );

    // 4. Log the switch (best-effort).
    await logActivity({
      organizationId,
      actorId: userId,
      action: "organization.switched",
      entityType: "organization",
      entityId: organizationId,
      metadata: { trigger: "manual_switch" },
    });

    console.info(`[ORG_SWITCH] User ${userId} switched to org ${organizationId}`);

    return NextResponse.json({
      message: "Active organization updated.",
      organizationId,
      organizationName,
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
