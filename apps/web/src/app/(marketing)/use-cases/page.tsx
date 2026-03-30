/**
 * Task 7: SEO content page — /use-cases
 * Targets "casos de uso ERP Costa Rica" keyword cluster.
 */
import { Metadata } from "next";
import Link from "next/link";
import { Building2, ShoppingCart, Utensils, Truck, Stethoscope, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Casos de Uso | ERP para Industrias en Costa Rica | ZonaSur Tech",
  description:
    "ZonaSur Tech se adapta a comercios, restaurantes, distribuidoras, clínicas y más. ERP con facturación electrónica Hacienda para cualquier industria en Costa Rica.",
  alternates: {
    canonical: "https://zonasurtech.online/use-cases",
  },
  openGraph: {
    title: "Casos de Uso | ERP Costa Rica | ZonaSur Tech",
    description:
      "Software ERP adaptado a cada industria costarricense con facturación electrónica Hacienda.",
    url: "https://zonasurtech.online/use-cases",
  },
};

const useCases = [
  {
    icon: ShoppingCart,
    color: "text-zs-blue",
    industry: "Comercio Minorista",
    description:
      "Supermercados, tiendas y puntos de venta. Facturación electrónica en segundos, inventario multi-sucursal y reportes de ventas diarios.",
    cta: "Ver solución para comercios",
    href: "/software-para-pymes-costa-rica",
  },
  {
    icon: Truck,
    color: "text-zs-cyan",
    industry: "Distribuidoras y Mayoristas",
    description:
      "Control de rutas, pedidos B2B, crédito a clientes y facturación masiva. Integración con catálogo CABYS para Hacienda.",
    cta: "Ver solución para distribuidoras",
    href: "/software-para-pymes-costa-rica",
  },
  {
    icon: Utensils,
    color: "text-zs-violet",
    industry: "Restaurantes y Cafeterías",
    description:
      "Tiquetes POS instantáneos, control de insumos, recetas digitales y cierre de caja. Compatible con impresoras fiscales.",
    cta: "Ver solución para restaurantes",
    href: "/features",
  },
  {
    icon: Building2,
    color: "text-zs-emerald",
    industry: "PYMES y Servicios Profesionales",
    description:
      "Facturas de servicios electrónicas, control de proyectos, gestión de clientes y cobros automatizados por correo.",
    cta: "Ver solución para servicios",
    href: "/facturacion-electronica-costa-rica",
  },
  {
    icon: Stethoscope,
    color: "text-zs-blue",
    industry: "Clínicas y Salud",
    description:
      "Facturación electrónica a CCSS, gestión de citas, control de insumos médicos y historial de pacientes.",
    cta: "Ver solución para salud",
    href: "/features",
  },
  {
    icon: Wrench,
    color: "text-zs-cyan",
    industry: "Talleres y Manufactura",
    description:
      "Órdenes de trabajo, control de materiales, facturación de servicios y seguimiento de garantías.",
    cta: "Ver solución para manufactura",
    href: "/sistema-inventario-costa-rica",
  },
];

export default function UseCasesPage() {
  return (
    <main className="relative bg-zs-bg-primary min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">

        <header className="text-center mb-20 max-w-4xl mx-auto">
          <p className="text-zs-blue text-sm font-black uppercase tracking-[0.3em] mb-4">
            Casos de Uso
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic leading-tight mb-6">
            ERP para Cualquier{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet">
              Industria en Costa Rica
            </span>
          </h1>
          <p className="text-xl text-zs-text-secondary font-light leading-relaxed">
            Desde comercios hasta clínicas. ZonaSur Tech se adapta a su industria
            con facturación electrónica Hacienda y ERP completo.
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
                <Icon
                  className={`w-10 h-10 ${uc.color} mb-6`}
                  aria-hidden
                />
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
