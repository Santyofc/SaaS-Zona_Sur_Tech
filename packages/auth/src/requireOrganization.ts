/**
 * requireOrganization — Requires authentication AND verified organization membership.
 *
 * Combines `requireAuth()` + `getActiveOrganization()` into a single ergonomic call.
 * Use this in any route handler that operates on an organization's data.
 *
 * @throws {UnauthorizedError} If there is no valid session.
 * @throws {ForbiddenError}    If the user is not a member of the organization.
 * @throws {NotFoundError}     If the user has no organizations at all.
 */

import { requireAuth, type AuthenticatedUser } from "./requireAuth";
import {
  getActiveOrganization,
  type ActiveOrganization,
} from "./getActiveOrganization";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrganizationContext extends AuthenticatedUser, ActiveOrganization {}

// ---------------------------------------------------------------------------
// requireOrganization
// ---------------------------------------------------------------------------

/**
 * Validates authentication and resolves the active organization in one call.
 *
 * @param organizationId - Optional explicit organization ID to resolve. If
 *   omitted, falls back to cookie → first membership (see getActiveOrganization).
 *
 * @throws {UnauthorizedError} If there is no valid session.
 * @throws {ForbiddenError}    If the user is not a member of the org.
 *
 * @example
 * export async function GET(request: Request) {
 *   try {
 *     const ctx = await requireOrganization();
 *     // ctx.userId, ctx.organizationId, ctx.role are all verified
 *     const data = await db.select()...where(eq(table.organizationId, ctx.organizationId));
 *     return NextResponse.json(data);
 *   } catch (err) {
 *     const { body, status } = handleAuthError(err);
 *     return NextResponse.json(body, { status });
 *   }
 * }
 */
export async function requireOrganization(
  organizationId?: string | null
): Promise<OrganizationContext> {
  // Step 1: Validate authentication (throws if invalid).
  const authUser = await requireAuth();

  // Step 2: Resolve and verify organization membership (throws if not member).
  const orgContext = await getActiveOrganization(authUser.userId, organizationId);

  return {
    ...authUser,
    ...orgContext,
  };
}
