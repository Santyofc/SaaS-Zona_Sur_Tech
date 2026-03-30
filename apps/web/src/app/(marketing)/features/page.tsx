/**
 * Task 7: SEO content page — /features
 * Strong H1 targeting "ERP y Facturación Electrónica Costa Rica"
 * keyword cluster, rich semantic structure for indexing.
 */
import { Metadata } from "next";
import Link from "next/link";
import { Check, Zap, Shield, BarChart3, Globe, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Funcionalidades | ERP y Facturación Electrónica Costa Rica",
  description:
    "Descubra todas las funcionalidades del ERP ZonaSur Tech: facturación electrónica Hacienda v4.3, inventario multi-sucursal, CRM, marketplace y reportería avanzada para PYMES costarricenses.",
  alternates: {
    canonical: "https://zonasurtech.online/features",
  },
  openGraph: {
    title: "Funcionalidades | ZonaSur Tech ERP Costa Rica",
    description:
      "Facturación electrónica, inventario, CRM y más para PYMES en Costa Rica.",
    url: "https://zonasurtech.online/features",
  },
};

const features = [
  {
    icon: Zap,
    color: "text-zs-blue",
    borderColor: "border-zs-blue/30",
    title: "Facturación Electrónica Hacienda v4.3",
    description:
      "Emisión y recepción de comprobantes XML cumpliendo 100% con el Ministerio de Hacienda de Costa Rica. Tiquetes electrónicos, facturas de exportación y notas de crédito automatizadas.",
    bullets: [
      "Firma digital certificada",
      "Envío automático a Hacienda",
      "Recepción y validación XML",
      "Tiquetes punto de venta",
    ],
  },
  {
    icon: BarChart3,
    color: "text-zs-cyan",
    borderColor: "border-zs-cyan/30",
    title: "ERP Financiero para PYMES",
    description:
      "Control contable completo con cuentas por cobrar, cuentas por pagar, conciliación bancaria y reportes financieros adaptados a la normativa costarricense.",
    bullets: [
      "Cuentas por cobrar (CXC)",
      "Cuentas por pagar (CXP)",
      "Conciliación bancaria",
      "Estados financieros NIIF",
    ],
  },
  {
    icon: Globe,
    color: "text-zs-violet",
    borderColor: "border-zs-violet/30",
    title: "Inventario Multi-Sucursal",
    description:
      "Gestión de bodegas, control de lotes y fechas de vencimiento, códigos EAN/UPC, y catálogo CABYS integrado para cumplimiento con Hacienda.",
    bullets: [
      "Múltiples bodegas y sucursales",
      "Lotes y fechas de vencimiento",
      "Integración catálogo CABYS",
      "Alertas de stock mínimo",
    ],
  },
  {
    icon: Shield,
    color: "text-zs-emerald",
    borderColor: "border-zs-emerald/30",
    title: "CRM y Gestión de Clientes",
    description:
      "Historial completo de clientes, seguimiento de ventas B2B, envíos automáticos por correo electrónico y gestión de créditos.",
    bullets: [
      "Perfil completo del cliente",
      "Pipeline de ventas B2B",
      "Correos automáticos",
      "Gestión de créditos",
    ],
  },
  {
    icon: Cpu,
    color: "text-zs-blue",
    borderColor: "border-zs-blue/30",
    title: "Marketplace B2B en Costa Rica",
    description:
      "Plataforma de ventas B2B donde sus clientes empresariales pueden hacer pedidos directamente, ver catálogos de precios personalizados y gestionar sus compras.",
    bullets: [
      "Catálogos de precios por cliente",
      "Pedidos en línea B2B",
      "Integración con facturación",
      "Panel del cliente",
    ],
  },
  {
    icon: BarChart3,
    color: "text-zs-cyan",
    borderColor: "border-zs-cyan/30",
    title: "Reportería y BI",
    description:
      "Dashboards en tiempo real con métricas clave del negocio: ventas, márgenes, rotación de inventario y análisis de clientes.",
    bullets: [
      "Dashboard en tiempo real",
      "Reportes de ventas",
      "Análisis de inventario",
      "Exportación a Excel/PDF",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="relative bg-zs-bg-primary min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">

        {/* Task 9: Correct heading hierarchy — single H1 */}
        <header className="text-center mb-20 max-w-4xl mx-auto">
          <p className="text-zs-blue text-sm font-black uppercase tracking-[0.3em] mb-4">
            Plataforma Completa
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic leading-tight mb-6">
            ERP y Facturación Electrónica{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet">
              para Costa Rica
            </span>
          </h1>
          <p className="text-xl text-zs-text-secondary font-light leading-relaxed">
            Todo lo que una PYME costarricense necesita en una sola plataforma:
            facturación electrónica Hacienda, inventario multi-sucursal, CRM y
            reportería financiera.
          </p>
        </header>

        {/* Feature Grid */}
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

        {/* Internal linking for SEO */}
        <nav
          className="text-center"
          aria-label="Páginas relacionadas"
        >
          <p className="text-zs-text-secondary mb-6">
            Explore más sobre nuestras soluciones
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/facturacion-electronica-costa-rica"
              className="px-6 py-3 rounded-xl bg-zs-blue/10 border border-zs-blue/30 text-zs-blue text-sm font-bold hover:bg-zs-blue/20 transition-all"
            >
              Facturación Electrónica
            </Link>
            <Link
              href="/software-para-pymes-costa-rica"
              className="px-6 py-3 rounded-xl bg-zs-cyan/10 border border-zs-cyan/30 text-zs-cyan text-sm font-bold hover:bg-zs-cyan/20 transition-all"
            >
              Software PYMES
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-zs-violet/10 border border-zs-violet/30 text-zs-violet text-sm font-bold hover:bg-zs-violet/20 transition-all"
            >
              Ver Precios
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
