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
    <section className="relative min-h-screen overflow-hidden pb-[120px] pt-[180px]">
      <div className="zs-orb left-[-10%] top-[-20%] h-[600px] w-[600px] bg-zs-cyan/10" />
      <div className="zs-orb bottom-[5%] right-[-6%] h-[420px] w-[420px] bg-zs-violet/8" />

      <div className="container relative z-10">
        <div className="max-w-[480px] mx-auto">
          <div className="animate-zs-fade-up">
            {/* Header */}
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-zs-cyan/30 bg-zs-cyan/10 text-zs-cyan shadow-zs-glow-cyan">
                <ShieldCheck size={32} />
              </div>
              <h1 className="zs-heading-lg mb-3 text-4xl italic">
                Zona Sur <span className="text-zs-cyan">Tech</span>
              </h1>
              <p className="text-sm font-medium uppercase tracking-widest text-zs-text-secondary">
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
            <p className="mt-8 text-center text-sm text-zs-text-secondary">
              ¿No tienes acceso?{" "}
              <Link href="/signup" className="font-black text-white underline decoration-zs-cyan/30 underline-offset-4 transition-colors hover:text-zs-cyan">
                Solicita Credenciales
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
