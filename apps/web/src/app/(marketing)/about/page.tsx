"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Target, Rocket, Award, Shield, Zap, Globe, Cpu } from "lucide-react";
import { LogoZS } from "@repo/ui/src/components/LogoZS";

const milestones = [
  { year: "2026", title: "Fundación Nucleus", desc: "Nace Zona Sur Tech con la misión de democratizar la arquitectura de alta complejidad." },
  { year: "2027", title: "Global Expansion", desc: "Despliegue de nodos en 4 continentes, alcanzando latencias menores a 30ms." },
  { year: "2028", title: "Santi OS", desc: "Lanzamiento de nuestro propio kernel de procesamiento distribuido." },
];

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 bg-zs-bg-primary min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zs-blue/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-zs-blue text-xs font-black uppercase tracking-[0.4em] mb-4">Nuestra Identidad</h2>
          <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-8 leading-none">
            Más allá del <br /> <span className="text-zs-blue drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">Software</span>
          </h1>
          <p className="text-2xl text-zs-text-secondary leading-relaxed font-light">
            En Zona Sur Tech, no solo escribimos código; forjamos el backbone digital
            de la próxima generación de empresas disruptivas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-zs-blue/10 border border-zs-blue/20 flex items-center justify-center text-zs-blue flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Visión Radical</h3>
                <p className="text-zs-text-secondary leading-relaxed">
                  Creemos en un mundo donde la infraestructura técnica no sea una limitación,
                  sino el catalizador principal para la innovación exponencial.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-zs-violet/10 border border-zs-violet/20 flex items-center justify-center text-zs-violet flex-shrink-0">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Ejecución de Élite</h3>
                <p className="text-zs-text-secondary leading-relaxed">
                  Nuestros estándares de ingeniería son innegociables. Cada línea de código
                  está optimizada para el máximo rendimiento.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 bg-zs-blue/10 blur-[80px] rounded-full" />
            <motion.div
              animate={{ rotateY: [0, 10, 0], rotateX: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 p-12 bg-zs-bg-secondary/40 backdrop-blur-3xl border border-zs-border rounded-[3rem] shadow-2xl flex flex-col items-center text-center"
            >
              <LogoZS className="w-32 h-32 text-zs-blue mb-8 shadow-zs-glow-blue/20" />
              <span className="text-xs font-black text-zs-text-muted uppercase tracking-[0.5em] mb-2">Established 2026</span>
              <p className="text-white text-sm font-bold uppercase tracking-widest italic">Zona Sur Tech Protocol</p>
            </motion.div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-32">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-16 text-center">Nuestra <span className="text-zs-blue">Trayectoria</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-zs-bg-secondary/20 border border-zs-border relative group"
              >
                <span className="text-5xl font-black text-zs-blue/20 group-hover:text-zs-blue/40 transition-colors absolute top-4 right-4">{m.year}</span>
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4 relative z-10">{m.title}</h4>
                <p className="text-sm text-zs-text-secondary leading-relaxed relative z-10">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Invitation */}
        <section className="p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-zs-bg-secondary to-black border border-zs-border text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 p-8 opacity-5">
            <Users className="w-64 h-64 text-white" />
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none relative z-10">¿Quieres ser parte de <br /><span className="text-zs-blue">nuestra historia?</span></h2>
          <p className="text-zs-text-secondary max-w-2xl mx-auto mb-12 relative z-10 leading-relaxed text-lg">
            Buscamos visionarios, rebeldes y expertos técnicos que quieran dejar una marca
            imborrable en la industria tecnológica.
          </p>
          <Link href="/careers">
            <button className="zs-btn-brand bg-white text-zs-blue shadow-white/10 px-12 py-5 text-sm font-black uppercase tracking-widest relative z-10">
              Ver Posiciones Abiertas
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}
