"use client";

import { motion } from "framer-motion";
import { Zap, Code, Database, Wind, Globe, Rocket, Terminal, Box } from "lucide-react";



const techStack = [
    {
        name: "Santi Logic Core",
        role: "Frontend Runtime",
        desc: "Núcleo de ejecución con streaming de datos para interactividad instantánea.",
        icon: <Rocket className="w-8 h-8" />,
        color: "zs-blue"
    },
    {
        name: "Nucleus DB",
        role: "Data Engine",
        desc: "Malla de datos global basada en protocolos Santi para alta disponibilidad.",
        icon: <Database className="w-8 h-8" />,
        color: "zs-emerald"
    },
    {
        name: "Santi Protocol",
        role: "Integrity Layer",
        desc: "Capa de definición de esquemas con tipado estricto para máxima seguridad.",
        icon: <Box className="w-8 h-8" />,
        color: "zs-violet"
    },
    {
        name: "Nucleus Style",
        role: "Visual Engine",
        desc: "Motor estético propietario con aceleración por hardware para efectos avanzados.",
        icon: <Wind className="w-8 h-8" />,
        color: "zs-cyan"
    }
];

const stats = [
    { label: "Build Time", value: "< 2.5s" },
    { label: "Performance", value: "99/100" },
    { label: "Security", value: "Level 4" },
    { label: "Scalability", value: "Infinite" },
];

export default function TechnologyClient({ 
    pageTitle, 
    pageSubtitle 
}: { 
    pageTitle?: string | null, 
    pageSubtitle?: string | null 
}) {
    const titleText = pageTitle || "Santi Logic";
    const subtitleText = pageSubtitle || "Hemos seleccionado las tecnologías más disruptivas del mercado para construir una base sólida, segura y ridículamente rápida.";

    return (
        <main className="pt-32 pb-24 bg-zs-bg-primary min-h-screen relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="zs-orb w-[800px] h-[800px] bg-zs-blue/5 -top-[400px] -left-[400px] shadow-zs-glow-blue" />
            <div className="zs-orb w-[800px] h-[800px] bg-zs-violet/5 -bottom-[400px] -right-[400px] shadow-zs-glow-violet" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-zs-violet text-xs font-black uppercase tracking-[0.4em] mb-4 text-glow-violet">Stack de Ingeniería</h2>
                        <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-8 leading-none">
                            {titleText.split(' ')[0]} <span className="text-zs-violet drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">{titleText.split(' ').slice(1).join(' ') || "Logic"}</span>
                        </h1>
                        <p className="text-xl text-zs-text-secondary leading-relaxed max-w-xl whitespace-pre-line">
                            {subtitleText}
                        </p>

                        <div className="grid grid-cols-2 gap-8 mt-12">
                            {stats.map((s, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-4xl font-black text-white italic tracking-tighter mb-1">{s.value}</span>
                                    <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-[0.2em]">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="hidden lg:block relative"
                    >
                        <div className="absolute inset-0 bg-zs-violet/10 blur-[100px] rounded-full" />
                        <div className="relative p-8 bg-zs-bg-secondary/40 backdrop-blur-3xl border border-zs-border rounded-[2.5rem] shadow-2xl">
                            <Terminal className="text-zs-violet mb-6 w-12 h-12" />
                            <pre className="font-mono text-sm text-zs-text-secondary leading-relaxed">
                                {`const platform = {
  nucleus: ["LogicCore", "SantiDB", "ProtocolX"],
  performance: "Maximum",
  standards: "Advanced 2026",
  status: "Optimized",
  ready: () => true
};

platform.deploy();`}
                            </pre>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {techStack.map((tech, idx) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="zs-card p-8 group border-zs-border/40"
                        >
                            <div className={`mb-6 text-${tech.color} group-hover:scale-110 transition-transform`}>
                                {tech.icon}
                            </div>
                            <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest block mb-2">{tech.role}</span>
                            <h3 className="text-xl font-bold text-white mb-4">{tech.name}</h3>
                            <p className="text-xs text-zs-text-secondary leading-relaxed">
                                {tech.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Engineering Info */}
                <section className="p-12 rounded-[2rem] bg-gradient-to-br from-zs-bg-secondary to-zs-bg-primary border border-zs-violet/20 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent)]" />
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6 relative z-10">Diseñado para <span className="text-zs-violet">Developers</span></h2>
                    <p className="text-zs-text-secondary max-w-2xl mx-auto mb-8 relative z-10 leading-relaxed">
                        Nuestra API y SDKs permiten una integración fluida en menos de 5 minutos,
                        cumpliendo con los estándares más altos de seguridad y performance.
                    </p>
                    <button className="zs-btn-brand bg-zs-violet shadow-zs-glow-violet px-10 py-4 text-sm font-black uppercase tracking-widest relative z-10">
                        Explorar Documentación
                    </button>
                </section>
            </div>
        </main>
    );
}
