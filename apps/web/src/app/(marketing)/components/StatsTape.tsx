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
    <div className="flex items-center gap-4 text-white shrink-0">
      <Icon className={`${color} w-5 h-5`} aria-hidden="true" />
      <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

export default function StatsTape() {
  return (
    <div
      aria-hidden="true"
      className="relative z-20 bg-zs-blue/10 border-y border-zs-blue/20 py-4 overflow-hidden flex items-center backdrop-blur-md"
    >
      {/*
       * Two identical rows animate together so the loop is seamless.
       * Animation defined in globals.css as: @keyframes marquee { to { transform: translateX(-50%) } }
       */}
      <div
        className="flex whitespace-nowrap items-center gap-16 px-8 animate-marquee"
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
