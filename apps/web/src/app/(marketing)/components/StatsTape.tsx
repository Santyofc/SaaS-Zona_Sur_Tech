/**
 * StatsTape — Server Component
 *
 * Replaced Framer Motion `animate={{ x: [0, -1000] }}` with a pure-CSS
 * `@keyframes marquee` defined in globals.css. Zero JS on the client.
 * The content is duplicated in markup (×2) so the loop is seamless.
 */
import { Activity, Globe, Shield, Zap } from "lucide-react";

const STATS = [
  { icon: Activity, color: "text-zs-blue", label: "Procesos visibles de punta a punta" },
  { icon: Globe, color: "text-zs-cyan", label: "Automatización conectada entre áreas" },
  { icon: Shield, color: "text-zs-emerald", label: "Gobernanza y trazabilidad operativa" },
  { icon: Zap, color: "text-zs-violet", label: "IA aplicada al trabajo real" },
] as const;

function StatItem({ icon: Icon, color, label }: (typeof STATS)[number]) {
  return (
    <div className="flex shrink-0 items-center gap-3 text-white sm:gap-4">
      <Icon className={`${color} h-4 w-4 sm:h-5 sm:w-5`} aria-hidden="true" />
      <span className="text-[10px] font-black uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

export default function StatsTape() {
  return (
    <div
      aria-hidden="true"
      className="relative z-20 flex items-center overflow-hidden border-y border-zs-blue/20 bg-zs-blue/10 py-3 backdrop-blur-md sm:py-4"
    >
      {/*
       * Two identical rows animate together so the loop is seamless.
       * Animation defined in globals.css as: @keyframes marquee { to { transform: translateX(-50%) } }
       */}
      <div
        className="animate-marquee flex items-center gap-10 whitespace-nowrap px-6 sm:gap-16 sm:px-8"
        style={{ willChange: "transform" }}
      >
        {/* Row 1 */}
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
        {/* Row 2 — duplicate for seamless loop */}
        {STATS.map((s) => (
          <StatItem key={`${s.label}-dup`} {...s} />
        ))}
      </div>
    </div>
  );
}
