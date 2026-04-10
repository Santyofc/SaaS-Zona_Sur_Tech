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
      className="mx-auto max-w-6xl space-y-8 pb-12"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-2">
          <h1 className="zs-heading-lg italic">
            Centro de <span className="text-zs-cyan">Operaciones</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zs-text-secondary">
              Workspace: <span className="text-white">{session.organizationName}</span>
            </p>
            <div className="w-1 h-1 rounded-full bg-zs-border" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zs-text-secondary">
              Estatus: <span className="animate-pulse text-zs-emerald">En linea</span>
            </p>
          </div>
        </div>

        {session.isSuperAdmin && (
          <Link 
            href="/admin" 
            className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-zs-violet/30 bg-zs-violet/10 px-6 py-3 transition-all duration-300 hover:border-zs-violet hover:bg-zs-violet/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zs-violet/0 via-zs-violet/5 to-zs-violet/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Terminal className="w-4 h-4 text-zs-violet group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-zs-violet">Abrir terminal admin</span>
            <div className="w-1.5 h-1.5 rounded-full bg-zs-violet animate-pulse shadow-zs-glow-violet" />
          </Link>
        )}
      </motion.header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4, borderColor: "rgba(0, 247, 255, 0.3)" }}
            className="group"
          >
            <Link
              href={stat.link}
              className="zs-card block min-h-[156px] rounded-2xl p-6 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-lg border border-white/10 bg-white/5 p-2 ${stat.color}`}>
                  {stat.icon}
                </div>
                <ExternalLink className="h-3 w-3 text-zs-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </Link>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Activity Feed */}
        <motion.section
          variants={itemVariants}
          className="zs-card relative overflow-hidden rounded-3xl p-6 backdrop-blur-3xl md:p-8 lg:col-span-2"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zs-blue to-transparent opacity-50" />
          
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-xl font-bold text-white">
              <Activity className="w-5 h-5 text-zs-blue" />
              Actividad reciente
            </h2>
            <Link href="/dashboard/team" className="rounded-full border border-zs-cyan/30 bg-zs-cyan/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-zs-cyan transition-colors hover:bg-zs-cyan/20">
              Ver todo
            </Link>
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
          className="zs-card flex flex-col justify-between rounded-3xl p-6 backdrop-blur-3xl md:p-8"
        >
          <div>
            <h2 className="mb-6 text-lg font-bold text-white">Identidad digital</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zs-cyan text-xl font-black text-zs-bg-primary shadow-zs-glow-cyan">
                  {session.user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white">{session.user.name}</p>
                  <p className="max-w-[150px] truncate text-xs text-zs-text-muted">{session.user.email}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-zs-border pt-6">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-zs-text-muted">ID de sesion</p>
                  <p className="break-all font-mono text-[10px] text-zs-cyan">#{session.userId.split("-")[0]}...{session.userId.split("-").pop()}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-zs-text-muted">Endpoint de seguridad</p>
                  <p className="break-all font-mono text-[10px] text-zs-emerald">NEXT_APP_ROUTER_V14</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 italic">
            <p className="text-xs leading-relaxed text-zs-text-secondary">
              &quot;La infraestructura multitenant esta operando bajo protocolos de seguridad Supabase Auth v2.&quot;
            </p>
          </div>
        </motion.section>
      </div>

      {/* Mini SaaS Hub */}
      <MiniSaasGrid />

      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] -z-10 h-[40%] w-[40%] rounded-full bg-zs-blue/5 blur-[120px]" />
    </motion.main>
  );
}
