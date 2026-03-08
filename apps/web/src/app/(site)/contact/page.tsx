"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send, Github, Twitter, Linkedin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="pt-32 pb-24 bg-zs-bg-primary min-h-screen relative overflow-hidden font-mono">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(var(--color-zs-blue) 1px, transparent 0)`, backgroundSize: '30px 30px' }} />

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-zs-blue text-xs font-black uppercase tracking-[0.4em] mb-4">Canales Abiertos</h2>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-8 leading-none">
              Inicia la <br /> <span className="text-zs-blue shadow-zs-glow-blue">Conexión</span>
            </h1>
            <p className="text-xl text-zs-text-secondary leading-relaxed mb-12 max-w-md">
              Estamos listos para discutir tu próximo gran salto tecnológico.
              Nuestro equipo responde en tiempo real a las solicitudes de alta prioridad.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-zs-bg-secondary border border-zs-border flex items-center justify-center text-zs-blue group-hover:shadow-zs-glow-blue transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zs-text-muted font-black uppercase tracking-widest block mb-1">Direct Kernel Mail</span>
                  <span className="text-lg font-bold text-white hover:text-zs-blue transition-colors cursor-pointer">hello@zonasur.tech</span>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-zs-bg-secondary border border-zs-border flex items-center justify-center text-zs-blue group-hover:shadow-zs-glow-blue transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zs-text-muted font-black uppercase tracking-widest block mb-1">Secure Line</span>
                  <span className="text-lg font-bold text-white transition-colors cursor-default">+52 (202) 400-GLOBAL</span>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-xl bg-zs-bg-secondary border border-zs-border flex items-center justify-center text-zs-blue group-hover:shadow-zs-glow-blue transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zs-text-muted font-black uppercase tracking-widest block mb-1">Base de Operaciones</span>
                  <span className="text-lg font-bold text-white">Cloud Native / Global Remote</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="zs-card p-12 bg-zs-bg-secondary/40 backdrop-blur-3xl border-zs-border/60"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest ml-1">Identidad / Nombre</label>
                  <input type="text" placeholder="Tu nombre" className="zs-input bg-black/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest ml-1">Protocolo Email</label>
                  <input type="email" placeholder="email@dominio.com" className="zs-input bg-black/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest ml-1">Asunto de Misión</label>
                <input type="text" placeholder="¿Cómo podemos escalar juntos?" className="zs-input bg-black/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest ml-1">Payload / Mensaje</label>
                <textarea rows={5} placeholder="Describe tus requerimientos técnicos..." className="zs-input bg-black/20 resize-none" />
              </div>

              <button type="submit" className="zs-btn-brand w-full py-5 rounded-2xl flex items-center justify-center gap-3 group relative overflow-hidden mt-8">
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative font-black uppercase tracking-widest">Desplegar Mensaje</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative" />
              </button>
            </form>

            <div className="mt-12 pt-12 border-t border-zs-border">
              <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest block mb-4 text-center">Protocolos Sociales</span>
              <div className="flex justify-center gap-6">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <motion.div key={i} whileHover={{ y: -5 }} className="text-zs-text-secondary hover:text-zs-blue transition-colors cursor-pointer">
                    <Icon className="w-6 h-6" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
