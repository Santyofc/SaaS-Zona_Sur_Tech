import { LogoZS } from "@repo/ui";
import RegisterForm from "../../components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zs-bg-primary flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[640px] space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <LogoZS className="w-16 h-16 text-zs-blue mb-4" />
          <h1 className="text-4xl font-black text-white tracking-tighter">Únete a Zona Sur Tech</h1>
          <p className="text-zs-text-secondary max-w-sm">Comienza a gestionar tus servicios hoy mismo.</p>
        </div>
        
        <div className="bg-zs-bg-secondary p-8 md:p-12 rounded-[3rem] shadow-2xl border border-zs-border">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
