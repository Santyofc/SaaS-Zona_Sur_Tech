/**
 * Role definitions for the vm-platform multi-tenant authorization system.
 *
 * Roles are resolved from the `memberships.role` column in the database.
 * They are string literals — not a DB enum in application code — so that
 * the permission resolution layer remains pure TypeScript with no DB coupling.
 */

/**
 * All valid tenant membership roles, ordered from highest to lowest privilege.
 */
export const ROLES = ["owner", "admin", "member", "viewer", "billing"] as const;

/**
 * Discriminated union type for a membership role.
 */
export type Role = (typeof ROLES)[number];

/**
 * Type guard to verify that a raw string value is a valid Role.
 */
export function isValidRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/**
 * Returns the next role below the given one, or null if already the lowest.
 * Useful for downgrade validation guards.
 */
export function getRoleRank(role: Role): number {
  return ROLES.indexOf(role);
}

/**
 * Returns true if `actorRole` has equal or higher privilege than `targetRole`.
 * Used for role comparison guards (e.g., cannot promote a member to a role
 * higher than your own).
 */
export function isRoleAtLeast(actorRole: Role, targetRole: Role): boolean {
  return getRoleRank(actorRole) <= getRoleRank(targetRole);
}
