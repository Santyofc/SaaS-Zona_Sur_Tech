"use client";

import React, { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send, Github, Twitter, Linkedin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleApiSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name")?.toString(),
      email: formData.get("email")?.toString(),
      subject: formData.get("subject")?.toString(),
      message: formData.get("body")?.toString(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-8 leading-none">
              Inicia la <br /> <span className="text-zs-blue shadow-zs-glow-blue">Conexión</span>
            </h1>
            <p className="text-xl text-zs-text-secondary leading-relaxed mb-12 max-w-md">
              Estamos listos para discutir tu próximo gran salto tecnológico.
              Nuestro equipo responde en tiempo real a las solicitudes de alta prioridad.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-zs-bg-secondary border border-zs-border flex items-center justify-center text-zs-blue group-hover:shadow-zs-glow-blue transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 w-full">
                  <span className="text-[10px] text-zs-text-muted font-black uppercase tracking-widest block mb-2">Direct Kernel Mail</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a href={`mailto:${siteConfig.contact.emails.admin}`} className="flex items-center gap-2 p-3 rounded-lg border border-zs-border bg-zs-bg-secondary/50 text-white hover:border-zs-blue/50 hover:bg-zs-blue/5 hover:text-zs-blue transition-all cursor-pointer group/email">
                      <Send size={14} className="text-zs-text-muted group-hover/email:text-zs-blue group-hover/email:translate-x-0.5 transition-all" />
                      <span className="text-xs font-bold break-all">{siteConfig.contact.emails.admin}</span>
                    </a>
                    <a href={`mailto:${siteConfig.contact.emails.support}`} className="flex items-center gap-2 p-3 rounded-lg border border-zs-border bg-zs-bg-secondary/50 text-zs-text-secondary hover:border-zs-blue/50 hover:bg-zs-blue/5 hover:text-white transition-all cursor-pointer group/email">
                      <Send size={14} className="text-zs-text-muted group-hover/email:text-zs-blue group-hover/email:translate-x-0.5 transition-all" />
                      <span className="text-xs font-medium break-all">{siteConfig.contact.emails.support}</span>
                    </a>
                    <a href={`mailto:${siteConfig.contact.emails.santi}`} className="flex items-center gap-2 p-3 rounded-lg border border-zs-border bg-zs-bg-secondary/50 text-zs-text-secondary hover:border-zs-blue/50 hover:bg-zs-blue/5 hover:text-white transition-all cursor-pointer group/email">
                      <Send size={14} className="text-zs-text-muted group-hover/email:text-zs-blue group-hover/email:translate-x-0.5 transition-all" />
                      <span className="text-xs font-medium break-all">{siteConfig.contact.emails.santi}</span>
                    </a>
                    <a href={`mailto:${siteConfig.contact.emails.notifications}`} className="flex items-center gap-2 p-3 rounded-lg border border-zs-border bg-zs-bg-secondary/50 text-zs-text-secondary hover:border-zs-blue/50 hover:bg-zs-blue/5 hover:text-white transition-all cursor-pointer group/email">
                      <Send size={14} className="text-zs-text-muted group-hover/email:text-zs-blue group-hover/email:translate-x-0.5 transition-all" />
                      <span className="text-xs font-medium break-all">{siteConfig.contact.emails.notifications}</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-6 group mt-8">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-zs-bg-secondary border border-zs-border flex items-center justify-center text-zs-blue group-hover:shadow-zs-glow-blue transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 w-full">
                  <span className="text-[10px] text-zs-text-muted font-black uppercase tracking-widest block mb-2">Secure Line</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a href={`https://wa.me/${siteConfig.contact.phones.corporate.number.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border border-zs-border bg-zs-bg-secondary/50 text-white hover:border-zs-emerald/50 hover:bg-zs-emerald/5 hover:text-zs-emerald transition-all cursor-pointer group/wa">
                      <Phone size={14} className="text-zs-text-muted group-hover/wa:text-zs-emerald group-hover/wa:-rotate-12 transition-all" />
                      <span className="text-xs font-bold">{siteConfig.contact.phones.corporate.display} <span className="text-[10px] text-zs-text-muted ml-1">(Corp)</span></span>
                    </a>
                    <a href={`https://wa.me/${siteConfig.contact.phones.personal.number.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border border-zs-border bg-zs-bg-secondary/50 text-zs-text-secondary hover:border-zs-emerald/50 hover:bg-zs-emerald/5 hover:text-zs-emerald transition-all cursor-pointer group/wa">
                      <Phone size={14} className="text-zs-text-muted group-hover/wa:text-zs-emerald group-hover/wa:-rotate-12 transition-all" />
                      <span className="text-xs font-medium">{siteConfig.contact.phones.personal.display} <span className="text-[10px] text-zs-text-muted ml-1">(Personal)</span></span>
                    </a>
                  </div>
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
            {submitStatus === "success" ? (
              <div className="text-center py-12 animate-zs-fade-in">
                <div className="w-16 h-16 rounded-full bg-zs-emerald/10 border border-zs-emerald/30 mx-auto flex items-center justify-center mb-6 shadow-zs-glow-emerald">
                  <Send className="w-8 h-8 text-zs-emerald" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-wider">Transmisión Exitosa</h3>
                <p className="text-zs-text-secondary leading-relaxed max-w-sm mx-auto">
                  Tu payload ha sido entregado a los servidores centrales. Prepararemos una respuesta en breve.
                </p>
                <button 
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-8 text-xs font-bold text-zs-blue hover:text-white transition-colors uppercase tracking-widest"
                >
                  [ Enviar nuevo mensaje ]
                </button>
              </div>
            ) : (
              <form onSubmit={handleApiSubmit} className="space-y-6">
                
                {submitStatus === "error" && (
                  <div className="p-4 rounded-xl bg-zs-rose/10 border border-zs-rose/20 text-zs-rose text-[10px] font-bold uppercase tracking-widest animate-zs-fade-in text-center">
                    ANOMALÍA DETECTADA AL CONTACTAR EL SERVIDOR. <br /> INTENTA MÁS TARDE O USA KERNEL MAIL.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest ml-1">Identidad / Nombre</label>
                    <input id="name" type="text" name="name" required placeholder="Tu nombre" className="zs-input bg-black/20 focus:border-zs-blue/50 focus:ring-zs-blue/10" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest ml-1">Protocolo Email</label>
                    <input id="email" type="email" name="email" required placeholder="email@dominio.com" className="zs-input bg-black/20 focus:border-zs-blue/50 focus:ring-zs-blue/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest ml-1">Asunto de Misión</label>
                  <input id="subject" type="text" name="subject" required placeholder="¿Cómo podemos escalar juntos?" className="zs-input bg-black/20 focus:border-zs-blue/50 focus:ring-zs-blue/10" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="body" className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest ml-1">Payload / Mensaje</label>
                  <textarea id="body" rows={5} name="body" required placeholder="Describe tus requerimientos técnicos..." className="zs-input bg-black/20 resize-none focus:border-zs-blue/50 focus:ring-zs-blue/10" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="zs-btn-brand w-full py-5 rounded-2xl flex items-center justify-center gap-3 group relative overflow-hidden mt-8 disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="relative font-black uppercase tracking-widest">
                    {isSubmitting ? "Sincronizando..." : "Desplegar Mensaje al Core"}
                  </span>
                  {!isSubmitting && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative" />}
                </button>
              </form>
            )}

            <div className="mt-12 pt-12 border-t border-zs-border">
              <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest block mb-4 text-center">Protocolos Sociales</span>
              <div className="flex justify-center gap-6">
                <a href={siteConfig.contact.socials.github} target="_blank" rel="noopener noreferrer" aria-label="Visit our Github Profile">
                  <motion.div whileHover={{ y: -5 }} className="text-zs-text-secondary hover:text-white transition-colors cursor-pointer">
                    <Github className="w-6 h-6" />
                  </motion.div>
                </a>
                <a href={siteConfig.contact.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter Profile">
                  <motion.div whileHover={{ y: -5 }} className="text-zs-text-secondary hover:text-[#1DA1F2] transition-colors cursor-pointer">
                    <Twitter className="w-6 h-6" />
                  </motion.div>
                </a>
                <a href={siteConfig.contact.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Visit our LinkedIn Profile">
                  <motion.div whileHover={{ y: -5 }} className="text-zs-text-secondary hover:text-[#0A66C2] transition-colors cursor-pointer">
                    <Linkedin className="w-6 h-6" />
                  </motion.div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
