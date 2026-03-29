/**
 * Home — Server Component (marketing landing page)
 *
 * This file is intentionally thin (~25 lines). Its only job is to compose
 * the section components in order.
 *
 * Architecture:
 *  page.tsx          ← Server Component (this file)
 *  ├── HeroSection   ← Server Component
 *  │   ├── HeroText.client    ← Client leaf (entry animation only)
 *  │   └── HeroDemo.client    ← Client (mascot + HackerTerminal, deferred)
 *  ├── StatsTape     ← Server Component (CSS marquee, zero JS)
 *  ├── FeaturesGrid  ← Server Component
 *  │   └── FeatureCardWrapper.client ← Client leaf (whileInView)
 *  ├── LiveEmulators.client ← Client (IO-guarded, useReducer, dynamic imports)
 *  └── CTASection    ← Server Component (TerminalFeedback deferred)
 */
import HeroSection from "./components/HeroSection";
import StatsTape from "./components/StatsTape";
import FeaturesGrid from "./components/FeaturesGrid";
import CTASection from "./components/CTASection";
import dynamic from "next/dynamic";

const LiveEmulators = dynamic(() => import("./components/LiveEmulators.client"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative bg-zs-bg-primary overflow-hidden font-mono selection:bg-zs-blue/30 selection:text-white">
      {/* Static background effects — pure CSS, no JS */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-zs-blue/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-zs-violet/5 rounded-full blur-[150px]" />
      </div>

      <HeroSection />
      <StatsTape />
      <FeaturesGrid />
      <LiveEmulators />
      <CTASection />
    </main>
  );
}
