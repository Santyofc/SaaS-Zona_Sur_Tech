/**
 * listOrganizationMembers — Returns enriched membership records for an org.
 *
 * Joins memberships with public.users for profile display data (name, email,
 * image). public.users is used ONLY for enrichment — authorization always
 * comes from memberships.role.
 *
 * Returns members sorted: owners first, then by joined_at ascending.
 */

import { createAdminClient } from "./supabaseAdmin";
import { NotFoundError } from "./errors";
import type { Role } from "./roles";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MemberProfile {
  /** Display name from public.users, or null if profile not yet synced. */
  name: string | null;
  /** Email from public.users (display only — not used for auth). */
  email: string | null;
  /** Avatar URL from public.users. */
  image: string | null;
}

export interface OrganizationMember {
  /** Membership record UUID. */
  membershipId: string;
  /** auth.users UUID — the canonical user identifier. */
  userId: string;
  organizationId: string;
  role: Role;
  /** Membership lifecycle status. */
  status: "active" | "invited" | "suspended";
  joinedAt: string;
  updatedAt: string;
  /** Profile data from public.users — may be null if not yet synced. */
  profile: MemberProfile | null;
}

// Raw row returned by Supabase join query.
// Supabase returns nested one-to-one joins as an array or single object
// depending on the relationship type. We use `unknown` then cast defensively.
type UserProfile = {
  name: string | null;
  email: string | null;
  image: string | null;
};

type RawMemberRow = {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  status: string;
  joined_at: string;
  updated_at: string;
  // Supabase may return this as an array or single object depending on relationship.
  users: UserProfile | UserProfile[] | null;
};

// ---------------------------------------------------------------------------
// listOrganizationMembers
// ---------------------------------------------------------------------------

/**
 * Returns all membership records for the given organization,
 * enriched with profile data from public.users where available.
 *
 * @param organizationId - Tenant scope — always verified by the caller via requirePermission.
 *
 * @throws {NotFoundError} If the organization does not exist (edge case guard).
 */
export async function listOrganizationMembers(
  organizationId: string
): Promise<OrganizationMember[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("memberships")
    .select(
      `
      id,
      user_id,
      organization_id,
      role,
      status,
      joined_at,
      updated_at,
      users (
        name,
        email,
        image
      )
    `
    )
    .eq("organization_id", organizationId)
    .order("joined_at", { ascending: true });

  if (error) {
    console.error("[MEMBERS] Failed to list members:", error);
    throw new Error("Failed to retrieve organization members.");
  }

  if (!data) {
    throw new NotFoundError("Organization not found.");
  }

  // Sort: owners first by privilege, then by join date.
  const roleOrder: Record<string, number> = {
    owner: 0,
    admin: 1,
    member: 2,
    viewer: 3,
    billing: 4,
  };

  const sorted = [...data].sort((a, b) => {
    const rankA = roleOrder[a.role] ?? 99;
    const rankB = roleOrder[b.role] ?? 99;
    if (rankA !== rankB) return rankA - rankB;
    return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
  });

  return sorted.map((row) => {
    const rawRow = row as unknown as RawMemberRow;
    // Normalize: Supabase may return users as array or single object.
    const rawProfile = Array.isArray(rawRow.users)
      ? (rawRow.users[0] ?? null)
      : rawRow.users;

    const profile = rawProfile
      ? {
          name: rawProfile.name,
          email: rawProfile.email,
          image: rawProfile.image,
        }
      : null;

    return {
      membershipId: rawRow.id,
      userId: rawRow.user_id,
      organizationId: rawRow.organization_id,
      role: rawRow.role as Role,
      status: rawRow.status as OrganizationMember["status"],
      joinedAt: rawRow.joined_at,
      updatedAt: rawRow.updated_at,
      profile,
    };
  });
}
