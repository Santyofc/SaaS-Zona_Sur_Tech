import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Shield, Wrench } from "lucide-react";

const items = [
  {
    title: "Disponibilidad del sitio",
    description:
      "Monitoreamos formularios, rutas publicas y puntos criticos visibles para usuarios para detectar fallos rapidamente.",
    icon: CheckCircle2,
  },
  {
    title: "Cambios controlados",
    description:
      "Las actualizaciones de contenido, automatizaciones o integraciones se revisan antes de publicarse y se implementan por etapas.",
    icon: Wrench,
  },
  {
    title: "Seguridad operativa",
    description:
      "Aplicamos buenas practicas de acceso, despliegue y configuracion para reducir riesgo sin agregar friccion innecesaria.",
    icon: Shield,
  },
];

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-zs-bg-primary pt-32 pb-24 px-4 md:px-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-zs-blue) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto relative z-10 max-w-5xl">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-emerald/10 border border-zs-emerald/20 text-zs-emerald mb-8">
            <Clock3 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Estado operativo y mantenimiento
            </span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.9] mb-6">
            Estado del
            <br />
            servicio
          </h1>

          <p className="text-lg text-zs-text-secondary leading-relaxed max-w-2xl">
            Esta pagina resume de forma simple como cuidamos la operacion del sitio.
            No publicamos telemetria simulada: si hay una incidencia relevante, la
            comunicamos directamente a los clientes afectados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="zs-card p-8 bg-zs-bg-secondary/40 border-zs-border"
              >
                <div className="w-12 h-12 rounded-xl bg-zs-blue/10 flex items-center justify-center text-zs-blue mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-3">
                  {item.title}
                </h2>
                <p className="text-sm text-zs-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="zs-card p-8 md:p-10 bg-black/40 border-zs-border max-w-3xl">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">
            Necesitas confirmar algo puntual?
          </h2>
          <p className="text-zs-text-secondary leading-relaxed mb-8">
            Si eres cliente o estas evaluando trabajar con nosotros, podemos
            compartir el contexto operativo relevante de tu proyecto, integracion
            o despliegue.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-zs-blue text-white rounded-2xl font-black uppercase tracking-widest"
          >
            Contactar al equipo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
