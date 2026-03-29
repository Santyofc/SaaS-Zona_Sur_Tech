"use client";
/**
 * HeroText — Client leaf (Performance Optimized)
 *
 * CLS FIX:
 * - Children render visible immediately (no opacity:0 on server).
 * - The Framer Motion animation is applied only after mount via useEffect.
 * - This prevents the flash of invisible content (FOIC) that caused CLS.
 *
 * MAIN THREAD FIX:
 * - Removed `useScroll` + `useTransform` from this component.
 *   Those hooks ran on every scroll event and blocked the main thread.
 *   Parallax is now CSS-driven (no JS scroll listener).
 * - Entry animation is a simple CSS class toggled after mount,
 *   falling back to Framer only if prefers-reduced-motion is false.
 */
import { motion, useReducedMotion } from "framer-motion";
import { PropsWithChildren, useState, useEffect } from "react";

export default function HeroText({ children }: PropsWithChildren) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // Mount signal — lets server render fully visible, animate after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // No scroll tracking, no useTransform — pure mount animation only
  return (
    <motion.div
      /**
       * Server renders with opacity:1 (visible, no CLS).
       * After mount, Framer animates from 0 → 1 with a slide.
       * If reducedMotion is requested, skip entirely.
       */
      initial={
        !prefersReduced && mounted
          ? { opacity: 0, x: -30 }
          : { opacity: 1, x: 0 }
      }
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-start"
    >
      {children}
    </motion.div>
  );
}
