"use client";

import React from "react";
import { Building2, Landmark, CreditCard, ShieldCheck, Globe, Cpu, Network, Database } from "lucide-react";
import { motion } from "framer-motion";

/**
 * ════════════════════════════════════════════════════════════
 * ZS ECOSYSTEM BENTO — ZonaSur Tech
 * Propósito: Demostrar autoridad e interconectividad industrial
 * ════════════════════════════════════════════════════════════
 */

export default function EcosystemBento() {
  return (
    <section className="py-32 px-4 md:px-8 relative overflow-hidden bg-zs-bg-primary">
      <div className="container mx-auto">
        <div className="max-w-4xl mb-14 md:mb-16">
          <div className="flex items-center gap-3 text-zs-blue mb-6">
            <Network className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Red de Interconexión Global</span>
          </div>
          <h2 className="text-[clamp(2.2rem,6.5vw,5rem)] font-black text-white uppercase italic tracking-[-0.03em] leading-[0.92] mb-6 md:mb-7">
            Ecosistema <br />
            <span className="text-zs-blue">Intelectualmente Conectado</span>
          </h2>
          <p className="text-zs-text-secondary text-base md:text-lg font-light leading-relaxed max-w-3xl">
            Nuestra arquitectura no es una isla. Es el núcleo de una red de alta fidelidad que sincroniza datos financieros y operativos con los entes más críticos del país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
          {/* Main: Hacienda CR */}
          <div className="md:col-span-8 md:row-span-2 zs-card p-12 bg-zs-bg-secondary/40 border-zs-blue/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-12 text-zs-blue/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
               <Building2 className="w-80 h-80" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="text-zs-emerald bg-zs-emerald/10 border border-zs-emerald/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">ENLACE ACTIVO</span>
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mt-8 mb-4">Ministerio de <br/>Hacienda CR</h3>
                <p className="text-zs-text-secondary max-w-sm font-light text-base">
                  Certificación completa para Facturación Electrónica v4.3. Sincronización en milisegundos con el núcleo tributario.
                </p>
              </div>
              
              <div className="flex gap-12 items-center">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zs-text-muted uppercase">Latencia Promedio</span>
                    <span className="text-xl font-black text-zs-emerald italic">120ms</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zs-text-muted uppercase">Protocolo</span>
                    <span className="text-xl font-black text-white italic">HTTPS/TLS 1.3</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway */}
          <div className="md:col-span-4 md:row-span-1 zs-card p-8 bg-zs-bg-secondary/40 border-zs-border group">
            <div className="flex items-center justify-between mb-8">
               <div className="w-12 h-12 rounded-xl bg-zs-bg-primary border border-zs-border flex items-center justify-center text-zs-blue group-hover:shadow-zs-glow-blue transition-all">
                  <CreditCard className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest">GATEWAY</span>
            </div>
            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Transacciones</h4>
            <p className="text-zs-text-secondary text-sm font-light mb-6">Integración nativa con PayPal, Stripe y Bancos de Costa Rica.</p>
            <div className="flex gap-4 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                {/* Visual placeholders for logos */}
                <div className="w-10 h-6 bg-white/10 rounded-md" />
                <div className="w-10 h-6 bg-white/10 rounded-md" />
                <div className="w-10 h-6 bg-white/10 rounded-md" />
            </div>
          </div>

          {/* Security Node */}
          <div className="md:col-span-4 md:row-span-1 zs-card p-8 bg-zs-bg-secondary/40 border-zs-border hover:border-zs-violet/30 transition-all group">
             <div className="flex items-center gap-4 mb-8">
               <ShieldCheck className="w-8 h-8 text-zs-violet" />
               <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest italic">ZST_SEC_v2</span>
             </div>
             <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Cifrado de Grado Militar</h4>
             <p className="text-zs-text-secondary text-sm font-light mt-2">Protección de datos bajo la ley nacional 8968.</p>
          </div>

          {/* Infrastructure: AWS */}
          <div className="md:col-span-4 md:row-span-1 zs-card p-8 bg-zinc-900/40 border-zs-border group overflow-hidden">
             <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-20 transition-opacity">
                <Globe className="w-40 h-40" />
             </div>
             <div className="relative z-10">
               <div className="text-[10px] font-bold text-zs-text-muted uppercase mb-2">Infraestructura Core</div>
               <div className="text-2xl font-black text-white italic tracking-tighter uppercase">Nube AWS <br/><span className="text-zs-blue text-sm">Región US-EAST-2</span></div>
               <div className="mt-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zs-emerald animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-zs-emerald italic">Global Reach Enabled</span>
               </div>
             </div>
          </div>

          {/* Tech Nodes */}
          <div className="md:col-span-8 md:row-span-1 border-zs-border grid grid-cols-2 gap-6">
             <div className="zs-card p-8 bg-zs-bg-secondary/40 border-zs-border flex flex-col justify-center gap-2 group">
                <Landmark className="w-6 h-6 text-zs-blue mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-lg font-black text-white uppercase italic tracking-tight">Bancos de CR</div>
                <div className="text-[10px] text-zs-text-secondary font-bold uppercase">Sincronización Bancaria Directa</div>
             </div>
             <div className="zs-card p-8 bg-zs-bg-secondary/40 border-zs-border flex flex-col justify-center gap-2 group">
                <Database className="w-6 h-6 text-zs-violet mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-lg font-black text-white uppercase italic tracking-tight">Nodos ZST</div>
                <div className="text-[10px] text-zs-text-secondary font-bold uppercase">Base de datos aislada por cliente</div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
