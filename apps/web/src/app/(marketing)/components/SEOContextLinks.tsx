import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SEOContextLinks() {
  return (
    <section className="zs-section relative z-10 w-full overflow-hidden border-t border-zs-border/40 bg-zs-bg-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:gap-14">
          <div className="max-w-md">
            <h2 className="zs-heading-lg mb-4 italic">
              Como construimos su <span className="text-zs-blue">Business OS</span>
            </h2>
            <p className="zs-copy text-sm md:text-base">
              Partimos del trabajo real de su empresa: procesos, tareas,
              decisiones y fricciones. Desde ahi disenamos una operacion mas
              simple, automatizada e inteligente.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link 
              href="/features" 
              className="zs-card group flex h-full flex-col justify-between rounded-2xl border-zs-border p-6 transition-all hover:-translate-y-1 hover:border-zs-blue/50"
            >
              <div>
                <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-zs-blue">
                  Capacidades del sistema
                </h3>
                <p className="text-sm text-zs-text-secondary">
                  Procesos, automatizacion, IA y control operativo en una sola arquitectura.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <ChevronRight className="w-5 h-5 text-zs-text-muted group-hover:text-zs-blue group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link 
              href="/use-cases" 
              className="zs-card group flex h-full flex-col justify-between rounded-2xl border-zs-border p-6 transition-all hover:-translate-y-1 hover:border-zs-cyan/50"
            >
              <div>
                <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-zs-cyan">
                  Casos de uso reales
                </h3>
                <p className="text-sm text-zs-text-secondary">
                  Vea como aplicamos este enfoque en operaciones, servicio, backoffice y coordinacion interna.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <ChevronRight className="w-5 h-5 text-zs-text-muted group-hover:text-zs-cyan group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link 
              href="/pricing" 
              className="zs-card group flex h-full flex-col justify-between rounded-2xl border-zs-border p-6 transition-all hover:-translate-y-1 hover:border-zs-violet/50"
            >
              <div>
                <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-zs-violet">
                  Formas de trabajar juntos
                </h3>
                <p className="text-sm text-zs-text-secondary">
                  Desde un diagnostico inicial hasta una implementacion completa de su Business OS.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <ChevronRight className="w-5 h-5 text-zs-text-muted group-hover:text-zs-violet group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
