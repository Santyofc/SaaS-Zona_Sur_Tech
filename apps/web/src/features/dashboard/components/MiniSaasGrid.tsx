"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { miniSaasCatalog } from "@/config/mini-saas";
import { MiniSaasCard } from "./MiniSaasCard";

export function MiniSaasGrid() {
  return (
    <section className="space-y-7 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="zs-panel-soft rounded-xl border-zs-blue/20 bg-zs-blue/10 p-2.5 text-zs-blue">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="zs-heading-lg text-2xl italic">
              Ecosistema <span className="text-zs-blue shadow-zs-glow-blue">Zona Sur Tech</span>
            </h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zs-text-secondary">
              Hub de micro-servicios y herramientas SaaS
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {miniSaasCatalog.map((item, index) => (
          <MiniSaasCard key={item.slug} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
