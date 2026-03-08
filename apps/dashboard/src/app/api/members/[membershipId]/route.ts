/**
 * DELETE /api/members/[membershipId]
 *
 * Removes a membership from the active organization.
 *
 * Permission required: members:remove
 *
 * Safety rules enforced (in removeMember helper + RPC):
 * - Target must be in the same organization.
 * - Cannot remove the last active owner.
 * - Admin cannot remove an owner.
 * - Self-removal is allowed if another active owner exists.
 * - If self-removal: the active org cookie becomes stale;
 *   the client should redirect the user to org selection.
 *   The cookie will self-correct on the next request via getActiveOrganization.
 */

import { NextResponse } from "next/server";
import {
  requirePermission,
  removeMember,
  handleAuthError,
} from "@repo/auth";

interface RouteParams {
  params: { membershipId: string };
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const ctx = await requirePermission("members:remove");

    const membershipId = params.membershipId;
    if (!membershipId) {
      return NextResponse.json(
        { error: "membershipId is required.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const result = await removeMember({
      membershipId,
      organizationId: ctx.organizationId,
      actorUserId: ctx.userId,
      actorRole: ctx.role,
    });

    return NextResponse.json({
      message: result.isSelfRemoval
        ? "You have left the organization."
        : "Member removed successfully.",
      membershipId: result.membershipId,
      isSelfRemoval: result.isSelfRemoval,
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
