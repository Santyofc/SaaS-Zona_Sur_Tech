"use client";

/**
 * WorkspaceSwitcher — Shows current org + enables switching to others.
 *
 * Fetches current user context from /api/auth/me which includes
 * all memberships. Calls /api/organizations/switch to change context.
 *
 * Only shows organizations where membership status is 'active'.
 * Redirects to /dashboard on successful switch.
 */

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronDown, Check, Loader2 } from "lucide-react";
import { apiGetMe, apiSwitchOrganization, ApiFetchError } from "@/lib/api";
import type { MembershipBasic } from "@/lib/api";
import { cn } from "./ui-primitives";

export function WorkspaceSwitcher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [memberships, setMemberships] = useState<MembershipBasic[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [currentOrgName, setCurrentOrgName] = useState<string | null>(null);
  const [switching, setSwitching] = useState<string | null>(null); // ID being switched to
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiGetMe()
      .then((data) => {
        setCurrentOrgId(data.organization?.id ?? null);
        setCurrentOrgName(data.organization?.name ?? null);
        setMemberships(
          (data.memberships ?? []).filter((m) => m.status === "active")
        );
      })
      .catch(() => {
        /* Fail silently — user still sees the rest of the sidebar */
      })
      .finally(() => setLoading(false));
  }, []);

  // Close on outside click
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

  async function handleSwitch(orgId: string) {
    if (orgId === currentOrgId || switching) return;
    setSwitching(orgId);
    setError(null);
    try {
      const result = await apiSwitchOrganization(orgId);
      setCurrentOrgId(result.organizationId);
      setCurrentOrgName(result.organizationName);
      setOpen(false);
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      const msg =
        err instanceof ApiFetchError
          ? err.message
          : "Failed to switch organization.";
      setError(msg);
    } finally {
      setSwitching(null);
    }
  }

  const initials = currentOrgName
    ? currentOrgName.slice(0, 2).toUpperCase()
    : "~";

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={loading || memberships.length <= 1}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-zs-border bg-zs-bg-surface hover:bg-zs-bg-surface-hover transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch workspace"
      >
        {/* Org avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zs-blue to-zs-violet flex items-center justify-center text-xs font-black text-white shadow-zs-glow-blue shrink-0">
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            initials
          )}
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-bold text-white truncate">
            {loading ? "Loading..." : (currentOrgName ?? "No workspace")}
          </p>
          <p className="text-[10px] text-zs-text-muted uppercase tracking-widest">
            Workspace
          </p>
        </div>

        {memberships.length > 1 && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-zs-text-muted group-hover:text-white transition-all shrink-0",
              open && "rotate-180"
            )}
          />
        )}
      </button>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 text-xs text-rose-400 px-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.95, y: -4 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.95, y: -4 }}
            style={{ transformOrigin: "top" }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-14 z-50 bg-zs-bg-secondary border border-zs-border rounded-xl shadow-zs-glass overflow-hidden"
            role="listbox"
            aria-label="Available workspaces"
          >
            <div className="p-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted px-3 py-1.5">
                Your Workspaces
              </p>
              {memberships.length === 0 ? (
                <div className="px-3 py-4 text-center">
                  <Building2 className="w-6 h-6 text-zs-text-muted mx-auto mb-1" />
                  <p className="text-xs text-zs-text-muted">No active workspaces</p>
                </div>
              ) : (
                memberships.map((m) => {
                  const isActive = m.organizationId === currentOrgId;
                  const isSwitching = switching === m.organizationId;

                  return (
                    <button
                      key={m.organizationId}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSwitch(m.organizationId)}
                      disabled={isActive || isSwitching}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                        isActive
                          ? "bg-zs-blue/10 border border-zs-blue/20"
                          : "hover:bg-white/5 disabled:opacity-50"
                      )}
                    >
                      {/* Mini avatar */}
                      <div
                        className={cn(
                          "w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-black shrink-0",
                          isActive
                            ? "bg-zs-blue text-white"
                            : "bg-white/10 text-zs-text-secondary"
                        )}
                      >
                        {m.organizationName.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-xs font-semibold truncate",
                            isActive ? "text-white" : "text-zs-text-secondary"
                          )}
                        >
                          {m.organizationName}
                        </p>
                        <p className="text-[10px] text-zs-text-muted uppercase tracking-widest">
                          {m.role}
                        </p>
                      </div>

                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-zs-blue shrink-0" />
                      )}
                      {isSwitching && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-zs-blue shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
