"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Terminal, Cpu, Zap, Shield, Database, Globe, Code2, Activity, ChevronRight, Lock } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { HackerTerminal, DeviceEmulator, IDEEmulator } from "@repo/ui-experiments";
import { TerminalFeedback } from "../components/Contact/TerminalFeedback";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // --- ADVANCED INTERACTIVE DEMO LOGIC (GLOBAL DASHBOARD) ---
  const INITIAL_CODE = `import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Lock, Activity, Globe } from "lucide-react";

export const GlobalDashboard = () => {
  const [metrics, setMetrics] = useState(null);

  // 1. Initialize Core State
  usePulseEngineSystem();

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* 2. Global Power Mesh (Background Orbs) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zs-blue/20 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-zs-violet/10 blur-[150px] rounded-full mix-blend-screen" />

      {/* 3. Main Bento Architecture */}
      <div className="relative z-10 grid grid-cols-12 gap-6 p-8 h-screen">
        
        {/* Identity Gateway (Sidebar) */}
        <div className="col-span-3 custom-glass-panel rounded-3xl p-6 border border-white/5">
          <IdentityHub session={activeSession} />
        </div>

        {/* Nucleus Analytics (Main Central View) */}
        <div className="col-span-9 flex flex-col gap-6">
          <div className="h-2/3 custom-glass-panel rounded-3xl p-8 border border-white/5 flex items-center justify-center relative overflow-hidden">
             <GlobeVisualization nodes={64} active={true} />
          </div>

          {/* Real-time Telemetry (Bottom row) */}
          <div className="h-1/3 grid grid-cols-3 gap-6">
             <MetricCard title="E2E Latency" value="12ms" icon={<Activity />} trend="up" />
             <MetricCard title="Active Connections" value="1.2M" icon={<Globe />} />
             <MetricCard title="Threat Blocks" value="0.0%" icon={<Lock />} status="secure" />
          </div>
        </div>
      </div>
    </div>
  );
};`;

  const DEMO_STEPS = [
    { author: 'Santy', line: 33, target: 'value="12ms"', replacement: 'value="8ms"' },
    { author: 'Elena', line: 28, target: 'nodes={64}', replacement: 'nodes={128}' },
    { author: 'Santy', line: 34, target: 'value="1.2M"', replacement: 'value="2.4M"' },
    { author: 'Elena', line: 35, target: 'value="0.0%"', replacement: 'value="100%"' },
    { author: 'Santy', line: 33, target: 'value="8ms"', replacement: 'value="4ms"' },
    { author: 'Elena', line: 28, target: 'nodes={128}', replacement: 'nodes={256}' },
  ];

  const stepRef = useRef(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [typedCode, setTypedCode] = useState(INITIAL_CODE);
  const [activeLines, setActiveLines] = useState<{ [key: string]: number[] }>({});

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const runStep = () => {
      if (stepRef.current < DEMO_STEPS.length) {
        const step = DEMO_STEPS[stepRef.current];

        // Update code by replacing the target text
        setTypedCode(prev => prev.replace(step.target, step.replacement));

        // Update presence
        setActiveLines(prev => ({
          ...prev,
          [step.author]: [step.line]
        }));

        setStepIndex(stepRef.current);
        stepRef.current++;
        timeout = setTimeout(runStep, 2000 + Math.random() * 1500); // Slower, more deliberate changes
      } else {
        // Reset after complete loop
        timeout = setTimeout(() => {
          stepRef.current = 0;
          setStepIndex(0);
          setTypedCode(INITIAL_CODE);
          setActiveLines({});
          runStep();
        }, 8000);
      }
    };

    const initialDelay = setTimeout(runStep, 3000); // 3 seconds before first edit
    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, []);

  return (
    <main ref={containerRef} className="relative bg-zs-bg-primary overflow-hidden font-mono selection:bg-zs-blue/30 selection:text-white">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-zs-blue/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-zs-violet/5 rounded-full blur-[150px]" />

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-zs-text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--color-zs-text-muted) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
            transformOrigin: 'top center'
          }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-4 md:px-8 z-10">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-blue/10 border border-zs-blue/20 text-zs-blue mb-8">
              <span className="w-2 h-2 rounded-full bg-zs-blue animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Santi Devs Online</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-12">
              El Nuevo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                Estándar
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zs-text-secondary font-light leading-relaxed mb-12 max-w-xl">
              Infraestructura de Grado Industrial para desarrolladores que no aceptan compromisos. Construye más rápido. Escala infinito.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <button className="px-12 py-6 bg-zs-blue text-white font-black uppercase italic tracking-widest rounded-2xl hover:bg-zs-blue/80 transition-all drop-shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-4 group">
                Inicializar <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <Link href="/coming-soon" className="px-12 py-5 rounded-2xl bg-zs-bg-secondary/50 border border-zs-border hover:border-zs-blue/30 text-white flex items-center justify-center gap-3 group transition-all backdrop-blur-md">
                <Terminal className="w-5 h-5 text-zs-text-muted group-hover:text-zs-blue transition-colors" />
                <span className="text-sm font-black uppercase tracking-widest">Documentación</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            style={{ y: y1 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-zs-blue/20 to-zs-violet/20 blur-2xl rounded-full opacity-50 animate-pulse" />

            {/* Mascot Image Overlay */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotateZ: [0, 5, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-32 -right-16 z-20 w-64 h-64 drop-shadow-[0_0_25px_rgba(37,99,235,0.6)]"
            >
              <Image
                src="/images/mascot.png"
                alt="Zona Sur Tech Mascot"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zs-border/50">
              <HackerTerminal />
            </div>
          </motion.div>

        </div>
      </section>

      {/* LIVE STATS TAPE */}
      <div className="relative z-20 bg-zs-blue/10 border-y border-zs-blue/20 py-4 overflow-hidden flex items-center backdrop-blur-md">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap items-center gap-16 px-8"
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-16">
              <div className="flex items-center gap-4 text-white">
                <Activity className="text-zs-blue w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Zero Downtime (99.999%)</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Globe className="text-zs-cyan w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">64 Edge Nodes Globales</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Shield className="text-zs-emerald w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">E2E Encryption Activa</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Zap className="text-zs-violet w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">&lt; 15ms Latencia Global</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* BENTO BOX FEATURES SECTION */}
      <section className="py-32 relative z-10 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
              Arquitectura <br className="md:hidden" /><span className="text-zs-blue drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Bento-Core</span>
            </h2>
            <p className="text-zs-text-secondary text-lg max-w-2xl mx-auto">
              Componentes atómicos diseñados para operar en perfecta sincronía.
              El framework definitivo para ingenieros pragmáticos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-6xl mx-auto auto-rows-[300px]">

            {/* Box 1 (Large) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="md:col-span-2 zs-card p-10 bg-zs-bg-secondary/40 backdrop-blur-xl group overflow-hidden"
            >
              <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database className="w-[300px] h-[300px] text-zs-cyan" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-zs-cyan/10 border border-zs-cyan/20 flex items-center justify-center text-zs-cyan mb-6">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Nucleus Engine</h3>
                  <p className="text-zs-text-secondary max-w-md leading-relaxed">
                    Motor de datos distribuido con Santi Protocol integrado. Tus datos persistentes, fuertemente garantizados y asegurados a nivel atómico sin cuellos de botella.
                  </p>
                </div>
                <Link href="/technology" className="flex items-center gap-2 text-xs font-black text-zs-cyan uppercase tracking-widest hover:text-white transition-colors w-max">
                  Ver Arquitectura DB <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Box 2 (Tall) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="zs-card p-10 bg-zs-bg-secondary/40 backdrop-blur-xl group overflow-hidden md:row-span-2 relative flex flex-col justify-end"
            >
              <div className="absolute top-10 left-10 right-10 bottom-40 bg-gradient-to-b from-zs-blue/20 to-transparent rounded-2xl border border-zs-blue/20 p-4 font-mono text-xs text-zs-blue flex flex-col gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2"><Lock className="w-3 h-3" /> [AUTH] Token Verified</div>
                <div className="flex gap-2"><Activity className="w-3 h-3" /> [RLS] Policy Enforced</div>
                <div className="flex gap-2"><Globe className="w-3 h-3" /> [CDN] Cache HIT</div>
                <div className="flex gap-2 text-zs-emerald"><Shield className="w-3 h-3" /> Access Granted</div>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Santi Identity<br />Gateway</h3>
                <p className="text-zs-text-secondary leading-relaxed mb-6">
                  Autenticación propietaria multinivel. Gestión de identidades con cifrado de grado militar y validación instantánea en el punto de acceso.
                </p>
                <Link href="/security" className="flex items-center gap-2 text-xs font-black text-zs-blue uppercase tracking-widest hover:text-white transition-colors">
                  Protocolos Sec <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Box 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 }}
              className="zs-card p-10 bg-zs-bg-secondary/40 backdrop-blur-xl group"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <Cpu className="w-8 h-8 text-zs-emerald" />
                    <span className="text-[10px] bg-zs-emerald/10 text-zs-emerald px-2 py-1 rounded font-black tracking-widest uppercase">Pulse Engine</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Global Pulse Mesh</h3>
                  <p className="text-zs-text-secondary text-sm">
                    Lógica de negocio desplegada en una malla global, respondiendo en milisegundos desde cualquier punto del planeta.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Box 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
              className="zs-card p-10 bg-zs-bg-secondary/40 backdrop-blur-xl group"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <Code2 className="w-8 h-8 text-zs-violet" />
                    <span className="text-[10px] bg-zs-violet/10 text-zs-violet px-2 py-1 rounded font-black tracking-widest uppercase">Logic Runtime</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Core Runtime</h3>
                  <p className="text-zs-text-secondary text-sm">
                    Arquitectura híbrida de renderizado ultra-eficiente, diseñada para la máxima capacidad de respuesta y SEO dinámico.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* LIVE EMULATORS SHOWCASE */}
      <section className="py-32 relative z-10 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">
              Ecosistema <span className="text-zs-blue drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Full-Stack</span>
            </h2>
            <p className="text-zs-text-secondary max-w-2xl mx-auto">
              Desde la escritura de código colaborativa en tiempo real hasta la previsualización instantánea multi-dispositivo. La herramienta definitiva para arquitectos de software.
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto items-stretch">
            {/* IDE Emulator Column */}
            <div className="flex flex-col h-[900px] w-full relative group perspective-[2000px]">
              <div className="absolute -inset-4 bg-gradient-to-r from-zs-cyan/20 to-zs-blue/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-[2rem]" />
              <div className="flex-1 relative z-10 transition-transform duration-700 ease-out group-hover:rotate-y-[1deg] group-hover:scale-[1.01] rounded-[2rem] overflow-hidden border border-zs-border/50 bg-[#06080b]">
                <div className="absolute inset-0">
                  <IDEEmulator code={typedCode} activeLines={activeLines} />
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 shrink-0">Entorno Colaborativo</h3>
                <p className="text-xs text-zs-text-muted shrink-0">Presencia en tiempo real, cursores compartidos y terminal de build sincronizada.</p>
              </div>
            </div>

            {/* Device Emulator Column */}
            <div className="flex flex-col h-[900px] w-full relative group perspective-[2000px]">
              <div className="absolute -inset-4 bg-gradient-to-l from-zs-violet/20 to-zs-blue/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-[2rem]" />
              <div className="flex-1 relative z-10 transition-transform duration-700 ease-out group-hover:-rotate-y-[1deg] group-hover:scale-[1.01] rounded-[2rem] overflow-hidden border border-zs-border/50 bg-[#06080b]">
                <div className="absolute inset-0">
                  <DeviceEmulator
                    currentStep={stepIndex}
                    metrics={{
                      latency: typedCode.match(/value="(.*?ms)"/)?.[1] || "12ms",
                      nodes: parseInt(typedCode.match(/nodes=\{(\d+)\}/)?.[1] || "64", 10),
                      connections: typedCode.match(/value="([\d\.A-Z]+)" icon=\{<Globe/)?.[1] || "1.2M",
                      threats: typedCode.match(/value="([\d\.%]+)" icon=\{<Lock/)?.[1] || "0.0%"
                    }}
                  />
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 shrink-0">Previsualización Real</h3>
                <p className="text-xs text-zs-text-muted shrink-0">Hardware shell interactivo en 4K. De Desktop a Mobile con zero latencia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative z-10 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-[3rem] bg-gradient-to-br from-zs-bg-secondary to-black border border-zs-border overflow-hidden p-12 md:p-24 text-center flex flex-col items-center">
            <div className="absolute inset-0 bg-[url('https://camo.githubusercontent.com/4ccf7cbacf761614f09d8aa0242548ad7e6a71e46edef8def7cbafdf5dc8f566/68747470733a2f2f757365722d696d616765732e67697468756275736572636f6e74656e742e636f6d2f343430363730332f3133333633393931322d36636666613364372d633036322d346430372d613962322d6431326435343465353564342e706e67')] bg-cover bg-center opacity-5 mix-blend-overlay" />

            <div className="w-20 h-20 rounded-2xl bg-zs-blue/10 flex items-center justify-center text-zs-blue mb-8 relative z-10">
              <Terminal className="w-10 h-10" />
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-8 relative z-10">
              Deja de <span className="text-zs-text-muted line-through">Configurar</span><br />
              Empieza a <span className="text-zs-blue drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Construir</span>
            </h2>
            <p className="text-xl text-zs-text-secondary font-light max-w-2xl mx-auto mb-12 relative z-10">
              Únete a la nueva ola de ingenieros que eligen la potencia sobre la simplicidad aparente.
            </p>

            <div className="w-full max-w-2xl mx-auto mb-16 relative z-10">
              <TerminalFeedback />
            </div>

            <Link href="/gateway" className="zs-btn-brand px-16 py-6 rounded-2xl flex items-center justify-center gap-4 group relative overflow-hidden backdrop-blur-xl z-10 w-full sm:w-auto shadow-[0_0_40px_rgba(37,99,235,0.3)]">
              <span className="relative text-lg font-black uppercase tracking-widest">Acceso Inmediato</span>
              <ChevronRight className="w-6 h-6 relative group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
