"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, RotateCcw, ExternalLink, Lock, ChevronLeft, ChevronRight, CheckCircle2, Shield, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Emulator.module.css';

interface DeviceEmulatorProps {
    url?: string;
    onRefresh?: () => void;
    currentStep?: number;
    metrics?: {
        latency: string;
        nodes: number;
        connections: string;
        threats: string;
    };
}

export default function DeviceEmulator({
    url = "http://localhost:3000",
    onRefresh,
    currentStep = 0,
    metrics = { latency: "12ms", nodes: 64, connections: "1.2M", threats: "0.0%" }
}: DeviceEmulatorProps) {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [key, setKey] = useState(0); // For forcing refresh
    const [logs, setLogs] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setMounted(true);
        setIsLoading(true);
        setLogs([]);
        setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

        // Simular tiempo de carga/compilación para mostrar el feedback visual
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200);

        return () => clearTimeout(timer);
    }, [url, key, viewMode]);


    useEffect(() => {
        if (!isLoading) {
            setLogs([]);
            return;
        }

        const possibleLogs = [
            "compiling client and server...",
            "wait  - compiling...",
            "event - compiled client and server successfully",
            "info  - ready on http://localhost:3000",
            "wait  - compiling /page...",
            "event - compiled client and server successfully in 124ms",
            "✓ Compiled /page in 124ms"
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < possibleLogs.length) {
                setLogs(prev => [...prev, possibleLogs[index]]);
                index++;
            }
        }, 300);

        return () => clearInterval(interval);
    }, [isLoading, key]);

    const handleRefresh = () => {
        setKey(prev => prev + 1);
        onRefresh?.();
    };

    if (!mounted) return <div className={styles.emulatorWrapper} style={{ height: '700px', background: '#06080b' }} />;

    return (
        <div className={styles.emulatorWrapper} ref={containerRef}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.controls}>
                    <button
                        className={`${styles.btn} ${viewMode === 'desktop' ? styles.btnActive : ''}`}
                        onClick={() => setViewMode('desktop')}
                        title="Desktop View"
                    >
                        <Monitor size={18} />
                    </button>
                    <button
                        className={`${styles.btn} ${viewMode === 'mobile' ? styles.btnActive : ''}`}
                        onClick={() => setViewMode('mobile')}
                        title="Mobile View"
                    >
                        <Smartphone size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-[10px] text-zs-text-muted font-mono bg-black/40 px-3 py-1 rounded-full border border-zs-border">
                        {url}
                    </div>
                    <button onClick={handleRefresh} className={styles.btn} title="Reload Iframe">
                        <RotateCcw size={16} />
                    </button>
                    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.btn} title="Open in New Tab">
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>

            {/* Main Viewport Container */}
            <div className={styles.viewportContainer}>
                {/* Replaced by realistic loading skeleton inside iframeContainer */}

                <motion.div
                    layout
                    initial={false}
                    animate={{
                        width: viewMode === 'desktop' ? '100%' : '375px',
                        height: viewMode === 'desktop' ? '100%' : '812px',
                        borderRadius: viewMode === 'desktop' ? '12px' : '50px',
                        borderWidth: viewMode === 'desktop' ? '1px' : '12px',
                        borderColor: viewMode === 'desktop' ? 'var(--zs-border)' : '#121212',
                        boxShadow: viewMode === 'desktop'
                            ? '0 20px 50px rgba(0,0,0,0.3)'
                            : '0 0 0 2px #222, 0 30px 60px rgba(0,0,0,0.5)'
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8
                    }}
                    className={styles.deviceFrame}
                >
                    <AnimatePresence mode="popLayout">
                        {viewMode === 'desktop' && (
                            <motion.div
                                key="mac-header"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className={styles.macHeader}
                            >
                                <div className={`${styles.macDot} ${styles.red}`} />
                                <div className={`${styles.macDot} ${styles.yellow}`} />
                                <div className={`${styles.macDot} ${styles.green}`} />
                            </motion.div>
                        )}
                        {viewMode === 'mobile' && (
                            <motion.div
                                key="dynamic-island"
                                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className={styles.iphoneNotch}
                            >
                                <div className="flex-1" /> {/* Spacer */}
                                <div className="w-10 h-1 bg-[#111] rounded-full opacity-40 mx-auto" /> {/* Speaker mesh */}
                                <div className={styles.notchSensor} />
                                <div className={styles.cameraDot} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={styles.screenGlare} />

                    {/* Hardware Buttons */}
                    {viewMode === 'mobile' && (
                        <>
                            <div className={`${styles.sideButton} ${styles.actionButton}`} />
                            <div className={`${styles.sideButton} ${styles.volumeUp}`} />
                            <div className={`${styles.sideButton} ${styles.volumeDown}`} />
                            <div className={`${styles.sideButton} ${styles.powerButton}`} />
                            <div className={styles.homeBar} />
                        </>
                    )}

                    {/* Realistic Nav Bar (Safari Layout) */}
                    <div className={styles.browserNav}>
                        <div className={styles.navControls}>
                            {viewMode === 'desktop' && (
                                <>
                                    <button className={styles.btn}><ChevronLeft size={16} /></button>
                                    <button className={styles.btn}><ChevronRight size={16} /></button>
                                </>
                            )}
                            <button className={styles.btn} onClick={handleRefresh}><RotateCcw size={16} /></button>
                            <button className={styles.btn}><ExternalLink size={16} /></button>
                        </div>
                        <div className={styles.addressBar}>
                            {viewMode === 'desktop' && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zs-emerald/10 rounded-md border border-zs-emerald/20 mr-1">
                                    <Shield size={10} className="text-zs-emerald" />
                                    <span className="text-[9px] font-black text-zs-emerald leading-none">12</span>
                                </div>
                            )}
                            <Lock size={12} className={styles.lockIcon} />
                            <span className="truncate">{url.replace('http://', '')}</span>
                        </div>
                    </div>

                    <div className={styles.iframeContainer}>
                        {isLoading && (
                            <div className={styles.skeletonContainer}>
                                <div className={`${styles.skeletonBlock} ${styles.skeletonHeader}`} />
                                <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`${styles.skeletonBlock} ${styles.skeletonCard}`} />
                                    <div className={`${styles.skeletonBlock} ${styles.skeletonCard}`} />
                                </div>
                                <div className={`${styles.skeletonBlock} ${styles.skeletonCard}`} style={{ height: '200px', marginTop: '1rem' }} />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={styles.miniTerminal}
                                >
                                    <div className="flex items-center gap-2 mb-2 border-b border-zs-border/50 pb-2">
                                        <div className="w-2 h-2 rounded-full bg-zs-violet animate-pulse" />
                                        <span className="text-white text-[10px] tracking-widest uppercase font-black">Build Logs</span>
                                    </div>
                                    <div className="flex flex-col flex-1 overflow-hidden justify-end">
                                        {logs.map((log, i) => (
                                            <div key={i} className={`${styles.logLine} ${log?.includes('✓') || log?.includes('successfully') ? styles.logSuccess : log?.includes('info') ? styles.logInfo : ''}`}>
                                                <span className="opacity-50 mr-2">{'>'}</span> {log || ''}
                                            </div>
                                        ))}
                                        <div className={styles.logLine}>
                                            <span className="opacity-50 mr-2">{'>'}</span> <span className="animate-pulse">_</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Rendered Output matching the IDEEmulator code */}
                        {!isLoading && (
                            <div className="w-full h-full bg-[#050505] flex flex-col p-0 relative overflow-y-auto overflow-x-hidden font-sans">

                                {/* Background Orbs */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1 }}
                                    className="absolute top-0 right-[-20%] w-[500px] h-[500px] bg-zs-blue/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-zs-violet/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"
                                />

                                {/* Main Layout Grid */}
                                <div className={`relative z-10 grid gap-4 md:gap-6 p-4 md:p-8 min-h-full ${viewMode === 'desktop' ? 'grid-cols-12' : 'grid-cols-1'}`}>

                                    {/* Identity Gateway Sidebar */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`${viewMode === 'desktop' ? 'col-span-3' : 'col-span-1'} bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-6 border border-white/5 flex flex-col gap-6`}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-zs-violet/20 flex items-center justify-center text-zs-violet backdrop-blur-md border border-zs-violet/30">
                                                <Lock size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted">Santy Cloud</div>
                                                <div className="text-white text-sm font-black">Active Session</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div className="h-full bg-gradient-to-r from-zs-blue to-zs-violet" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} />
                                            </div>
                                            <div className="h-10 w-full rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-[10px] font-black uppercase text-green-400 tracking-widest gap-2">
                                                <CheckCircle2 size={14} /> Secure Connection
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Nucleus Analytics Main View */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`${viewMode === 'desktop' ? 'col-span-9' : 'col-span-1'} flex flex-col gap-4`}
                                    >
                                        {/* Globe Visualization */}
                                        <div className={`flex-1 ${viewMode === 'desktop' ? 'min-h-[200px]' : 'min-h-[150px]'} bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-4 md:p-6 border border-white/5 flex items-center justify-center relative overflow-hidden group`}>
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                            {/* Simulated Globe Wireframe */}
                                            <motion.div
                                                animate={isVisible ? { rotate: 360 } : {}}
                                                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                                                className={`${viewMode === 'desktop' ? 'w-[240px] h-[240px]' : 'w-[160px] h-[160px]'} rounded-full border border-zs-blue/30 relative flex items-center justify-center`}
                                                style={{ scale: metrics.nodes > 100 ? 1.05 : 1 }}
                                            >
                                                <div className="absolute w-[100%] h-[30%] border border-zs-blue/20 rounded-[100%] rotate-45" />
                                                <div className="absolute w-[100%] h-[30%] border border-zs-blue/20 rounded-[100%] -rotate-45" />
                                                <div className="absolute w-[30%] h-[100%] border border-zs-blue/20 rounded-[100%]" />
                                                <div className="w-[90%] h-[90%] bg-gradient-to-tr from-zs-blue/10 to-transparent rounded-full shadow-[inset_0_0_50px_rgba(37,99,235,0.2)]" />
                                            </motion.div>

                                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-zs-blue animate-ping" />
                                                <span className="text-[9px] uppercase tracking-widest font-black text-zs-blue">Nodes: {metrics.nodes}</span>
                                            </div>
                                        </div>

                                        {/* Telemetry Row */}
                                        <div className={`shrink-0 grid gap-3 ${viewMode === 'desktop' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-20 bg-white/[0.02] backdrop-blur-2xl rounded-2xl border border-white/5 p-3 flex flex-col justify-between">
                                                <div className="flex justify-between text-zs-text-muted">
                                                    <span className="text-[9px] uppercase font-black tracking-widest">Latency</span>
                                                    <Activity size={12} className="text-zs-emerald" />
                                                </div>
                                                <div className="text-xl font-black text-white italic transition-all duration-300">
                                                    {metrics.latency.replace('ms', '')}<span className="text-xs text-zs-text-muted ml-0.5">ms</span>
                                                </div>
                                            </motion.div>

                                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-20 bg-white/[0.02] backdrop-blur-2xl rounded-2xl border border-white/5 p-3 flex flex-col justify-between">
                                                <div className="flex justify-between text-zs-text-muted">
                                                    <span className="text-[9px] uppercase font-black tracking-widest">Active Conns</span>
                                                    <Globe size={12} className="text-zs-blue" />
                                                </div>
                                                <div className="text-xl font-black text-white italic transition-all duration-300">
                                                    {metrics.connections.replace(/[A-Z]/, '')}<span className="text-xs text-zs-text-muted ml-0.5">{metrics.connections.match(/[A-Z]/)?.[0] || ''}</span>
                                                </div>
                                            </motion.div>

                                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-20 bg-white/[0.02] backdrop-blur-2xl rounded-2xl border border-white/5 p-3 flex flex-col justify-between overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-zs-violet/10 to-transparent opacity-50" />
                                                <div className="relative flex justify-between text-zs-text-muted">
                                                    <span className="text-[9px] uppercase font-black tracking-widest">Threats</span>
                                                    <Lock size={12} className={metrics.threats === '100%' ? 'text-red-500 animate-pulse' : 'text-zs-violet'} />
                                                </div>
                                                <div className={`relative text-xl font-black italic transition-all duration-300 ${metrics.threats === '100%' ? 'text-red-400' : 'text-white'}`}>
                                                    {metrics.threats.replace('%', '')}<span className="text-xs opacity-50 ml-0.5">%</span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        )}


                        {/* Ghost Cursor Animation */}
                        {isVisible && !isLoading && !prefersReducedMotion && (
                            <motion.div
                                className={styles.ghostCursor}
                                animate={{
                                    x: ['0px', '50px', '-30px', '0px'],
                                    y: ['0px', '80px', '40px', '0px'],
                                    scale: [1, 0.9, 1, 1],
                                    opacity: [0, 1, 1, 0]
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.2, 0.8, 1],
                                    repeatDelay: 2
                                }}
                                style={{ top: '50%', left: '50%' }}
                            >
                                <div className={styles.ghostCursorInner} />
                            </motion.div>
                        )}

                        {/* Live Badge */}
                        <div className={styles.liveBadge}>
                            <div className={styles.liveIndicator} />
                            {!isLoading ? 'LIVE' : 'SYNCING'}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
