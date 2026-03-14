import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Key, 
  Users, 
  AlertTriangle, 
  Terminal,
  Activity,
  UserPlus
} from "lucide-react";
import { requireSuperAdmin } from "@repo/auth";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPermissionsPage() {
  await requireSuperAdmin();
  const supabase = createAdminClient();

  // Fetch users with superadmin metadata
  const { data: { users: allUsers } } = await supabase.auth.admin.listUsers();
  const superAdmins = allUsers.filter(u => !!u.app_metadata?.is_super_admin);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
            Root <span className="text-zs-red">Access</span>
          </h1>
          <p className="text-zs-text-secondary text-base font-medium max-w-xl">
            Gestión de privilegios globales. Solo identidades verificadas como Root 
            pueden modificar parámetros críticos de la arquitectura.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="zs-btn-brand px-6 py-3 rounded-xl flex items-center gap-2 text-xs uppercase tracking-widest font-black bg-zs-red/20 border-zs-red/50 text-zs-red hover:bg-zs-red/30">
                Grant Root
                <UserPlus className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Super Admin List */}
          <div className="lg:col-span-2 space-y-8">
              <div className="zs-card overflow-hidden border-zs-red/20">
                  <div className="p-6 border-b border-zs-border bg-zs-red/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                           <ShieldCheck className="w-5 h-5 text-zs-red" />
                           <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Root Clusters</h2>
                       </div>
                       <span className="text-[10px] font-mono text-zs-red uppercase tracking-widest animate-pulse">Security Level: Maximum</span>
                  </div>

                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-mono">
                          <thead>
                              <tr className="border-b border-zs-border bg-zs-bg-secondary/20">
                                  <th className="px-6 py-4 text-[10px] font-black text-zs-text-muted uppercase tracking-widest">Identity</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-zs-text-muted uppercase tracking-widest">Clearance</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-zs-text-muted uppercase tracking-widest text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-zs-border/50">
                              {superAdmins.map((user) => (
                                  <tr key={user.id} className="group hover:bg-zs-red/5 transition-colors">
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-4">
                                              <div className="w-8 h-8 rounded-lg bg-zs-red/10 border border-zs-red/20 flex items-center justify-center">
                                                  <Lock className="w-4 h-4 text-zs-red" />
                                              </div>
                                              <div className="flex flex-col">
                                                  <span className="text-xs font-bold text-white">{user.email}</span>
                                                  <span className="text-[9px] text-zs-text-muted uppercase tracking-tighter">{user.id}</span>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-zs-red/10 border border-zs-red/20">
                                              <div className="w-1 h-1 rounded-full bg-zs-red" />
                                              <span className="text-[9px] font-black text-zs-red uppercase tracking-[0.2em]">LEVEL_ZERO_ROOT</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                          <button className="text-[10px] font-black uppercase text-zs-text-muted hover:text-zs-red transition-colors tracking-widest">
                                              Revoke Access
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* Roles Definition Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RoleCapabilityCard 
                    role="Owner" 
                    icon={<Key className="text-zs-emerald" />} 
                    capabilities={["Organization Destruction", "Billing Management", "Ownership Transfer", "Security Policy Override"]} 
                  />
                  <RoleCapabilityCard 
                    role="Admin" 
                    icon={<ShieldCheck className="text-zs-blue" />} 
                    capabilities={["Member Management", "Invitation Control", "Configuration Tuning", "Audit Log Access"]} 
                  />
              </div>
          </div>

          {/* Right Column: Permission Sentinel */}
          <div className="space-y-8">
              <div className="zs-card p-6 border-zs-border/50 bg-zs-bg-secondary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <AlertTriangle className="w-20 h-20 text-zs-red" />
                  </div>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                      <Activity className="w-5 h-5 text-zs-red" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Auth Sentinel</h3>
                  </div>
                  <div className="space-y-6 relative z-10">
                      <div className="p-4 rounded-xl border border-zs-red/20 bg-zs-red/5">
                          <p className="text-[10px] leading-relaxed text-zs-text-secondary font-mono">
                              <span className="text-zs-red font-black">[WARNING]</span> 
                              Multiple ROOT sessions detected from disparate IP addresses. 
                              Kernel integrity check recommended.
                          </p>
                      </div>
                      <button className="w-full py-4 bg-zs-red text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl shadow-zs-glow-red/20 hover:scale-[1.02] transition-all">
                          Flush Auth Buffer
                      </button>
                  </div>
              </div>

              <div className="zs-card p-6 border-zs-border/50 bg-zs-bg-secondary/20">
                  <div className="flex items-center gap-3 mb-6">
                      <Terminal className="w-5 h-5 text-zs-text-muted" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Access Matrix</h3>
                  </div>
                  <div className="space-y-4 font-mono text-[10px]">
                      <div className="flex justify-between border-b border-zs-border/30 pb-2">
                          <span className="text-zs-text-muted uppercase">Endpoint</span>
                          <span className="text-zs-text-muted uppercase">Protection</span>
                      </div>
                      <PermissionRow endpoint="/api/admin/*" level="SUPER_ADMIN" />
                      <PermissionRow endpoint="/api/org/*" level="MEMBER+" />
                      <PermissionRow endpoint="/api/auth/*" level="PUBLIC" />
                      <PermissionRow endpoint="/api/infra/*" level="SYSTEM_ONLY" />
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

function RoleCapabilityCard({ role, icon, capabilities }: any) {
    return (
        <div className="zs-card p-6 border-zs-border/50 group hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-zs-bg-secondary border border-zs-border group-hover:border-zs-text-muted">
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{role} Capabilities</h3>
            </div>
            <ul className="space-y-3">
                {capabilities.map((cap: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] text-zs-text-secondary font-medium">
                        <div className="w-1 h-1 rounded-full bg-zs-text-muted/50" />
                        {cap}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function PermissionRow({ endpoint, level }: any) {
    const isRoot = level === "SUPER_ADMIN" || level === "SYSTEM_ONLY";
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-white truncate max-w-[120px]">{endpoint}</span>
            <span className={`font-black uppercase tracking-tighter ${isRoot ? 'text-zs-red' : 'text-zs-text-muted'}`}>{level}</span>
        </div>
    )
}
