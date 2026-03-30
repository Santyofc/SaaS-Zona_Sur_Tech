"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { LogoZS } from "@repo/ui/src/components/LogoZS";

const footerLinks = [
    {
        title: "Plataforma",
        links: [
            { name: "Sistemas", href: "/systems" },
            { name: "Infraestructura", href: "/infra" },
            { name: "Seguridad", href: "/security" },
            { name: "Precios", href: "/pricing" },
        ],
    },
    {
        title: "Empresa",
        links: [
            { name: "Nosotros", href: "/about" },
            { name: "Carreras", href: "/careers" },
            { name: "Blog", href: "/blog" },
            { name: "Contacto", href: "/contact" },
        ],
    },
    {
        title: "Recursos",
        links: [
            { name: "Documentación", href: "/docs" },
            { name: "API Reference", href: "/api-reference" },
            { name: "Comunidad", href: "/community" },
            { name: "Estado", href: "/status" },
        ],
    },
];

const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/Santyofc", color: "hover:text-white" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/santidelgados_", color: "hover:text-zs-blue" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/santi-delgados/", color: "hover:text-zs-blue-lt" },
    { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/santidelgados_/", color: "hover:text-zs-violet" },
];

export default function Footer() {
    return (
        <footer className="relative bg-zs-bg-primary pt-24 pb-12 overflow-hidden border-t border-zs-border">
            {/* Background Decor */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-zs-blue/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-4 mb-8 group">
                            <div className="w-12 h-12 text-zs-blue group-hover:scale-110 transition-transform">
                                <LogoZS className="w-full h-full" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white tracking-widest uppercase italic leading-none">
                                    ZONA SUR <span className="text-zs-blue">TECH</span>
                                </span>
                                <span className="text-[10px] text-zs-text-muted font-black uppercase tracking-[0.3em] mt-1">
                                    Established 2026
                                </span>
                            </div>
                        </Link>
                        <p className="text-zs-text-secondary text-sm leading-relaxed max-w-sm mb-8">
                            Arquitecturas de alto nivel diseñadas para el máximo rendimiento y escalabilidad extrema.
                            El estándar para la próxima década de software industrial.
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    className={`p-3 rounded-xl bg-zs-bg-secondary border border-zs-border transition-all duration-300 text-zs-text-secondary ${social.color} hover:border-white/20 hover:shadow-zs-glass`}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                        <div className="mt-6">
                            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">
                                Support
                            </p>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="https://github.com/sponsors/Santyofc"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-zs-blue hover:text-white transition-colors"
                                >
                                    github.com/sponsors/Santyofc
                                </a>
                                <iframe
                                    src="https://github.com/sponsors/Santyofc/button"
                                    title="Sponsor Santyofc"
                                    height={32}
                                    width={114}
                                    style={{ border: 0, borderRadius: 6 }}
                                />
                                <iframe
                                    src="https://github.com/sponsors/Santyofc/card"
                                    title="Sponsor Santyofc card"
                                    height={225}
                                    width={600}
                                    className="w-full max-w-[600px]"
                                    style={{ border: 0 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((column) => (
                        <div key={column.title}>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white mb-8 border-b border-zs-blue/30 pb-2 inline-block">
                                {column.title}
                            </h4>
                            <ul className="space-y-4">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-zs-text-secondary hover:text-zs-blue text-sm font-medium transition-colors flex items-center group"
                                        >
                                            <ArrowRight className="w-0 h-0 group-hover:w-3 group-hover:h-3 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="pt-12 border-t border-zs-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 group cursor-default">
                        <span className="text-xs text-zs-text-muted font-medium">Plataforma por</span>
                        <span className="text-xs font-black text-white tracking-tighter uppercase italic group-hover:text-zs-blue transition-colors">
                            @santidelgados_
                        </span>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link href="/legal/privacy" className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted hover:text-white transition-colors">
                            Privacidad
                        </Link>
                        <Link href="/legal/terms" className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted hover:text-white transition-colors">
                            Términos
                        </Link>
                        <Link href="/legal/cookies" className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted hover:text-white transition-colors">
                            Cookies
                        </Link>
                    </div>

                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">
                        © {new Date().getFullYear()} ZONA SUR TECH. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>
        </footer>
    );
}
