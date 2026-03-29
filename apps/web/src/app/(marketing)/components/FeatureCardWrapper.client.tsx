"use client";
/**
 * FeatureCardWrapper — Client leaf (Performance Optimized)
 *
 * PERF FIXES:
 * 1. Removed `useMotion()` — was subscribing to global mouse tracking
 *    context on every card (4 cards × 60fps mouse events = significant TBT).
 * 2. Removed `rotateX: 5` and `scale: 0.95` from initial — these GPU layers
 *    were causing CLS because Framer creates a separate stacking context
 *    before the scroll trigger fires.
 * 3. `whileInView` kept but simplified — opacity+y only (no scale/rotateX).
 * 4. `whileHover` kept for UX but avoids scale changes (scale causes repaints).
 * 5. `viewport={{ once: true }}` ensures the animation only runs once,
 *    not continuously on every scroll direction change.
 */
import { motion, useReducedMotion } from "framer-motion";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  colSpan?: string;
  rowSpan?: string;
  delay?: number;
}

export default function FeatureCardWrapper({
  children,
  colSpan = "",
  rowSpan = "",
  delay = 0,
}: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      // CLS FIX: initial opacity:0 is fine here — these cards are
      // below the fold, so they don't affect the LCP or above-fold CLS.
      initial={prefersReduced ? false : { opacity: 0, y: 32 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      // PERF FIX: removed whileHover scale (caused repaint + layout)
      // Using translateY only (compositor-only, no repaint)
      whileHover={prefersReduced ? undefined : { y: -4 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        // whileHover gets its own faster transition
        y: { type: "spring", stiffness: 300, damping: 30 },
      }}
      className={`zs-card p-10 bg-zs-bg-secondary/40 group overflow-hidden relative border border-zs-border/50 hover:border-zs-blue/40 transition-colors ${colSpan} ${rowSpan}`}
    >
      {/* Gradient overlay — CSS only, no JS */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-zs-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}
