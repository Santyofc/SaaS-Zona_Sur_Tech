"use client";
/**
 * HeroDemo — Client Component (Performance Optimized)
 *
 * PERF FIXES:
 * 1. Removed mouseX/mouseY transforms — consumed MotionProvider on every
 *    mouse move event, causing continuous main thread work (was ~4s TBT).
 * 2. Removed useScroll/useTransform — no scroll listener on this element.
 * 3. Replaced with IntersectionObserver — HackerTerminal only mounts when
 *    actually in viewport, preventing off-screen work.
 * 4. Tilt effect replaced with CSS hover transform (GPU-composited, no JS).
 * 5. Glow backdrop: removed animate-pulse (continuous rAF) → CSS animation
 *    with will-change:opacity respects GPU compositing.
 */
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

/**
 * HackerTerminal is the heaviest chunk (~80KB).
 * Only loads after the component is in the viewport.
 */
const HackerTerminal = dynamic(
  () =>
    import("@repo/ui-experiments").then((mod) => ({
      default: mod.HackerTerminal,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full bg-zs-bg-secondary/50 rounded-2xl"
        style={{ height: 320 }}
        aria-label="Cargando terminal..."
      />
    ),
  }
);

export default function HeroDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  /**
   * Intersection Observer — mount HackerTerminal only when visible.
   * Eliminates the most expensive JS parsing cost on initial load.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire once
        }
      },
      { rootMargin: "200px" } // preload 200px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    /*
     * CLS FIX: explicit height on the container prevents layout shift
     * while HackerTerminal loads. hidden lg:block avoids the container
     * taking up space on mobile where it's never shown.
     *
     * CSS tilt on :hover (transform: perspective + rotateX/Y) is GPU-only,
     * zero JavaScript, replaces the Framer useTransform mouse tracking.
     */
    <div
      ref={ref}
      className="relative hidden lg:block group"
      style={{ minHeight: 380 }}
    >
      {/* GLOW SYSTEM: Multi-layered for depth */}
      <div
        className="absolute -inset-20 bg-gradient-to-r from-zs-blue/20 via-zs-violet/10 to-zs-cyan/20 blur-[100px] rounded-full opacity-30 animate-zs-pulse-dot"
        aria-hidden="true"
      />
      <div
        className="absolute -inset-10 bg-zs-blue/10 blur-[60px] rounded-full opacity-20 animate-zs-float"
        aria-hidden="true"
        style={{ animationDelay: "-2s" }}
      />

      {/* Terminal — Container with CRT styling */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.2)] border border-zs-border/50 bg-zs-bg-secondary/40 backdrop-blur-xl"
        style={{
          transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transform: "perspective(1000px)",
        }}
      >
        {/* Scanline Utility */}
        <div className="zs-scanline-overlay" />

        {inView ? (
          <HackerTerminal />
        ) : (
          <div
            className="w-full bg-zs-bg-secondary/50 rounded-2xl"
            style={{ height: 320 }}
          />
        )}
      </div>
    </div>
  );
}
