"use client";

import React from "react";
import { motion } from "framer-motion";
import { Construction, ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";
import { cn } from "./ui-primitives";

interface ModulePlaceholderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: string;
}

export function ModulePlaceholder({ 
  title, 
  description = "Este módulo está siendo optimizado por el equipo de ingeniería de Zona Sur Tech. Vuelve pronto para explorar todas sus capacidades.",
  icon,
  status = "Under Construction"
}: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-12"
      >
        <div className="w-24 h-24 rounded-[2rem] bg-zs-blue/10 border border-zs-blue/20 flex items-center justify-center relative z-10">
          {icon || <Construction className="w-10 h-10 text-zs-blue" />}
        </div>
        <div className="absolute inset-0 bg-zs-blue/20 rounded-[2rem] blur-3xl animate-pulse -z-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-xl space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zs-blue/10 border border-zs-blue/20 text-zs-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Terminal className="w-3.5 h-3.5" />
          Status: {status}
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          {title} <span className="text-zs-blue shadow-zs-glow-blue">Soon</span>
        </h1>

        <p className="text-zs-text-secondary text-lg font-medium leading-relaxed">
          {description}
        </p>

        <div className="pt-8">
          <Link
            href="/dashboard"
            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-zs-blue hover:border-zs-blue transition-all duration-300 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al Hub
          </Link>
        </div>
      </motion.div>

      {/* Background Decorative Element */}
      <div className="fixed inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.03] pointer-events-none -z-10">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="border border-white/10" />
        ))}
      </div>
    </div>
  );
}
