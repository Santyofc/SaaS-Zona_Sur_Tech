"use client";

import { motion } from "framer-motion";
import { Activity, Shield, Database, Cpu, Globe, CheckCircle2, AlertCircle, BarChart3, Clock } from "lucide-react";

const services = [
    { name: "Auth Engine (OAuth 2.1)", status: "Operational", latency: "12ms", uptime: "100%", color: "zs-blue" },
    { name: "Database Cluster", status: "Operational", latency: "45ms", uptime: "99.99%", color: "zs-emerald" },
    { name: "Edge Compute nodes", status: "Operational", latency: "8ms", uptime: "100%", color: "zs-cyan" },
    { name: "Global CDN", status: "Operational", latency: "150ms", uptime: "99.95%", color: "zs-violet" },
    { name: "Storage Buckets", status: "Operational", latency: "89ms", uptime: "100%", color: "zs-blue-lt" },
    { name: "Realtime Socket", status: "Operational", latency: "5ms", uptime: "99.99%", color: "zs-cyan" },
];

export default function StatusPage() {
    return (
        <main className="pt-32 pb-24 bg-zs-bg-primary min-h-screen relative overflow-hidden font-mono">
            {/* Background Matrix/Grid Effect */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(var(--color-zs-text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--color-zs-text-muted) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 rounded-full bg-zs-emerald animate-pulse shadow-[0_0_10px_var(--color-zs-emerald)]" />
                            <span className="text-zs-emerald text-xs font-black uppercase tracking-[0.4em]">All Systems Nominal</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.8]">
                            Estatus del <span className="text-zs-blue">Kernel</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 p-4 rounded-xl bg-zs-bg-secondary border border-zs-border">
                        <Clock className="text-zs-text-muted w-5 h-5" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-zs-text-muted uppercase font-black tracking-widest leading-none mb-1">Last Update</span>
                            <span className="text-xs font-bold text-white uppercase italic">{new Date().toLocaleTimeString()} UTC</span>
                        </div>
                    </div>
                </div>

                {/* Global Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Requests (24h)", val: "1.2M", desc: "+12% vs last period" },
                        { label: "Avg Latency", val: "24ms", desc: "-2ms optimization" },
                        { label: "Bandwidth", val: "4.2TB", desc: "Global distribution" },
                        { label: "Security Events", val: "0", desc: "No breaches detected" },
                    ].map(stat => (
                        <div key={stat.label} className="p-6 rounded-2xl bg-zs-bg-secondary/40 border border-zs-border">
                            <span className="text-[10px] text-zs-text-muted uppercase font-black tracking-widest block mb-2">{stat.label}</span>
                            <span className="text-3xl font-black text-white italic tracking-tighter block mb-1">{stat.val}</span>
                            <span className="text-[9px] text-zs-emerald uppercase font-bold">{stat.desc}</span>
                        </div>
                    ))}
                </div>

                {/* Services Table */}
                <div className="zs-card p-0 overflow-hidden mb-12 bg-black/40 border-zs-border/60">
                    <table className="zs-table">
                        <thead>
                            <tr>
                                <th>Sistema / Servicio</th>
                                <th>Estatus</th>
                                <th>Latencia</th>
                                <th>Uptime 30d</th>
                                <th className="hidden md:table-cell">Región</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, idx) => (
                                <motion.tr
                                    key={service.name}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <td className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full bg-${service.color}`} />
                                        <span className="font-bold text-white">{service.name}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-zs-emerald">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{service.status}</span>
                                        </div>
                                    </td>
                                    <td className="text-zs-text-secondary">{service.latency}</td>
                                    <td className="text-zs-text-secondary">{service.uptime}</td>
                                    <td className="hidden md:table-cell">
                                        <div className="flex items-center gap-1 group cursor-default">
                                            <Globe className="w-3 h-3 text-zs-text-muted group-hover:text-zs-blue transition-colors" />
                                            <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest">Global Anycast</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Advanced Observability Mockup (Grafana inspired) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 zs-card p-8 bg-black/60 min-h-[300px] relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Consumo de CPU (Backbone Cluster)</h3>
                            <BarChart3 className="text-zs-blue w-5 h-5" />
                        </div>
                        <div className="flex items-end gap-1 h-40">
                            {[...Array(40)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 50}%`, `${20 + Math.random() * 60}%`] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
                                    className="flex-1 bg-zs-blue/40 rounded-t-sm"
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[9px] text-zs-text-muted font-black tracking-widest">
                            <span>04:00</span>
                            <span>08:00</span>
                            <span>12:00</span>
                            <span>16:00</span>
                            <span>20:00</span>
                            <span>Current</span>
                        </div>
                    </div>

                    <div className="zs-card p-8 bg-black/60 flex flex-col justify-between">
                        <div className="mb-8">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic mb-6">Distribución de Tráfico</h3>
                            <div className="space-y-6">
                                {[
                                    { l: "América", p: 45, c: "zs-blue" },
                                    { l: "Europa", p: 30, c: "zs-violet" },
                                    { l: "Asia", p: 15, c: "zs-cyan" },
                                    { l: "Resto", p: 10, c: "zs-emerald" },
                                ].map(r => (
                                    <div key={r.l} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-zs-text-secondary">{r.l}</span>
                                            <span className="text-white">{r.p}%</span>
                                        </div>
                                        <div className="h-1 bg-zs-border rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${r.p}%` }}
                                                className={`h-full bg-${r.c}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-[10px] text-zs-text-muted leading-relaxed uppercase tracking-widest italic">
                            Carga balanceada automáticamente mediante protocolos de enrutamiento BGP dinámico.
                        </p>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center">
                    <p className="text-[10px] text-zs-text-muted font-black uppercase tracking-[0.6em] mb-4">Grafana Optimized observability</p>
                    <button className="flex items-center gap-2 text-[10px] font-black text-zs-blue uppercase tracking-widest hover:text-white transition-colors">
                        Descargar Reporte Técnico <Zap className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </main>
    );
}

function Zap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 14.71 13.18 3l-1.55 7.82L20 9.29 10.82 21l1.55-7.82L4 14.71Z" />
        </svg>
    );
}
