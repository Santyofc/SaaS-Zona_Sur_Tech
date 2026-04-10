"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Settings, Loader2, LogOut } from "lucide-react";
import Link from "next/link";

interface UserData {
  name?: string;
  email?: string;
  role?: string;
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
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-zs-border bg-zs-bg-overlay px-4 py-3.5 backdrop-blur-xl sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zs-text-muted">Paginas / Dashboard</p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-zs-text-primary">Consola de operaciones</h2>
        </div>

        <div className="hidden w-full max-w-sm items-center gap-3 md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zs-text-muted" />
            <input
              type="text"
              placeholder="Buscar modulos..."
              className="w-full rounded-xl border border-zs-border bg-zs-bg-secondary py-2 pl-10 pr-3 text-sm text-zs-text-primary outline-none transition focus:border-zs-cyan"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zs-border bg-zs-bg-secondary text-zs-text-secondary transition hover:border-zs-cyan/30 hover:text-zs-cyan" title="Notificaciones">
            <Bell className="h-4 w-4" />
          </button>

          <Link href="/dashboard/settings" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zs-border bg-zs-bg-secondary text-zs-text-secondary transition hover:border-zs-cyan/30 hover:text-zs-cyan" title="Configuracion">
            <Settings className="h-4 w-4" />
          </Link>

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/";
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zs-border bg-zs-bg-secondary text-zs-text-secondary transition hover:border-rose-500/30 hover:text-zs-rose"
            title="Salir"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <div className="ml-2 hidden items-center gap-3 rounded-xl border border-zs-border bg-zs-bg-secondary px-3 py-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-zs-cyan to-zs-violet text-xs font-black text-zs-bg-primary">
              {(user?.name?.charAt(0) ?? "U").toUpperCase()}
            </div>
            <div className="text-right">
              {loading ? (
                <Loader2 className="ml-auto h-3 w-3 animate-spin text-zs-cyan" />
              ) : (
                <>
                  <p className="max-w-[120px] truncate text-xs font-bold text-zs-text-primary">{user?.name ?? "Usuario"}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-zs-text-muted">{user?.role ?? "member"}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
