/**
 * HeroSection — Server Component
 *
 * Static shell: h1, description, CTA buttons.
 * HeroText wraps the entry animation (client leaf).
 * HeroDemo loads the heavy canvas/Three bits off the critical path.
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import { Terminal } from "lucide-react";
import { ArrowRight } from "lucide-react";
import HeroText from "./HeroText.client";
import { GlitchText } from "@/components/ui/GlitchText.client";
import { AmbientGrid } from "@/components/ui/AmbientGrid.client";

const HeroDemo = dynamic(() => import("./HeroDemo.client"), {
  ssr: false,
  loading: () => (
    <div className="hidden lg:block w-full h-[480px] rounded-2xl bg-zs-bg-secondary/40 border border-zs-border/30 animate-pulse" />
  ),
});

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-44 pb-20 px-4 md:px-8 z-10">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — static copy + animated entry (client leaf) */}
        <HeroText>
          <Link href="/api/health" target="_blank" className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-emerald/10 border border-zs-emerald/20 text-zs-emerald mb-8 group hover:bg-zs-emerald/20 transition-all">
            <span className="w-2 h-2 rounded-full bg-zs-emerald animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">
              System Status: Operational
            </span>
          </Link>

          <h1 className="text-[clamp(3.5rem,12vw,10rem)] font-black text-white tracking-tighter uppercase italic leading-[0.95] mb-12 pt-8">
            El Nuevo <br />
            <GlitchText
              text="Estándar"
              className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]"
              delay={0.5}
            />
          </h1>

          <p className="text-xl md:text-2xl text-zs-text-secondary font-light leading-relaxed mb-12 max-w-xl">
            Infraestructura de Grado Industrial para desarrolladores que no
            aceptan compromisos. Construye más rápido. Escala infinito.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <button className="px-12 py-6 bg-zs-blue text-white font-black uppercase italic tracking-widest rounded-2xl hover:bg-zs-blue/80 transition-all drop-shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-4 group">
              Inicializar{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <Link
              href="/docs"
              className="px-12 py-5 rounded-2xl bg-zs-bg-secondary/50 border border-zs-border hover:border-zs-blue/30 text-white flex items-center justify-center gap-3 group transition-all backdrop-blur-md"
            >
              <Terminal className="w-5 h-5 text-zs-text-muted group-hover:text-zs-blue transition-colors" />
              <span className="text-sm font-black uppercase tracking-widest">
                Documentación
              </span>
            </Link>
          </div>
        </HeroText>

        {/* Right — heavy canvas demo, deferred off critical path */}
        <HeroDemo />

      </div>
      <AmbientGrid />
    </section>
  );
}
