"use client";

import React, { useState } from "react";
import { Calculator, TrendingDown, Zap, ShieldCheck } from "lucide-react";

/**
 * ════════════════════════════════════════════════════════════
 * ZS PRICE CALCULATOR — ZonaSur Tech
 * Propósito: Demostrar el ahorro operativo (ROI)
 * ════════════════════════════════════════════════════════════
 */

export function PriceCalculator() {
  const [invoices, setInvoices] = useState(500);
  const avgCostPerInvoce = 0.20; // $0.20 USD traditional market CR
  const zstFixedCost = 49; // Industrial Core

  const totalTraditional = invoices * avgCostPerInvoce;
  const savings = Math.max(0, totalTraditional - zstFixedCost);
  const savingsPercent = Math.round((savings / totalTraditional) * 100);

  return (
    <div className="zs-card p-8 md:p-12 mt-32 max-w-5xl mx-auto overflow-hidden relative border-zs-blue/20 bg-zs-bg-secondary/40">
      <div className="absolute top-0 right-0 w-[40%] h-full bg-zs-blue/5 blur-[100px] -z-10" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-3 text-zs-blue mb-6">
            <Calculator className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Calculadora de ROI Logístico</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-8">
            Optimice su <br />
            <span className="text-zs-blue">Costo Operativo</span>
          </h2>

          <p className="text-zs-text-secondary text-sm mb-12 max-w-sm">
            Compare el costo tradicional por documento frente a la tarifa plana de infraestructura industrial de Zona Sur Tech.
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zs-text-muted">
                <span>Volumen de Facturación Mensual</span>
                <span className="text-zs-blue">{invoices} DOCS</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={invoices}
                onChange={(e) => setInvoices(parseInt(e.target.value))}
                className="w-full h-1 bg-zs-border rounded-lg appearance-none cursor-pointer accent-zs-blue transition-all"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 gap-6">
            {/* Traditional Card */}
            <div className="p-6 rounded-2xl border border-white/5 bg-black/20">
              <span className="text-[10px] font-bold text-zs-text-muted uppercase">Gasto Promedio Tradicional</span>
              <div className="text-3xl font-black text-white italic mt-1">${totalTraditional.toFixed(2)}</div>
            </div>

            {/* ZST Card */}
            <div className="p-8 rounded-3xl border border-zs-blue/30 bg-zs-blue/10 relative overflow-hidden group">
              <Zap className="absolute -top-4 -right-4 w-24 h-24 text-zs-blue/10 group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10">
                <span className="text-[10px] font-black text-zs-blue uppercase tracking-widest">Plan Industrial Core (ZST)</span>
                <div className="text-5xl font-black text-white italic mt-2">${zstFixedCost.toFixed(2)}</div>
                
                <div className="mt-8 pt-6 border-t border-zs-blue/20 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-zs-emerald uppercase tracking-widest mb-1">Ahorro Mensual Estimado</div>
                    <div className="text-2xl font-black text-zs-emerald italic">+ ${savings.toFixed(2)}</div>
                  </div>
                  <div className="bg-zs-emerald/20 text-zs-emerald px-4 py-2 rounded-xl text-lg font-black italic">
                    {savingsPercent}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-zs-text-muted text-[10px] font-bold uppercase tracking-tighter">
              <ShieldCheck className="w-4 h-4" />
              <span>Cifrado E2E y Nodos Ilimitados incluidos en la comparativa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
