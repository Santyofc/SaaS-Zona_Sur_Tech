/**
 * apps/web/src/lib/cms/permissions.ts
 *
 * CMS permission layer.
 *
 * Extends the existing @repo/auth permission system with CMS-specific
 * permissions. Follows the exact same pattern: role → permission mapping,
 * no DB tables, purely code-defined and auditable.
 *
 * CMS access is scoped to the organization's own content (tenant isolation).
 */

import { hasPermission, type Permission } from "@repo/auth";
import type { Role } from "@repo/auth";

// ---------------------------------------------------------------------------
// CMS Permission catalog extension
// ---------------------------------------------------------------------------

/**
 * CMS-specific permissions.
 * These are intentionally NOT added to the @repo/auth package yet —
 * they live here until the CMS is stable, then they get promoted.
 */
export const CMS_PERMISSIONS = [
  "cms:read",        // Can view all entries and media in the admin panel
  "cms:write",       // Can create and edit entries/media
  "cms:publish",     // Can change status to published/archived
  "cms:delete",      // Can hard-delete entries and media
  "cms:settings",    // Can update org CMS settings
] as const;

export type CmsPermission = (typeof CMS_PERMISSIONS)[number];

/**
 * Which CMS permissions each org role gets.
 *
 * - owner/admin: full CMS control
 * - member: can read + create/edit drafts, cannot publish or delete
 * - viewer: read-only in admin (useful for stakeholder access)
 * - billing: no CMS access
 */
export const CMS_ROLE_PERMISSIONS: Record<Role, readonly CmsPermission[]> = {
  owner: ["cms:read", "cms:write", "cms:publish", "cms:delete", "cms:settings"],
  admin: ["cms:read", "cms:write", "cms:publish", "cms:delete", "cms:settings"],
  member: ["cms:read", "cms:write"],
  viewer: ["cms:read"],
  billing: [],
};

// ---------------------------------------------------------------------------
// Resolution helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the given org role has the specified CMS permission.
 *
 * @example
 * hasCmsPermission("member", "cms:publish") // false
 * hasCmsPermission("admin", "cms:publish")  // true
 */
export function hasCmsPermission(role: Role, perm: CmsPermission): boolean {
  return (CMS_ROLE_PERMISSIONS[role] as readonly string[]).includes(perm);
}

export function hasCmsAnyPermission(
  role: Role,
  perms: CmsPermission[]
): boolean {
  return perms.some((p) => hasCmsPermission(role, p));
}

// ---------------------------------------------------------------------------
// Server-side guard (used in Server Actions)
// ---------------------------------------------------------------------------

import { ForbiddenError } from "@repo/auth";
import { getMembershipContext } from "@repo/auth";

/**
 * Resolves the calling user's org membership and checks the CMS permission.
 * Throws ForbiddenError if access is denied. Returns the membership context.
 *
 * Use this at the top of every CMS server action:
 *
 * @example
 * "use server";
 * export async function createPost(input: unknown) {
 *   const ctx = await requireCmsPermission("cms:write");
 *   // ... proceed safely with ctx.organizationId and ctx.userId
 * }
 */
export async function requireCmsPermission(permission: CmsPermission) {
  const ctx = await getMembershipContext();

  if (!hasCmsPermission(ctx.role, permission)) {
    throw new ForbiddenError(
      `You do not have the '${permission}' permission in this organization.`
    );
  }

  return ctx;
}
