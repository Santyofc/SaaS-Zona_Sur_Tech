import React from "react";
import { 
  Building2, 
  Users, 
  Terminal,
  Layers,
  Globe,
  Database,
  ShieldCheck,
  TrendingUp,
  Filter
} from "lucide-react";
import { requireSuperAdmin } from "@repo/auth";
import { OrgActionButtons } from "./components/OrgActionButtons";
import { AdminSearch } from "../components/AdminSearch";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { q?: string };
}

export default async function AdminOrganizationsPage({ searchParams }: PageProps) {
  // 1. Authorization Gate
  await requireSuperAdmin();

  const query = searchParams.q || "";

  // 2. Data Fetching
  const supabase = createAdminClient();
  
  let dbQuery = supabase
    .from("organizations")
    .select(`
      id,
      name,
      created_at,
      memberships (count)
    `);

  if (query) {
    dbQuery = dbQuery.ilike("name", `%${query}%`);
  }

  const { data: organizations, error } = await dbQuery.order("created_at", { ascending: false });

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] zs-card border-zs-red/20 bg-zs-red/5">
            <Terminal className="w-12 h-12 text-zs-red mb-4" />
            <h2 className="text-xl font-black text-white uppercase italic">Infrastructure Sync Failure</h2>
            <p className="text-zs-text-secondary mt-2 font-mono text-sm">Error: {error.message}</p>
        </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
            Infrastructure <span className="text-zs-cyan">Nodes</span>
          </h1>
          <p className="text-zs-text-secondary text-base font-medium max-w-xl">
            Gestiona los clústeres de organizaciones en la red. Monitorea el despliegue de 
            nodos, cuotas de recursos y la integridad de los espacios de trabajo.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="zs-btn-brand px-6 py-3 rounded-xl flex items-center gap-2 text-xs uppercase tracking-widest font-black">
                Provision Node
                <Terminal className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Resource Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ResourceMetric 
            label="Total Nodes" 
            value={organizations.length.toString()} 
            icon={<Globe className="text-zs-blue" />} 
          />
          <ResourceMetric 
            label="Database Shards" 
            value="1" 
            icon={<Database className="text-zs-cyan" />} 
          />
          <ResourceMetric 
            label="Active Clusters" 
            value={organizations.length.toString()} 
            icon={<Layers className="text-zs-violet" />} 
          />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-zs-bg-secondary/30 p-4 rounded-2xl border border-zs-border/50 backdrop-blur-3xl">
          <AdminSearch placeholder="Search by Node ID or Name..." />
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zs-border bg-zs-bg-primary/50 text-zs-text-secondary hover:text-white transition-all text-xs font-black uppercase tracking-widest whitespace-nowrap">
            <Filter className="w-4 h-4" />
            Node Filter
          </button>
      </div>

      {/* Organizations Table */}
      <div className="zs-card overflow-hidden border-zs-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zs-border bg-zs-bg-secondary/50">
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">Cluster Name</th>
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">Node ID</th>
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">Node Count</th>
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">Deployment</th>
                <th className="px-6 py-5 text-[10px] font-black text-zs-text-secondary uppercase tracking-[0.2em]">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zs-border/50">
              {organizations.map((org: any) => (
                <tr key={org.id} className="group hover:bg-zs-cyan/5 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zs-bg-secondary border border-zs-border flex items-center justify-center shrink-0 group-hover:border-zs-cyan/50 transition-colors">
                        <Building2 className="w-5 h-5 text-zs-cyan" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate">{org.name}</span>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] text-zs-text-muted font-black uppercase tracking-widest">Enterprise Tier</span>
                             <div className="w-1 h-1 rounded-full bg-zs-text-muted/30" />
                             <span className="text-[10px] text-zs-emerald font-black uppercase tracking-widest">Verified</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <code className="text-[10px] font-mono text-zs-text-muted bg-zs-bg-secondary/50 px-2 py-1 rounded-md border border-zs-border">
                      {org.id.substring(0, 18)}...
                    </code>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-zs-bg-secondary border border-zs-bg-primary flex items-center justify-center">
                                    <Users className="w-3 h-3 text-zs-text-muted" />
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-white">
                            {org.memberships?.[0]?.count || 0} users
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-zs-text-secondary font-medium text-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-zs-emerald" />
                            {new Date(org.created_at).toLocaleDateString()}
                        </div>
                        <div className="h-1 w-24 bg-zs-bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-zs-cyan w-full" />
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <OrgActionButtons orgId={org.id} orgName={org.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Console Pagination */}
        <div className="p-6 border-t border-zs-border bg-zs-bg-secondary/30 flex items-center justify-between">
            <div className="text-xs font-mono text-zs-text-muted uppercase tracking-widest flex items-center gap-4">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zs-emerald animate-pulse" /> Nodes Active: {organizations.length}</span>
                <span className="text-zs-border">|</span>
                <span>System Sync: OK</span>
            </div>
            <button className="text-[10px] font-black uppercase text-zs-text-muted hover:text-zs-cyan transition-colors tracking-widest flex items-center gap-2">
                Download Infrastructure Report
                <TrendingUp className="w-3 h-3" />
            </button>
        </div>
      </div>
    </div>
  );
}

function ResourceMetric({ label, value, icon }: any) {
    return (
        <div className="zs-card p-6 border-zs-border/50 bg-gradient-to-br from-zs-bg-secondary/50 to-transparent flex items-center gap-6 group hover:border-zs-cyan/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zs-bg-secondary border border-zs-border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div>
                <h3 className="text-[10px] font-black text-zs-text-muted uppercase tracking-[0.2em] mb-1">{label}</h3>
                <p className="text-2xl font-bold text-white tracking-tighter">{value}</p>
            </div>
        </div>
    )
}
