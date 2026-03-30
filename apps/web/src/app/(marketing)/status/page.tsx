"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, Globe, ShieldCheck, Wifi, Server, CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react";

const services = [
    { name: "Auth Engine (OAuth 2.1)", status: "Operational", latency: "12ms", uptime: "100%", color: "zs-blue" },
    { name: "Database Cluster", status: "Operational", latency: "45ms", uptime: "99.99%", color: "zs-emerald" },
    { name: "Edge Compute nodes", status: "Operational", latency: "8ms", uptime: "100%", color: "zs-cyan" },
    { name: "Global CDN", status: "Operational", latency: "150ms", uptime: "99.95%", color: "zs-violet" },
    { name: "Storage Buckets", status: "Operational", latency: "89ms", uptime: "100%", color: "zs-blue" },
    { name: "Realtime Socket", status: "Operational", latency: "5ms", uptime: "99.99%", color: "zs-cyan" },
];

export default function StatusPage() {
    const [latencyData, setLatencyData] = useState<number[]>(Array.from({ length: 40 }, () => Math.random() * 50 + 20));
    const [activeConnections, setActiveConnections] = useState(14023);
    const [currentTime, setCurrentTime] = useState("");

    // Time ticker
    useEffect(() => {
        const t = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString() + " UTC");
        }, 1000);
        setCurrentTime(new Date().toLocaleTimeString() + " UTC");
        return () => clearInterval(t);
    }, []);

    // Live Feed Simulator
    useEffect(() => {
        const interval = setInterval(() => {
            setLatencyData((prev) => {
                const newData = [...prev.slice(1), Math.random() * 60 + 10]; // Live shifting window
                return newData;
            });
            setActiveConnections((prev) => prev + Math.floor(Math.random() * 20) - 10);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const currentLatency = latencyData[latencyData.length - 1] || 0;

    return (
        <main className="pt-32 pb-24 bg-zs-bg-primary min-h-screen relative overflow-hidden font-mono">
            {/* Background Decor */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(var(--color-zs-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-zs-cyan) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
            />

            <div className="container px-4 mx-auto relative z-10 max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-8">
                    <div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-emerald/10 border border-zs-emerald/20 text-zs-emerald mb-8 shadow-zs-glow-emerald">
                            <div className="w-2 h-2 rounded-full bg-zs-emerald animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Todos los Sistemas Operativos</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                            Estatus del <span className="text-zs-cyan shadow-zs-glow-cyan">Kernel</span>
                        </h1>
                        <p className="text-zs-text-secondary max-w-2xl leading-relaxed mt-4">
                            Monitorización hiper-real de los clústeres globales de Zona Sur Tech. 
                            Métricas de telemetría de red, latencia y rendimiento del Edge.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-6 p-4 rounded-xl bg-[#06080b] border border-zs-border shadow-zs-glow-blue/10">
                        <Clock className="text-zs-blue w-5 h-5" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-zs-text-muted uppercase font-black tracking-widest leading-none mb-1">Última Sincronización</span>
                            <span className="text-xs font-bold text-white uppercase tracking-widest">{currentTime}</span>
                        </div>
                    </div>
                </div>

                {/* Top Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Uptime */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="zs-card p-8 bg-[#06080b] border-zs-border/60 hover:border-zs-emerald/50 hover:shadow-zs-glow-emerald/10 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 rounded-xl bg-zs-emerald/10 flex items-center justify-center text-zs-emerald group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-zs-emerald uppercase tracking-[0.2em] bg-zs-emerald/10 px-3 py-1.5 rounded-full border border-zs-emerald/20">Normal</span>
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2 italic">99.99<span className="text-xl text-zs-text-muted">%</span></h3>
                        <p className="text-xs text-zs-text-muted uppercase tracking-[0.2em] font-black">Uptime Global</p>
                    </motion.div>

                    {/* Latency */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="zs-card p-8 bg-[#06080b] border-zs-border/60 hover:border-zs-cyan/50 hover:shadow-zs-glow-cyan/10 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 rounded-xl bg-zs-cyan/10 flex items-center justify-center text-zs-cyan group-hover:scale-110 transition-transform">
                                <Wifi className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-zs-cyan uppercase tracking-[0.2em] bg-zs-cyan/10 px-3 py-1.5 rounded-full border border-zs-cyan/20">Óptimo</span>
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2 italic">{Math.round(currentLatency)}<span className="text-xl text-zs-text-muted">ms</span></h3>
                        <p className="text-xs text-zs-text-muted uppercase tracking-[0.2em] font-black">Latencia API</p>
                    </motion.div>

                    {/* Active Nodes */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="zs-card p-8 bg-[#06080b] border-zs-border/60 hover:border-zs-violet/50 hover:shadow-zs-glow-violet/10 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 rounded-xl bg-zs-violet/10 flex items-center justify-center text-zs-violet group-hover:scale-110 transition-transform">
                                <Globe className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-zs-violet uppercase tracking-[0.2em] bg-zs-violet/10 px-3 py-1.5 rounded-full border border-zs-violet/20">Anycast</span>
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2 italic">
                            {activeConnections.toLocaleString()}
                        </h3>
                        <p className="text-xs text-zs-text-muted uppercase tracking-[0.2em] font-black">Nodos Activos</p>
                    </motion.div>
                </div>

                {/* Live Traffic Graph Simulator + Regional Load */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* Live Line Chart */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 zs-card p-8 bg-[#06080b] border-zs-border/60 shadow-zs-glow-cyan/5"
                    >
                        <div className="flex items-center justify-between border-b border-zs-border/50 pb-6 mb-8">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-zs-cyan" />
                                <h2 className="text-lg font-black text-white uppercase tracking-widest italic">Carga de CPU (Cluster Backbone)</h2>
                            </div>
                            <div className="text-[10px] font-black text-zs-emerald uppercase tracking-[0.3em] flex items-center gap-2 px-3 py-1 rounded bg-zs-emerald/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-zs-emerald animate-pulse" />
                                Live Feed
                            </div>
                        </div>
                        
                        {/* Animated Bar Chart */}
                        <div className="h-48 flex items-end justify-between gap-1 md:gap-2">
                            {latencyData.map((val, i) => (
                                <motion.div
                                    key={i}
                                    layout
                                    initial={{ height: 0 }}
                                    animate={{ height: `${val}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-full relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-zs-cyan/20 to-zs-cyan/80 rounded-t-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                                    {/* Tick line on top */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-zs-cyan" />
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 pt-4 border-t border-zs-border/30 text-[10px] text-zs-text-muted font-black uppercase tracking-[0.3em]">
                            <span>T-60s</span>
                            <span>Ahora</span>
                        </div>
                    </motion.div>

                    {/* Regional Load */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="zs-card p-8 bg-[#06080b] border-zs-border/60 flex flex-col"
                    >
                        <div className="flex items-center justify-between border-b border-zs-border/50 pb-6 mb-8">
                            <h2 className="text-lg font-black text-white uppercase tracking-widest italic">Distribución</h2>
                            <Globe className="w-5 h-5 text-zs-violet" />
                        </div>
                        <div className="space-y-7 flex-1">
                            {[
                                { l: "América", p: 45, c: "zs-blue" },
                                { l: "Europa", p: 30, c: "zs-violet" },
                                { l: "Asia", p: 15, c: "zs-cyan" },
                                { l: "Resto", p: 10, c: "zs-emerald" },
                            ].map(r => (
                                <div key={r.l} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-zs-text-secondary">{r.l}</span>
                                        <span className="text-white">{r.p}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${r.p}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full bg-${r.c} shadow-[0_0_10px_var(--color-${r.c})]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-zs-text-muted leading-relaxed uppercase tracking-[0.2em] font-bold mt-8 border-t border-zs-border/50 pt-6">
                            Carga balanceada automáticamente mediante protocolos de enrutamiento BGP dinámico en el Edge.
                        </p>
                    </motion.div>
                </div>

                {/* Services Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="zs-card p-0 overflow-hidden mb-12 bg-black/40 border-zs-border/60"
                >
                    <table className="zs-table">
                        <thead>
                            <tr>
                                <th>Módulos del Sistema</th>
                                <th>Estatus Operativo</th>
                                <th>Latencia Actual</th>
                                <th>Uptime (30d)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, idx) => (
                                <tr key={service.name} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 py-6">
                                        <div className={`w-2 h-2 rounded-full bg-${service.color} shadow-[0_0_8px_var(--color-${service.color})]`} />
                                        <span className="font-bold text-white tracking-wide">{service.name}</span>
                                    </td>
                                    <td className="py-6">
                                        <div className="flex items-center gap-2 text-zs-emerald">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{service.status}</span>
                                        </div>
                                    </td>
                                    <td className="font-mono text-zs-text-secondary py-6">{service.latency}</td>
                                    <td className="font-mono font-bold text-white py-6">{service.uptime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Incident History Timeline */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 border-b border-zs-border/50 pb-6 mb-6 italic">
                        <Server className="w-6 h-6 text-zs-text-muted" />
                        Registro de Incidentes
                    </h2>

                    <div className="space-y-4">
                        <div className="zs-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:bg-zs-bg-secondary/50 transition-colors cursor-default border-zs-border/50">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle2 className="w-5 h-5 text-zs-emerald" />
                                    <span className="text-sm font-black text-white uppercase tracking-widest">Mantenimiento Global Completado</span>
                                </div>
                                <p className="text-xs text-zs-text-secondary leading-relaxed max-w-2xl">
                                    Actualización de nodos criptográficos en el perímetro Edge. Transición de tráfico automatizada. Tiempo total de inactividad de red: 0ms.
                                </p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zs-text-muted whitespace-nowrap bg-zs-bg-primary px-3 py-1.5 rounded border border-zs-border">
                                Hace 2 días
                            </span>
                        </div>

                        <div className="zs-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-zs-amber/5 hover:bg-zs-amber/10 border-zs-amber/20 transition-colors cursor-default">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <AlertCircle className="w-5 h-5 text-zs-amber" />
                                    <span className="text-sm font-black text-white uppercase tracking-widest">Degradación Parcial de API</span>
                                </div>
                                <p className="text-xs text-zs-text-secondary leading-relaxed max-w-2xl">
                                    Los clústeres SA-East experimentaron un aumento de latencia debido a un ataque DDoS masivo capa 7. El WAF de Zona Sur Tech mitigó el 99.8% del impacto malicioso en 45 segundos.
                                </p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zs-text-muted whitespace-nowrap bg-black/40 px-3 py-1.5 rounded border border-zs-amber/30 text-zs-amber">
                                Hace 12 días
                            </span>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-24 flex flex-col items-center">
                    <p className="text-[10px] text-zs-text-muted font-black uppercase tracking-[0.4em] mb-4">Grafana Optimized observability / V 4.2.0</p>
                    <button className="px-6 py-3 rounded-lg border border-zs-border bg-zs-bg-secondary/50 hover:bg-zs-blue/10 hover:border-zs-blue/50 flex items-center gap-3 text-[10px] font-black text-zs-blue uppercase tracking-[0.2em] transition-all">
                        Descargar Reporte SecOps <Zap className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </main>
    );
}
