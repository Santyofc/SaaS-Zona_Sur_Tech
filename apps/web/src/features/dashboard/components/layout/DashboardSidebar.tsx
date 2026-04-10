"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LayoutDashboard, Users, Settings, CreditCard, Menu, X, UsersRound, Workflow } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkspaceSwitcher } from "../WorkspaceSwitcher";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAVIGATION = [
  { name: "Inicio", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: "Organizaciones", href: "/dashboard/organizations", icon: <Users className="h-4 w-4" /> },
  { name: "Equipo", href: "/dashboard/team", icon: <UsersRound className="h-4 w-4" /> },
  { name: "Facturacion", href: "/dashboard/billing", icon: <CreditCard className="h-4 w-4" /> },
  { name: "Configuracion", href: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <button
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zs-border bg-zs-bg-secondary text-zs-text-primary shadow-lg lg:hidden"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Cerrar menu lateral" : "Abrir menu lateral"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-zs-border bg-zs-bg-overlay backdrop-blur-2xl lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-300",
        )}
      >
        <div className="flex h-full flex-col px-5 pb-5 pt-6">
          <div className="zs-panel-soft rounded-2xl p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">Workspace</p>
            <div className="mt-2 flex items-center gap-2 text-zs-text-primary">
              <Workflow className="h-4 w-4 text-zs-cyan" />
              <span className="text-sm font-bold">Consola central</span>
            </div>
          </div>

          <nav className="mt-6 flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all",
                    isActive
                      ? "border-zs-cyan/40 bg-zs-cyan/10 text-zs-text-primary"
                      : "border-transparent text-zs-text-secondary hover:border-zs-border hover:bg-zs-bg-surface hover:text-zs-text-primary",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-lg border",
                      isActive ? "border-zs-cyan/30 bg-zs-cyan/10 text-zs-cyan" : "border-zs-border bg-zs-bg-secondary text-zs-text-muted",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 border-t border-zs-border pt-5">
            <WorkspaceSwitcher />
          </div>
        </div>
      </aside>
    </>
  );
}
