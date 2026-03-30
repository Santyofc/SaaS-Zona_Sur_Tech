"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { signIn } from "../actions";
import SocialSignIn from "@/components/Auth/SocialSignIn";

export function SignInForm({ 
  defaultError, 
  message 
}: { 
  defaultError?: string;
  message?: string;
}) {
  return (
    <>
      {defaultError && (
        <div className="mb-6 p-4 rounded-xl bg-zs-rose/10 border border-zs-rose/20 text-zs-rose text-xs font-bold animate-zs-fade-in flex items-center gap-3">
          <ShieldAlert size={16} className="shrink-0" />
          {defaultError}
        </div>
      )}
      {message && (
        <div className="mb-6 p-4 rounded-xl bg-zs-emerald/10 border border-zs-emerald/20 text-zs-emerald text-xs font-bold animate-zs-fade-in">
          {message}
        </div>
      )}

      <SocialSignIn />

      <div className="flex items-center gap-4 my-6">
        <div className="h-px bg-zs-border flex-1" />
        <span className="text-[10px] font-black tracking-widest text-zs-text-muted uppercase">o usar protocolo email</span>
        <div className="h-px bg-zs-border flex-1" />
      </div>

      <form action={signIn} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-2 ml-1">
            Protocolo Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zs-text-muted group-focus-within:text-zs-blue transition-colors" size={18} />
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="agente@zonasurtech.online"
              className="zs-input pl-12"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-2 ml-1">
            Llave de Acceso
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zs-text-muted group-focus-within:text-zs-blue transition-colors" size={18} />
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="zs-input pl-12"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            href="/forgot-password"
            className="text-[11px] font-bold text-zs-text-secondary hover:text-zs-blue transition-colors"
          >
            ¿Olvidaste tu llave?
          </Link>
        </div>

        <button type="submit" className="zs-btn w-full py-4 text-sm group">
          Sincronizar Kernel
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </>
  );
}
