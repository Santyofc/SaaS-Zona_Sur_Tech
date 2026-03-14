"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoZS } from "@repo/ui/src/components/LogoZS";

export function KernelLoader({ path }: { path: string }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const getRouteLabel = (p: string) => {
    const parts = p.split('/').filter(Boolean);
    if (parts.length === 0) return "HOME_KERNEL";
    const lastPart = parts[parts.length - 1].toUpperCase();
    return lastPart.replace(/-/g, '_');
  };

  const [statusText, setStatusText] = useState(`ACCEDIENDO A SECTOR: ${getRouteLabel(path)}`);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsVisible(false), 500);
            return 100;
          }
          
          // Dynamic status messages
          if (prev > 30 && prev < 60) setStatusText("ESTABLECIENDO ENLACE ENCRIPTADO...");
          if (prev >= 60 && prev < 90) setStatusText("SINCRONIZANDO NODOS GLOBALES...");
          if (prev >= 90) setStatusText("ACCESO CONCEDIDO");
          
          return prev + Math.random() * 15;
        });
      }, 150);
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[var(--z-modal)] bg-[#050608] flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zs-blue/5 blur-[120px] rounded-full animate-pulse" />
             <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(var(--color-zs-blue) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
             />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 mb-12 relative"
            >
              <div className="absolute inset-0 bg-zs-blue/20 blur-3xl rounded-full animate-pulse" />
              <img src="/images/zst_kernel_core.png" alt="ZST Core" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
            </motion.div>

            {/* Status Text */}
            <motion.h2 
              key={statusText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-black text-white uppercase italic tracking-widest text-center mb-8 h-8"
            >
              {statusText.split(" ").map((word, i) => (
                <span key={i} className={word === "ZST" || word === "KERNEL" ? "text-zs-blue" : ""}>
                  {word}{" "}
                </span>
              ))}
            </motion.h2>

            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-zs-blue shadow-[0_0_15px_var(--color-zs-blue)]"
              />
            </div>

            {/* System Info */}
            <div className="mt-12 px-4 py-1.5 rounded-full bg-zs-emerald/10 border border-zs-emerald/20 text-[10px] font-black text-zs-emerald uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zs-emerald animate-pulse" />
                <span>Destino: {getRouteLabel(path)} | TLS 1.3</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
