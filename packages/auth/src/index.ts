/**
 * @repo/auth — Public API barrel export.
 *
 * Import hierarchy (no circular deps):
 *
 *   roles.ts
 *   permissions.ts           ← imports roles.ts
 *   errors.ts                (standalone)
 *   session.ts               (standalone JWT utils)
 *   supabaseAdmin.ts         (standalone — internal client factory)
 *   logActivity.ts           ← imports supabaseAdmin
 *   requireAuth.ts           ← imports errors.ts
 *   getActiveOrganization.ts ← imports supabaseAdmin, errors, roles
 *   requireOrganization.ts   ← imports requireAuth, getActiveOrganization
 *   getAuthorizationContext.ts ← imports supabaseAdmin, errors, permissions, roles
 *   requirePermission.ts     ← imports requireAuth, getActiveOrg, getAuthzCtx, errors
 *   ensureUserProfile.ts     ← imports @repo/db
 *   setActiveOrganization.ts ← imports supabaseAdmin, getActiveOrganization, errors
 *   invitations.ts           ← imports supabaseAdmin, logActivity, errors, roles
 *   listOrganizationMembers.ts ← imports supabaseAdmin, errors, roles
 *   updateMemberRole.ts      ← imports supabaseAdmin, logActivity, errors, roles
 *   updateMemberStatus.ts    ← imports supabaseAdmin, logActivity, errors, roles
 *   removeMember.ts          ← imports supabaseAdmin, logActivity, errors, roles
 *   transferOwnership.ts     ← imports supabaseAdmin, logActivity, errors, roles
 *   resendInvitation.ts      ← imports supabaseAdmin, logActivity, errors, invitations
 */

// ---------------------------------------------------------------------------
// Core JWT session utilities (used by middleware and login routes)
// ---------------------------------------------------------------------------
export { encrypt, decrypt, type SessionPayload } from "./session";

// ---------------------------------------------------------------------------
// Role system
// ---------------------------------------------------------------------------
export {
  ROLES,
  type Role,
  isValidRole,
  getRoleRank,
  isRoleAtLeast,
} from "./roles";

// ---------------------------------------------------------------------------
// Permission system
// ---------------------------------------------------------------------------
export {
  PERMISSIONS,
  type Permission,
  ROLE_PERMISSIONS,
  isValidPermission,
  hasPermission,
  getPermissions,
  hasAllPermissions,
  hasAnyPermission,
} from "./permissions";

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------
export {
  AuthError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  handleAuthError,
} from "./errors";

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------
export { requireAuth, type AuthenticatedUser } from "./requireAuth";

// ---------------------------------------------------------------------------
// Organization resolution
// ---------------------------------------------------------------------------
export {
  getActiveOrganization,
  ACTIVE_ORG_COOKIE,
  type ActiveOrganization,
} from "./getActiveOrganization";

// ---------------------------------------------------------------------------
// Combined auth + org guard
// ---------------------------------------------------------------------------
export {
  requireOrganization,
  type OrganizationContext,
} from "./requireOrganization";

// ---------------------------------------------------------------------------
// Full authorization context (membership + permissions)
// ---------------------------------------------------------------------------
export {
  getAuthorizationContext,
  type AuthorizationContext,
  type MembershipRecord,
} from "./getAuthorizationContext";

// ---------------------------------------------------------------------------
// Permission-gated route guard (primary API protection primitive)
// ---------------------------------------------------------------------------
export {
  requirePermission,
  type PermissionContext,
} from "./requirePermission";

// ---------------------------------------------------------------------------
// Profile synchronization
// ---------------------------------------------------------------------------
export {
  ensurePublicUserProfile,
  type AuthUserInput,
  type PublicUserProfile,
} from "./ensureUserProfile";

// ---------------------------------------------------------------------------
// Activity logging
// ---------------------------------------------------------------------------
export { logActivity, type LogActivityInput } from "./logActivity";

// ---------------------------------------------------------------------------
// Active organization switching (cookie management)
// ---------------------------------------------------------------------------
export {
  setActiveOrganization,
  type SetActiveOrganizationResult,
} from "./setActiveOrganization";

// ---------------------------------------------------------------------------
// Invitation system
// ---------------------------------------------------------------------------
export {
  createInvitation,
  listInvitations,
  revokeInvitation,
  acceptInvitation,
  type Invitation,
  type InvitationSummary,
  type InvitationStatus,
  type CreateInvitationInput,
  type CreateInvitationResult,
  type RawInvitationRow,
} from "./invitations";

// ---------------------------------------------------------------------------
// Member management
// ---------------------------------------------------------------------------
export {
  listOrganizationMembers,
  type OrganizationMember,
  type MemberProfile,
} from "./listOrganizationMembers";

export {
  updateMemberRole,
  type UpdateMemberRoleInput,
  type UpdateMemberRoleResult,
} from "./updateMemberRole";

export {
  updateMemberStatus,
  type UpdateMemberStatusInput,
  type UpdateMemberStatusResult,
  type MemberStatus,
} from "./updateMemberStatus";

export {
  removeMember,
  type RemoveMemberInput,
  type RemoveMemberResult,
} from "./removeMember";

export {
  transferOwnership,
  type TransferOwnershipInput,
  type TransferOwnershipResult,
} from "./transferOwnership";

// ---------------------------------------------------------------------------
// Invitation resend
// ---------------------------------------------------------------------------
export {
  resendInvitation,
  type ResendInvitationResult,
} from "./resendInvitation";
