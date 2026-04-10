import { requireOrganization, handleAuthError, requireSuperAdmin, requireAuth } from '@repo/auth';
import { DashboardContent } from '@/components/dashboard/dashboard/DashboardContent';
import Link from 'next/link';
import { Terminal, ShieldAlert } from 'lucide-react';

export default async function DashboardPage() {
  try {
    // Consolidated resolution of identity + organization + role + permissions
    const ctx = await requireOrganization();

    const session = {
      userId: ctx.userId,
      organizationId: ctx.organizationId,
      organizationName: ctx.organizationName,
      role: ctx.role,
      user: {
        id: ctx.userId,
        email: ctx.email,
        name: ctx.authUser.user_metadata?.display_name || ctx.email.split('@')[0],
      },
      isSuperAdmin: !!ctx.authUser.app_metadata?.is_super_admin || ctx.email === "admin@zonasurtech.online"
    };

    return (
      <div className="p-8">
        <DashboardContent session={session as any} />
      </div>
    );
  } catch (error: any) {
    // Check if the user is a Super Admin even if they don't have an organization
    try {
      const authUser = await requireAuth();
      const isSuperAdmin = !!authUser.authUser.app_metadata?.is_super_admin || authUser.email === "admin@zonasurtech.online";

      if (isSuperAdmin) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] bg-zs-bg-primary text-white p-6">
            <div className="w-20 h-20 rounded-3xl bg-zs-violet/10 border border-zs-violet/20 flex items-center justify-center mb-8 relative">
                <ShieldAlert className="w-10 h-10 text-zs-violet" />
                <div className="absolute inset-0 bg-zs-violet/20 rounded-3xl blur-2xl animate-pulse" />
            </div>
            
            <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-4">
              Kernel <span className="text-zs-violet shadow-zs-glow-violet">Detectado</span>
            </h1>
            <p className="text-zs-text-secondary text-center max-w-md mb-10 font-medium">
              Tu identidad ha sido verificada como <span className="text-white font-bold">Administrador Raiz</span>. 
              Aunque no perteneces a ninguna organización aún, tienes acceso total al Kernel de Zona Sur Tech.
            </p>

            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-zs-violet text-white font-black uppercase tracking-[0.3em] text-xs shadow-zs-glow-violet/40 hover:scale-105 transition-all active:scale-95"
            >
              <Terminal className="w-5 h-5" />
              Ingresar al Kernel
            </Link>
          </div>
        );
      }
    } catch (authError) {
      // Fallback to error handling if even requireAuth fails
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-zs-bg-primary text-zs-text-primary p-6">
        <h1 className="mb-4 text-2xl font-bold">No se encontro una organizacion activa</h1>
        <p className="mb-8 text-center text-zs-text-secondary">Completa onboarding o unete a una organizacion.</p>
        <Link href="/onboarding" className="zs-btn-brand px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">
            Iniciar onboarding
        </Link>
      </div>
    );
  }
}
