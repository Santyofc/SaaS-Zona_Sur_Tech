"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Rocket } from "lucide-react";

export default function ComingSoonPage() {
    return (
        <main className="min-h-screen bg-zs-bg-primary flex items-center justify-center relative overflow-hidden p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(var(--color-zs-blue) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zs-blue/10 blur-[120px] rounded-full" />

            <div className="max-w-xl w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12 relative"
                >
                    {/* Mascot Container */}
                    <div className="relative w-80 h-[500px] mx-auto mb-8">
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative z-10 w-full h-full"
                        >
                            <Image
                                src="/assets/mascot.png"
                                alt="Zona Sur Tech Official Mascot"
                                fill
                                className="object-contain drop-shadow-[0_0_60px_rgba(37,99,235,0.5)]"
                                priority
                            />
                        </motion.div>

                        {/* Orbiting Elements */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-80 h-80 border border-zs-blue/20 rounded-full"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 10 + i * 5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{
                                    marginTop: '-160px',
                                    marginLeft: '-160px',
                                    scale: 1 + i * 0.2
                                }}
                            />
                        ))}
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zs-violet/30 bg-zs-violet/5 text-zs-violet text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-zs-glow-violet">
                        <Rocket className="w-3 h-3" /> Protocolo en Desarrollo
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-6">
                        Próximamente <br />
                        <span className="text-zs-blue">Online</span>
                    </h1>
                    <p className="text-zs-text-secondary text-lg mb-12 leading-relaxed">
                        Nuestra mascota técnica está configurando los últimos nodos de este módulo.
                        Estamos construyendo el estándar de la próxima década del software industrial.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-zs-bg-secondary border border-zs-border rounded-xl text-white font-black uppercase tracking-widest hover:border-zs-blue transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        Volver al Centro
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
