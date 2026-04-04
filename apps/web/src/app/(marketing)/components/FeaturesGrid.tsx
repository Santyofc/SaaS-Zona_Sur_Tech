import Link from "next/link";
import {
  Bot,
  Workflow,
  Eye,
  ShieldCheck,
  ChevronRight,
  Database,
  Network,
  Cpu,
} from "lucide-react";
import FeatureCardWrapper from "./FeatureCardWrapper.client";
import { GlitchText } from "@/components/ui/GlitchText.client";

type FeatureCard = {
  id: string;
  colSpan?: string;
  rowSpan?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  title: React.ReactNode;
  description: string;
  cta?: { href: string; label: string; color: string };
  preview?: React.ReactNode;
  delay?: number;
};

const CARDS: FeatureCard[] = [
  {
    id: "business-os",
    colSpan: "md:col-span-2",
    icon: <Database className="w-6 h-6" />,
    title: "Business OS a su medida",
    description:
      "Disenamos la capa operativa que conecta personas, procesos, datos y decisiones. Menos friccion, mas control y una forma clara de operar.",
    cta: { href: "/systems", label: "Ver enfoque operativo", color: "text-zs-cyan" },
    delay: 0,
  },
  {
    id: "automation",
    rowSpan: "md:row-span-2",
    icon: <Workflow className="w-6 h-6" />,
    title: (
      <>
        Automatizacion
        <br />
        sin caos
      </>
    ),
    description:
      "Eliminamos tareas repetitivas, aprobaciones manuales y dobles registros. Automatizamos flujos entre ventas, operaciones, finanzas y servicio.",
    cta: { href: "/features", label: "Ver automatizaciones", color: "text-zs-blue" },
    preview: (
      <div className="absolute top-10 left-10 right-10 bottom-40 bg-gradient-to-b from-zs-blue/20 to-transparent rounded-2xl border border-zs-blue/20 p-4 font-mono text-xs text-zs-blue flex flex-col gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2">
          <Workflow className="w-3 h-3" /> [FLOW] Lead capturado
        </div>
        <div className="flex gap-2">
          <Network className="w-3 h-3" /> [SYNC] CRM y operaciones
        </div>
        <div className="flex gap-2">
          <Eye className="w-3 h-3" /> [CHECK] SLA monitoreado
        </div>
        <div className="flex gap-2 text-zs-emerald">
          <ShieldCheck className="w-3 h-3" /> [DONE] Tarea ejecutada
        </div>
      </div>
    ),
    delay: 0.1,
  },
  {
    id: "ai",
    icon: <Bot className="w-8 h-8 text-zs-emerald" />,
    badge: (
      <span className="text-[10px] bg-zs-emerald/10 text-zs-emerald px-2 py-1 rounded font-black tracking-widest uppercase">
        IA aplicada
      </span>
    ),
    title: "Asistentes y copilotos internos",
    description:
      "Implementamos IA donde si mueve la aguja: clasificacion, respuesta, priorizacion, busqueda interna y ejecucion asistida.",
    delay: 0.2,
  },
  {
    id: "control",
    icon: <Cpu className="w-8 h-8 text-zs-violet" />,
    badge: (
      <span className="text-[10px] bg-zs-violet/10 text-zs-violet px-2 py-1 rounded font-black tracking-widest uppercase">
        Control operativo
      </span>
    ),
    title: "Visibilidad y gobierno",
    description:
      "Creamos tableros, reglas, alertas y metricas para que su equipo opere con criterio, consistencia y prioridades claras.",
    delay: 0.3,
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-32 relative z-10 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black text-white uppercase italic tracking-[-0.03em] leading-[0.92] mb-6">
            Arquitectura{" "}
            <br className="md:hidden" />
            <GlitchText
              text="Business Core"
              className="text-zs-blue drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              delay={0.2}
            />
          </h2>
          <p className="text-zs-text-secondary text-lg max-w-2xl mx-auto">
            Cuatro frentes para ordenar su operacion: estructura, automatizacion,
            inteligencia y control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-6xl mx-auto auto-rows-[300px]">
          {CARDS.map((card) => (
            <FeatureCardWrapper
              key={card.id}
              colSpan={card.colSpan}
              rowSpan={card.rowSpan}
              delay={card.delay}
            >
              {card.id === "business-os" && (
                <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Database className="w-[300px] h-[300px] text-zs-cyan" />
                </div>
              )}

              {card.preview}

              <div
                className={`relative z-10 h-full flex flex-col ${card.rowSpan ? "justify-end" : "justify-between"}`}
              >
                <div>
                  {card.badge ? (
                    <div className="flex items-center justify-between mb-6">
                      {card.icon}
                      {card.badge}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-zs-cyan/10 border border-zs-cyan/20 flex items-center justify-center text-zs-cyan mb-6">
                      {card.icon}
                    </div>
                  )}

                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
                    {card.title}
                  </h3>
                  <p className="text-zs-text-secondary text-sm max-w-md leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {card.cta && (
                  <Link
                    href={card.cta.href}
                    className={`flex items-center gap-2 text-xs font-black ${card.cta.color} uppercase tracking-widest hover:text-white transition-colors w-max mt-4`}
                  >
                    {card.cta.label} <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </FeatureCardWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
