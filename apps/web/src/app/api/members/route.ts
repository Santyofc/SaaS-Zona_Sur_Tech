/**
 * GET /api/members
 *
 * Returns all members of the active organization, enriched with profile data.
 *
 * Permission required: members:read
 *
 * Response includes:
 * - membership metadata (id, role, status, joinedAt, updatedAt)
 * - profile data from public.users (name, email, image) — null if not synced
 *
 * public.users is used for display only. Authorization always comes from memberships.
 */

import { NextResponse } from "next/server";
import {
  requirePermission,
  listOrganizationMembers,
  handleAuthError,
} from "@repo/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ctx = await requirePermission("members:read");
    const members = await listOrganizationMembers(ctx.organizationId);

    return NextResponse.json({
      members,
      organizationId: ctx.organizationId,
      total: members.length,
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
