"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { miniSaasCatalog } from "@/config/mini-saas";
import { MiniSaasCard } from "./MiniSaasCard";

export function MiniSaasGrid() {
  return (
    <section className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-zs-blue/10 border border-zs-blue/20 text-zs-blue">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
              Ecosistema <span className="text-zs-blue shadow-zs-glow-blue">Zona Sur Tech</span>
            </h2>
            <p className="text-zs-text-secondary text-sm font-medium tracking-widest uppercase mt-1">
              Hub de Micro-Servicios y Herramientas SaaS
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {miniSaasCatalog.map((item, index) => (
          <MiniSaasCard key={item.slug} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
