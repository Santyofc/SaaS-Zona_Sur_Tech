import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { signUp } from "../actions";
import { UserPlus, Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Solicitud de Credenciales | Santy Tech",
  description: "Únete al ecosistema de alto rendimiento de Santy Tech.",
};

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="relative min-h-screen pt-[180px] pb-[120px] overflow-hidden">
      {/* Background Decor */}
      <div className="zs-orb w-[600px] h-[600px] bg-zs-violet/10 top-[-20%] right-[-10%]" />
      <div className="zs-orb w-[400px] h-[400px] bg-zs-blue/5 bottom-[10%] left-[-5%]" />

      <div className="container relative z-10">
        <div className="max-w-[480px] mx-auto">
          <div className="animate-zs-fade-up">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zs-violet/10 border border-zs-violet/20 text-zs-violet mb-6 shadow-zs-glow-violet">
                <UserPlus size={32} />
              </div>
              <h1 className="text-4xl font-black text-white mb-3 italic tracking-tight">
                Santy <span className="text-zs-violet">Tech</span>
              </h1>
              <p className="text-zs-text-secondary text-sm font-medium">
                Inicializa tu Nodo en el Kernel
              </p>
            </div>

            {/* Form Card */}
            <div className="zs-card p-8 md:p-10">
              {searchParams.error && (
                <div className="mb-6 p-4 rounded-xl bg-zs-rose/10 border border-zs-rose/20 text-zs-rose text-xs font-bold animate-zs-fade-in flex items-center gap-3">
                  <ShieldAlert size={16} />
                  {searchParams.error}
                </div>
              )}

              <form action={signUp} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-2 ml-1">
                    Email de Identidad
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zs-text-muted group-focus-within:text-zs-violet transition-colors" size={18} />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="nuevo.agente@santy.tech"
                      className="zs-input pl-12 focus:border-zs-violet focus:ring-zs-violet/10"
                    />
                  </div>
                </div>

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
                      placeholder="••••••••"
                      className="zs-input pl-12 focus:border-zs-violet focus:ring-zs-violet/10"
                    />
                  </div>
                </div>

                <div className="relative py-2">
                  <div className="text-[10px] text-zs-text-muted leading-relaxed">
                    Al inicializar, aceptas los <span className="text-white italic">Protocolos de Servicio</span> y la <span className="text-white italic">Política de Datos</span> del ecosistema Santy Tech.
                  </div>
                </div>

                <button type="submit" className="zs-btn zs-btn-brand w-full py-4 text-sm group !shadow-zs-glow-violet">
                  Inicializar Agente
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Footer Signup */}
            <p className="text-center mt-8 text-zs-text-secondary text-sm">
              ¿Ya tienes un nodo activo?{" "}
              <Link href="/signin" className="text-white font-black hover:text-zs-violet transition-colors underline decoration-zs-violet/30 underline-offset-4">
                Sincronizar Ahora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
