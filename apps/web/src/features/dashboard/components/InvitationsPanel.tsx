"use client";

/**
 * InvitationsPanel — Create invitations + list pending/past invitations.
 *
 * Wires to:
 *   POST /api/invitations     — create
 *   GET  /api/invitations     — list
 *   POST /api/invitations/[id]/revoke
 *   POST /api/invitations/[id]/resend
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Plus, Send, X, Clock } from "lucide-react";
import {
  apiCreateInvitation,
  apiRevokeInvitation,
  apiResendInvitation,
  ApiFetchError,
} from "@/lib/api";
import type { InvitationSummary, Role } from "@/lib/api";
import {
  RoleBadge,
  StatusBadge,
  ConfirmDialog,
  ErrorBanner,
  EmptyState,
  Spinner,
  cn,
} from "./ui-primitives";

interface InvitationsPanelProps {
  invitations: InvitationSummary[];
  canInvite: boolean;
  onRefresh: () => void;
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "member", label: "Miembro" },
  { value: "admin", label: "Admin" },
  { value: "viewer", label: "Visualizador" },
  { value: "billing", label: "Facturacion" },
];

function formatExpiry(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "Expirada";
  if (days === 0) return "Expira hoy";
  return `Expira en ${days}d`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function InvitationsPanel({
  invitations,
  canInvite,
  onRefresh,
}: InvitationsPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  const [revokeTarget, setRevokeTarget] = useState<InvitationSummary | null>(null);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleInvite = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);
      setSuccessUrl(null);
      setFormLoading(true);
      try {
        const result = await apiCreateInvitation(email, role);
        setSuccessUrl(result.inviteUrl);
        setEmail("");
        onRefresh();
      } catch (err) {
        setFormError(
          err instanceof ApiFetchError ? err.message : "Failed to create invitation."
        );
      } finally {
        setFormLoading(false);
      }
    },
    [email, role, onRefresh]
  );

  const handleRevoke = useCallback(async () => {
    if (!revokeTarget) return;
    setRevokeLoading(true);
    setActionError(null);
    try {
      await apiRevokeInvitation(revokeTarget.id);
      setRevokeTarget(null);
      onRefresh();
    } catch (err) {
      setActionError(
        err instanceof ApiFetchError ? err.message : "Failed to revoke invitation."
      );
    } finally {
      setRevokeLoading(false);
    }
  }, [revokeTarget, onRefresh]);

  const handleResend = useCallback(
    async (id: string) => {
      setResendLoading(id);
      setActionError(null);
      try {
        await apiResendInvitation(id);
        onRefresh();
      } catch (err) {
        setActionError(
          err instanceof ApiFetchError ? err.message : "Failed to resend invitation."
        );
      } finally {
        setResendLoading(null);
      }
    },
    [onRefresh]
  );

  return (
    <div className="space-y-6">
      {actionError && (
        <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />
      )}

      {/* Invite Form */}
      {canInvite && (
          <div className="zs-card p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <Mail className="w-4 h-4 text-zs-blue" />
              Invitar miembro
            </h3>
            <button
              onClick={() => {
                setShowForm((p) => !p);
                setFormError(null);
                setSuccessUrl(null);
              }}
              className="p-1.5 rounded-lg text-zs-text-muted hover:text-white hover:bg-white/5 transition-colors"
              aria-label={showForm ? "Colapsar formulario de invitacion" : "Expandir formulario de invitacion"}
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleInvite}
                className="overflow-hidden"
              >
                <div className="space-y-3">
                  {formError && <ErrorBanner message={formError} onDismiss={() => setFormError(null)} />}

                  {successUrl && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 rounded-xl bg-zs-emerald/10 border border-emerald-500/20 space-y-1"
                    >
                      <p className="text-xs font-semibold text-emerald-400">Invitacion creada</p>
                      <p className="text-[10px] text-zs-text-muted">Comparte este enlace:</p>
                      <code className="block text-[10px] text-zs-blue break-all bg-black/20 p-2 rounded-lg">
                        {successUrl}
                      </code>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <input
                      id="invite-email"
                      type="email"
                      required
                      placeholder="colega@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="zs-input flex-1 text-sm py-2.5"
                      disabled={formLoading}
                      aria-label="Correo para invitar"
                    />

                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="zs-input w-36 text-sm py-2.5 cursor-pointer"
                      disabled={formLoading}
                      aria-label="Rol de invitacion"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading || !email.trim()}
                    className="w-full zs-btn flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formLoading ? (
                      <Spinner className="w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Enviar invitacion
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Invitations list */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-zs-text-muted mb-3">
          Invitaciones ({invitations.length})
        </h3>

        {invitations.length === 0 ? (
          <EmptyState
            icon={<Mail className="w-6 h-6" />}
            title="Sin invitaciones"
            description={canInvite ? "Crea una invitacion para comenzar." : undefined}
          />
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="zs-panel-soft flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-zs-bg-surface-hover"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-zs-border flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-zs-text-muted" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {inv.email}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-zs-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {inv.status === "pending" ? formatExpiry(inv.expiresAt) : formatDate(inv.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <RoleBadge role={inv.role} />
                  <StatusBadge status={inv.status} />
                </div>

                {/* Actions */}
                {inv.status === "pending" && canInvite && (
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => handleResend(inv.id)}
                      disabled={resendLoading === inv.id}
                      className={cn(
                        "rounded-lg border border-zs-border px-2.5 py-1.5 text-xs font-medium text-zs-text-secondary transition-all hover:border-zs-border-hover hover:text-white disabled:opacity-50",
                      )}
                      aria-label={`Reenviar invitacion a ${inv.email}`}
                    >
                      {resendLoading === inv.id ? (
                        <Spinner className="w-3 h-3" />
                      ) : (
                        "Reenviar"
                      )}
                    </button>
                    <button
                      onClick={() => setRevokeTarget(inv)}
                      className="rounded-lg border border-rose-500/20 px-2.5 py-1.5 text-xs font-medium text-rose-400 transition-all hover:bg-zs-rose/10"
                      aria-label={`Revocar invitacion de ${inv.email}`}
                    >
                      Revocar
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Revoke confirmation */}
      <ConfirmDialog
        open={!!revokeTarget}
        title="Revocar invitacion?"
        description={`La invitacion para ${revokeTarget?.email ?? ""} sera invalidada permanentemente.`}
        confirmLabel="Revocar"
        variant="danger"
        loading={revokeLoading}
        onConfirm={handleRevoke}
        onCancel={() => setRevokeTarget(null)}
      />
    </div>
  );
}
