/**
 * ensurePublicUserProfile — Idempotent upsert of a user's public profile.
 *
 * Synchronizes the `public.users` table with data from `auth.users`.
 * This is a best-effort operation: failures are logged but never crash
 * the calling request (critical for onboarding flows).
 *
 * Design decisions:
 * - The `id` column in `public.users` intentionally mirrors `auth.users.id`
 *   so that JOINs are trivial and there is a single source of identity.
 * - `password_hash` is stored as a sentinel ("SUPABASE_MANAGED") because
 *   Supabase owns password management. The column exists for legacy reasons
 *   and must NOT be used for authentication.
 * - This function is idempotent — calling it multiple times is safe.
 *
 * Security note:
 * - NEVER use `public.users.id` as the identity source. Always use
 *   `auth.users.id` (i.e., the JWT `sub` claim or `supabase.auth.getUser()`).
 * - `public.users` is a profile mirror for display data only.
 */

import { db, users } from "@repo/db";
import type { User } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Minimal shape of a Supabase Auth user required for profile sync.
 * Accepts both the full `User` type and a minimal subset for flexibility.
 */
export interface AuthUserInput {
  id: string;
  email?: string | null;
  user_metadata?: {
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  } | null;
}

export interface PublicUserProfile {
  id: string;
  email: string;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// ensurePublicUserProfile
// ---------------------------------------------------------------------------

/**
 * Upserts the user's profile into `public.users`.
 *
 * @param authUser - The user from `supabase.auth.getUser()` or `admin.getUserById()`.
 * @returns The upserted user record, or `null` if the upsert failed (non-fatal).
 *
 * @example
 * const authUser = await requireAuth();
 * await ensurePublicUserProfile(authUser.authUser);
 */
export async function ensurePublicUserProfile(
  authUser: AuthUserInput | User
): Promise<PublicUserProfile | null> {
  if (!authUser?.id) {
    console.warn("[AUTH_SYNC] ensurePublicUserProfile called with no user id. Skipping.");
    return null;
  }

  try {
    const email = authUser.email ?? "";
    const displayName =
      authUser.user_metadata?.display_name ||
      authUser.user_metadata?.full_name ||
      (email ? email.split("@")[0] : "user");

    const result = await db
      .insert(users)
      .values({
        id: authUser.id,
        email,
        // Sentinel value — Supabase owns authentication, not this column.
        // The column is kept for schema backward-compat only.
        passwordHash: "SUPABASE_MANAGED",
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email,
          // Intentionally not updating passwordHash to avoid overwriting
          // any future real value.
        },
      })
      .returning({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
      });

    if (!result[0]) {
      console.warn("[AUTH_SYNC] Upsert returned no rows for user:", authUser.id);
      return null;
    }

    return result[0];
  } catch (error) {
    // Non-fatal: warn but never crash onboarding.
    console.warn(
      `[AUTH_SYNC] Failed to ensure public user profile for ${authUser.id}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
