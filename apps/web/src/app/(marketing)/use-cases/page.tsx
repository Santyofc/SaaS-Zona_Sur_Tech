import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  ShoppingCart,
  Utensils,
  Truck,
  Stethoscope,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Casos de Uso | Business OS para empresas en Costa Rica",
  description:
    "Vea como aplicamos diseno operativo, automatizacion e IA en ventas, servicio, backoffice y operaciones para empresas en Costa Rica.",
  alternates: {
    canonical: "https://zonasurtech.online/use-cases",
  },
  openGraph: {
    title: "Casos de Uso | ZonaSur Tech Business OS",
    description: "Ejemplos reales de Business OS, automatizacion e IA aplicada.",
    url: "https://zonasurtech.online/use-cases",
  },
};

const useCases = [
  {
    icon: ShoppingCart,
    color: "text-zs-blue",
    industry: "Ventas y pipeline comercial",
    description:
      "Captura de leads, seguimiento, propuestas, handoff a operaciones y visibilidad de cierres en un solo flujo.",
    cta: "Ver capacidades comerciales",
    href: "/features",
  },
  {
    icon: Truck,
    color: "text-zs-cyan",
    industry: "Operaciones y cumplimiento interno",
    description:
      "Coordinacion entre equipos, estados de trabajo, aprobaciones y seguimiento sin depender de chats o planillas dispersas.",
    cta: "Ver diseno operativo",
    href: "/systems",
  },
  {
    icon: Utensils,
    color: "text-zs-violet",
    industry: "Atencion al cliente y servicio",
    description:
      "Mesa de ayuda, clasificacion, priorizacion y respuestas asistidas para atender mas rapido con mejor contexto.",
    cta: "Ver automatizacion de servicio",
    href: "/features",
  },
  {
    icon: Building2,
    color: "text-zs-emerald",
    industry: "Backoffice y tareas repetitivas",
    description:
      "Reemplazamos tareas manuales y seguimiento informal por flujos claros, alertas y ejecucion automatica.",
    cta: "Hablar del backoffice",
    href: "/contact",
  },
  {
    icon: Stethoscope,
    color: "text-zs-blue",
    industry: "IA para decisiones y ejecucion",
    description:
      "Asistentes internos para buscar contexto, resumir casos, redactar borradores y acelerar decisiones del equipo.",
    cta: "Ver capa de IA",
    href: "/features",
  },
  {
    icon: Wrench,
    color: "text-zs-cyan",
    industry: "Transformacion por etapas",
    description:
      "Empezamos por el cuello de botella mas caro y escalamos con evidencia hasta consolidar el Business OS completo.",
    cta: "Ver planes",
    href: "/pricing",
  },
];

export default function UseCasesPage() {
  return (
    <main className="relative bg-zs-bg-primary min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <header className="text-center mb-20 max-w-4xl mx-auto">
          <p className="text-zs-blue text-sm font-black uppercase tracking-[0.3em] mb-4">
            Casos de uso
          </p>
          <h1 className="text-2xl md:text-5xl font-black text-white tracking-tight uppercase italic leading-tight mb-6">
            Business OS para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet">
              equipos que quieren operar mejor
            </span>
          </h1>
          <p className="text-xl text-zs-text-secondary font-light leading-relaxed">
            Adaptamos el sistema a la realidad de su empresa: ventas,
            operaciones, servicio, backoffice y casos puntuales de IA.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <article
                key={uc.industry}
                className="p-8 rounded-2xl bg-zs-bg-secondary/40 border border-zs-border hover:border-zs-blue/30 transition-all group flex flex-col"
              >
                <Icon className={`w-10 h-10 ${uc.color} mb-6`} aria-hidden />
                <h2 className="text-xl font-bold text-white mb-3">
                  {uc.industry}
                </h2>
                <p className="text-zs-text-secondary font-light text-sm leading-relaxed flex-1 mb-6">
                  {uc.description}
                </p>
                <Link
                  href={uc.href}
                  className={`text-sm font-bold ${uc.color} hover:underline`}
                  aria-label={uc.cta}
                >
                  {uc.cta} →
                </Link>
              </article>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-zs-blue text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zs-blue/80 transition-all"
          >
            Hablar con un experto
          </Link>
        </div>
      </div>
    </main>
  );
}
