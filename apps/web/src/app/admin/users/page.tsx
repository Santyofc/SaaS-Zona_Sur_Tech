import React from "react";
import { 
  Shield, 
  Terminal,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar
} from "lucide-react";
import { requireSuperAdmin } from "@repo/auth";
import { UserActionButtons } from "./components/UserActionButtons";
import { AdminSearch } from "../components/AdminSearch";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { q?: string };
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  // 1. Level Zero Security Guard
  await requireSuperAdmin();

  const query = searchParams.q || "";

  // 2. Data Synthesis (Supabase Auth)
  const supabase = createAdminClient();
  
  // Note: listUsers() doesn't support server-side filtering via API directly in the same way 
  // as standard tables, but we can filter the result or use standard users table if synced.
  // For now, we fetch and filter to keep it simple and reactive.
  const { data: { users: allUsers }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] zs-card border-zs-red/20 bg-zs-red/5">
            <Terminal className="w-12 h-12 text-zs-red mb-4" />
            <h2 className="text-xl font-black text-white uppercase italic">Critical System Failure</h2>
            <p className="text-zs-text-secondary mt-2 font-mono text-sm">Error: {error.message}</p>
        </div>
    );
  }

  const users = query 
    ? allUsers.filter(u => 
        u.email?.toLowerCase().includes(query.toLowerCase()) || 
        u.id.toLowerCase().includes(query.toLowerCase())
      )
    : allUsers;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
            Identity <span className="text-zs-blue">Management</span>
          </h1>
          <p className="text-zs-text-secondary text-base font-medium max-w-xl">
            Supervisa el estado de todos los nodos de usuarios en la red. Gestiona accesos, 
            revoca identidades o eleva privilegios del sistema.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-zs-bg-secondary border border-zs-border">
                <Shield className="w-4 h-4 text-zs-blue" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Level Access</span>
            </div>
            <button className="zs-btn-brand px-6 py-3 rounded-xl flex items-center gap-2 text-xs uppercase tracking-widest font-black">
                Inject User
                <Terminal className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-zs-bg-secondary/30 p-4 rounded-2xl border border-zs-border/50 backdrop-blur-3xl">
          <AdminSearch placeholder="Search by UUID, Email or Alias..." />
          <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zs-border bg-zs-bg-primary/50 text-zs-text-secondary hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zs-border bg-zs-bg-primary/50 text-zs-text-secondary hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                Export Data
              </button>
          </div>
      </div>

      {/* Users Table */}
      <div className="zs-card overflow-hidden border-zs-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zs-border bg-zs-bg-secondary/50">
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">User Node</th>
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">UUID / ID</th>
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">Last Sync</th>
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zs-border/50">
              {users.map((user) => {
                const isBanned = !!user.banned_until && new Date(user.banned_until) > new Date();
                
                return (
                  <tr key={user.id} className="group hover:bg-zs-blue/5 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zs-bg-secondary border border-zs-border flex items-center justify-center shrink-0 group-hover:border-zs-blue/50 transition-colors">
                          <span className="text-xs font-black text-zs-blue">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-white truncate">{user.email}</span>
                          <span className="text-[10px] text-zs-text-muted font-medium uppercase tracking-tight">
                            {user.app_metadata.is_super_admin ? 'SUPER_ADMIN' : 'Standard Identity'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <code className="text-[10px] font-mono text-zs-text-muted bg-zs-bg-secondary/50 px-2 py-1 rounded-md border border-zs-border">
                        {user.id.substring(0, 18)}...
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`
                          inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${isBanned 
                              ? "bg-zs-red/10 text-zs-red border border-zs-red/20" 
                              : user.email_confirmed_at 
                                ? "bg-zs-emerald/10 text-zs-emerald border border-zs-emerald/20" 
                                : "bg-zs-amber/10 text-zs-amber border border-zs-amber/20"
                          }
                      `}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isBanned ? 'bg-zs-red' : user.email_confirmed_at ? 'bg-zs-emerald' : 'bg-zs-amber'} shadow-zs-glow-${isBanned ? 'red' : user.email_confirmed_at ? 'emerald' : 'amber'}/40`} />
                          {isBanned ? "Banned" : user.email_confirmed_at ? "Active" : "Pending"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-zs-text-secondary font-medium text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(user.last_sign_in_at || user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <UserActionButtons 
                        userId={user.id} 
                        isLocked={isBanned} 
                        userEmail={user.email || "Unknown"} 
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Console */}
        <div className="p-6 border-t border-zs-border bg-zs-bg-secondary/30 flex items-center justify-between">
            <div className="text-xs font-mono text-zs-text-muted uppercase tracking-widest">
                Showing <span className="text-white font-black">{users.length}</span> nodes
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-zs-border text-zs-text-muted hover:text-white hover:bg-zs-bg-secondary transition-all disabled:opacity-30" disabled>
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                    {[1].map((p) => (
                        <button key={p} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${p === 1 ? 'bg-zs-blue text-white' : 'text-zs-text-muted hover:text-white'}`}>
                            {p}
                        </button>
                    ))}
                </div>
                <button className="p-2 rounded-lg border border-zs-border text-zs-text-muted hover:text-white hover:bg-zs-bg-secondary transition-all disabled:opacity-30" disabled>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

