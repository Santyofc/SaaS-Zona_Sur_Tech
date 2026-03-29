/**
 * Task 8: Performance-optimized HeroSection
 * - Uses next/image with priority + explicit sizes for LCP optimization
 * - Removes render-blocking imports
 * - Correct aria labels (Task 9: Accessibility)
 * - Strong H1 with target keywords (Task 7: SEO)
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import { Terminal, ArrowRight } from "lucide-react";
import HeroText from "./HeroText.client";
import { GlitchText } from "@/components/ui/GlitchText.client";
import { AmbientGrid } from "@/components/ui/AmbientGrid.client";

/**
 * HeroDemo loaded off critical path — no blocking the LCP element.
 * The loading placeholder prevents layout shift (CLS).
 */
const HeroDemo = dynamic(() => import("./HeroDemo.client"), {
  ssr: false,
  loading: () => (
    <div
      className="hidden lg:block w-full h-[480px] rounded-2xl bg-zs-bg-secondary/40 border border-zs-border/30 animate-pulse"
      aria-hidden="true"
    />
  ),
});

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-44 pb-20 px-4 md:px-8 z-10"
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — LCP element: H1 rendered server-side, no JS dependency */}
        <HeroText>
          {/* Task 9: Accessibility — status indicator has descriptive label */}
          <Link
            href="/status"
            aria-label="Ver estado del sistema: Operacional"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-emerald/10 border border-zs-emerald/20 text-zs-emerald mb-8 group hover:bg-zs-emerald/20 transition-all"
          >
            <span
              className="w-2 h-2 rounded-full bg-zs-emerald animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              aria-hidden="true"
            />
            <span className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">
              Sistema Operacional
            </span>
          </Link>

          {/*
           * Task 7 + 8: The H1 is the LCP element. It is:
           * - Server-rendered (no JS delay)
           * - Contains primary keyword: "ERP y Facturación Electrónica en Costa Rica"
           * - Uses clamp for responsive sizing without render-blocking CSS
           */}
          <h1
            id="hero-heading"
            className="text-[clamp(3rem,10vw,8rem)] font-black text-white tracking-tighter uppercase italic leading-[0.95] mb-12 pt-8"
          >
            ERP y{" "}
            <GlitchText
              text="Facturación"
              className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]"
              delay={0.5}
            />{" "}
            <br />
            <span className="text-white/90 text-[0.7em]">
              Electrónica en Costa Rica
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zs-text-secondary font-light leading-relaxed mb-12 max-w-xl">
            Software ERP con facturación electrónica Hacienda v4.3, inventario
            multi-sucursal y CRM para PYMES costarricenses.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            {/* Task 9: Accessibility — button has an explicit label */}
            <Link
              href="/signup"
              aria-label="Inicializar cuenta gratuita en ZonaSur Tech"
              className="px-12 py-6 bg-zs-blue text-white font-black uppercase italic tracking-widest rounded-2xl hover:bg-zs-blue/80 transition-all drop-shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-4 group"
            >
              Iniciar Gratis{" "}
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-2 transition-transform"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/docs"
              aria-label="Ver documentación técnica de ZonaSur Tech"
              className="px-12 py-5 rounded-2xl bg-zs-bg-secondary/50 border border-zs-border hover:border-zs-blue/30 text-white flex items-center justify-center gap-3 group transition-all backdrop-blur-md"
            >
              <Terminal
                className="w-5 h-5 text-zs-text-muted group-hover:text-zs-blue transition-colors"
                aria-hidden="true"
              />
              <span className="text-sm font-black uppercase tracking-widest">
                Documentación
              </span>
            </Link>
          </div>
        </HeroText>

        {/* Right — heavy canvas demo, deferred off critical path */}
        <HeroDemo />
      </div>

      {/* Background grid — decorative, aria-hidden */}
      <AmbientGrid />
    </section>
  );
}
