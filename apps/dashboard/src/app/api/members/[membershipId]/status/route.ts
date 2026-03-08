/**
 * PATCH /api/members/[membershipId]/status
 *
 * Suspends or reactivates a member's membership in the active organization.
 *
 * Permission required: members:update
 *
 * Safety rules enforced (in updateMemberStatus helper):
 * - Cannot change your own status.
 * - Admin cannot suspend/reactivate an owner.
 * - Cannot suspend the last active owner.
 * - No-op guard (already in the target status returns 409).
 *
 * Body: { status: "active" | "suspended" }
 */

import { NextResponse } from "next/server";
import {
  requirePermission,
  updateMemberStatus,
  handleAuthError,
  type MemberStatus,
} from "@repo/auth";

interface RouteParams {
  params: { membershipId: string };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const ctx = await requirePermission("members:update");

    const membershipId = params.membershipId;
    if (!membershipId) {
      return NextResponse.json(
        { error: "membershipId is required.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const newStatus = body.status as string;
    if (newStatus !== "active" && newStatus !== "suspended") {
      return NextResponse.json(
        {
          error: `Invalid status "${newStatus}". Valid values: "active", "suspended".`,
          code: "VALIDATION_ERROR",
        },
        { status: 422 }
      );
    }

    const result = await updateMemberStatus({
      membershipId,
      organizationId: ctx.organizationId,
      actorUserId: ctx.userId,
      actorRole: ctx.role,
      newStatus: newStatus as MemberStatus,
    });

    const message =
      newStatus === "suspended"
        ? "Member suspended successfully."
        : "Member reactivated successfully.";

    return NextResponse.json({ message, ...result });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
