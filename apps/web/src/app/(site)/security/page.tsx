"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Key, Fingerprint, EyeOff, FileLock, UserCheck, ShieldAlert } from "lucide-react";

const securityFeatures = [
    {
        title: "Santi Identity Protocol",
        desc: "Implementación propietaria de protocolos de autorización con flujos PKCE para una interoperabilidad segura entre servicios.",
        icon: <Key className="w-8 h-8" />,
        color: "zs-blue"
    },
    {
        title: "Nucleus Guard",
        desc: "Políticas de integridad granulares en cada segmento de datos, asegurando un aislamiento total entre entornos.",
        icon: <FileLock className="w-8 h-8" />,
        color: "zs-emerald"
    },
    {
        title: "Santi Trust Core",
        desc: "Verificación de integridad en cada petición. Arquitectura basada en pruebas criptográficas continuas.",
        icon: <UserCheck className="w-8 h-8" />,
        color: "zs-violet"
    },
    {
        title: "Santi Enclave",
        desc: "Datos sensibles procesados en entornos aislados y encriptados bajo estándares militares AES-256.",
        icon: <Lock className="w-8 h-8" />,
        color: "zs-cyan"
    }
];

export default function SecurityPage() {
    return (
        <main className="pt-32 pb-24 bg-zs-bg-primary min-h-screen relative overflow-hidden">
            {/* Security Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(var(--color-zs-blue) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

            <div className="container px-4 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-4xl mx-auto mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zs-blue/30 bg-zs-blue/5 text-zs-blue text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        <ShieldCheck className="w-3 h-3" /> Digital Fortress
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-8 leading-none">
                        Seguridad <span className="text-zs-blue drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]">Blindada</span>
                    </h1>
                    <p className="text-xl text-zs-text-secondary leading-relaxed">
                        Hemos construido Zona Sur Tech sobre una base de confianza técnica absoluta.
                        Nuestros protocolos de seguridad superan los estándares de la industria bancaria actual.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
                    {securityFeatures.map((feat, idx) => (
                        <motion.div
                            key={feat.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className="p-10 rounded-[2.5rem] bg-zs-bg-secondary/30 backdrop-blur-xl border border-zs-border hover:border-zs-blue/40 transition-all group"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-${feat.color}/10 border border-${feat.color}/20 flex items-center justify-center text-${feat.color} mb-8 shrink-0 group-hover:shadow-zs-glow-blue transition-all`}>
                                {feat.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">{feat.title}</h3>
                            <p className="text-zs-text-secondary leading-relaxed">
                                {feat.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Audit Log / Transparency Section */}
                <div className="zs-card p-12 bg-black/40 relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">Transparencia de <span className="text-zs-blue">Infraestructura</span></h2>
                            <p className="text-zs-text-secondary mb-8 leading-relaxed">
                                Publicamos reportes de auditoría en tiempo real y permitimos el monitoreo de la integridad del sistema 24/7.
                                Si ocurre una anomalía, nuestro sistema de contingencia Kernel-Level Shard se activa al instante.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {["SOC2 Type II", "ISO 27001", "Compliance Ready", "GDPR+"].map(badge => (
                                    <span key={badge} className="px-3 py-1 bg-zs-bg-primary border border-zs-border rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">{badge}</span>
                                ))}
                            </div>
                        </div>
                        <div className="relative w-full lg:w-96 aspect-square p-2 bg-zs-blue/20 rounded-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-zs-blue/10 animate-pulse rounded-full" />
                            <Fingerprint className="w-32 h-32 text-zs-blue" />
                        </div>
                    </div>
                </div>

                <div className="mt-24 text-center">
                    <p className="text-zs-text-muted text-[10px] font-black uppercase tracking-[0.5em] mb-4">Zona Sur Tech Protocol v3.4</p>
                    <div className="flex justify-center gap-1">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="w-1 h-3 bg-zs-border rounded-full" />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
