"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe2, Cpu, Zap, Cloud, Network, Server, HardDrive, BarChart3 } from "lucide-react";
import { Sparkline } from "@repo/ui-experiments";

const infraPoints = [
    {
        title: "Pulse Edge Nodes",
        desc: "Cómputo distribuido en una red global propia para una respuesta instantánea.",
        icon: <Zap className="w-8 h-8" />,
        color: "zs-blue"
    },
    {
        title: "Active Nucleus Sync",
        desc: "Sincronización de datos multiregión que garantiza consistencia absoluta de estado a nivel global.",
        icon: <Globe2 className="w-8 h-8" />,
        color: "zs-cyan"
    },
    {
        title: "Auto-Scaling Runtime",
        desc: "Capacidad computacional elástica que se adapta a cualquier volumen de tráfico sin degradación.",
        icon: <Cpu className="w-8 h-8" />,
        color: "zs-violet"
    },
    {
        title: "Logic Mesh Routing",
        desc: "Balanceo de carga inteligente basado en latencia y salud del nodo coordinado por Santi Mesh.",
        icon: <Network className="w-8 h-8" />,
        color: "zs-emerald"
    }
];

export default function InfrastructurePage() {
    return (
        <main className="pt-32 pb-24 bg-zs-bg-primary min-h-screen relative overflow-hidden">
            {/* Decorative Network Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(90deg, var(--color-zs-blue) 1px, transparent 1px), linear-gradient(var(--color-zs-blue) 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />

            <div className="container px-4 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-4xl mb-24"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px w-12 bg-zs-blue" />
                        <span className="text-zs-blue text-[10px] font-black uppercase tracking-[0.5em]">Global Backbone</span>
                    </div>
                    <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-8 leading-[0.8]">
                        Infraestructura <span className="text-zs-blue animate-pulse">Global</span>
                    </h1>
                    <p className="text-2xl text-zs-text-secondary leading-tight max-w-2xl font-light">
                        No solo servimos archivos. Desplegamos inteligencia técnica escalable a través de los océanos.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    {infraPoints.map((point, idx) => (
                        <Link
                            key={point.title}
                            href="/systems"
                            className="block"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="zs-card p-10 bg-zs-bg-secondary/40 relative overflow-hidden group hover:border-zs-blue/40 transition-all h-full"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    {point.icon}
                                </div>
                                <div className={`mb-6 text-${point.color}`}>
                                    {point.icon}
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4 group-hover:text-zs-blue transition-colors">{point.title}</h3>
                                <p className="text-sm text-zs-text-secondary leading-relaxed mb-6">
                                    {point.desc}
                                </p>
                                <div className="pt-4 border-t border-zs-border/50">
                                    <Sparkline width={150} height={30} color={`var(--color-${point.color})`} points={15} speed={4} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Global Nodes Representation Mockup */}
                <section className="relative h-[400px] rounded-[3rem] bg-zs-bg-secondary/20 border border-zs-border overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-[300px] h-[300px] rounded-full border border-zs-blue/20 animate-[spin_60s_linear_infinite]">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="absolute w-2 h-2 rounded-full bg-zs-blue shadow-zs-glow-blue"
                                    style={{ top: '50%', left: '50%', transform: `rotate(${i * 60}deg) translate(150px)` }} />
                            ))}
                        </div>
                        <div className="absolute w-[200px] h-[200px] rounded-full border border-zs-violet/20 animate-[spin_40s_linear_infinite_reverse]">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="absolute w-2 h-2 rounded-full bg-zs-violet shadow-zs-glow-violet"
                                    style={{ top: '50%', left: '50%', transform: `rotate(${i * 90}deg) translate(100px)` }} />
                            ))}
                        </div>
                        <div className="absolute z-10 text-center">
                            <Globe2 className="w-24 h-24 text-white mx-auto mb-4" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Active Mesh Network</span>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24">
                    {[
                        { label: "Uptime SLA", val: "99.999%", icon: <Server className="w-4 h-4" /> },
                        { label: "Storage", val: "Global P-FS", icon: <HardDrive className="w-4 h-4" /> },
                        { label: "Throughput", val: "100+ GB/s", icon: <BarChart3 className="w-4 h-4" /> },
                    ].map(stat => (
                        <div key={stat.label} className="flex items-center gap-6 p-6 rounded-2xl bg-zs-bg-secondary/50 border border-zs-border group">
                            <div className="text-zs-blue">{stat.icon}</div>
                            <div className="flex-1">
                                <h4 className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest leading-none mb-1">{stat.label}</h4>
                                <div className="flex items-end justify-between">
                                    <span className="text-lg font-black text-white italic">{stat.val}</span>
                                    <Sparkline width={60} height={15} color="var(--color-zs-blue)" speed={2} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
