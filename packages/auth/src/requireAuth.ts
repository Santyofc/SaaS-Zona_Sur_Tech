/**
 * requireAuth — Validates a Supabase session and returns a normalized user object.
 *
 * This is the primary entry point for all API route handlers that require
 * authentication. It reads the Supabase session from the server-side cookie
 * store and verifies the token cryptographically with the Supabase service.
 *
 * It does NOT check organization membership or permissions. Use
 * `requireOrganization()` or `requirePermission()` for that.
 *
 * @throws {UnauthorizedError} If there is no valid session.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { UnauthorizedError } from "./errors";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthenticatedUser {
  /** The user's UUID from auth.users — the single source of identity. */
  userId: string;
  /** The user's email address. */
  email: string;
  /** Whether the user has confirmed their email address. */
  emailConfirmed: boolean;
  /** The raw Supabase auth.User object for advanced use cases. */
  authUser: User;
}

// ---------------------------------------------------------------------------
// Internal: Supabase SSR client factory
// ---------------------------------------------------------------------------

/**
 * Creates a Supabase server client bound to the current request's cookie store.
 * Uses the ANON key — sufficient for session validation via `getUser()`.
 * The service-role key is only used in admin-level helpers (see lib/supabase.ts).
 */
function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "[FATAL] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set."
    );
  }

  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Silently swallow: set() called from Server Component context where cookies are read-only.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Silently swallow: same reason as above.
        }
      },
    },
  });
}

// ---------------------------------------------------------------------------
// requireAuth
// ---------------------------------------------------------------------------

/**
 * Validates the current Supabase session and returns a normalized, typed user.
 *
 * Uses `supabase.auth.getUser()` which performs a cryptographic verification
 * against the Supabase Auth server — NOT a local JWT decode. This is the
 * correct approach per Supabase security guidance to prevent forged tokens.
 *
 * @throws {UnauthorizedError} If no session exists or the token is invalid.
 *
 * @example
 * export async function GET() {
 *   try {
 *     const { userId, email } = await requireAuth();
 *     return NextResponse.json({ userId });
 *   } catch (err) {
 *     const { body, status } = handleAuthError(err);
 *     return NextResponse.json(body, { status });
 *   }
 * }
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new UnauthorizedError(
      "No active session found. Please log in."
    );
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    emailConfirmed: !!(user.email_confirmed_at ?? user.confirmed_at),
    authUser: user,
  };
}
