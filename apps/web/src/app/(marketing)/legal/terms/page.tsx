"use client";

import React from "react";
import { FileText, CreditCard, Settings, ShieldAlert, BadgeCheck } from "lucide-react";

/**
 * ══════════════════════════════════════════════════════════
 * ZS TERMS OF SERVICE — ZonaSur Tech
 * Propósito: Acuerdo legal de uso (Industrial Licensing)
 * ══════════════════════════════════════════════════════════
 */

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zs-bg-primary pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-blue/10 border border-zs-blue/20 text-zs-blue mb-8">
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Licencia de Operación v1.5</span>
          </div>
          <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-8">
            Términos de <br />
            <span className="text-zs-blue">Uso Industrial</span>
          </h1>
          <p className="text-zs-text-secondary text-lg font-light leading-relaxed">
            Bienvenido al kernel de Zona Sur Tech. Al acceder a nuestros servicios, usted acepta regirse por los siguientes protocolos de uso industrial y legal.
          </p>
        </div>

        <div className="space-y-12">
          <TermSection 
            icon={<BadgeCheck className="w-5 h-5" />}
            title="Derecho de Uso"
            content="Zona Sur Tech otorga una licencia limitada, no exclusiva e intransferible para el acceso a la plataforma SaaS. El uso está restringido a la orquestación de servicios empresariales legítimos dentro del marco legal de Costa Rica."
          />

          <TermSection 
            icon={<CreditCard className="w-5 h-5" />}
            title="Facturación y Pagos"
            content="Los pagos se procesan de forma recurrente mensual según el plan seleccionado. Los precios están expresados en Dólares Americanos (USD). En Costa Rica, el servicio está sujeto a las normativas de IVA vigentes."
          />

          <TermSection 
            icon={<ShieldAlert className="w-5 h-5" />}
            title="SLA de Disponibilidad"
            content="ZST se compromete a mantener un tiempo de actividad (uptime) del 99.9% para servicios de grado industrial. Las ventanas de mantenimiento programado se notificarán con 48 horas de antelación vía telemetría de sistema."
          />

          <div className="zs-card p-10 bg-zs-bg-secondary/40 border-zs-border mt-20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-zs-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">Jurisdicción</h4>
            <p className="text-sm text-zs-text-secondary leading-relaxed font-light">
                Cualquier disputa legal relacionada con los servicios de Zona Sur Tech será resuelta bajo las leyes de la República de Costa Rica, sometiéndose las partes a la jurisdicción de los tribunales de San José.
            </p>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-zs-border flex justify-between items-center text-zs-text-muted">
           <span className="text-[10px] font-bold uppercase tracking-widest">ZST FINAL_LICENSE_RELEASE</span>
           <div className="flex gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 px-3 py-1 rounded">2026 EDITION</span>
           </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-zs-violet/5 rounded-full blur-[120px]" />
      </div>
    </main>
  );
}

function TermSection({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-12 h-12 rounded-xl bg-zs-bg-secondary/60 border border-zs-border flex items-center justify-center text-zs-blue shrink-0 shadow-zs-glow-blue/5">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{title}</h3>
        <p className="text-zs-text-secondary font-light leading-relaxed text-base italic">{content}</p>
      </div>
    </div>
  );
}
