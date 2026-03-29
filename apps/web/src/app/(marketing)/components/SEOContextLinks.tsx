import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SEOContextLinks() {
  return (
    <section className="bg-zs-bg-secondary/20 py-24 border-t border-zs-border/40 relative z-10 w-full overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-12 justify-between">
          <div className="max-w-md">
            <h2 className="text-3xl font-black text-white italic tracking-tight mb-4 uppercase">
              El Ecosistema Cloud <span className="text-zs-blue">Comercial</span>
            </h2>
            <p className="text-zs-text-secondary leading-relaxed font-light">
              Nuestra arquitectura modula todas las capas de su negocio bajo una única infraestructura técnica consolidada diseñada en Costa Rica.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/facturacion-electronica-costa-rica" 
              className="group p-6 rounded-2xl bg-zs-bg-primary/50 border border-zs-border hover:border-zs-blue/50 transition-all flex flex-col justify-between h-full hover:-translate-y-1 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.1)]"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zs-blue transition-colors">
                  Software de facturación electrónica en Costa Rica
                </h3>
                <p className="text-sm text-zs-text-secondary font-light">
                  Cumplimiento 100% automático con Hacienda (Versión 4.3). Tiquetes y conectividad inmediata.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <ChevronRight className="w-5 h-5 text-zs-text-muted group-hover:text-zs-blue group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link 
              href="/software-para-pymes-costa-rica" 
              className="group p-6 rounded-2xl bg-zs-bg-primary/50 border border-zs-border hover:border-zs-cyan/50 transition-all flex flex-col justify-between h-full hover:-translate-y-1 shadow-[0_10px_30px_-15px_rgba(34,211,238,0.1)]"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zs-cyan transition-colors">
                  Software cloud para PYMES en Costa Rica
                </h3>
                <p className="text-sm text-zs-text-secondary font-light">
                  Controle ventas B2B, gestione cuentas por cobrar (CXC) y automatice envíos con correos.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <ChevronRight className="w-5 h-5 text-zs-text-muted group-hover:text-zs-cyan group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link 
              href="/sistema-inventario-costa-rica" 
              className="group p-6 rounded-2xl bg-zs-bg-primary/50 border border-zs-border hover:border-zs-violet/50 transition-all flex flex-col justify-between h-full hover:-translate-y-1 shadow-[0_10px_30px_-15px_rgba(139,92,246,0.1)]"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zs-violet transition-colors">
                  Sistema de Bodegas e Inventario Costa Rica
                </h3>
                <p className="text-sm text-zs-text-secondary font-light">
                  Control multi-sucursal, lotes de vencimiento, códigos EAN y manejo maestro de costos Cabys.
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
