import { createBrowserClient } from "@supabase/ssr";
import { getCookieDomain } from "./cookie-config";

export function createClient() {
  const host = typeof window !== "undefined" ? window.location.host : null;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: getCookieDomain(host),
      },
    },
  );
}
