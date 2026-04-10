/**
 * CTASection — Server Component
 *
 * The final call-to-action block.
 * Changes from the original:
 * - External bg-url-camo.github image removed → replaced
 *   with a pure CSS gradient (no unoptimized external image request)
 * - TerminalFeedback lazy-loaded via dynamic() to keep it off the critical path
 */
import Link from "next/link";
import { Terminal, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const TerminalFeedback = dynamic(
  () =>
    import("../../../components/Contact/TerminalFeedback").then((m) => ({
      default: m.TerminalFeedback,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-24 w-full rounded-xl bg-zs-bg-secondary/50 animate-pulse" />
    ),
  }
);

export default function CTASection() {
  return (
    <section className="zs-section">
      <div className="container mx-auto">
        <div className="relative flex flex-col items-center overflow-hidden rounded-[2rem] border border-zs-border bg-gradient-to-br from-zs-bg-secondary to-black p-8 text-center md:rounded-[3rem] md:p-16 lg:p-24">
          {/*
           * Replaced the raw external bg-url-github with a CSS gradient.
           * Benefits: no external request, no unoptimized image, no blocked LCP.
           */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 50% 0%, var(--color-zs-blue) 0%, transparent 70%), radial-gradient(ellipse at 80% 100%, var(--color-zs-violet) 0%, transparent 60%)",
            }}
          />

          <div className="zs-panel-soft relative z-10 mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border-zs-blue/20 bg-zs-blue/10 text-zs-blue">
            <Terminal className="w-10 h-10" />
          </div>

          <h2 className="zs-heading-lg relative z-10 mb-8 italic">
            Deja de{" "}
            <span className="text-zs-text-muted line-through">improvisar</span>
            <br />
            Empieza a{" "}
            <span className="text-zs-blue drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              operar con sistema
            </span>
          </h2>

          <p className="zs-copy relative z-10 mx-auto mb-12 max-w-2xl">
            Disenamos junto a su equipo la estructura, automatizaciones y capa
            de IA que necesita para trabajar con menos friccion.
          </p>

          <div className="relative z-10 mx-auto mb-12 w-full max-w-2xl md:mb-16">
            <TerminalFeedback />
          </div>

          <Link
            href="/contact"
            className="zs-btn-brand group relative z-10 flex min-h-16 w-full items-center justify-center gap-4 overflow-hidden rounded-2xl px-8 py-5 text-center backdrop-blur-xl shadow-[0_0_40px_rgba(37,99,235,0.3)] sm:w-auto sm:px-14 sm:py-6"
          >
            <span className="relative text-base font-black uppercase tracking-[0.16em] sm:text-lg">
              Agendar conversacion
            </span>
            <ChevronRight className="w-6 h-6 relative group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
