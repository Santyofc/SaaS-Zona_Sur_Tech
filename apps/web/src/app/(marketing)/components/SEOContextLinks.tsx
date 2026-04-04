import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SEOContextLinks() {
  return (
    <section className="bg-zs-bg-secondary/20 py-24 border-t border-zs-border/40 relative z-10 w-full overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-12 justify-between">
          <div className="max-w-md">
            <h2 className="text-3xl font-black text-white italic tracking-tight mb-4 uppercase">
              Como construimos su <span className="text-zs-blue">Business OS</span>
            </h2>
            <p className="text-zs-text-secondary leading-relaxed font-light">
              Partimos del trabajo real de su empresa: procesos, tareas,
              decisiones y fricciones. Desde ahi disenamos una operacion mas
              simple, automatizada e inteligente.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/features" 
              className="group p-6 rounded-2xl bg-zs-bg-primary/50 border border-zs-border hover:border-zs-blue/50 transition-all flex flex-col justify-between h-full hover:-translate-y-1 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.1)]"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zs-blue transition-colors">
                  Capacidades del sistema
                </h3>
                <p className="text-sm text-zs-text-secondary font-light">
                  Procesos, automatizacion, IA y control operativo en una sola arquitectura.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <ChevronRight className="w-5 h-5 text-zs-text-muted group-hover:text-zs-blue group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link 
              href="/use-cases" 
              className="group p-6 rounded-2xl bg-zs-bg-primary/50 border border-zs-border hover:border-zs-cyan/50 transition-all flex flex-col justify-between h-full hover:-translate-y-1 shadow-[0_10px_30px_-15px_rgba(34,211,238,0.1)]"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zs-cyan transition-colors">
                  Casos de uso reales
                </h3>
                <p className="text-sm text-zs-text-secondary font-light">
                  Vea como aplicamos este enfoque en operaciones, servicio, backoffice y coordinacion interna.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <ChevronRight className="w-5 h-5 text-zs-text-muted group-hover:text-zs-cyan group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link 
              href="/pricing" 
              className="group p-6 rounded-2xl bg-zs-bg-primary/50 border border-zs-border hover:border-zs-violet/50 transition-all flex flex-col justify-between h-full hover:-translate-y-1 shadow-[0_10px_30px_-15px_rgba(139,92,246,0.1)]"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zs-violet transition-colors">
                  Formas de trabajar juntos
                </h3>
                <p className="text-sm text-zs-text-secondary font-light">
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
