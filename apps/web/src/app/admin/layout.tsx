"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  Settings, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Terminal,
  Layers,
  FileText,
  LayoutTemplate,
  ImageIcon
} from "lucide-react";
import { LogoZS } from "@repo/ui/src/components/LogoZS";
import { TerminateSessionButton } from "./components/TerminateSessionButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-zs-bg-primary text-zs-text-primary">
      {/* Admin Sidebar */}
      <aside className="w-72 border-r border-zs-border bg-zs-bg-secondary/50 backdrop-blur-3xl flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-zs-border">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 shadow-zs-glow-cyan/20">
              <LogoZS className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-widest uppercase italic">
                KERNEL <span className="text-zs-cyan">MASTER</span>
              </span>
              <span className="text-[10px] text-zs-text-muted font-bold uppercase tracking-tighter">
                System Control Unit
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-4 px-4">
            Main Interface
          </div>
          
          <AdminNavLink href="/admin" icon={<BarChart3 />} label="Overview" active={pathname === "/admin"} />
          <AdminNavLink href="/admin/users" icon={<Users />} label="Identities" active={pathname === "/admin/users"} />
          <AdminNavLink href="/admin/organizations" icon={<Layers />} label="Nodes (Orgs)" active={pathname === "/admin/organizations"} />
          <AdminNavLink href="/admin/activity" icon={<Activity />} label="Global Logs" active={pathname === "/admin/activity"} />

          <div className="mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-4 px-4">
            Content Management
          </div>
          <AdminNavLink href="/admin/posts" icon={<FileText />} label="Blog Posts" active={pathname.startsWith("/admin/posts")} />
          <AdminNavLink href="/admin/pages" icon={<LayoutTemplate />} label="CMS Pages" active={pathname.startsWith("/admin/pages")} />
          <AdminNavLink href="/admin/media" icon={<ImageIcon />} label="Media Library" active={pathname.startsWith("/admin/media")} />

          <div className="mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-4 px-4">
            Security & Core
          </div>
          <AdminNavLink href="/admin/settings" icon={<Settings />} label="Kernel Config" active={pathname === "/admin/settings"} />
          <AdminNavLink href="/admin/permissions" icon={<ShieldCheck />} label="Root Access" active={pathname === "/admin/permissions"} />
        </nav>

        <div className="p-6 border-t border-zs-border bg-zs-bg-primary/50">
          <TerminateSessionButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="h-20 border-b border-zs-border bg-zs-bg-primary/50 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Terminal className="w-4 h-4 text-zs-cyan" />
            <span className="text-xs font-mono text-zs-text-muted uppercase tracking-widest">
              root@zonasur:~$ <span className="text-white">access_control --global</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zs-emerald/10 border border-zs-emerald/20">
              <div className="w-2 h-2 rounded-full bg-zs-emerald animate-pulse" />
              <span className="text-[10px] font-black uppercase text-zs-emerald tracking-widest">Master Online</span>
            </div>
            <div className="w-10 h-10 rounded-full border border-zs-border bg-zs-bg-secondary flex items-center justify-center">
              <span className="text-xs font-black text-zs-blue">AD</span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 p-10 overflow-y-auto overflow-x-hidden relative">
           {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavLink({ 
  href, 
  icon, 
  label, 
  active = false 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
}) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all group
        ${active 
          ? "bg-zs-blue/10 text-zs-blue border border-zs-blue/20" 
          : "text-zs-text-secondary hover:text-white hover:bg-zs-bg-secondary border border-transparent"
        }
      `}
    >
      <span className={`${active ? "text-zs-blue" : "text-zs-text-muted group-hover:text-zs-blue"} transition-colors w-5 h-5 flex items-center`}>
        {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      </span>
      <span className="flex-1 tracking-tight">{label}</span>
      <ChevronRight className={`w-4 h-4 transition-transform ${active ? "opacity-100" : "opacity-0 group-hover:opacity-50"} group-hover:translate-x-1`} />
    </Link>
  );
}

