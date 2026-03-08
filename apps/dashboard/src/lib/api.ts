/**
 * lib/api.ts — Typed fetch wrappers for all backend API routes.
 *
 * All functions throw structured errors. Callers should catch and display
 * them using the inline error pattern (no raw stack traces exposed).
 *
 * Conventions:
 * - All requests include credentials (cookies) for session forwarding.
 * - Errors are normalized to { message: string, code?: string }.
 * - Every mutation returns the parsed JSON response.
 */

export interface ApiError {
  message: string;
  code?: string;
}

/** Normalized error thrown by API helpers. */
export class ApiFetchError extends Error {
  public readonly status: number;
  public readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiFetchError";
    this.status = status;
    this.code = code;
  }
}

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    let code: string | undefined;
    try {
      const body = await res.json();
      message = body.error ?? body.message ?? message;
      code = body.code;
    } catch {
      /* ignore parse errors */
    }
    throw new ApiFetchError(message, res.status, code);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Types (mirrors backend response shapes)
// ---------------------------------------------------------------------------

export interface MemberProfile {
  name: string | null;
  email: string | null;
  image: string | null;
}

export type MemberStatus = "active" | "invited" | "suspended";
export type Role = "owner" | "admin" | "member" | "viewer" | "billing";
export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export interface OrganizationMember {
  membershipId: string;
  userId: string;
  organizationId: string;
  role: Role;
  status: MemberStatus;
  joinedAt: string;
  updatedAt: string;
  profile: MemberProfile | null;
}

export interface InvitationSummary {
  id: string;
  organizationId: string;
  email: string;
  role: Role;
  invitedBy: string | null;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  organizationId: string;
  actorId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface OrganizationBasic {
  id: string;
  name: string;
  slug: string | null;
}

export interface MembershipBasic {
  membershipId: string;
  organizationId: string;
  organizationName: string;
  role: Role;
  status: MemberStatus;
}

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export async function apiListMembers(): Promise<OrganizationMember[]> {
  const data = await apiFetch<{ members: OrganizationMember[] }>("/api/members");
  return data.members;
}

export async function apiUpdateMemberRole(
  membershipId: string,
  role: Role
): Promise<void> {
  await apiFetch(`/api/members/${membershipId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function apiUpdateMemberStatus(
  membershipId: string,
  status: MemberStatus
): Promise<void> {
  await apiFetch(`/api/members/${membershipId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function apiRemoveMember(membershipId: string): Promise<{ isSelfRemoval: boolean }> {
  return apiFetch<{ isSelfRemoval: boolean }>(`/api/members/${membershipId}`, {
    method: "DELETE",
  });
}

export async function apiTransferOwnership(toUserId: string): Promise<void> {
  await apiFetch("/api/organizations/transfer-ownership", {
    method: "POST",
    body: JSON.stringify({ toUserId }),
  });
}

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export async function apiListInvitations(): Promise<InvitationSummary[]> {
  const data = await apiFetch<{ invitations: InvitationSummary[] }>("/api/invitations");
  return data.invitations;
}

export async function apiCreateInvitation(
  email: string,
  role: Role
): Promise<{ invitation: InvitationSummary; inviteUrl: string }> {
  return apiFetch("/api/invitations", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
}

export async function apiRevokeInvitation(invitationId: string): Promise<void> {
  await apiFetch(`/api/invitations/${invitationId}/revoke`, { method: "POST" });
}

export async function apiResendInvitation(invitationId: string): Promise<{ inviteUrl: string }> {
  return apiFetch(`/api/invitations/${invitationId}/resend`, { method: "POST" });
}

export async function apiAcceptInvitation(token: string): Promise<{
  organizationId: string;
  organizationName: string;
}> {
  return apiFetch("/api/invitations/accept", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

// ---------------------------------------------------------------------------
// Organization switching
// ---------------------------------------------------------------------------

export async function apiSwitchOrganization(
  organizationId: string
): Promise<{ organizationId: string; organizationName: string }> {
  return apiFetch("/api/organizations/switch", {
    method: "POST",
    body: JSON.stringify({ organizationId }),
  });
}

// ---------------------------------------------------------------------------
// User memberships (for workspace switcher)
// ---------------------------------------------------------------------------

export async function apiGetMe(): Promise<{
  user: { name: string; email: string; role: string };
  organization?: { id: string; name: string };
  memberships?: MembershipBasic[];
}> {
  return apiFetch("/api/auth/me");
}

// ---------------------------------------------------------------------------
// Activity logs
// ---------------------------------------------------------------------------

export async function apiListActivity(limit = 50): Promise<ActivityLogEntry[]> {
  const data = await apiFetch<{ logs: ActivityLogEntry[] }>(
    `/api/activity?limit=${limit}`
  );
  return data.logs;
}
