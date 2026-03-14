"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Users, Shield, Zap, ExternalLink, Terminal } from "lucide-react";
import Link from "next/link";
import { ActivityFeed } from "../ActivityFeed";
import { apiListActivity, type ActivityLogEntry } from "@/lib/api";
import { Spinner } from "../ui-primitives";
import { MiniSaasGrid } from "../MiniSaasGrid";

interface DashboardContentProps {
  session: {
    userId: string;
    organizationId: string;
    organizationName: string;
    role: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
    isSuperAdmin?: boolean;
  };
}

export function DashboardContent({ session }: DashboardContentProps) {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      try {
        const data = await apiListActivity(10);
        setLogs(data);
      } catch (err) {
        console.error("Failed to load activity:", err);
      } finally {
        setLoading(false);
      }
    }
    loadActivity();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Centro de <span className="text-zs-blue shadow-zs-glow-blue">Operaciones</span>
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-zs-text-secondary text-sm font-medium tracking-widest uppercase">
              Workspace: <span className="text-white">{session.organizationName}</span>
            </p>
            <div className="w-1 h-1 rounded-full bg-zs-border" />
            <p className="text-zs-text-secondary text-sm font-medium tracking-widest uppercase">
              Estatus: <span className="text-zs-green animate-pulse">En Línea</span>
            </p>
          </div>
        </div>

        {session.isSuperAdmin && (
          <Link 
            href="/admin" 
            className="group relative flex items-center gap-3 px-6 py-3 rounded-xl bg-zs-violet/10 border border-zs-violet/30 hover:bg-zs-violet/20 hover:border-zs-violet transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zs-violet/0 via-zs-violet/5 to-zs-violet/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Terminal className="w-4 h-4 text-zs-violet group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black text-zs-violet uppercase tracking-[0.2em]">Open Admin Terminal</span>
            <div className="w-1.5 h-1.5 rounded-full bg-zs-violet animate-pulse shadow-zs-glow-violet" />
          </Link>
        )}
      </motion.header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "Miembros del Equipo", 
            value: "Activo", 
            icon: <Users className="w-4 h-4" />,
            color: "text-zs-blue",
            link: "/dashboard/team"
          },
          { 
            label: "Perfil de Acceso", 
            value: session.role.toUpperCase(), 
            icon: <Shield className="w-4 h-4" />,
            color: "text-zs-violet",
            link: "/dashboard/settings"
          },
          { 
            label: "Nivel de Plan", 
            value: "Pro", 
            icon: <Zap className="w-4 h-4" />,
            color: "text-zs-emerald",
            link: "/dashboard/billing"
          },
        ].map((stat) => (
          <motion.article
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4, borderColor: "rgba(0, 247, 255, 0.3)" }}
            className="p-6 rounded-2xl bg-zs-bg-secondary/40 backdrop-blur-xl border border-zs-border shadow-zs-glass group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${stat.color}`}>
                {stat.icon}
              </div>
              <ExternalLink className="w-3 h-3 text-zs-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold text-white`}>
              {stat.value}
            </p>
          </motion.article>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-2 p-8 rounded-3xl bg-zs-bg-secondary/20 backdrop-blur-3xl border border-zs-border relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zs-blue to-transparent opacity-50" />
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Activity className="w-5 h-5 text-zs-blue" />
              Actividad Reciente
            </h2>
            <button className="text-xs font-bold text-zs-blue hover:underline uppercase tracking-widest">
              Ver Todo
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <ActivityFeed logs={logs} />
          )}
        </motion.section>

        {/* Info / Identity Panel */}
        <motion.section
          variants={itemVariants}
          className="p-8 rounded-3xl bg-zs-bg-secondary/20 backdrop-blur-3xl border border-zs-border flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-bold text-white mb-6">Identidad Digital</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zs-blue flex items-center justify-center text-xl font-black text-white shadow-zs-glow-blue">
                  {session.user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-bold">{session.user.name}</p>
                  <p className="text-xs text-zs-text-muted truncate max-w-[150px]">{session.user.email}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zs-border space-y-4">
                <div>
                  <p className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest mb-1">ID de Sesión</p>
                  <p className="font-mono text-[10px] text-zs-blue break-all">#{session.userId.split('-')[0]}...{session.userId.split('-').pop()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest mb-1">Endpoint de Seguridad</p>
                  <p className="font-mono text-[10px] text-zs-emerald break-all">NEXT_APP_ROUTER_V14</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 italic">
            <p className="text-zs-text-secondary text-xs leading-relaxed">
              &quot;La infraestructura multitenant está operando bajo protocolos de seguridad Supabase Auth v2.&quot;
            </p>
          </div>
        </motion.section>
      </div>

      {/* Mini SaaS Hub */}
      <MiniSaasGrid />

      {/* Decorative Blur Orbs */}
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zs-blue/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </motion.main>
  );
}
