/**
 * logActivity — Appends an event to org_activity_logs.
 *
 * This is a best-effort helper. Unless `critical` is set to true, logging
 * failures are caught and warned without propagating. This ensures that a
 * logging failure never aborts a business-critical operation.
 *
 * Architecture:
 * - Uses the `log_org_activity` RPC (SECURITY DEFINER) which is the single
 *   write path to org_activity_logs.
 * - Falls back to a direct insert if the RPC fails (e.g., during dev without
 *   the function deployed yet).
 *
 * Supported action strings (expand as needed):
 *   organization.created
 *   organization.switched
 *   invitation.created
 *   invitation.revoked
 *   invitation.accepted
 *   member.removed
 *   member.role_updated
 */

import { createAdminClient } from "./supabaseAdmin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LogActivityInput {
  /** UUID of the organization this event belongs to. */
  organizationId: string;
  /** UUID of the user who performed the action (from auth.users). */
  actorId: string;
  /**
   * Dot-separated action string (e.g., "invitation.created").
   * Use consistent naming: <entity>.<verb>
   */
  action: string;
  /** Type of entity this action targets (e.g., "invitation", "member"). */
  entityType?: string;
  /** ID of the entity this action targets. */
  entityId?: string;
  /**
   * Arbitrary JSON metadata to store with the event.
   * Include contextual data useful for audit display (e.g., email, role)
   * but NEVER include secrets or PII beyond what's necessary for audit.
   */
  metadata?: Record<string, unknown>;
  /**
   * If true, logging failures will throw instead of being swallowed.
   * Use for legally/business critical events.
   * Default: false (best-effort)
   */
  critical?: boolean;
}

// ---------------------------------------------------------------------------
// logActivity
// ---------------------------------------------------------------------------

/**
 * Appends an activity event to org_activity_logs.
 *
 * @param input - Structured event payload.
 * @returns The UUID of the created log row, or null if logging failed (non-critical).
 *
 * @example
 * await logActivity({
 *   organizationId,
 *   actorId: userId,
 *   action: "invitation.created",
 *   entityType: "invitation",
 *   entityId: invitationId,
 *   metadata: { email, role },
 * });
 */
export async function logActivity(input: LogActivityInput): Promise<string | null> {
  const {
    organizationId,
    actorId,
    action,
    entityType,
    entityId,
    metadata = {},
    critical = false,
  } = input;

  try {
    const supabase = createAdminClient();

    // Prefer the RPC path for atomicity.
    const { data, error } = await supabase.rpc("log_org_activity", {
      p_organization_id: organizationId,
      p_actor_id: actorId,
      p_action: action,
      p_entity_type: entityType ?? null,
      p_entity_id: entityId ?? null,
      p_metadata: metadata,
    });

    if (!error && data) {
      return data as string;
    }

    // RPC failed (e.g., function not deployed in local dev) — direct insert fallback.
    if (error?.code === "PGRST202") {
      const { data: row, error: insertError } = await supabase
        .from("org_activity_logs")
        .insert({
          organization_id: organizationId,
          actor_id: actorId,
          action,
          entity_type: entityType ?? null,
          entity_id: entityId ?? null,
          metadata,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      return row?.id ?? null;
    }

    if (error) throw error;
    return null;
  } catch (err) {
    const msg = `[ACTIVITY_LOG] Failed to log "${action}" for org ${organizationId}:`;

    if (critical) {
      console.error(msg, err);
      throw err;
    }

    console.warn(msg, err instanceof Error ? err.message : err);
    return null;
  }
}
