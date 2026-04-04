"use client";

import React from "react";
import {
  Book,
  Shield,
  ChevronRight,
  Cpu,
  Zap,
  Layout,
  Activity,
  Network,
  Binary,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { GlitchText } from "@/components/ui/GlitchText.client";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-zs-bg-primary pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-zs-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-zs-violet/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-zs-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-zs-blue) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-blue/10 border border-zs-blue/20 text-zs-blue mb-8">
            <Book className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">
              BUSINESS_OS_DOCUMENTATION
            </span>
          </div>

          <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-8">
            Sistema de <br />
            <GlitchText
              text="Documentacion"
              className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            />
          </h1>

          <p className="text-xl text-zs-text-secondary font-light max-w-2xl leading-relaxed">
            Guia para entender nuestro enfoque de diseno operativo,
            automatizacion e IA aplicada en empresas de Costa Rica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DocCard
            icon={<Layout className="w-6 h-6" />}
            title="Diagnostico"
            description="Como analizamos la operacion actual, detectamos friccion y priorizamos oportunidades de cambio."
            links={[
              { label: "Enfoque de diseno", href: "/technology" },
              { label: "Mapa del sistema", href: "/systems" },
              { label: "Capacidades", href: "/features" },
            ]}
          />
          <DocCard
            icon={<Building2 className="w-6 h-6" />}
            title="Implementacion"
            description="Como aterrizamos procesos, automatizaciones y una fuente unica de verdad sin paralizar la operacion."
            links={[
              { label: "Orden por etapas", href: "/docs" },
              { label: "Visibilidad y control", href: "/features" },
              { label: "Casos de uso", href: "/use-cases" },
            ]}
          />
          <DocCard
            icon={<Zap className="w-6 h-6" />}
            title="IA aplicada"
            description="Criterios para implementar asistentes y automatizaciones con IA donde realmente aportan valor."
            links={[
              { label: "Capa IA", href: "/features" },
              { label: "Stack tecnico", href: "/api-reference" },
              { label: "Hablar con ZST", href: "/contact" },
            ]}
          />
        </div>

        <div className="mt-12 zs-card p-1 sm:p-12 bg-zs-bg-secondary/40 border-zs-border overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 text-zs-blue/10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Cpu className="w-64 h-64" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Binary className="w-5 h-5 text-zs-blue" />
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                  Referencia de implementacion
                </h3>
              </div>
              <p className="text-zs-text-secondary mb-8 leading-relaxed text-lg font-light">
                Documentamos tanto la logica de implementacion como el stack
                tecnico para que cada decision tenga contexto y trazabilidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/api-reference"
                  className="zs-btn-brand px-12 py-5 rounded-2xl group inline-flex items-center justify-center gap-3 w-full sm:w-auto"
                >
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">
                    Ver referencia tecnica
                  </span>
                </Link>
                <Link
                  href="/security"
                  className="zs-btn-ghost px-12 py-5 rounded-2xl group inline-flex items-center justify-center gap-3 w-full sm:w-auto overflow-hidden relative"
                >
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest relative z-10">
                    Ver marco de seguridad
                  </span>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-72 h-48 bg-black/60 rounded-3xl border border-zs-border p-6 flex items-center justify-center overflow-hidden">
              <div className="flex items-end gap-1.5 h-full w-full">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [
                        `${20 + Math.random() * 60}%`,
                        `${20 + Math.random() * 80}%`,
                        `${20 + Math.random() * 60}%`,
                      ],
                    }}
                    transition={{ duration: 1.5 + Math.random(), repeat: Infinity }}
                    className="w-full bg-zs-blue/40 rounded-t-sm shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DocCard({
  icon,
  title,
  description,
  links,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="zs-card p-10 bg-zs-bg-secondary/20 hover:bg-zs-bg-secondary/40 transition-all border-zs-border hover:border-zs-blue/30 group flex flex-col h-full">
      <div className="w-14 h-14 rounded-2xl bg-zs-bg-primary border border-zs-border flex items-center justify-center text-zs-blue mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-zs-glow-blue/5">
        {icon}
      </div>
      <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-6 group-hover:text-zs-blue transition-colors">
        {title}
      </h4>
      <p className="text-base text-zs-text-secondary font-light leading-relaxed mb-10 flex-1">
        {description}
      </p>
      <div className="space-y-4">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-zs-border hover:border-zs-blue/40 hover:bg-zs-blue/5 transition-all group/link"
          >
            <div className="flex items-center gap-3">
              <ChevronRight className="w-3 h-3 text-zs-blue group-hover/link:translate-x-1 transition-all" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {link.label}
              </span>
            </div>
            <Network className="w-3.5 h-3.5 text-zs-text-muted group-hover/link:text-zs-blue transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
