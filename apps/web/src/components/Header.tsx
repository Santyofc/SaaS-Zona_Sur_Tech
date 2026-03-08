"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Cpu, Search } from "lucide-react";
import { LogoZS } from "@repo/ui/src/components/LogoZS";

const navItems = [
    { name: "Sistemas", href: "/systems" },
    { name: "Tecnología", href: "/technology" },
    { name: "Precios", href: "/pricing" },
    { name: "Nosotros", href: "/about" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className={`fixed top-0 left-0 w-full z-[var(--z-topbar)] transition-all duration-300 ${isScrolled
                ? "py-4 bg-zs-bg-primary/70 backdrop-blur-xl border-b border-zs-border shadow-zs-glass"
                : "py-6 bg-transparent"
                }`}
        >
            <div className="container px-4 mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="group flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotateY: 180, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-10 h-10 text-zs-blue shadow-zs-glow-blue/20"
                    >
                        <LogoZS className="w-full h-full" />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-white tracking-widest uppercase italic leading-none">
                            ZONA SUR <span className="text-zs-blue">TECH</span>
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item, idx) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx + 0.3 }}
                        >
                            <Link
                                href={item.href}
                                className="relative px-5 py-2 text-sm font-bold text-zs-text-secondary hover:text-white transition-colors group"
                            >
                                {item.name}
                                <motion.span
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-zs-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                                    initial={false}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Action Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-zs-text-secondary hover:text-zs-blue transition-colors"
                        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                    >
                        <Search className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-zs-text-secondary hover:text-zs-blue transition-colors"
                    >
                        <Globe className="w-5 h-5" />
                    </motion.button>
                    ...
                    <motion.div
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 25px rgba(37, 99, 235, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <Link href="/signin" className="zs-btn-brand px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Cpu className="w-4 h-4 animate-pulse" />
                            Acceso Kernel
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-white"
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-zs-bg-secondary border-b border-zs-border overflow-hidden"
                    >
                        <div className="container px-4 py-8 flex flex-col gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-black text-white tracking-tight uppercase italic hover:text-zs-blue transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href="/signin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full text-center zs-btn-brand py-4 rounded-2xl text-sm font-black uppercase tracking-widest"
                            >
                                Sincronizar Nodo
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
