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
    <section className="py-32 relative z-10 px-4">
      <div className="container mx-auto">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-zs-bg-secondary to-black border border-zs-border overflow-hidden p-12 md:p-24 text-center flex flex-col items-center">
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

          <div className="w-20 h-20 rounded-2xl bg-zs-blue/10 flex items-center justify-center text-zs-blue mb-8 relative z-10">
            <Terminal className="w-10 h-10" />
          </div>

          <h2 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-8 relative z-10">
            Deja de{" "}
            <span className="text-zs-text-muted line-through">Configurar</span>
            <br />
            Empieza a{" "}
            <span className="text-zs-blue drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Construir
            </span>
          </h2>

          <p className="text-xl text-zs-text-secondary font-light max-w-2xl mx-auto mb-12 relative z-10">
            Únete a la nueva ola de ingenieros que eligen la potencia sobre la
            simplicidad aparente.
          </p>

          <div className="w-full max-w-2xl mx-auto mb-16 relative z-10">
            <TerminalFeedback />
          </div>

          <Link
            href="/gateway"
            className="zs-btn-brand px-16 py-6 rounded-2xl flex items-center justify-center gap-4 group relative overflow-hidden backdrop-blur-xl z-10 w-full sm:w-auto shadow-[0_0_40px_rgba(37,99,235,0.3)]"
          >
            <span className="relative text-lg font-black uppercase tracking-widest">
              Acceso Inmediato
            </span>
            <ChevronRight className="w-6 h-6 relative group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
