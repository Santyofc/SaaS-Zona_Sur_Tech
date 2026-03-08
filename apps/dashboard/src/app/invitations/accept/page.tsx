"use client";

/**
 * /invitations/accept — Invitation acceptance flow.
 *
 * Flow:
 * 1. Read `token` from URL search params.
 * 2. If no token → show error state.
 * 3. Check if user is authenticated via /api/auth/me.
 *    - If NOT authenticated → redirect to /login?next=/invitations/accept?token=...
 * 4. Submit token to POST /api/invitations/accept.
 * 5. Handle all response cases with clear, user-safe messages.
 * 6. On success → redirect to /dashboard (org cookie already set by backend).
 *
 * This is outside the /dashboard shell (no Sidebar/Header).
 * Matches the login/onboarding page pattern.
 */

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MailX,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { apiAcceptInvitation, apiGetMe, ApiFetchError } from "@/lib/api";

type Phase =
  | "loading"       // Checking auth + submitting
  | "success"       // Accepted and redirecting
  | "no-token"      // URL has no token
  | "expired"       // Invitation expired
  | "invalid"       // Already used or revoked
  | "email-mismatch" // Wrong account
  | "error";        // Generic error

interface MessageConfig {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: { label: string; href: string };
}

const MESSAGES: Record<Phase, MessageConfig> = {
  loading: {
    icon: <Loader2 className="w-8 h-8 animate-spin text-zs-blue" />,
    title: "Verifying invitation...",
    body: "Please wait while we process your invitation.",
  },
  success: {
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
    title: "You're in!",
    body: "You've joined the organization. Redirecting to your dashboard...",
  },
  "no-token": {
    icon: <MailX className="w-8 h-8 text-rose-400" />,
    title: "Invalid invitation link",
    body: "This invitation link is missing a token. Please use the original link from your email.",
    action: { label: "Go to dashboard", href: "/dashboard" },
  },
  expired: {
    icon: <Clock className="w-8 h-8 text-amber-400" />,
    title: "Invitation expired",
    body: "This invitation link has expired. Please ask the organization owner to resend the invitation.",
    action: { label: "Go to login", href: "/login" },
  },
  invalid: {
    icon: <XCircle className="w-8 h-8 text-rose-400" />,
    title: "Invitation unavailable",
    body: "This invitation has already been used or was revoked. If you believe this is an error, contact the organization owner.",
    action: { label: "Go to dashboard", href: "/dashboard" },
  },
  "email-mismatch": {
    icon: <MailX className="w-8 h-8 text-rose-400" />,
    title: "Wrong account",
    body: "This invitation was sent to a different email address. Please log in with the correct account and try again.",
    action: { label: "Switch account", href: "/login" },
  },
  error: {
    icon: <XCircle className="w-8 h-8 text-rose-400" />,
    title: "Something went wrong",
    body: "We couldn't process your invitation. Please try again or contact support.",
    action: { label: "Go to login", href: "/login" },
  },
};

function mapErrorToPhase(err: ApiFetchError): Phase {
  const code = err.code ?? "";
  const msg = err.message ?? "";

  if (code === "INVITATION_EXPIRED" || msg.includes("expired")) return "expired";
  if (msg.includes("already been used") || msg.includes("revoked")) return "invalid";
  if (msg.includes("different email")) return "email-mismatch";
  if (err.status === 404) return "invalid";
  return "error";
}

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setPhase("no-token");
      return;
    }

    async function run() {
      try {
        // 1. Check authentication
        const me = await apiGetMe().catch(() => null);

        if (!me) {
          // Not authenticated — preserve token through auth redirect
          const returnUrl = encodeURIComponent(
            `/invitations/accept?token=${token}`
          );
          router.push(`/login?next=${returnUrl}`);
          return;
        }

        // 2. Accept the invitation
        const result = await apiAcceptInvitation(token!);
        setOrgName(result.organizationName ?? null);
        setPhase("success");

        // 3. Redirect to dashboard after brief success display
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      } catch (err) {
        if (err instanceof ApiFetchError) {
          setPhase(mapErrorToPhase(err));
        } else {
          setPhase("error");
        }
      }
    }

    run();
  }, [searchParams, router]);

  const config = MESSAGES[phase];

  return (
    <div className="min-h-screen bg-zs-bg-primary flex flex-col items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zs-blue/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-zs-violet/8 rounded-full blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -16 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="w-full max-w-md"
        >
          <div className="zs-card p-8 text-center space-y-4">
            {/* Top accent */}
            <div
              className={`h-0.5 w-full absolute top-0 left-0 rounded-t-2xl ${
                phase === "success"
                  ? "bg-gradient-to-r from-transparent via-zs-emerald to-transparent"
                  : phase === "loading"
                  ? "bg-gradient-to-r from-transparent via-zs-blue to-transparent"
                  : "bg-gradient-to-r from-transparent via-zs-rose to-transparent"
              }`}
            />

            {/* Brand mark */}
            <div className="flex items-center justify-center mb-6">
              <span className="text-sm font-black tracking-widest uppercase text-white">
                ZonaSur <span className="text-zs-blue">Tech</span>
              </span>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-2">{config.icon}</div>

            {/* Title */}
            <h1 className="text-xl font-black text-white tracking-tight">
              {config.title}
            </h1>

            {/* Body */}
            <p className="text-zs-text-secondary text-sm leading-relaxed">
              {config.body}
              {phase === "success" && orgName && (
                <>
                  {" "}
                  <span className="text-zs-blue font-semibold">{orgName}</span>
                </>
              )}
            </p>

            {/* Progress bar for loading / success */}
            {(phase === "loading" || phase === "success") && (
              <div className="w-full h-0.5 bg-zs-border rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: phase === "success" ? "100%" : "60%" }}
                  transition={{ duration: phase === "success" ? 2 : 0.8, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-zs-blue to-zs-violet"
                />
              </div>
            )}

            {/* CTA */}
            {config.action && phase !== "loading" && phase !== "success" && (
              <a
                href={config.action.href}
                className="mt-4 inline-flex items-center gap-2 zs-btn text-sm px-5 py-2.5"
              >
                {config.action.label}
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
