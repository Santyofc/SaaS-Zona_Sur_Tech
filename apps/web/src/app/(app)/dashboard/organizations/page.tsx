import { requireAuth, handleAuthError } from "@repo/auth";
import { PageHeader, EmptyState } from "@/components/dashboard/ui-primitives";
import { Building2, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WorkspaceSwitcher } from "@/components/dashboard/WorkspaceSwitcher";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  try {
    const { userId } = await requireAuth();
    const supabase = createAdminClient();

    // Load memberships with organization details
    const { data: memberships } = await supabase
      .from("memberships")
      .select("id, role, status, organizations(id, name, slug)")
      .eq("user_id", userId)
      .eq("status", "active");

    const orgs = (memberships ?? []).map((m) => {
      const org = m.organizations as unknown as { id: string; name: string; slug: string | null };
      return {
        membershipId: m.id,
        role: m.role,
        ...org,
      };
    });

    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <PageHeader 
          title="Tus Organizaciones" 
          description="Gestiona tus espacios de trabajo y cambia entre ellos."
          action={
            <Link 
              href="/onboarding"
              className="px-4 py-2 bg-zs-blue hover:bg-zs-blue-lt text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-zs-glow-blue flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Organización
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orgs.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState 
                icon={<Building2 className="w-8 h-8" />}
                title="No tienes organizaciones"
                description="Crea tu primera organización para empezar a trabajar."
              />
            </div>
          ) : (
            orgs.map((org) => (
              <div 
                key={org.id}
                className="p-6 rounded-2xl bg-zs-bg-secondary/40 backdrop-blur-xl border border-zs-border hover:border-zs-blue/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zs-blue text-xl font-black">
                    {org.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-zs-blue/10 text-zs-blue border border-zs-blue/20">
                    {org.role}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{org.name}</h3>
                <p className="text-xs text-zs-text-secondary mb-6">{org.slug || "No slug set"}</p>
                
                <div className="pt-4 border-t border-zs-border flex justify-end">
                   <Link 
                     href="/dashboard"
                     className="text-xs font-bold text-zs-text-muted hover:text-zs-blue uppercase tracking-widest transition-colors"
                   >
                     Entrar al Dashboard →
                   </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-8 border-t border-zs-border">
          <h2 className="text-sm font-black text-zs-text-muted uppercase tracking-[0.2em] mb-4">Selector Rápido</h2>
          <div className="max-w-xs">
            <WorkspaceSwitcher />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    const { body, status } = handleAuthError(err);
    return (
       <div className="p-8 text-rose-400">
         Error al cargar organizaciones.
       </div>
    );
  }
}
