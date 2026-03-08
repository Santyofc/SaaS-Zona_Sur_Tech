"use client";

/**
 * /dashboard/team — Member management, invitations, and activity feed.
 *
 * This is the primary team management hub.
 *
 * Data flow:
 * - Members fetched from GET /api/members
 * - Invitations from GET /api/invitations
 * - Activity from GET /api/activity
 * - Current user context from GET /api/auth/me
 *
 * All fetches run in parallel on mount.
 * Mutations trigger a targeted refresh (not full-page reload).
 *
 * Permission gates:
 * - members:read  → can see members + activity
 * - members:invite → can see + manage invitations
 * - members:update → can change roles and status
 * - members:remove → can remove members
 * - org:update (owner) → can transfer ownership
 *
 * Backend is still the final authority — these just pre-filter the UI.
 */

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Mail, Activity, RefreshCw } from "lucide-react";
import {
  apiListMembers,
  apiListInvitations,
  apiListActivity,
  apiGetMe,
  ApiFetchError,
} from "@/lib/api";
import type { OrganizationMember, InvitationSummary, ActivityLogEntry, Role } from "@/lib/api";
import { MembersTable } from "@/components/MembersTable";
import { InvitationsPanel } from "@/components/InvitationsPanel";
import { ActivityFeed } from "@/components/ActivityFeed";
import {
  PageHeader,
  ErrorBanner,
  Spinner,
  cn,
} from "@/components/ui-primitives";

type Tab = "members" | "invitations" | "activity";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "members", label: "Members", icon: <Users className="w-4 h-4" /> },
  { id: "invitations", label: "Invitations", icon: <Mail className="w-4 h-4" /> },
  { id: "activity", label: "Activity", icon: <Activity className="w-4 h-4" /> },
];

export default function TeamPage() {
  const [tab, setTab] = useState<Tab>("members");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<InvitationSummary[]>([]);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<Role>("member");

  const loadAll = useCallback(async () => {
    setError(null);
    try {
      const [membersData, invitationsData, logsData, me] = await Promise.allSettled([
        apiListMembers(),
        apiListInvitations(),
        apiListActivity(50),
        apiGetMe(),
      ]);

      if (membersData.status === "fulfilled") setMembers(membersData.value);
      if (invitationsData.status === "fulfilled") setInvitations(invitationsData.value);
      if (logsData.status === "fulfilled") setLogs(logsData.value);

      if (me.status === "fulfilled") {
        // Derive current user's membership in the active org
        const myMembership = me.value.memberships?.find(
          (m) => m.organizationId === me.value.organization?.id
        );
        if (myMembership) {
          setCurrentUserRole(myMembership.role);
        }
        // Use the auth/me user id from members list
        // (me endpoint returns user object)
      }

      // Try to get current userId from members list as self-reference
      if (membersData.status === "fulfilled" && me.status === "fulfilled") {
        const meEmail = me.value.user?.email;
        const selfMember = membersData.value.find(
          (m) => m.profile?.email === meEmail
        );
        if (selfMember) {
          setCurrentUserId(selfMember.userId);
          setCurrentUserRole(selfMember.role);
        }
      }
    } catch (err) {
      const msg =
        err instanceof ApiFetchError ? err.message : "Failed to load team data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const canInvite = ["owner", "admin"].includes(currentUserRole);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-zs-fade-up">
      <PageHeader
        title="Team"
        description="Manage members, invitations, and review organization activity."
        action={
          <button
            onClick={loadAll}
            disabled={loading}
            className="zs-btn-ghost flex items-center gap-2 px-3 py-2 text-sm rounded-xl"
            aria-label="Refresh team data"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </button>
        }
      />

      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zs-bg-surface/60 backdrop-blur-sm border border-zs-border rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === t.id
                ? "text-white"
                : "text-zs-text-secondary hover:text-white"
            )}
            aria-selected={tab === t.id}
            role="tab"
          >
            {tab === t.id && (
              <motion.div
                layoutId="team-tab-bg"
                className="absolute inset-0 bg-zs-blue/15 border border-zs-blue/25 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {t.icon}
              {t.label}
              {/* Count pill */}
              {t.id === "members" && members.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-zs-text-muted">
                  {members.length}
                </span>
              )}
              {t.id === "invitations" && invitations.filter(i => i.status === "pending").length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-zs-amber/20 text-[10px] font-bold text-amber-400">
                  {invitations.filter((i) => i.status === "pending").length}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="zs-card p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Spinner />
            <span className="text-sm text-zs-text-secondary">Loading team data...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "members" && (
                <MembersTable
                  members={members}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                  onRefresh={loadAll}
                />
              )}
              {tab === "invitations" && (
                <InvitationsPanel
                  invitations={invitations}
                  canInvite={canInvite}
                  onRefresh={loadAll}
                />
              )}
              {tab === "activity" && <ActivityFeed logs={logs} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
