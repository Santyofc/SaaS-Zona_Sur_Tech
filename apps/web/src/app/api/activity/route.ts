/**
 * GET /api/activity
 *
 * Returns recent activity log entries for the active organization.
 * Requires members:read permission.
 *
 * Query params:
 *   limit — max entries to return (default 50, max 200)
 */

import { NextResponse } from "next/server";
import { requirePermission, handleAuthError } from "@repo/auth";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const ctx = await requirePermission("members:read");

    const url = new URL(request.url);
    const rawLimit = parseInt(url.searchParams.get("limit") ?? "50", 10);
    const limit = Math.min(Math.max(1, rawLimit), 200);

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("org_activity_logs")
      .select("id, organization_id, actor_id, action, entity_type, entity_id, metadata, created_at")
      .eq("organization_id", ctx.organizationId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[ACTIVITY] Failed to fetch activity logs:", error);
      throw new Error("Failed to retrieve activity logs.");
    }

    return NextResponse.json({
      logs: (data ?? []).map((row) => ({
        id: row.id,
        organizationId: row.organization_id,
        actorId: row.actor_id,
        action: row.action,
        entityType: row.entity_type,
        entityId: row.entity_id,
        metadata: row.metadata ?? {},
        createdAt: row.created_at,
      })),
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return NextResponse.json(body, { status });
  }
}
