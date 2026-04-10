"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Boxes, 
  Users2, 
  Calendar, 
  FileText, 
  LifeBuoy, 
  ArrowRight,
  Zap,
  Clock,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { MiniSaasItem, MiniSaasStatus } from "@/config/mini-saas";
import { cn } from "./ui-primitives";

const ICON_MAP = {
  erp: Package,
  inventory: Boxes,
  crm: Users2,
  bookings: Calendar,
  quotes: FileText,
  tickets: LifeBuoy,
};

const STATUS_CONFIG: Record<MiniSaasStatus, { label: string; color: string; icon: any }> = {
  live: { label: "Live", color: "text-zs-emerald border-zs-emerald/20 bg-zs-emerald/10", icon: Zap },
  beta: { label: "Beta", color: "text-zs-blue border-zs-blue/20 bg-zs-blue/10", icon: Rocket },
  priority: { label: "Próximamente", color: "text-zs-violet border-zs-violet/20 bg-zs-violet/10", icon: Zap },
  planned: { label: "Planeado", color: "text-zs-text-muted border-zs-border bg-white/5", icon: Clock },
};

export function MiniSaasCard({ item, index }: { item: MiniSaasItem; index: number }) {
  const Icon = ICON_MAP[item.slug as keyof typeof ICON_MAP] || Package;
  const status = STATUS_CONFIG[item.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative p-6 rounded-3xl bg-zs-bg-secondary/40 backdrop-blur-xl border border-zs-border hover:border-zs-blue/30 transition-all duration-300 shadow-zs-glass overflow-hidden"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-px bg-gradient-to-br from-zs-blue/20 via-transparent to-zs-violet/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zs-blue group-hover:scale-110 group-hover:bg-zs-blue/10 transition-all duration-300">
            <Icon className="w-6 h-6" />
          </div>
          
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border transition-colors",
            status.color
          )}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zs-blue transition-colors">
          {item.name}
        </h3>
        
        <p className="text-sm text-zs-text-secondary leading-relaxed mb-8 min-h-[40px]">
          {item.description}
        </p>

        <Link
          href={item.href}
          className={cn(
            "flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300",
            item.status === "planned" 
              ? "bg-white/5 text-zs-text-muted cursor-not-allowed" 
              : "bg-zs-blue/10 border border-zs-blue/20 text-zs-blue hover:bg-zs-blue hover:text-white shadow-zs-glow-blue/20"
          )}
          onClick={(e) => item.status === "planned" && e.preventDefault()}
        >
          {item.status === "planned" ? "Bloqueado" : "Entrar al Sistema"}
          {item.status !== "planned" && <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
        </Link>
      </div>
    </motion.div>
  );
}
