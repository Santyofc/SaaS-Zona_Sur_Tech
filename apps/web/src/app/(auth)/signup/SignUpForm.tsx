"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Mail, Lock, ArrowRight, ShieldAlert, Building, User, Briefcase } from "lucide-react";
import Link from "next/link";
import { signUp } from "../actions";
import { useDebounce } from "@repo/ui/src/hooks/use-debounce";
import SocialSignIn from "@/components/Auth/SocialSignIn";

export function SignUpForm({ defaultError }: { defaultError?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const debouncedEmail = useDebounce(email, 600);

  useEffect(() => {
    async function checkEmail() {
      if (!debouncedEmail || !debouncedEmail.includes("@")) {
        setEmailError("");
        return;
      }
      setCheckingEmail(true);
      try {
        const res = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: debouncedEmail }),
        });
        if (res.ok) {
          const { exists } = await res.json();
          if (exists) {
            setEmailError("Este email ya está registrado en el protocolo.");
          } else {
            setEmailError("");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingEmail(false);
      }
    }
    checkEmail();
  }, [debouncedEmail]);

  const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;
  const passwordLengthOk = password.length >= 8 || password.length === 0;
  
  const canSubmit = 
    email.length > 0 && 
    !emailError &&
    password.length >= 8 &&
    confirmPassword.length > 0 &&
    passwordsMatch;

  return (
    <>
      {defaultError && (
        <div className="mb-6 p-4 rounded-xl bg-zs-rose/10 border border-zs-rose/20 text-zs-rose text-xs font-bold animate-zs-fade-in flex items-center gap-3">
          <ShieldAlert size={16} />
          {defaultError}
        </div>
      )}

      <SocialSignIn />

      <div className="flex items-center gap-4 my-6">
        <div className="h-px bg-zs-border flex-1" />
        <span className="text-[10px] font-black tracking-widest text-zs-text-muted uppercase">o usar protocolo manual</span>
        <div className="h-px bg-zs-border flex-1" />
      </div>

      <form action={signUp} className="space-y-5">
        
        {/* Nombre & Cargo en una fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-2 ml-1">
              Identidad (Nombre)
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zs-text-muted group-focus-within:text-zs-violet transition-colors" size={18} />
              <input
                name="nombre"
                type="text"
                required
                autoComplete="name"
                placeholder="Agente X"
                className="zs-input pl-12 focus:border-zs-violet focus:ring-zs-violet/10"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-2 ml-1">
              Rol / Cargo
            </label>
            <div className="relative group">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zs-text-muted group-focus-within:text-zs-violet transition-colors" size={18} />
              <input
                name="cargo"
                type="text"
                required
                autoComplete="organization-title"
                placeholder="Ingeniero de Sistemas"
                className="zs-input pl-12 focus:border-zs-violet focus:ring-zs-violet/10"
              />
            </div>
          </div>
        </div>

        {/* Empresa */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-2 ml-1">
            Designación Corporativa (Empresa)
          </label>
          <div className="relative group">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-zs-text-muted group-focus-within:text-zs-violet transition-colors" size={18} />
            <input
              name="empresa"
              type="text"
              required
              autoComplete="organization"
              placeholder="Zona Sur Corp"
              className="zs-input pl-12 focus:border-zs-violet focus:ring-zs-violet/10"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-2 ml-1 flex items-center justify-between">
            <span>Email de Identidad</span>
            {checkingEmail && <span className="text-zs-blue animate-pulse">Analizando anomalías...</span>}
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zs-text-muted group-focus-within:text-zs-violet transition-colors" size={18} />
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nuevo.agente@santy.tech"
              className={`zs-input pl-12 focus:border-zs-violet focus:ring-zs-violet/10 ${emailError ? "border-zs-rose text-zs-rose focus:border-zs-rose focus:ring-zs-rose/10" : ""}`}
            />
          </div>
          {emailError && (
            <p className="text-xs text-zs-rose font-bold mt-2 ml-1 flex items-center gap-1">
              <ShieldAlert size={12} /> {emailError}
            </p>
          )}
        </div>

        {/* Passwords en una fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-2 ml-1">
              Nueva Llave de Acceso
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zs-text-muted group-focus-within:text-zs-violet transition-colors" size={18} />
              <input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`zs-input pl-12 focus:border-zs-violet focus:ring-zs-violet/10 ${!passwordLengthOk ? "border-zs-rose focus:border-zs-rose" : ""}`}
              />
            </div>
            {!passwordLengthOk && <p className="text-[10px] text-zs-rose mt-1 ml-1">Mínimo 8 caracteres</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-2 ml-1">
              Verificar Llave
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zs-text-muted group-focus-within:text-zs-violet transition-colors" size={18} />
              <input
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`zs-input pl-12 focus:border-zs-violet focus:ring-zs-violet/10 ${!passwordsMatch ? "border-zs-rose focus:border-zs-rose" : ""}`}
              />
            </div>
            {!passwordsMatch && <p className="text-[10px] text-zs-rose mt-1 ml-1">Las llaves no coinciden</p>}
          </div>
        </div>

        <div className="relative py-2">
          <div className="text-[10px] text-zs-text-muted leading-relaxed">
            Al inicializar, aceptas los <Link href="/legal/terms" className="text-white italic hover:text-zs-blue transition-colors underline decoration-zs-border">Protocolos de Servicio</Link> y la <Link href="/legal/privacy" className="text-white italic hover:text-zs-blue transition-colors underline decoration-zs-border">Política de Datos</Link> del ecosistema Zona Sur Tech.
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!canSubmit}
          className="zs-btn zs-btn-brand w-full py-4 text-sm group !shadow-zs-glow-violet disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Inicializar Agente
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </>
  );
}
