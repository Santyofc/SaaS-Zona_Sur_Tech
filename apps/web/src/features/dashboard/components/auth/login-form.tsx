"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Github, Chrome, Cpu, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // const name = formData.get("name") as string; // Optional: For registration

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Algo ha fallado en la sincronización.");
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error crítico en la conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-mono bg-zs-bg-primary">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-zs-blue/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-zs-violet/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: `radial-gradient(var(--color-zs-text-muted) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-zs-bg-secondary/40 backdrop-blur-3xl border border-zs-border rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10"
      >
        {/* Visual Content Column */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-zs-blue/10 to-zs-violet/10 border-r border-zs-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="w-64 h-64 text-zs-blue" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => window.location.href = "http://localhost:3000"}>
              <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }}>
                <div className="w-10 h-10 bg-zs-blue/20 rounded-lg flex items-center justify-center border border-zs-blue/30">
                  <Cpu className="text-zs-blue w-6 h-6" />
                </div>
              </motion.div>
              <span className="text-xl font-black text-white tracking-widest uppercase italic hover:text-zs-blue transition-colors">
                ZONA SUR <span className="text-zs-blue">TECH</span>
              </span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-6">
              Console <br />
              <span className="text-zs-blue shadow-zs-glow-blue">Management</span>
            </h2>
            <p className="text-zs-text-secondary text-base max-w-xs">
              Módulo de comando central. Arquitectura Zero-Trust activada.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-sm font-bold text-white uppercase tracking-widest">
              <ShieldCheck className="text-zs-blue w-5 h-5" />
              Auth Protocol v2.1 Activated
            </div>
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-zs-bg-secondary bg-zs-bg-primary overflow-hidden flex items-center justify-center">
                  <User className="w-5 h-5 text-zs-text-muted" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-zs-bg-secondary bg-zs-blue flex items-center justify-center text-[10px] font-black text-white">
                +2k
              </div>
            </div>
            <p className="text-[10px] font-black text-zs-text-muted uppercase tracking-[0.3em]">
              Trusted by high-performance teams globally
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <div className="w-16 h-16 rounded-2xl bg-zs-blue/10 border border-zs-blue/20 flex items-center justify-center mb-6 shadow-zs-glow-blue mx-auto lg:mx-0 lg:hidden">
              <Cpu className="w-8 h-8 text-zs-blue" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
              {mode === "login" ? "Reiniciar Sesión" : "Crear Identidad"}
            </h3>
            <p className="text-zs-text-secondary text-xs sm:text-sm">
              {mode === "login" ? "¿Nuevo en la red?" : "¿Ya eres parte del core?"}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-zs-blue ml-2 font-bold hover:underline"
              >
                {mode === "login" ? "Registrar ahora" : "Acceder sesión"}
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-bold uppercase tracking-wider">
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] sm:text-xs font-black text-zs-text-muted uppercase tracking-widest ml-1">Alias / Nombre</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
                    <input
                      name="name"
                      type="text"
                      placeholder="e.g. Neo"
                      className="w-full py-4 pl-12 pr-4 bg-black/40 border border-zs-border rounded-xl text-white placeholder-zs-text-muted/50 focus:border-zs-blue focus:outline-none focus:ring-1 focus:ring-zs-blue transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-black text-zs-text-muted uppercase tracking-widest ml-1">Protocolo Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full py-4 pl-12 pr-4 bg-black/40 border border-zs-border rounded-xl text-white placeholder-zs-text-muted/50 focus:border-zs-blue focus:outline-none focus:ring-1 focus:ring-zs-blue transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] sm:text-xs font-black text-zs-text-muted uppercase tracking-widest">Llave de Acceso</label>
                {mode === "login" && (
                  <button type="button" className="text-[9px] sm:text-[10px] font-black text-zs-blue uppercase tracking-widest hover:text-white transition-colors">
                    ¿Olvidaste la llave?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full py-4 pl-12 pr-4 bg-black/40 border border-zs-border rounded-xl text-white placeholder-zs-text-muted/50 focus:border-zs-blue focus:outline-none focus:ring-1 focus:ring-zs-blue transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="zs-btn-brand w-full py-4 rounded-xl flex items-center justify-center gap-3 group relative overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative text-sm font-black uppercase tracking-widest">
                {loading ? "Sincronizando..." : mode === "login" ? "Cargar Kernel" : "Sincronizar Datos"}
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
            </button>
          </form>

          <div className="mt-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-zs-border" />
              <span className="text-[9px] sm:text-[10px] font-black text-zs-text-muted uppercase tracking-widest">O entrar vía</span>
              <div className="h-px flex-1 bg-zs-border" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-3 p-3 rounded-xl bg-zs-bg-secondary border border-zs-border hover:border-zs-blue/40 hover:bg-zs-blue/5 transition-all text-xs font-bold text-white group">
                <Github className="w-4 h-4 text-zs-text-secondary group-hover:text-white" />
                GitHub
              </button>
              <button type="button" className="flex items-center justify-center gap-3 p-3 rounded-xl bg-zs-bg-secondary border border-zs-border hover:border-zs-blue/40 hover:bg-zs-blue/5 transition-all text-xs font-bold text-white group">
                <Chrome className="w-4 h-4 text-zs-text-secondary group-hover:text-white" />
                Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-[9px] text-zs-text-muted font-medium uppercase tracking-[0.2em]">
            Al continuar, aceptas nuestros <span className="text-white hover:text-zs-blue transition-colors cursor-pointer px-1">Protocolos de Servicio</span>
            y <span className="text-white hover:text-zs-blue transition-colors cursor-pointer px-1">Encriptación</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
