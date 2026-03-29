import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { getCookieDomain } from "./cookie-config";

export function createClient() {
  const cookieStore = cookies();
  const host = headers().get("host");

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
              ...options,
              domain: getCookieDomain(host),
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
              ...options,
              domain: getCookieDomain(host),
            });
          } catch (error) {
            // Ignored in SC
          }
        },
      },
    },
  );
}
