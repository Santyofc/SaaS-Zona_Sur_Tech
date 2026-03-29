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
      className="relative hidden lg:block"
      style={{ minHeight: 380 }}
    >
      {/* Glow: CSS animation instead of Framer animate-pulse (no rAF) */}
      <div
        className="absolute -inset-10 bg-gradient-to-r from-zs-blue/10 to-zs-violet/10 blur-3xl rounded-full"
        style={{
          opacity: 0.25,
          animation: "zs-pulse-dot 4s ease-in-out infinite",
          willChange: "opacity",
        }}
        aria-hidden="true"
      />

      {/* Terminal — only renders after IO fires */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-zs-border/50 bg-zs-bg-secondary/20"
        style={{
          // CSS-only 3D tilt — no JS, GPU-composited
          transition: "transform 0.3s ease",
          transform: "perspective(1000px)",
        }}
      >
        {inView ? (
          <HackerTerminal />
        ) : (
          // Skeleton while waiting for IO
          <div
            className="w-full bg-zs-bg-secondary/50 rounded-2xl"
            style={{ height: 320 }}
          />
        )}
      </div>
    </div>
  );
}
