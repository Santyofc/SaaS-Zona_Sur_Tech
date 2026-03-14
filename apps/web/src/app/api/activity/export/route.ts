/**
 * GET /api/activity/export
 *
 * Exports activity logs for the active organization as CSV.
 * Requires members:read permission (or stricter, if appropriate).
 */

import { requirePermission, handleAuthError } from "@repo/auth";
import { rateLimit } from "@repo/platform";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const ctx = await requirePermission("members:read");

    // Protect export with rate limiting (e.g. 5 exports per hour)
    const limitRes = await rateLimit(`export:activity:${ctx.userId}`, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!limitRes.success) {
      return new Response("Too Many Requests", { status: 429 });
    }

    const url = new URL(request.url);
    const fromDate = url.searchParams.get("from");
    const toDate = url.searchParams.get("to");

    const supabase = createAdminClient();

    let query = supabase
      .from("org_activity_logs")
      .select("id, actor_id, action, entity_type, entity_id, metadata, created_at")
      .eq("organization_id", ctx.organizationId)
      .order("created_at", { ascending: false })
      .limit(5000); // safety bound

    if (fromDate) query = query.gte("created_at", fromDate);
    if (toDate) query = query.lte("created_at", toDate);

    const { data, error } = await query;

    if (error) {
      console.error("[EXPORT] Failed to fetch activity logs for export:", error);
      return new Response("Failed to export logs", { status: 500 });
    }

    // Convert to CSV
    const rows = data || [];
    const csvHeader = "ID,CreatedAt,ActorID,Action,EntityType,EntityID,Metadata\n";
    const csvData = rows
      .map((row) => {
        // Safe stringification for CSV
        const escapeCSV = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
        
        return [
          row.id,
          row.created_at,
          row.actor_id || "",
          row.action,
          row.entity_type || "",
          row.entity_id || "",
          escapeCSV(JSON.stringify(row.metadata || {})),
        ].join(",");
      })
      .join("\n");

    const csvContent = csvHeader + csvData;

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="activity_export_${ctx.organizationId}_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
