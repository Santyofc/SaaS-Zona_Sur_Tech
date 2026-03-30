"use client";

import { motion } from "framer-motion";
import { Brain, Rocket, Code2, Globe, Heart, Star, Users, ArrowRight } from "lucide-react";

const jobCategories = [
    {
        title: "Core Engineering",
        openings: "3 Positions",
        icon: <Code2 className="w-6 h-6" />,
        color: "zs-blue"
    },
    {
        title: "AI & Data Science",
        openings: "1 Position",
        icon: <Brain className="w-6 h-6" />,
        color: "zs-violet"
    },
    {
        title: "Cloud Infrastructure",
        openings: "2 Positions",
        icon: <Globe className="w-6 h-6" />,
        color: "zs-cyan"
    },
    {
        title: "Product Design",
        openings: "Closed",
        icon: <Heart className="w-6 h-6" />,
        color: "zs-rose"
    }
];

export default function CareersPage() {
    return (
        <main className="pt-32 pb-24 bg-zs-bg-primary min-h-screen relative overflow-hidden">
            {/* Background Radial Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent_70%)] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto mb-32"
                >
                    <div className="inline-flex items-center gap-2 mb-8 group cursor-default">
                        <Star className="w-4 h-4 text-zs-amber animate-spin-slow" />
                        <span className="text-zs-text-muted text-[10px] font-black uppercase tracking-[0.5em] group-hover:text-white transition-colors">Join the Elite</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-12">
                        Construye el <span className="text-zs-blue">Futuro</span>
                    </h1>
                    <p className="text-2xl text-zs-text-secondary leading-relaxed font-light">
                        No buscamos empleados. Buscamos arquitectos del mañana dispuestos a redefinir
                        los límites de lo que es posible en la Web.
                    </p>
                </motion.div>

                {/* Culture Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
                    {[
                        { title: "Libertad Absoluta", desc: "Trabaja desde cualquier lugar, cuando quieras. Valoramos resultados, no horas." },
                        { title: "Equipamiento Pro", desc: "Te damos las herramientas que necesitas para ser el mejor en tu campo." },
                        { title: "Propiedad Directa", desc: "Cada ingeniero es dueño de su código y participa en las decisiones de negocio." },
                    ].map((c, i) => (
                        <motion.div
                            key={c.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-3xl bg-zs-bg-secondary/40 border border-zs-border hover:border-zs-blue/40 transition-all text-center"
                        >
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{c.title}</h3>
                            <p className="text-sm text-zs-text-secondary leading-relaxed">{c.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Job Grid */}
                <div className="mb-24">
                    <div className="flex items-center justify-between gap-4 mb-12 border-b border-zs-border pb-6">
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                            <Users className="text-zs-blue" /> Vacantes Disponibles
                        </h2>
                        <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest">Global Remote</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobCategories.map((job, idx) => (
                            <motion.div
                                key={job.title}
                                whileHover={{ x: 10 }}
                                className="zs-card p-8 flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-xl bg-${job.color}/10 border border-${job.color}/20 flex items-center justify-center text-${job.color}`}>
                                        {job.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white group-hover:text-zs-blue transition-colors">{job.title}</h4>
                                        <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest leading-none mt-1">{job.openings}</span>
                                    </div>
                                </div>
                                {job.openings !== "Closed" && (
                                    <ArrowRight className="w-5 h-5 text-zs-blue opacity-0 group-hover:opacity-100 transition-all" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <section className="relative p-16 rounded-[4rem] bg-zs-blue relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent)] transition-transform group-hover:scale-110 duration-1000" />
                    <div className="max-w-3xl relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">¿No ves tu <span className="text-black/40">Rol Ideal?</span></h2>
                        <p className="text-white/80 text-xl mb-12 leading-relaxed">
                            Si crees que puedes aportar algo extraordinario a Zona Sur Tech,
                            escríbenos directamente. Siempre hay espacio para el talento radical.
                        </p>
                        <button className="px-12 py-5 bg-white text-zs-blue rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            Enviar Candidatura Espontánea
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}
