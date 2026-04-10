"use client";

/**
 * MembersTable — Lists org members with role/status badges and per-row actions.
 *
 * Actions shown based on the current user's role:
 * - members:update → Change Role, Suspend/Reactivate
 * - members:remove → Remove Member
 * - org:update (owner only) → Transfer Ownership
 *
 * Backend remains authoritative — frontend only hides obvious non-actions.
 * All errors are caught and shown inline; backend validation is the final gate.
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, AlertCircle, UserMinus } from "lucide-react";
import {
  apiUpdateMemberRole,
  apiUpdateMemberStatus,
  apiRemoveMember,
  apiTransferOwnership,
  ApiFetchError,
} from "@/lib/api";
import type { OrganizationMember, Role } from "@/lib/api";
import {
  RoleBadge,
  StatusBadge,
  ConfirmDialog,
  ActionMenu,
  Spinner,
  EmptyState,
  ErrorBanner,
  cn,
} from "./ui-primitives";

interface MembersTableProps {
  members: OrganizationMember[];
  currentUserId: string;
  currentUserRole: Role;
  onRefresh: () => void;
}

type Dialog =
  | null
  | { type: "change-role"; member: OrganizationMember; newRole: Role }
  | { type: "suspend"; member: OrganizationMember }
  | { type: "reactivate"; member: OrganizationMember }
  | { type: "remove"; member: OrganizationMember }
  | { type: "transfer"; member: OrganizationMember };

const ROLE_OPTIONS: Role[] = ["admin", "member", "viewer", "billing"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MembersTable({
  members,
  currentUserId,
  currentUserRole,
  onRefresh,
}: MembersTableProps) {
  const [localMembers, setLocalMembers] = useState<OrganizationMember[]>(members);

  const [dialog, setDialog] = useState<Dialog>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Keep local state in sync with server data when props update
  useEffect(() => {
    setLocalMembers(members);
  }, [members]);

  async function handleConfirm() {
    if (!dialog) return;
    
    // Save original state for rollback
    const originalMembers = [...localMembers];
    const targetMemberId = dialog.member.membershipId;

    // Apply optimistic updates to local state
    if (dialog.type === "change-role") {
      setLocalMembers(prev => prev.map(m => 
        m.membershipId === targetMemberId ? { ...m, role: dialog.newRole } : m
      ));
    } else if (dialog.type === "suspend") {
      setLocalMembers(prev => prev.map(m => 
        m.membershipId === targetMemberId ? { ...m, status: "suspended" } : m
      ));
    } else if (dialog.type === "reactivate") {
      setLocalMembers(prev => prev.map(m => 
        m.membershipId === targetMemberId ? { ...m, status: "active" } : m
      ));
    } else if (dialog.type === "remove") {
      setLocalMembers(prev => prev.filter(m => m.membershipId !== targetMemberId));
    }

    setLoading(true);
    setActionError(null);

    try {
      switch (dialog.type) {
        case "change-role":
          await apiUpdateMemberRole(targetMemberId, dialog.newRole);
          break;
        case "suspend":
          await apiUpdateMemberStatus(targetMemberId, "suspended");
          break;
        case "reactivate":
          await apiUpdateMemberStatus(targetMemberId, "active");
          break;
        case "remove":
          await apiRemoveMember(targetMemberId);
          break;
        case "transfer":
          await apiTransferOwnership(dialog.member.userId);
          break;
      }
      setDialog(null);
      onRefresh(); // Trigger parent refresh to ensure server sync
    } catch (err) {
      // Rollback on failure
      setLocalMembers(originalMembers);
      const msg = err instanceof ApiFetchError ? err.message : "Action failed. Try again.";
      setActionError(msg);
    } finally {
      setLoading(false);
    }
  }

  const canUpdate = ["owner", "admin"].includes(currentUserRole);
  const canRemove = ["owner", "admin"].includes(currentUserRole);
  const isOwner = currentUserRole === "owner";

  if (localMembers.length === 0) {
    return (
      <EmptyState
        icon={<UserMinus className="w-6 h-6" />}
        title="No members yet"
        description="Invite people to collaborate in your organization."
      />
    );
  }

  return (
    <div className="space-y-3">
      {actionError && (
        <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />
      )}

      <div className="overflow-x-auto rounded-2xl border border-zs-border bg-zs-bg-surface/40 backdrop-blur-xl">
        <table className="zs-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {localMembers.map((member, i) => {
              const isSelf = member.userId === currentUserId;
              const isTargetOwner = member.role === "owner";
              const displayName =
                member.profile?.name ?? member.profile?.email ?? "Unknown";
              const displayEmail = member.profile?.email ?? null;

              // Build action items for this row
              const actions = [];

              // Change role sub-items
              if (canUpdate && !isSelf && !(currentUserRole === "admin" && isTargetOwner)) {
                ROLE_OPTIONS.forEach((r) => {
                  if (r !== member.role) {
                    actions.push({
                      label: `Set as ${r}`,
                      onClick: () =>
                        setDialog({
                          type: "change-role",
                          member,
                          newRole: r,
                        }),
                    });
                  }
                });
              }

              if (canUpdate && !isSelf && !(currentUserRole === "admin" && isTargetOwner)) {
                if (member.status === "active") {
                  actions.push({
                    label: "Suspend",
                    variant: "danger" as const,
                    onClick: () => setDialog({ type: "suspend", member }),
                  });
                } else if (member.status === "suspended") {
                  actions.push({
                    label: "Reactivate",
                    onClick: () => setDialog({ type: "reactivate", member }),
                  });
                }
              }

              if (canRemove && !(currentUserRole === "admin" && isTargetOwner)) {
                actions.push({
                  label: isSelf ? "Leave organization" : "Remove member",
                  variant: "danger" as const,
                  onClick: () => setDialog({ type: "remove", member }),
                });
              }

              if (isOwner && !isSelf && member.status === "active" && !isTargetOwner) {
                actions.push({
                  label: "Transfer ownership",
                  variant: "danger" as const,
                  onClick: () => setDialog({ type: "transfer", member }),
                });
              }

              return (
                <motion.tr
                  key={member.membershipId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0",
                          isTargetOwner
                            ? "bg-gradient-to-br from-zs-violet to-zs-blue shadow-zs-glow-violet"
                            : "bg-white/10"
                        )}
                      >
                        {(member.profile?.name ?? member.profile?.email ?? "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-white">
                            {displayName}
                          </p>
                          {isTargetOwner && (
                            <Crown className="w-3.5 h-3.5 text-zs-violet" aria-label="Owner" />
                          )}
                          {isSelf && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-zs-text-muted">
                              (you)
                            </span>
                          )}
                        </div>
                        {displayEmail && (
                          <p className="text-xs text-zs-text-muted">{displayEmail}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <RoleBadge role={member.role} />
                  </td>
                  <td>
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="text-zs-text-secondary text-xs">
                    {formatDate(member.joinedAt)}
                  </td>
                  <td className="text-right">
                    <ActionMenu items={actions} />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={dialog?.type === "change-role"}
        title={`Change role to ${dialog?.type === "change-role" ? dialog.newRole : ""}?`}
        description={`This will update the member's permissions immediately.`}
        confirmLabel="Update role"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.type === "suspend"}
        title="Suspend member?"
        description="This member will lose access to the organization until reactivated."
        confirmLabel="Suspend"
        variant="danger"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.type === "reactivate"}
        title="Reactivate member?"
        description="This member will regain access to the organization."
        confirmLabel="Reactivate"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.type === "remove"}
        title={
          dialog?.type === "remove" && dialog.member.userId === currentUserId
            ? "Leave organization?"
            : "Remove member?"
        }
        description={
          dialog?.type === "remove" && dialog.member.userId === currentUserId
            ? "You will lose access to this organization. This action cannot be undone."
            : "This member will permanently lose access. This action cannot be undone."
        }
        confirmLabel={
          dialog?.type === "remove" && dialog.member.userId === currentUserId
            ? "Leave"
            : "Remove"
        }
        variant="danger"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog?.type === "transfer"}
        title="Transfer ownership?"
        description={`${
          dialog?.type === "transfer" ? (dialog.member.profile?.name ?? "This member") : ""
        } will become the new owner. You will become an admin. This cannot be undone.`}
        confirmLabel="Transfer ownership"
        variant="danger"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      {/* Loading overlay for dialog */}
      {loading && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none">
          <div className="bg-zs-bg-secondary/80 rounded-2xl p-4 border border-zs-border flex items-center gap-3">
            <Spinner />
            <span className="text-sm text-zs-text-secondary">Processing...</span>
          </div>
        </div>
      )}

      {/* Error displayed inside dialog result */}
      {actionError && dialog && (
        <div className="flex items-center gap-2 mt-2 text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {actionError}
        </div>
      )}
    </div>
  );
}
