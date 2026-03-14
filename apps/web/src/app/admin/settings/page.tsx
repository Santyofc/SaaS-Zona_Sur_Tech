import React from "react";
import { 
  Settings, 
  Shield, 
  Zap, 
  Terminal, 
  Database, 
  Cloud, 
  Lock,
  Cpu,
  Save
} from "lucide-react";
import { requireSuperAdmin } from "@repo/auth";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireSuperAdmin();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
            Kernel <span className="text-zs-blue">Configuration</span>
          </h1>
          <p className="text-zs-text-secondary text-base font-medium max-w-xl">
            Ajusta los parámetros vitales del sistema. Gestiona cuotas globales, 
            configuración de red y políticas de seguridad del núcleo Zona Sur Tech.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="zs-btn-brand px-6 py-3 rounded-xl flex items-center gap-2 text-xs uppercase tracking-widest font-black">
                Commit Changes
                <Save className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Settings Categories */}
        <div className="lg:col-span-2 space-y-8">
            <SettingsSection 
                title="SaaS Global Quotas" 
                icon={<Database className="text-zs-blue" />}
                description="Control access limits and resource allocation across all organizations."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ConfigField label="Default Member Limit" value="10" unit="Nodes" />
                    <ConfigField label="API Rate Limit" value="1,000" unit="Req/min" />
                    <ConfigField label="Storage Quota" value="5" unit="GB" />
                    <ConfigField label="Concurrent Jobs" value="2" unit="Tasks" />
                </div>
            </SettingsSection>

            <SettingsSection 
                title="Network & Security" 
                icon={<Shield className="text-zs-cyan" />}
                description="Global security protocols and network-level configurations."
            >
                <div className="space-y-6">
                    <ToggleField label="Maintenance Mode" active={false} description="Halt all non-admin traffic across the platform." />
                    <ToggleField label="Global IP Whitelisting" active={true} description="Enforce IP validation for all administrative logins." />
                    <ToggleField label="Auto-Scaling" active={true} description="Dynamically allocate resources based on network load." />
                </div>
            </SettingsSection>
        </div>

        {/* Right Column: System Status */}
        <div className="space-y-8">
            <div className="zs-card p-6 border-zs-border/50 bg-zs-bg-secondary/20">
                <div className="flex items-center gap-3 mb-6">
                    <Cpu className="w-5 h-5 text-zs-blue" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">System Engine</h3>
                </div>
                <div className="space-y-4 font-mono">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zs-text-muted uppercase">Version</span>
                        <span className="text-zs-blue">v4.2.0-STABLE</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zs-text-muted uppercase">Environment</span>
                        <span className="text-zs-emerald">PRODUCTION</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zs-text-muted uppercase">Load Average</span>
                        <span className="text-white">0.12 / 0.08 / 0.01</span>
                    </div>
                    <div className="pt-4 border-t border-zs-border/30">
                        <div className="w-full h-1 bg-zs-bg-secondary rounded-full overflow-hidden mb-2">
                             <div className="h-full bg-zs-blue w-[15%]" />
                        </div>
                        <span className="text-[9px] text-zs-text-muted uppercase tracking-widest">CPU Allocation: 15.2%</span>
                    </div>
                </div>
            </div>

            <div className="zs-card p-6 border-zs-border/50 bg-zs-bg-secondary/20">
                <div className="flex items-center gap-3 mb-6">
                    <Cloud className="text-zs-cyan w-5 h-5" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">External Shards</h3>
                </div>
                <div className="space-y-4">
                    <ShardStatus label="Supabase Auth" status="Online" />
                    <ShardStatus label="Edge Functions" status="Online" />
                    <ShardStatus label="Redis Buffer" status="Syncing" />
                    <ShardStatus label="Storage Bucket" status="Online" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, icon, description, children }: any) {
    return (
        <div className="zs-card p-8 border-zs-border/50">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-zs-bg-secondary border border-zs-border flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="text-xl font-black text-white uppercase italic tracking-widest">{title}</h2>
            </div>
            <p className="text-xs text-zs-text-secondary mb-8 ml-14">{description}</p>
            <div className="ml-14">{children}</div>
        </div>
    );
}

function ConfigField({ label, value, unit }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest">{label}</label>
            <div className="flex items-center gap-3">
                <div className="zs-input-wrapper flex-1">
                    <input type="text" defaultValue={value} className="zs-input h-10 px-4 font-mono text-sm" />
                </div>
                <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-tighter w-12">{unit}</span>
            </div>
        </div>
    );
}

function ToggleField({ label, active, description }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-zs-bg-secondary/30 border border-zs-border/50 group hover:border-zs-blue/30 transition-all">
            <div className="space-y-1">
                <h4 className="text-xs font-black text-white uppercase tracking-tight">{label}</h4>
                <p className="text-[10px] text-zs-text-secondary">{description}</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${active ? 'bg-zs-blue' : 'bg-zs-bg-secondary'} border border-zs-border`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-6' : ''}`} />
            </div>
        </div>
    );
}

function ShardStatus({ label, status }: any) {
    const isOnline = status === "Online";
    const isSync = status === "Syncing";

    return (
        <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-zs-text-secondary">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-zs-emerald' : isSync ? 'text-zs-blue' : 'text-zs-red'}`}>
                    {status}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-zs-emerald shadow-zs-glow-emerald/50' : isSync ? 'bg-zs-blue animate-pulse' : 'bg-zs-red shadow-zs-glow-red/50'}`} />
            </div>
        </div>
    );
}
