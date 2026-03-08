import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase admin client — uses the service role key to bypass RLS.
 * NEVER expose this to the client side.
 * Used exclusively in Next.js API route handlers.
 */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[FATAL] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. " +
      "Add them to your .env file."
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
