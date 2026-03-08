"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

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
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1, backgroundColor: "var(--color-zs-blue-lt)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    aria-label="scroll to top"
                    className="fixed bottom-8 right-8 z-[999] flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-zs-blue text-white shadow-zs-glow-blue border border-white/10"
                >
                    <ChevronUp className="w-6 h-6" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
