/**
 * Internal Supabase admin client factory.
 *
 * Creates a Supabase client using the service-role key, which bypasses RLS.
 * This module is INTERNAL to @repo/auth and must never be exported from index.ts.
 *
 * Security:
 * - Used exclusively in server-side code paths.
 * - Never used on the client side.
 * - All callers are already behind requireAuth() or requirePermission().
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a fresh Supabase admin client (service-role key).
 * Callers are responsible for creating a new instance per request — there is
 * no singleton pattern here because Supabase clients are stateless and cheap.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[FATAL] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. " +
        "Add them to your .env file."
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
