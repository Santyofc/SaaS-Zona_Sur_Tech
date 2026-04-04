import { Metadata } from "next";
import Link from "next/link";
import { Check, Zap, Shield, BarChart3, Globe, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Capacidades | Business OS, Automatizacion e IA",
  description:
    "Conozca como disenamos sistemas operativos de negocio: procesos claros, automatizacion util, visibilidad operativa e IA aplicada.",
  alternates: {
    canonical: "https://zonasurtech.online/features",
  },
  openGraph: {
    title: "Capacidades | ZonaSur Tech Business OS",
    description:
      "Procesos, automatizacion, control operativo e IA aplicada para empresas en Costa Rica.",
    url: "https://zonasurtech.online/features",
  },
};

const features = [
  {
    icon: Zap,
    color: "text-zs-blue",
    borderColor: "border-zs-blue/30",
    title: "Diseno de procesos",
    description:
      "Mapeamos como entra el trabajo, donde se frena, quien decide y que reglas necesita su operacion para funcionar con consistencia.",
    bullets: [
      "Mapa de flujo actual",
      "Cuellos de botella identificados",
      "Definicion de responsables",
      "Reglas operativas claras",
    ],
  },
  {
    icon: BarChart3,
    color: "text-zs-cyan",
    borderColor: "border-zs-cyan/30",
    title: "Automatizacion de tareas",
    description:
      "Reducimos trabajo manual entre equipos conectando formularios, CRM, seguimiento, aprobaciones y notificaciones.",
    bullets: [
      "Handoffs sin doble digitacion",
      "Alertas y recordatorios automaticos",
      "Aprobaciones estructuradas",
      "Integraciones entre herramientas",
    ],
  },
  {
    icon: Globe,
    color: "text-zs-violet",
    borderColor: "border-zs-violet/30",
    title: "Visibilidad operativa",
    description:
      "Construimos tableros y metricas para saber que pasa, que esta detenido y donde intervenir primero.",
    bullets: [
      "KPIs accionables",
      "Seguimiento por etapa",
      "Alertas por SLA",
      "Priorizacion de trabajo",
    ],
  },
  {
    icon: Shield,
    color: "text-zs-emerald",
    borderColor: "border-zs-emerald/30",
    title: "Capa de IA aplicada",
    description:
      "Implementamos IA donde realmente ayuda al equipo: busqueda, clasificacion, copilotos y soporte a la ejecucion.",
    bullets: [
      "Copilotos internos",
      "Clasificacion automatica",
      "Busqueda sobre contexto real",
      "Borradores y respuestas asistidas",
    ],
  },
  {
    icon: Cpu,
    color: "text-zs-blue",
    borderColor: "border-zs-blue/30",
    title: "Integracion de equipos y herramientas",
    description:
      "Unimos la operacion entre areas para que ventas, operaciones, finanzas y servicio trabajen sobre el mismo sistema.",
    bullets: [
      "Contexto compartido",
      "Flujos interarea",
      "Estados visibles",
      "Menos retrabajo",
    ],
  },
  {
    icon: BarChart3,
    color: "text-zs-cyan",
    borderColor: "border-zs-cyan/30",
    title: "Implementacion y adopcion",
    description:
      "No entregamos solo diseno. Dejamos un sistema funcionando, documentado y adoptado por el equipo.",
    bullets: [
      "Acompanamiento de rollout",
      "Playbooks operativos",
      "Capacitacion por roles",
      "Mejora continua",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="relative bg-zs-bg-primary min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <header className="text-center mb-20 max-w-4xl mx-auto">
          <p className="text-zs-blue text-sm font-black uppercase tracking-[0.3em] mb-4">
            Capacidades clave
          </p>
          <h1 className="text-2xl md:text-5xl font-black text-white tracking-tight uppercase italic leading-tight mb-6">
            Business OS{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet">
              para empresas en Costa Rica
            </span>
          </h1>
          <p className="text-xl text-zs-text-secondary font-light leading-relaxed">
            Disenamos la estructura operativa que su empresa necesita para
            trabajar con menos friccion y mas criterio.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className={`p-8 rounded-2xl bg-zs-bg-secondary/40 border ${feature.borderColor} hover:bg-zs-bg-secondary/60 transition-all group`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-zs-bg-primary border ${feature.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${feature.color}`} aria-hidden />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h2>
                <p className="text-zs-text-secondary font-light text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2" role="list">
                  {feature.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-center gap-2 text-sm text-zs-text-secondary"
                    >
                      <Check
                        className="w-4 h-4 text-zs-emerald flex-shrink-0"
                        aria-hidden
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <nav className="text-center" aria-label="Paginas relacionadas">
          <p className="text-zs-text-secondary mb-6">
            Explore como aplicamos este enfoque
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/use-cases"
              className="px-6 py-3 rounded-xl bg-zs-blue/10 border border-zs-blue/30 text-zs-blue text-sm font-bold hover:bg-zs-blue/20 transition-all"
            >
              Casos de uso
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-zs-cyan/10 border border-zs-cyan/30 text-zs-cyan text-sm font-bold hover:bg-zs-cyan/20 transition-all"
            >
              Hablar con ZST
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-zs-violet/10 border border-zs-violet/30 text-zs-violet text-sm font-bold hover:bg-zs-violet/20 transition-all"
            >
              Ver planes
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
