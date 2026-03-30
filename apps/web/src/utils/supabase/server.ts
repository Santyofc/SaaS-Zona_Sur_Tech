import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { getCookieDomain } from "@/utils/supabase/cookie-config";

export function createClient() {
  const cookieStore = cookies();
  const host = headers().get("host");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("[FATAL] Missing Supabase URL or anon key in server runtime.");
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              domain: getCookieDomain(host),
              ...options,
            });
          } catch (error) {
            // Ignored in SC
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: "",
              domain: getCookieDomain(host),
              ...options,
            });
          } catch (error) {
            // Ignored in SC
          }
        },
      },
    },
  );
}
