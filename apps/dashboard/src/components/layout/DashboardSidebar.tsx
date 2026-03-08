"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LayoutDashboard, Users, Settings, CreditCard, Menu, X, UsersRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkspaceSwitcher } from "../WorkspaceSwitcher";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAVIGATION = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Organizations", href: "/dashboard/organizations", icon: <Users className="w-5 h-5" /> },
  { name: "Team", href: "/dashboard/team", icon: <UsersRound className="w-5 h-5" /> },
  { name: "Billing", href: "/dashboard/billing", icon: <CreditCard className="w-5 h-5" /> },
  { name: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full text-white bg-zs-blue shadow-zs-glow-blue"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 max-w-full lg:static lg:block",
          "bg-zs-bg-secondary/40 backdrop-blur-2xl border-r border-zs-border lg:border-none",
          "m-0 lg:m-4 lg:rounded-2xl",
          "lg:translate-x-0",
          !isOpen && "translate-x-[-100%] lg:translate-x-0 transition-transform duration-300",
          isOpen && "translate-x-0 transition-transform duration-300"
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center justify-center py-6 border-b border-zs-border">
            <h1 className="text-xl font-bold tracking-widest text-white uppercase">
              ZonaSur <span className="text-zs-blue">Tech</span>
            </h1>
          </div>

          <nav className="flex-1 mt-6 space-y-2 overflow-y-auto no-scrollbar">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <motion.div
                  key={item.name}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * NAVIGATION.indexOf(item) }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-zs-blue/10 text-white shadow-md border border-zs-blue/20"
                        : "text-zs-text-secondary hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                        isActive ? "text-zs-blue" : "bg-white/10 group-hover:bg-white/20"
                      )}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Workspace Switcher */}
          <div className="mt-4 pt-4 border-t border-zs-border">
            <WorkspaceSwitcher />
          </div>
        </div>
      </aside>
    </>
  );
}
