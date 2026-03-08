/**
 * Permission definitions and role-based permission resolution.
 *
 * Permissions are resolved from roles in application code — NOT stored in
 * database tables. This keeps the system simple, auditable, and avoids
 * over-engineering with a permission table.
 *
 * To add a new permission:
 *   1. Add it to the `PERMISSIONS` array and `Permission` type.
 *   2. Add it to the relevant roles in `ROLE_PERMISSIONS`.
 */

import type { Role } from "./roles";

// ---------------------------------------------------------------------------
// Permission catalog
// ---------------------------------------------------------------------------

export const PERMISSIONS = [
  // Organization-level
  "org:read",
  "org:update",
  "org:delete",

  // Member management
  "members:read",
  "members:invite",
  "members:update",
  "members:remove",

  // Billing
  "billing:read",
  "billing:update",

  // Projects
  "projects:read",
  "projects:create",
  "projects:update",
  "projects:delete",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Type guard to verify that a raw string is a known Permission.
 */
export function isValidPermission(value: unknown): value is Permission {
  return (
    typeof value === "string" &&
    (PERMISSIONS as readonly string[]).includes(value)
  );
}

// ---------------------------------------------------------------------------
// Role → Permission mapping
// ---------------------------------------------------------------------------

/**
 * Defines which permissions each role holds.
 *
 * Design decisions:
 * - `owner`   : Full control of the organization including deletion.
 * - `admin`   : Full control except organization deletion.
 * - `member`  : Can use projects but cannot manage billing or members beyond reading.
 * - `viewer`  : Read-only access across org/members/projects.
 * - `billing` : Dedicated billing access with minimal operational read access.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  owner: [
    "org:read",
    "org:update",
    "org:delete",
    "members:read",
    "members:invite",
    "members:update",
    "members:remove",
    "billing:read",
    "billing:update",
    "projects:read",
    "projects:create",
    "projects:update",
    "projects:delete",
  ],

  admin: [
    "org:read",
    "org:update",
    // org:delete intentionally omitted — only owners can delete the org
    "members:read",
    "members:invite",
    "members:update",
    "members:remove",
    "billing:read",
    "billing:update",
    "projects:read",
    "projects:create",
    "projects:update",
    "projects:delete",
  ],

  member: [
    "org:read",
    "members:read",
    "billing:read",
    "projects:read",
    "projects:create",
    "projects:update",
    // projects:delete intentionally omitted — members cannot delete projects
  ],

  viewer: [
    "org:read",
    "members:read",
    "projects:read",
    // No write permissions whatsoever
  ],

  billing: [
    "org:read",
    "billing:read",
    "billing:update",
    // Narrow scope: billing role can only manage billing, nothing else
  ],
} as const;

// ---------------------------------------------------------------------------
// Permission resolution helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the given role has the specified permission.
 *
 * @param role       - The membership role to check.
 * @param permission - The permission to test for.
 *
 * @example
 * hasPermission("admin", "org:delete") // false
 * hasPermission("owner", "org:delete") // true
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return (perms as readonly string[]).includes(permission);
}

/**
 * Returns all permissions held by a given role.
 */
export function getPermissions(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Returns true if the given role has ALL of the specified permissions.
 */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Returns true if the given role has ANY of the specified permissions.
 */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
