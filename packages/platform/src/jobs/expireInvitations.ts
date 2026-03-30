import { createAdminClient } from "../../../auth/src/supabaseAdmin";
import { logger } from "../logger";

export async function runExpireInvitationsJob(): Promise<{ processed: number; success: boolean, error?: string }> {
  logger.info("[JOB] Started expireInvitations job");
  
  try {
    const supabase = createAdminClient();
    
    // We already have a Postgres RPC "expire_org_invitations" available from the legacy SQL,
    // which handles this idempotently.
    // If it's missing, we can implement it in raw drizzle or supabase here.
    
    const { data: updatedCount, error } = await supabase.rpc("expire_org_invitations");
    
    if (error) {
      // Fallback if the RPC doesn't exist
      if (error.code === "PGRST202") {
        logger.warn("[JOB] RPC expire_org_invitations not found, falling back to direct update");
        
        const now = new Date().toISOString();
        const { data: updated, error: updateError } = await supabase
          .from("org_invitations")
          .update({ status: "expired" })
          .eq("status", "pending")
          .lt("expires_at", now)
          .select("id");
          
        if (updateError) {
           throw updateError;
        }
        
        const count = updated?.length || 0;
        logger.info(`[JOB] Expired ${count} invitations via direct update.`);
        return { processed: count, success: true };
      }
      throw error;
    }
    
    logger.info(`[JOB] Expired invitations successfully.`);
    return { processed: typeof updatedCount === 'number' ? updatedCount : 0, success: true };
  } catch (error: any) {
    logger.error("[JOB] expireInvitations job failed:", error);
    return { processed: 0, success: false, error: error.message };
  }
}
