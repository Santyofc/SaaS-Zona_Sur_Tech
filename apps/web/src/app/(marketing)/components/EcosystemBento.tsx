"use client";

import {
  Bot,
  Workflow,
  BarChart3,
  ShieldCheck,
  Network,
  Database,
  Layers3,
} from "lucide-react";

export default function EcosystemBento() {
  return (
    <section className="zs-section relative overflow-hidden bg-zs-bg-primary">
      <div className="container mx-auto">
        <div className="max-w-4xl mb-14 md:mb-16">
          <div className="mb-6 flex items-center gap-3 text-zs-blue">
            <Network className="w-5 h-5" />
            <span className="zs-eyebrow italic">
              Sistema operativo de negocio
            </span>
          </div>
          <h2 className="zs-heading-xl mb-6 italic md:mb-7">
            Disenado para <br />
            <span className="text-zs-blue">coordinar toda la operacion</span>
          </h2>
          <p className="zs-copy max-w-3xl">
            Un Business OS util no vive en una sola herramienta. Integra
            procesos, datos, automatizacion e IA para que cada equipo trabaje
            sobre la misma realidad operativa.
          </p>
        </div>

        <div className="grid auto-rows-[220px] grid-cols-1 gap-6 md:grid-cols-12 md:auto-rows-[240px]">
          <div className="zs-card relative overflow-hidden border-zs-blue/20 bg-zs-bg-secondary/40 p-8 group md:col-span-8 md:row-span-2 md:p-12">
            <div className="absolute top-0 right-0 p-12 text-zs-blue/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Layers3 className="w-80 h-80" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="text-zs-emerald bg-zs-emerald/10 border border-zs-emerald/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                  ENLACE ACTIVO
                </span>
                <h3 className="zs-heading-lg mt-8 mb-4 max-w-2xl italic">
                  Business OS <br />
                  alineado a su operacion
                </h3>
                <p className="zs-copy max-w-xl text-sm md:text-base">
                  Mapeamos como entra el trabajo, quien decide, que se
                  automatiza y donde conviene usar IA para mejorar velocidad,
                  calidad y seguimiento.
                </p>
              </div>

              <div className="flex flex-col items-start gap-5 pt-8 md:flex-row md:items-center md:gap-12">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zs-text-muted uppercase">
                    Resultado esperado
                  </span>
                  <span className="text-xl font-black text-zs-emerald italic">
                    Mas control
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zs-text-muted uppercase">
                    Metodo
                  </span>
                  <span className="text-xl font-black text-white italic">
                    Proceso + automatizacion + IA
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="zs-card border-zs-border bg-zs-bg-secondary/40 p-8 group md:col-span-4 md:row-span-1">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-zs-bg-primary border border-zs-border flex items-center justify-center text-zs-blue group-hover:shadow-zs-glow-blue transition-all">
                <Workflow className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest">
                WORKFLOW
              </span>
            </div>
            <h4 className="mb-2 text-xl font-black uppercase italic tracking-tight text-white">
              Flujos conectados
            </h4>
            <p className="mb-6 text-sm text-zs-text-secondary">
              Unimos handoffs, aprobaciones, recordatorios y seguimiento entre
              areas.
            </p>
            <div className="flex gap-4 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
              <div className="w-10 h-6 bg-white/10 rounded-md" />
              <div className="w-10 h-6 bg-white/10 rounded-md" />
              <div className="w-10 h-6 bg-white/10 rounded-md" />
            </div>
          </div>

          <div className="zs-card border-zs-border bg-zs-bg-secondary/40 p-8 transition-all group hover:border-zs-violet/30 md:col-span-4 md:row-span-1">
            <div className="flex items-center gap-4 mb-8">
              <ShieldCheck className="w-8 h-8 text-zs-violet" />
              <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest italic">
                ZST_SEC_v2
              </span>
            </div>
            <h4 className="text-xl font-black uppercase italic tracking-tight text-white">
              Gobierno y trazabilidad
            </h4>
            <p className="mt-2 text-sm text-zs-text-secondary">
              Decisiones, permisos y cambios claros para operar sin
              improvisacion.
            </p>
          </div>

          <div className="zs-card relative overflow-hidden border-zs-border bg-zinc-900/40 p-8 group md:col-span-4 md:row-span-1">
            <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-20 transition-opacity">
              <Bot className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-bold text-zs-text-muted uppercase mb-2">
                Capa de IA
              </div>
              <div className="text-2xl font-black text-white italic tracking-tighter uppercase">
                Asistentes, busquedas <br />
                <span className="text-zs-blue text-sm">y ejecucion asistida</span>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zs-emerald animate-pulse" />
                <span className="text-[9px] font-black uppercase text-zs-emerald italic">
                  IA conectada al contexto
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 border-zs-border sm:grid-cols-2 md:col-span-8 md:row-span-1">
            <div className="zs-card flex flex-col justify-center gap-2 border-zs-border bg-zs-bg-secondary/40 p-8 group">
              <BarChart3 className="w-6 h-6 text-zs-blue mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-lg font-black text-white uppercase italic tracking-tight">
                Visibilidad
              </div>
              <div className="text-[10px] text-zs-text-secondary font-bold uppercase">
                Indicadores, alertas y seguimiento
              </div>
            </div>
            <div className="zs-card flex flex-col justify-center gap-2 border-zs-border bg-zs-bg-secondary/40 p-8 group">
              <Database className="w-6 h-6 text-zs-violet mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-lg font-black text-white uppercase italic tracking-tight">
                Fuente unica de verdad
              </div>
              <div className="text-[10px] text-zs-text-secondary font-bold uppercase">
                Datos alineados para decidir mejor
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
