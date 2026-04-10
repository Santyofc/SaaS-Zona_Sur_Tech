"use client";

/**
 * ui-primitives.tsx — Minimal shared UI building blocks.
 *
 * Only primitives not already in @repo/ui or DashboardContent:
 * - Badge (role + status colors)
 * - Spinner
 * - ConfirmDialog (accessible modal)
 * - EmptyState
 * - ErrorBanner
 * - PageHeader
 * - ActionMenu (dropdown for row actions)
 */

import React, { useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Loader2, ChevronDown } from "lucide-react";
import type { Role, MemberStatus, InvitationStatus } from "@/lib/api";

// ---------------------------------------------------------------------------
// cn utility
// ---------------------------------------------------------------------------
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("animate-spin text-zs-blue", className ?? "w-5 h-5")}
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// RoleBadge
// ---------------------------------------------------------------------------
const ROLE_STYLES: Record<Role, string> = {
  owner: "bg-zs-violet/15 text-violet-300 border-violet-500/25",
  admin: "bg-zs-blue/15 text-blue-300 border-blue-500/25",
  member: "bg-zs-emerald/15 text-emerald-300 border-emerald-500/25",
  viewer: "bg-white/5 text-zs-text-secondary border-white/10",
  billing: "bg-zs-amber/15 text-amber-300 border-amber-500/25",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
        ROLE_STYLES[role]
      )}
    >
      {role}
    </span>
  );
}

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------
const STATUS_STYLES: Record<MemberStatus | InvitationStatus, string> = {
  active: "bg-zs-emerald/15 text-emerald-300 border-emerald-500/25",
  invited: "bg-zs-blue/15 text-blue-300 border-blue-500/25",
  suspended: "bg-zs-rose/15 text-rose-300 border-rose-500/25",
  pending: "bg-zs-amber/15 text-amber-300 border-amber-500/25",
  accepted: "bg-zs-emerald/15 text-emerald-300 border-emerald-500/25",
  revoked: "bg-zs-rose/15 text-rose-300 border-rose-500/25",
  expired: "bg-white/5 text-zs-text-muted border-white/10",
};

export function StatusBadge({
  status,
}: {
  status: MemberStatus | InvitationStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// ErrorBanner
// ---------------------------------------------------------------------------
export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 p-3 rounded-xl bg-zs-rose/10 border border-zs-rose/20 text-rose-300 text-sm"
      role="alert"
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-zs-rose" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-rose-400 hover:text-rose-200 transition-colors"
          aria-label="Cerrar error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-14 text-center"
    >
      {icon && (
        <div className="zs-panel-soft flex h-12 w-12 items-center justify-center rounded-2xl text-zs-text-muted">
          {icon}
        </div>
      )}
      <div>
        <p className="text-base font-bold text-white">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-zs-text-secondary">{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// PageHeader
// ---------------------------------------------------------------------------
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="zs-heading-lg">{title}</h1>
        {description && (
          <p className="zs-copy mt-2 max-w-2xl text-sm md:text-base">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ConfirmDialog — accessible modal with escape key + focus trap
// ---------------------------------------------------------------------------
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialogId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  // Focus cancel button on open
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    cancelRef.current?.focus();
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [open]);

  // Basic focus trap while dialog is open
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const container = dialogRef.current;
      if (!container) return;

      const focusable = container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(6, 8, 15, 0.85)", backdropFilter: "blur(8px)" }}
          aria-modal="true"
          role="dialog"
          aria-labelledby={`${dialogId}-title`}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            ref={dialogRef}
            className="relative w-full max-w-md rounded-2xl border border-zs-border bg-zs-bg-secondary p-6 shadow-zs-glass"
          >
            {/* Top accent line */}
            <div
              className={cn(
                "absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl",
                variant === "danger"
                  ? "bg-gradient-to-r from-transparent via-zs-rose to-transparent"
                  : "bg-gradient-to-r from-transparent via-zs-blue to-transparent"
              )}
            />

            <h2
              id={`${dialogId}-title`}
              className="text-lg font-bold text-white mb-2"
            >
              {title}
            </h2>
            {description && (
              <p className="text-zs-text-secondary text-sm mb-6">
                {description}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                ref={cancelRef}
                onClick={onCancel}
                disabled={loading}
                className="zs-btn-ghost px-4 py-2 text-sm rounded-xl disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60",
                  variant === "danger"
                    ? "bg-zs-rose hover:bg-rose-500 shadow-zs-glow-rose"
                    : "bg-zs-blue hover:bg-zs-blue-lt shadow-zs-glow-blue"
                )}
              >
                {loading && <Spinner className="w-4 h-4" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// ActionMenu — kebab-style dropdown for table row actions
// ---------------------------------------------------------------------------
export interface ActionItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

export function ActionMenu({ items }: { items: ActionItem[] }) {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", keyHandler);
    firstItemRef.current?.focus();
    return () => window.removeEventListener("keydown", keyHandler);
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-2 rounded-lg text-zs-text-secondary hover:text-white hover:bg-white/5 transition-all"
        aria-label="Mas acciones"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-10 z-50 w-48 py-1 bg-zs-bg-secondary border border-zs-border rounded-xl shadow-zs-glass"
            role="menu"
          >
            {items.map((item, i) => (
              <button
                key={i}
                ref={i === 0 ? firstItemRef : undefined}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  item.variant === "danger"
                    ? "text-rose-400 hover:bg-zs-rose/10"
                    : "text-zs-text-primary hover:bg-white/5"
                )}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
