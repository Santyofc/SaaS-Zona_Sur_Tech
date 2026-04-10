import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Solicitud de Credenciales | Zona Sur Tech",
  description: "Únete al ecosistema de alto rendimiento de Zona Sur Tech.",
};

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="relative min-h-screen overflow-hidden pb-[120px] pt-[180px]">
      <div className="zs-orb right-[-10%] top-[-20%] h-[620px] w-[620px] bg-zs-violet/10" />
      <div className="zs-orb bottom-[8%] left-[-5%] h-[420px] w-[420px] bg-zs-cyan/8" />

      <div className="container relative z-10">
        <div className="max-w-[480px] mx-auto">
          <div className="animate-zs-fade-up">
            {/* Header */}
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-zs-violet/30 bg-zs-violet/12 text-zs-violet shadow-zs-glow-violet">
                <UserPlus size={32} />
              </div>
              <h1 className="zs-heading-lg mb-3 text-4xl italic">
                Zona Sur <span className="text-zs-violet">Tech</span>
              </h1>
              <p className="text-sm font-medium uppercase tracking-widest text-zs-text-secondary">
                Inicializa tu Nodo en el Kernel
              </p>
            </div>

            {/* Form Card */}
            <div className="zs-card p-8 md:p-10">
              <SignUpForm defaultError={searchParams.error} />
            </div>

            {/* Footer Signup */}
            <p className="mt-8 text-center text-sm text-zs-text-secondary">
              ¿Ya tienes un nodo activo?{" "}
              <Link href="/signin" className="font-black text-white underline decoration-zs-violet/30 underline-offset-4 transition-colors hover:text-zs-violet">
                Sincronizar Ahora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
