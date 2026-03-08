"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <>
            {/* Global Scroll Progress Bar (Top) */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-zs-blue z-[10000] origin-left"
                style={{ scaleX }}
            />

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 50, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 50, rotate: 45 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="fixed bottom-10 right-10 z-[var(--z-topbar)]"
                    >
                        <motion.button
                            whileHover={{
                                scale: 1.1,
                                rotate: 5,
                                boxShadow: "0 0 30px rgba(37, 99, 235, 0.5)"
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={scrollToTop}
                            className="relative w-14 h-14 flex items-center justify-center rounded-2xl bg-zs-bg-secondary border border-zs-blue/30 text-zs-blue shadow-2xl backdrop-blur-xl group overflow-hidden"
                        >
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-zs-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Progress Ring (Circle) */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="28"
                                    cy="28"
                                    r="24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="transparent"
                                    strokeDasharray="150"
                                    strokeDashoffset={150 - (150 * 1)} // Full ring as base
                                    className="text-zs-border"
                                />
                            </svg>

                            <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />

                            {/* Particle Effects (Subtle) */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.2, 0.1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-x-2 inset-y-2 rounded-xl border border-zs-blue/20 pointer-events-none"
                            />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
