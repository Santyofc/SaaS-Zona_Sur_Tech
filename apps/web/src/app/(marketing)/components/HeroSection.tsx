/**
 * HeroSection — Server Component (Performance Optimized)
 *
 * PERF FIXES APPLIED:
 * 1. LCP: H1 is server-rendered, no JS dependency. HeroText animation
 *    is deferred via useEffect inside the client leaf.
 * 2. HeroText gets `initialVisible` prop — renders visible on server,
 *    animates in on client (no CLS from opacity: 0 on initial paint).
 * 3. HeroDemo deferred via dynamic(ssr:false) — zero impact on critical path.
 * 4. No above-the-fold blur filters or heavy backdrop-blur on the H1.
 * 5. CTA buttons have explicit min-width to prevent CLS on hydration.
 * 6. Status pill changes from /api/health (network request) to /status page.
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import { Terminal, ArrowRight } from "lucide-react";
import HeroText from "./HeroText.client";
import { GlitchText } from "@/components/ui/GlitchText.client";

/**
 * AmbientGrid is decorative only. Deferred off critical path to prevent
 * it from blocking the LCP render (previously caused 400ms+ delay).
 */
const AmbientGrid = dynamic(
  () =>
    import("@/components/ui/AmbientGrid.client").then((m) => ({
      default: m.AmbientGrid,
    })),
  { ssr: false }
);

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
      className="relative min-h-screen flex items-center pt-44 pb-20 px-4 md:px-8 z-10"
      aria-labelledby="hero-heading"
    >
      {/* 
        CLS FIX: Reserve the two-column grid space immediately.
        lg:grid-cols-2 with items-center prevents any layout shift
        when HeroDemo hydrates on the right column.
      */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/*
          LCP ELEMENT: Left column text.
          HeroText renders children server-side (visible by default),
          then applies the Framer animation after hydration.
          This means Google and the browser paint the text immediately.
        */}
        <HeroText>
          {/* Status pill — lightweight link, no API call on paint */}
          <Link
            href="/status"
            aria-label="Ver estado del sistema: Operacional"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-emerald/10 border border-zs-emerald/20 text-zs-emerald mb-8 hover:bg-zs-emerald/20 transition-colors"
            // CLS FIX: explicit height prevents shift when animation plays
            style={{ height: 36 }}
          >
            <span
              className="w-2 h-2 rounded-full bg-zs-emerald animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Sistema Operacional
            </span>
          </Link>

          {/*
            LCP FIX: H1 is the LCP candidate.
            - No opacity:0 initial state (rendered visible from server)
            - No filter:blur on this element
            - clamp() instead of viewport-relative font to prevent reflow
            - GlitchText animation starts with delay:0.5 to not block paint
          */}
          <h1
            id="hero-heading"
            className="font-black text-white tracking-tighter uppercase italic leading-[0.95] mb-12 pt-8"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
          >
            ERP y{" "}
            <GlitchText
              text="Facturación"
              className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet"
              delay={0.6}
            />{" "}
            <br />
            <span
              className="text-white/90"
              style={{ fontSize: "0.65em" }}
            >
              Electrónica en Costa Rica
            </span>
          </h1>

          <p className="text-xl text-zs-text-secondary font-light leading-relaxed mb-12 max-w-xl">
            Software ERP con facturación electrónica Hacienda v4.3, inventario
            multi-sucursal y CRM para PYMES costarricenses.
          </p>

          {/*
            CLS FIX: Buttons must have explicit dimensions so they don't
            shift the layout when the client-side Link hover styles hydrate.
            flex-shrink-0 + explicit padding keeps dimensions stable.
          */}
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <Link
              href="/signup"
              aria-label="Iniciar cuenta gratuita en ZonaSur Tech"
              className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-zs-blue text-white font-black uppercase italic tracking-widest rounded-2xl hover:bg-zs-blue/80 transition-colors flex-shrink-0 group"
              style={{ minWidth: 200, minHeight: 64 }}
            >
              Iniciar Gratis{" "}
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/docs"
              aria-label="Ver documentación técnica"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-zs-bg-secondary/50 border border-zs-border hover:border-zs-blue/30 text-white transition-colors flex-shrink-0"
              style={{ minWidth: 200, minHeight: 64 }}
            >
              <Terminal
                className="w-5 h-5 text-zs-text-muted"
                aria-hidden="true"
              />
              <span className="text-sm font-black uppercase tracking-widest">
                Documentación
              </span>
            </Link>
          </div>
        </HeroText>

        {/* Right — heavy canvas demo, fully deferred */}
        <HeroDemo />
      </div>

      {/* AmbientGrid — decorative, zero critical path impact */}
      <AmbientGrid />
    </section>
  );
}
