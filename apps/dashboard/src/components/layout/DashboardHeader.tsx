"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Settings, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
  name: string;
  email: string;
  role: string;
}

export function DashboardHeader() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full p-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md"
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col"
      >
        <p className="text-zs-text-secondary text-xs font-medium">Páginas / Dashboard</p>
        <h2 className="text-white font-bold text-lg tracking-tight">Consola Principal</h2>
      </motion.div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-secondary" />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="w-full pl-12 pr-4 py-2 bg-zs-bg-secondary/50 border border-zs-border rounded-2xl text-sm focus:border-zs-blue outline-none transition-all placeholder:text-zs-text-muted text-white"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-zs-text-secondary hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-zs-text-secondary hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Profile Selector */}
        <div className="flex items-center gap-3 pl-4 border-l border-zs-border">
          <div className="text-right hidden sm:block">
            {loading ? (
              <div className="flex items-center justify-end">
                <Loader2 className="w-3 h-3 animate-spin text-zs-blue" />
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-white truncate max-w-[120px]">
                  {user?.name || "Usuario"}
                </p>
                <p className="text-[10px] text-zs-blue font-black uppercase tracking-widest">
                  {user?.role || "MEMBER"}
                </p>
              </>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, borderColor: "rgba(0, 247, 255, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-zs-bg-secondary/80 p-1 pr-3 rounded-2xl border border-zs-border hover:border-zs-blue/50 transition-all"
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-8 h-8 rounded-xl bg-zs-blue flex items-center justify-center text-xs font-bold text-white shadow-zs-glow-blue"
            >
              {user?.name?.charAt(0) || "U"}
            </motion.div>
            <ChevronDown className="w-4 h-4 text-zs-text-secondary" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
