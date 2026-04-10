"use client";

/**
 * ActivityFeed — Renders org activity log entries with action labels,
 * actor info, timestamps, and metadata highlights.
 *
 * Wires to: GET /api/activity
 */

import React from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  UserMinus,
  Mail,
  MailX,
  MailCheck,
  RefreshCw,
  Shield,
  Building2,
  Crown,
  AlertCircle,
  Activity,
} from "lucide-react";
import type { ActivityLogEntry } from "@/lib/api";
import { EmptyState } from "./ui-primitives";

interface ActivityFeedProps {
  logs: ActivityLogEntry[];
}

interface ActionConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
}

const ACTION_CONFIG: Record<string, ActionConfig> = {
  "invitation.created": {
    label: "Invitation sent",
    icon: <Mail className="w-3.5 h-3.5" />,
    color: "text-zs-blue bg-zs-blue/10 border-blue-500/20",
  },
  "invitation.revoked": {
    label: "Invitation revoked",
    icon: <MailX className="w-3.5 h-3.5" />,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  "invitation.accepted": {
    label: "Invitation accepted",
    icon: <MailCheck className="w-3.5 h-3.5" />,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  "invitation.resent": {
    label: "Invitation resent",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    color: "text-zs-amber bg-amber-500/10 border-amber-500/20",
  },
  "member.role_updated": {
    label: "Role updated",
    icon: <Shield className="w-3.5 h-3.5" />,
    color: "text-zs-violet bg-violet-500/10 border-violet-500/20",
  },
  "member.suspended": {
    label: "Member suspended",
    icon: <UserMinus className="w-3.5 h-3.5" />,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  "member.reactivated": {
    label: "Member reactivated",
    icon: <UserPlus className="w-3.5 h-3.5" />,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  "member.removed": {
    label: "Member removed",
    icon: <UserMinus className="w-3.5 h-3.5" />,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  "ownership.transferred": {
    label: "Ownership transferred",
    icon: <Crown className="w-3.5 h-3.5" />,
    color: "text-zs-violet bg-violet-500/10 border-violet-500/20",
  },
  "organization.switched": {
    label: "Switched workspace",
    icon: <Building2 className="w-3.5 h-3.5" />,
    color: "text-zs-blue bg-zs-blue/10 border-blue-500/20",
  },
  "organization.created": {
    label: "Organization created",
    icon: <Building2 className="w-3.5 h-3.5" />,
    color: "text-zs-emerald bg-emerald-500/10 border-emerald-500/20",
  },
};

const DEFAULT_ACTION: ActionConfig = {
  label: "Activity",
  icon: <AlertCircle className="w-3.5 h-3.5" />,
  color: "text-zs-text-secondary bg-white/5 border-white/10",
};

/**
 * Extracts a human-readable detail line from log metadata.
 * Never exposes raw DB values — picks known safe keys only.
 */
function getMetadataDetail(action: string, metadata: Record<string, unknown>): string | null {
  if (action === "invitation.created" || action === "invitation.revoked" || action === "invitation.resent") {
    const email = metadata.email;
    const role = metadata.role;
    if (email) return role ? `${email} as ${role}` : String(email);
  }
  if (action === "member.role_updated") {
    const prev = metadata.previous_role;
    const next = metadata.new_role;
    if (prev && next) return `${prev} → ${next}`;
  }
  if (action === "ownership.transferred") {
    return "Ownership has been transferred";
  }
  return null;
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  if (logs.length === 0) {
    return (
      <EmptyState
        icon={<Activity className="w-6 h-6" />}
        title="No activity yet"
        description="Activity will appear here as your team makes changes."
      />
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[1.4rem] top-3 bottom-3 w-px bg-gradient-to-b from-zs-blue/20 via-zs-border to-transparent" aria-hidden="true" />

      <div className="space-y-3">
        {logs.map((log, i) => {
          const config = ACTION_CONFIG[log.action] ?? DEFAULT_ACTION;
          const detail = getMetadataDetail(log.action, log.metadata);

          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="flex items-start gap-4 pl-1"
            >
              {/* Icon bubble */}
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 z-10 ${config.color}`}
                aria-hidden="true"
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-3 border-b border-white/5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-snug">
                      {config.label}
                    </p>
                    {detail && (
                      <p className="text-xs text-zs-text-secondary mt-0.5 truncate">
                        {detail}
                      </p>
                    )}
                  </div>
                  <time
                    dateTime={log.createdAt}
                    className="text-[10px] text-zs-text-muted whitespace-nowrap shrink-0 mt-0.5"
                  >
                    {formatRelativeTime(log.createdAt)}
                  </time>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
