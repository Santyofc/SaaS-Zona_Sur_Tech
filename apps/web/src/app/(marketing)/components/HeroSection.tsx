/**
 * HeroSection — Server Component (Performance Optimized)
 *
 * PERF FIXES APPLIED:
 * 1. LCP: H1 is server-rendered, with no client-side text animation.
 * 2. Decorative background effects are kept out of the critical path.
 * 3. HeroDemo is deferred via dynamic(ssr:false) — zero impact on initial paint.
 * 4. No above-the-fold blur filters or heavy backdrop-blur on the H1.
 * 5. CTA buttons have explicit min-width to prevent CLS on hydration.
 * 6. Status pill now points to a lightweight marketing page.
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import { Terminal, ArrowRight } from "lucide-react";

/**
 * HeroDemo: heavy canvas + Three.js — always deferred.
 * The skeleton placeholder has explicit height to avoid CLS.
 */
const HeroDemo = dynamic(() => import("./HeroDemo.client"), {
  ssr: false,
  loading: () => (
    // PERF: explicit dimensions prevent layout shift while JS loads
    <div
      className="hidden lg:flex w-full h-[480px] rounded-2xl bg-zs-bg-secondary/40 border border-zs-border/30 items-center justify-center"
      style={{ minHeight: 480 }}
      aria-hidden="true"
    >
      <div className="w-8 h-8 border-2 border-zs-blue/30 border-t-zs-blue rounded-full animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  return (
    <section
      className="zs-section relative z-10 flex min-h-[92vh] items-center pt-40 md:pt-44"
      aria-labelledby="hero-heading"
    >
      {/* 
        CLS FIX: Reserve the two-column grid space immediately.
        lg:grid-cols-2 with items-center prevents any layout shift
        when HeroDemo hydrates on the right column.
      */}
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/*
          LCP ELEMENT: Left column text.
          This column is now fully server-rendered to avoid delaying the
          mobile LCP behind client-side text animation.
        */}
        <div className="flex flex-col items-start">
          {/* Status pill — lightweight link, no API call on paint */}
          <Link
            href="/features"
            aria-label="Ver capacidades del Business OS"
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-zs-emerald/30 bg-zs-emerald/10 px-4 py-2 text-zs-emerald transition-all hover:scale-105 hover:bg-zs-emerald/20 hover:shadow-zs-glow-emerald/20"
            // CLS FIX: explicit height prevents shift when animation plays
            style={{ height: 36 }}
          >
            <span
              className="w-2 h-2 rounded-full bg-zs-emerald animate-pulse shadow-zs-glow-emerald"
              aria-hidden="true"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Business OS en operación
            </span>
          </Link>

          {/*
            LCP FIX: H1 is the LCP candidate.
            - No opacity:0 initial state (rendered visible from server)
            - No filter:blur on this element
            - clamp() instead of viewport-relative font to prevent reflow
            - Static gradient span keeps the hero server-first for mobile LCP
          */}
          <h1 id="hero-heading" className="zs-heading-xl mb-10 pt-6 italic md:pt-8">
            Impulsando su{" "}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet animate-zs-glitch-slow">
              Business OS
            </span>{" "}
            <br />
            <span
              className="mt-3 block text-zs-text-muted/80"
              style={{ fontSize: "0.45em", letterSpacing: "0.1em" }}
            >
              Control, Automatización e IA
            </span>
          </h1>

          <p className="zs-copy mb-10 max-w-xl md:mb-12">
            Ayudamos a empresas en Costa Rica a ordenar procesos, automatizar
            tareas e implementar IA. Diseñamos su Business OS para operar con
            más control y menos fricción.
          </p>

          {/*
            CLS FIX: Buttons must have explicit dimensions so they don't
            shift the layout when the client-side Link hover styles hydrate.
            flex-shrink-0 + explicit padding keeps dimensions stable.
          */}
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-6">
            <Link
              href="/contact"
              aria-label="Solicitar diagnóstico operativo"
              className="zs-btn group min-h-16 rounded-2xl px-8 py-5 text-center italic sm:px-10"
              style={{ minWidth: 200, minHeight: 64 }}
            >
              Diagnóstico inicial{" "}
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/features"
              aria-label="Ver capacidades del Business OS"
              className="zs-btn-ghost min-h-16 rounded-2xl border-zs-border/80 px-8 py-5 text-center sm:px-10"
              style={{ minWidth: 200, minHeight: 64 }}
            >
              <Terminal
                className="w-5 h-5 text-zs-text-muted"
                aria-hidden="true"
              />
              <span className="text-sm font-black uppercase tracking-widest">
                Capacidades
              </span>
            </Link>
          </div>
        </div>

        {/* Right — heavy canvas demo, fully deferred */}
        <div className="relative z-20 mx-auto w-full max-w-[680px] translate-y-4 animate-zs-float lg:translate-y-8 xl:translate-x-12">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
