"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
    Terminal, Shield, ChevronRight, Cpu, Activity, 
    BellRing, Share2, Scan, Zap, Layers, Radio,
    HardDrive, Network, GitBranch, Binary, Eye
} from "lucide-react";
import { GlitchText } from "@/components/ui/GlitchText.client";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ZST API REFERENCE v6.0 — VISUAL TELEMETRY EDITION
 * Enfoque: Eliminación de texto descriptivo en favor de visualizaciones gráficas abstractas.
 */

export default function ApiReferencePage() {
    const [activeSection, setActiveSection] = useState("telemetry");

    const sections = {
        telemetry: {
            title: "TELEMETRÍA_CORE",
            subtitle: "NODE_STATUS_LINK",
            icon: <Activity className="w-5 h-5" />,
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-cascade">
                    <GraphModule title="NETWORK_FLOW_L7" type="pulse" color="blue" />
                    <GraphModule title="KERNEL_LOAD_HEATMAP" type="grid" color="violet" />
                    <GraphModule title="LATENCY_OSCILLOSCOPE" type="wave" color="cyan" />
                    <GraphModule title="SYNC_ATOMIC_HASH" type="binary" color="emerald" />
                </div>
            )
        },
        infra: {
            title: "INFRAESTRUCTURA",
            subtitle: "MESH_GRID_v4",
            icon: <Layers className="w-5 h-5" />,
            content: (
                <div className="space-y-8 animate-cascade">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <StatusIndicator label="EDGE_NODES" val="64" percent={100} color="blue" />
                         <StatusIndicator label="ROUTING_EFF" val="98.2%" percent={98} color="cyan" />
                         <StatusIndicator label="UPTIME_SYNC" val="99.999" percent={99} color="emerald" />
                    </div>
                    <div className="zs-card p-10 bg-black/40 border-zs-border overflow-hidden relative min-h-[400px]">
                         <AbstractMeshVisualization />
                         <div className="absolute bottom-8 left-8">
                             <span className="text-[10px] font-black text-zs-blue uppercase tracking-[0.5em] animate-pulse">GLOBAL_MESH_ACTIVE</span>
                         </div>
                    </div>
                </div>
            )
        },
        security: {
            title: "AUTENTICACIÓN",
            subtitle: "IDENTITY_UPLINK",
            icon: <Shield className="w-5 h-5" />,
            content: (
                <div className="space-y-12 animate-cascade">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <AuthProtocolCard 
                            title="GATEWAY_AUTH_SYNC" 
                            protocol="SUPABASE_AUTH_HELPER" 
                            status="STABLE"
                            code={`const supabase = createClient();
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { display_name: name }
  }
});
// Identity created at gateway level`}
                         />
                         <AuthProtocolCard 
                            title="NODE_INVITATION_FLOW" 
                            protocol="RESEND_API_UPLINK" 
                            status="ACTIVE"
                            code={`// src/app/api/invitations/route.ts
await resend.emails.send({
  from: 'Zona Sur Tech <nodes@zonasurtech.online>',
  to: member_email,
  subject: 'Access Granted: Node Cluster',
  react: InvitationEmail({ link })
});
// Node access pending validation`}
                         />
                    </div>

                    <div className="zs-card p-12 bg-zs-blue/5 border-zs-blue/20 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <Binary className="w-6 h-6 text-zs-blue" />
                                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">SECURE_EDGE_PROTECTION</h4>
                            </div>
                            <Shield className="w-5 h-5 text-zs-blue/40 group-hover:text-zs-blue transition-colors" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                            <div className="lg:col-span-1">
                                <div className="space-y-6">
                                    <div className="p-4 bg-black/40 border border-zs-border rounded-xl">
                                        <span className="text-[10px] font-black text-zs-text-muted block mb-2 uppercase tracking-widest">LAYER</span>
                                        <span className="text-white font-mono text-sm uppercase">NEXT_JS_MIDDLEWARE</span>
                                    </div>
                                    <div className="p-4 bg-black/40 border border-zs-border rounded-xl">
                                        <span className="text-[10px] font-black text-zs-text-muted block mb-2 uppercase tracking-widest">PROTOCOL</span>
                                        <span className="text-zs-blue font-mono text-sm uppercase">JWT_OAUTH_2.0</span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 h-64 bg-black/60 rounded-3xl border border-zs-border p-8 overflow-hidden relative">
                                <div className="font-mono text-[11px] text-zs-emerald/80 space-y-1">
                                    <p>{`// src/middleware.ts - Edge Protection`}</p>
                                    <p>{`const token = await getToken({ req });`}</p>
                                    <p>{`if (!token && isProtected(req.url)) {`}</p>
                                    <p>{`  return NextResponse.redirect('/signin');`}</p>
                                    <p>{`}`}</p>
                                    <p>{`// Cluster access synchronized via JWT`}</p>
                                    <motion.div 
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 1 }}
                                        className="h-4 w-1 bg-zs-emerald mt-2"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SecurityShieldModule label="SHIELD_INTEGRITY" level={98} protocol="NEXTAUTH_JS" />
                        <SecurityShieldModule label="ENCRYPTION_LAYER" level={100} protocol="AES_256_GCM" />
                        <SecurityShieldModule label="THREAT_DETECTION" level={95} protocol="AI_GUARD_V4" />
                    </div>
                </div>
            )
        }
    };

    return (
        <main className="min-h-screen bg-zs-bg-primary pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
            {/* Neural Matrix Shader */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05]" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-zs-blue) 1px, transparent 0)', backgroundSize: '40px 40px' }} 
            />
            <div className="fixed inset-0 pointer-events-none">
                 <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] bg-zs-blue/5 rounded-full blur-[160px]" />
                 <div className="absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-zs-violet/5 rounded-full blur-[140px]" />
            </div>

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="h-px w-16 bg-zs-blue" />
                             <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zs-blue/10 border border-zs-blue/20 text-zs-blue font-mono">
                                <Scan className="w-4 h-4 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em]">SYSTEM_VISUALIZER_v6.0</span>
                             </div>
                             <div className="h-px w-32 bg-gradient-to-r from-zs-blue/30 to-transparent" />
                        </div>

                        <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.7] mb-8">
                            LINK <br />
                            <GlitchText 
                                text="Status" 
                                className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet drop-shadow-[0_0_50px_rgba(37,99,235,0.5)]"
                            />
                        </h1>
                        <p className="text-[10px] font-black text-zs-text-muted uppercase tracking-[0.8em] animate-pulse">MONITORING_REALTIME_DATA_FLOW</p>
                    </div>

                    <div className="hidden lg:block w-72 h-72 relative">
                         <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-x-0 inset-y-0 border-2 border-dashed border-zs-blue/20 rounded-full scale-125" 
                         />
                         <img src="/images/zst_kernel_core.png" alt="Kernel" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_80px_rgba(37,99,235,0.6)]" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Visual Control Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        {Object.entries(sections).map(([key, section]) => (
                            <button
                                key={key}
                                onClick={() => setActiveSection(key)}
                                className={`w-full p-10 rounded-[40px] border transition-all duration-700 relative overflow-hidden group ${
                                    activeSection === key 
                                    ? 'bg-zs-bg-secondary border-zs-blue/60 shadow-zs-glow-blue/20 translate-x-4' 
                                    : 'bg-zs-bg-secondary/20 border-zs-border/40 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-8">
                                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-700 ${
                                            activeSection === key ? 'bg-zs-blue text-white shadow-zs-glow-blue' : 'bg-black/60 text-zs-text-muted'
                                        }`}>
                                            {section.icon}
                                        </div>
                                        <div className="text-left">
                                            <h4 className={`text-2xl font-black uppercase italic tracking-tighter transition-colors ${activeSection === key ? 'text-white' : 'text-zs-text-muted'}`}>
                                                {section.title}
                                            </h4>
                                            <span className="text-[9px] font-black text-zs-text-muted uppercase tracking-[0.3em] font-mono">{section.subtitle}</span>
                                        </div>
                                    </div>
                                    {activeSection === key && (
                                        <div className="flex gap-1.5 animate-pulse">
                                            {[1,2,3,4].map(i => <div key={i} className="w-1 h-4 bg-zs-blue rounded-full" />)}
                                        </div>
                                    )}
                                </div>
                                {activeSection === key && (
                                     <motion.div layoutId="nav-glow" className="absolute inset-0 bg-gradient-to-r from-zs-blue/20 via-transparent to-transparent" />
                                )}
                            </button>
                        ))}

                        <div className="mt-12 p-12 rounded-[48px] bg-black/40 border border-zs-border relative overflow-hidden">
                             <h6 className="text-[9px] font-black text-zs-text-muted uppercase tracking-[0.5em] mb-10 text-center">GLOBAL_LOAD_DIST</h6>
                             <div className="flex justify-center gap-6 h-48 items-end pb-4">
                                  {[60, 40, 85, 20, 55, 90, 35].map((h, i) => (
                                      <motion.div 
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1.5, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                                        className="w-4 bg-zs-blue/40 rounded-full relative group"
                                      >
                                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black text-zs-blue">{h}%</div>
                                      </motion.div>
                                  ))}
                             </div>
                             <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zs-blue/20 to-transparent animate-scan" />
                        </div>
                    </div>

                    {/* Graphics Matrix Matrix */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className="zs-card p-4 sm:p-16 bg-zs-bg-secondary/40 backdrop-blur-3xl border-zs-border/60 relative overflow-hidden min-h-[850px]"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                     <Radio className="w-64 h-64" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-20 pb-12 border-b border-zs-border/40">
                                        <div className="flex items-center gap-10">
                                            <div className="w-24 h-24 rounded-[32px] bg-zs-bg-primary border border-zs-border flex items-center justify-center text-zs-blue relative shadow-zs-glow-blue/10">
                                                 {sections[activeSection as keyof typeof sections].icon}
                                                 <div className="absolute inset-x-0 bottom-0 h-1 bg-zs-blue animate-pulse" />
                                            </div>
                                            <div>
                                                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-2">
                                                    {sections[activeSection as keyof typeof sections].title}
                                                </h2>
                                                <div className="flex items-center gap-4">
                                                     <div className="w-2 h-2 rounded-full bg-zs-emerald animate-pulse" />
                                                     <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-[0.4em] font-mono">ENCRYPTED_TELEMETRY_STREAM</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex flex-col items-end gap-2 font-mono">
                                             <span className="text-[9px] font-black text-zs-text-muted uppercase tracking-widest">HASH_SEED: 0x82f9...</span>
                                             <span className="text-xs font-black text-white/40 italic">ZST_LINK_v6.0</span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full">
                                        {sections[activeSection as keyof typeof sections].content}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}

function GraphModule({ title, type, color }: { title: string, type: 'pulse' | 'grid' | 'wave' | 'binary', color: string }) {
    return (
        <div className="zs-card p-10 bg-black/40 border-zs-border group hover:border-zs-blue/30 transition-all overflow-hidden h-80 relative">
             <div className="flex items-center justify-between mb-8 relative z-10">
                 <h4 className="text-[10px] font-black text-zs-text-muted uppercase tracking-[0.5em] group-hover:text-white transition-colors">{title}</h4>
                 <div className={`w-2 h-2 rounded-full bg-zs-${color} animate-pulse shadow-zs-glow-${color}`} />
             </div>
             
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                  {type === 'pulse' && <PulseGraph color={color} />}
                  {type === 'grid' && <HeatmapGrid color={color} />}
                  {type === 'wave' && <OscilloscopeWave color={color} />}
                  {type === 'binary' && <BinaryMatrix color={color} />}
             </div>

             <div className="absolute bottom-8 right-8 flex gap-1 relative z-10">
                 {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 bg-zs-${color}/30 rounded-full`} />)}
             </div>
        </div>
    );
}

function StatusIndicator({ label, val, percent, color }: { label: string, val: string, percent: number, color: string }) {
    return (
        <div className="zs-card p-8 bg-black/30 border-zs-border/50 text-center space-y-4">
             <span className="text-[9px] font-black text-zs-text-muted uppercase tracking-[0.4em] block">{label}</span>
             <h3 className={`text-4xl font-black italic tracking-tighter text-zs-${color}`}>{val}</h3>
             <div className="h-1 w-full bg-zs-border rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={`h-full bg-zs-${color}`}
                  />
             </div>
        </div>
    );
}

function SecurityShieldModule({ label, level, protocol }: { label: string, level: number, protocol: string }) {
    return (
        <div className="zs-card p-10 bg-black/40 border-zs-border flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
             <div className="w-24 h-24 rounded-full border-2 border-dashed border-zs-blue/20 flex items-center justify-center animate-spin-slow">
                  <Shield className="w-10 h-10 text-zs-blue group-hover:scale-125 transition-transform" />
             </div>
             <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-4">{label}</h4>
                  <div className="flex flex-col items-center gap-2">
                       <span className="text-3xl font-black text-zs-blue italic">{level}%</span>
                       <span className="text-[8px] font-black text-zs-text-muted uppercase tracking-widest">{protocol}</span>
                  </div>
             </div>
             <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zs-blue/40 shadow-zs-glow-blue" />
        </div>
    );
}

function AuthProtocolCard({ title, protocol, status, code }: { title: string, protocol: string, status: string, code: string }) {
    return (
        <div className="zs-card p-10 bg-black/40 border-zs-border overflow-hidden relative group hover:border-zs-blue/40 transition-all flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zs-blue uppercase tracking-[0.4em] mb-2">{title}</span>
                    <span className="text-[8px] font-black text-zs-text-muted uppercase tracking-[0.2em]">{protocol}</span>
                </div>
                <div className="px-3 py-1 bg-zs-blue/10 border border-zs-blue/20 rounded-lg">
                    <span className="text-[8px] font-black text-zs-blue uppercase tracking-widest animate-pulse">{status}</span>
                </div>
            </div>
            
            <div className="bg-black/80 rounded-2xl p-6 border border-zs-border/50 flex-1 flex flex-col relative overflow-hidden group-hover:bg-black/90 transition-colors">
                <div className="font-mono text-[10px] text-zinc-400 leading-relaxed">
                    <pre className="whitespace-pre-wrap">{code}</pre>
                </div>
                <div className="absolute bottom-4 right-4 text-zs-blue/20 group-hover:text-zs-blue transition-colors">
                    <GitBranch className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}

/* --- Abstract Visual Components --- */

function PulseGraph({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 400 200" className="w-full h-32 stroke-current">
            <motion.path
                d="M 0 100 L 50 100 L 60 40 L 80 160 L 90 100 L 150 100 L 160 20 L 180 180 L 190 100 L 250 100 L 260 60 L 280 140 L 290 100 L 400 100"
                fill="none"
                strokeWidth="2"
                className={`text-zs-${color}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
        </svg>
    );
}

function HeatmapGrid({ color }: { color: string }) {
    return (
        <div className="grid grid-cols-8 gap-2 w-full p-8 opacity-60">
             {Array.from({length: 32}).map((_, i) => (
                 <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                    className={`h-4 rounded-sm bg-zs-${color}`}
                    style={{ opacity: Math.random() }}
                 />
             ))}
        </div>
    );
}

function OscilloscopeWave({ color }: { color: string }) {
    return (
        <div className="flex items-end gap-1 h-32 w-full px-12 opacity-80">
             {Array.from({length: 40}).map((_, i) => (
                 <motion.div 
                    key={i}
                    animate={{ height: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`w-px bg-zs-${color}`}
                 />
             ))}
        </div>
    );
}

function BinaryMatrix({ color }: { color: string }) {
    return (
        <div className="font-mono text-[8px] text-zinc-800 break-all p-12 overflow-hidden w-full h-full text-justify leading-none select-none">
             {Array.from({length: 1500}).map(() => Math.floor(Math.random() * 2)).join('')}
             <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-zs-bg-primary via-transparent to-transparent" />
        </div>
    );
}

function SecurityWaveform() {
    return (
        <div className="flex items-center gap-0.5 h-full opacity-60 overflow-hidden">
             {Array.from({length: 120}).map((_, i) => (
                 <motion.div 
                    key={i}
                    animate={{ height: ['40px', '120px', '40px'] }}
                    transition={{ duration: 2, delay: i * 0.05, repeat: Infinity }}
                    className="w-1 bg-zs-rose rounded-full"
                 />
             ))}
        </div>
    );
}

function AbstractMeshVisualization() {
    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
             {Array.from({length: 5}).map((_, i) => (
                 <motion.div 
                    key={i}
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                    className="absolute border border-zs-blue/40 rounded-full"
                    style={{ width: `${(i + 1) * 150}px`, height: `${(i + 1) * 150}px` }}
                 />
             ))}
             <div className="relative w-4 h-4 rounded-full bg-zs-blue shadow-zs-glow-blue" />
        </div>
    );
}
