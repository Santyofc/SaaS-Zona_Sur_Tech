"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige automáticamente al entorno seguro del Dashboard después de 1.5s
    const timer = setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/login`;
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-zs-bg-primary flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zs-blue/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: `radial-gradient(var(--color-zs-text-muted) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-dashed border-zs-blue/30 rounded-full"
          />
          {/* Inner pulsating box */}
          <div className="w-20 h-20 rounded-2xl bg-zs-blue/10 border border-zs-blue/20 flex items-center justify-center shadow-zs-glow-blue relative">
            <Cpu className="w-10 h-10 text-zs-blue animate-pulse" />
          </div>
        </div>

        <motion.h1
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-widest mb-2"
        >
          Inicializando <span className="text-zs-blue">ZST Kernel</span>
        </motion.h1>

        <p className="text-zs-text-muted text-[10px] md:text-sm font-bold uppercase tracking-[0.3em]">
          Estableciendo enlace encriptado con el nodo seguro...
        </p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-zs-bg-secondary mt-8 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-full w-full bg-zs-blue shadow-zs-glow-blue"
          />
        </div>
      </motion.div>
    </main>
  );
}
