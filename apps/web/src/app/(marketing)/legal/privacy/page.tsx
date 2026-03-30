"use client";

import React from "react";
import { Shield, Lock, Eye, FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * ════════════════════════════════════════════════════════════
 * ZS PRIVACY POLICY — ZonaSur Tech
 * Propósito: Cumplimiento legal y transparencia de datos (CR)
 * ════════════════════════════════════════════════════════════
 */

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zs-bg-primary pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-blue/10 border border-zs-blue/20 text-zs-blue mb-8">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Protocolo de Privacidad v2.0</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-8">
            Privacidad de <br />
            <span className="text-zs-blue">Datos Industriales</span>
          </h1>
          <p className="text-zs-text-secondary text-lg font-light leading-relaxed">
            Su información técnica y financiera es el núcleo de su operación. En Zona Sur Tech, protegemos ese núcleo con estándares de seguridad de grado militar y estricto cumplimiento legal.
          </p>
        </div>

        <div className="space-y-12">
          <LegalSection 
            number="01"
            title="Marco Normativo (Costa Rica)"
            content="En cumplimiento con la Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Ley N° 8968) de Costa Rica, informamos que los datos recolectados a través de la plataforma ZST son tratados bajo estrictas medidas de seguridad técnica y organizativa."
          />

          <LegalSection 
            number="02"
            title="Recolección de Información"
            content="Recopilamos datos técnicos necesarios para la orquestación de servicios: Identificación fiscal (para Hacienda CR), credenciales de API cifradas, y telemetría de uso del sistema. Nunca accedemos a la lógica de negocio privada almacenada en sus nodos aislados."
          />

          <LegalSection 
            number="03"
            title="Seguridad del Kernel"
            content="Toda la información reside en bases de datos aisladas físicamente en la región AWS US-East-2. Implementamos cifrado AES-256 en reposo y TLS 1.3 en tránsito para cada paquete de datos."
          />

          <div className="zs-card p-8 bg-zs-blue/5 border-zs-blue/20 mt-16">
            <div className="flex items-center gap-4 mb-4">
               <Lock className="w-5 h-5 text-zs-blue" />
               <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Derechos ARCO</h4>
            </div>
            <p className="text-xs text-zs-text-secondary leading-relaxed">
                Usted mantiene el derecho de acceso, rectificación, cancelación y oposición de sus datos. Para ejercer estos derechos o solicitar el borrado de sus registros, contacte a <strong>legal@zonasurtech.online</strong>.
            </p>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-zs-border flex justify-between items-center text-zs-text-muted">
           <span className="text-[10px] font-bold uppercase tracking-widest">Última actualización: 23 de Marzo, 2026</span>
           <div className="flex gap-6">
              <FileText className="w-4 h-4" />
              <Shield className="w-4 h-4" />
           </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-zs-blue/5 rounded-full blur-[100px]" />
      </div>
    </main>
  );
}

function LegalSection({ number, title, content }: { number: string, title: string, content: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="text-zs-blue font-black text-xs pt-1 tracking-widest">{number}</div>
      <div>
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4 group-hover:text-zs-blue transition-colors">
          {title}
        </h3>
        <p className="text-zs-text-secondary font-light leading-relaxed text-base italic">
          {content}
        </p>
      </div>
    </div>
  );
}
