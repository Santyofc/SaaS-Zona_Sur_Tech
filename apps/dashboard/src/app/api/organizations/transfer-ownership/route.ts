/**
 * POST /api/organizations/transfer-ownership
 *
 * Transfers organizational ownership from the current user to a target member.
 *
 * Only the current owner can perform this action.
 * The transfer is atomic (Postgres RPC with row-level locking).
 *
 * Policy implemented:
 * - Previous owner → becomes admin after transfer.
 * - New owner → becomes owner.
 *
 * Body: { toUserId: string }
 *
 * HTTP status codes:
 *   200 — transfer completed successfully
 *   400 — missing or invalid toUserId
 *   401 — not authenticated
 *   403 — not the owner, or target is not active member
 *   404 — target user not found in this org
 *   409 — target is already owner / self-transfer
 */

import { NextResponse } from "next/server";
import {
  requirePermission,
  transferOwnership,
  handleAuthError,
} from "@repo/auth";

export async function POST(request: Request) {
  try {
    // org:update is the closest permission for destructive org-level operations.
    // Ownership transfer additionally enforces role='owner' inside the helper.
    const ctx = await requirePermission("org:update");

    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const toUserId =
      typeof body.toUserId === "string" ? body.toUserId.trim() : "";

    if (!toUserId) {
      return NextResponse.json(
        { error: "toUserId is required.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const result = await transferOwnership({
      organizationId: ctx.organizationId,
      fromUserId: ctx.userId,
      fromUserRole: ctx.role,
      toUserId,
    });

    return NextResponse.json({
      message:
        "Ownership transferred successfully. You are now an admin of this organization.",
      ...result,
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
