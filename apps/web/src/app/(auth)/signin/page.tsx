import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Acceso al Kernel | Zona Sur Tech",
  description: "Inicia sesión para acceder al ecosistema de alto rendimiento de Zona Sur Tech.",
};

export default function SigninPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <section className="relative min-h-screen pt-[180px] pb-[120px] overflow-hidden">
      {/* Background Decor */}
      <div className="zs-orb w-[600px] h-[600px] bg-zs-blue/10 top-[-20%] left-[-10%]" />
      <div className="zs-orb w-[400px] h-[400px] bg-zs-violet/5 bottom-[10%] right-[-5%]" />

      <div className="container relative z-10">
        <div className="max-w-[480px] mx-auto">
          <div className="animate-zs-fade-up">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zs-blue/10 border border-zs-blue/20 text-zs-blue mb-6 shadow-zs-glow-blue">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-4xl font-black text-white mb-3 italic tracking-tight uppercase">
                Zona Sur <span className="text-zs-blue">Tech</span>
              </h1>
              <p className="text-zs-text-secondary text-sm font-medium uppercase tracking-widest">
                Acceso al Kernel Industrial
              </p>
            </div>

            {/* Form Card */}
            <div className="zs-card p-8 md:p-10">
              <SignInForm 
                defaultError={searchParams.error} 
                message={searchParams.message} 
              />
            </div>

            {/* Footer Signin */}
            <p className="text-center mt-8 text-zs-text-secondary text-sm">
              ¿No tienes acceso?{" "}
              <Link href="/signup" className="text-white font-black hover:text-zs-blue transition-colors underline decoration-zs-blue/30 underline-offset-4">
                Solicita Credenciales
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
