import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { signIn } from "../actions";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Acceso al Kernel | Santy Tech",
  description: "Inicia sesión para acceder al ecosistema de alto rendimiento de Santy Tech.",
};

export default function SigninPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <section className="relative min-h-screen pt-[180px] pb-[120px] overflow-hidden">
      {/* Background Decor */}
      <div className="zs-orb w-[600px] h-[600px] bg-zs-blue/10 top-[-20%] left-[-10%]" />
      <div className="zs-orb w-[400px] h-[400px] bg-zs-violet/5 bottom-[10%] right-[-5%]" />

      <div className="container relative z-10">
        <div className="max-w-[480px] mx-auto">
          <div className="animate-zs-fade-up">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zs-blue/10 border border-zs-blue/20 text-zs-blue mb-6 shadow-zs-glow-blue">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-4xl font-black text-white mb-3 italic tracking-tight">
                Santy <span className="text-zs-blue">Tech</span>
              </h1>
              <p className="text-zs-text-secondary text-sm font-medium">
                Autenticación de Nivel Industrial
              </p>
            </div>

            {/* Form Card */}
            <div className="zs-card p-8 md:p-10">
              {searchParams.error && (
                <div className="mb-6 p-4 rounded-xl bg-zs-rose/10 border border-zs-rose/20 text-zs-rose text-xs font-bold animate-zs-fade-in flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-zs-rose animate-pulse" />
                  {searchParams.error}
                </div>
              )}
              {searchParams.message && (
                <div className="mb-6 p-4 rounded-xl bg-zs-emerald/10 border border-zs-emerald/20 text-zs-emerald text-xs font-bold animate-zs-fade-in">
                  {searchParams.message}
                </div>
              )}

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
                      placeholder="usuario@santy.tech"
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
            </div>

            {/* Footer Signin */}
            <p className="text-center mt-8 text-zs-text-secondary text-sm">
              ¿No tienes acceso?{" "}
              <Link href="/signup" className="text-white font-black hover:text-zs-blue transition-colors underline decoration-zs-blue/30 underline-offset-4">
                Solicita Credenciales
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
