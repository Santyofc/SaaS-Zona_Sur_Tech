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
    label: "Invitacion enviada",
    icon: <Mail className="w-3.5 h-3.5" />,
    color: "text-zs-blue bg-zs-blue/10 border-blue-500/20",
  },
  "invitation.revoked": {
    label: "Invitacion revocada",
    icon: <MailX className="w-3.5 h-3.5" />,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  "invitation.accepted": {
    label: "Invitacion aceptada",
    icon: <MailCheck className="w-3.5 h-3.5" />,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  "invitation.resent": {
    label: "Invitacion reenviada",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    color: "text-zs-amber bg-amber-500/10 border-amber-500/20",
  },
  "member.role_updated": {
    label: "Rol actualizado",
    icon: <Shield className="w-3.5 h-3.5" />,
    color: "text-zs-violet bg-violet-500/10 border-violet-500/20",
  },
  "member.suspended": {
    label: "Miembro suspendido",
    icon: <UserMinus className="w-3.5 h-3.5" />,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  "member.reactivated": {
    label: "Miembro reactivado",
    icon: <UserPlus className="w-3.5 h-3.5" />,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  "member.removed": {
    label: "Miembro removido",
    icon: <UserMinus className="w-3.5 h-3.5" />,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  "ownership.transferred": {
    label: "Propiedad transferida",
    icon: <Crown className="w-3.5 h-3.5" />,
    color: "text-zs-violet bg-violet-500/10 border-violet-500/20",
  },
  "organization.switched": {
    label: "Workspace cambiado",
    icon: <Building2 className="w-3.5 h-3.5" />,
    color: "text-zs-blue bg-zs-blue/10 border-blue-500/20",
  },
  "organization.created": {
    label: "Organizacion creada",
    icon: <Building2 className="w-3.5 h-3.5" />,
    color: "text-zs-emerald bg-emerald-500/10 border-emerald-500/20",
  },
};

const DEFAULT_ACTION: ActionConfig = {
  label: "Actividad",
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
    if (email) return role ? `${email} como ${role}` : String(email);
  }
  if (action === "member.role_updated") {
    const prev = metadata.previous_role;
    const next = metadata.new_role;
    if (prev && next) return `${prev} → ${next}`;
  }
  if (action === "ownership.transferred") {
    return "La propiedad fue transferida";
  }
  return null;
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  if (logs.length === 0) {
    return (
      <EmptyState
        icon={<Activity className="w-6 h-6" />}
        title="Sin actividad"
        description="La actividad aparecera aqui cuando el equipo haga cambios."
      />
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div
        className="absolute bottom-3 left-[1.4rem] top-3 hidden w-px bg-gradient-to-b from-zs-blue/20 via-zs-border to-transparent sm:block"
        aria-hidden="true"
      />

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
              className="zs-panel-soft flex items-start gap-3 rounded-xl p-3 sm:gap-4 sm:p-4 sm:pl-5"
            >
              {/* Icon bubble */}
              <div
                className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${config.color}`}
                aria-hidden="true"
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug text-white">
                      {config.label}
                    </p>
                    {detail && (
                      <p className="mt-0.5 truncate text-xs text-zs-text-secondary">
                        {detail}
                      </p>
                    )}
                  </div>
                  <time
                    dateTime={log.createdAt}
                    className="mt-0.5 shrink-0 whitespace-nowrap text-[10px] text-zs-text-muted"
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
