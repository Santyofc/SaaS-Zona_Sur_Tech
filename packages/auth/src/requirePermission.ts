/**
 * requirePermission — The primary authorization gate for all protected API routes.
 *
 * Composes authentication + organization resolution + membership verification +
 * permission check into a single, ergonomic call.
 *
 * This is the recommended way to protect route handlers in the dashboard app.
 *
 * @example
 * export async function DELETE(request: Request) {
 *   try {
 *     const ctx = await requirePermission("projects:delete");
 *     // ctx.userId, ctx.organizationId, ctx.permissions are all verified
 *     await db.delete(projects).where(eq(projects.organizationId, ctx.organizationId));
 *     return NextResponse.json({ success: true });
 *   } catch (err) {
 *     const { body, status } = handleAuthError(err);
 *     return NextResponse.json(body, { status });
 *   }
 * }
 */

import { requireAuth, type AuthenticatedUser } from "./requireAuth";
import {
  getActiveOrganization,
  type ActiveOrganization,
} from "./getActiveOrganization";
import { getAuthorizationContext, type AuthorizationContext } from "./getAuthorizationContext";
import { ForbiddenError } from "./errors";
import type { Permission } from "./permissions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PermissionContext
  extends AuthenticatedUser,
    ActiveOrganization,
    Omit<AuthorizationContext, "membership"> {
  /** The membership record UUID. */
  membershipId: string;
}

// ---------------------------------------------------------------------------
// requirePermission
// ---------------------------------------------------------------------------

/**
 * Validates authentication, resolves the organization, verifies membership,
 * and checks that the user's role has the requested permission.
 *
 * @param permission     - The permission to require (e.g. "projects:delete").
 * @param organizationId - Optional explicit org ID; falls back to cookie → first membership.
 *
 * @throws {UnauthorizedError} If there is no valid session.
 * @throws {ForbiddenError}    If the user is not a member or lacks the permission.
 *
 * @returns A fully resolved context object safe to use in route logic.
 */
export async function requirePermission(
  permission: Permission,
  organizationId?: string | null
): Promise<PermissionContext> {
  // Step 1: Validate session.
  const authUser = await requireAuth();

  // Step 2: Resolve & verify organization membership.
  const orgContext = await getActiveOrganization(
    authUser.userId,
    organizationId
  );

  // Step 3: Load the full authorization context (membership + permissions).
  const authzContext = await getAuthorizationContext(
    authUser.userId,
    orgContext.organizationId
  );

  // Step 4: Check that the role has the requested permission.
  if (!authzContext.has(permission)) {
    throw new ForbiddenError(
      `You do not have the required permission: "${permission}".`
    );
  }

  return {
    ...authUser,
    ...orgContext,
    permissions: authzContext.permissions,
    has: authzContext.has.bind(authzContext),
    membershipId: authzContext.membership.id,
  };
}
