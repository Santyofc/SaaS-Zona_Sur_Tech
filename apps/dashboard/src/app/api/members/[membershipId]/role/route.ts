/**
 * PATCH /api/members/[membershipId]/role
 *
 * Updates a member's role within the active organization.
 *
 * Permission required: members:update
 *
 * Safety rules enforced (in updateMemberRole helper):
 * - Cannot change your own role.
 * - Admin cannot change an owner's role.
 * - Cannot promote to owner (use /transfer-ownership instead).
 * - Cannot assign a role higher than your own.
 * - Cannot demote the last active owner.
 *
 * Body: { role: "admin" | "member" | "viewer" | "billing" }
 */

import { NextResponse } from "next/server";
import {
  requirePermission,
  updateMemberRole,
  handleAuthError,
  isValidRole,
  type Role,
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

    const newRole = body.role as string;
    if (!newRole || !isValidRole(newRole)) {
      return NextResponse.json(
        {
          error: `Invalid role "${newRole}". Valid roles: admin, member, viewer, billing.`,
          code: "VALIDATION_ERROR",
        },
        { status: 422 }
      );
    }

    const result = await updateMemberRole({
      membershipId,
      organizationId: ctx.organizationId,
      actorUserId: ctx.userId,
      actorRole: ctx.role,
      newRole: newRole as Role,
    });

    return NextResponse.json({
      message: "Member role updated successfully.",
      ...result,
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
