import Image from "next/image";
import Link from "next/link";
import { updatePassword } from "@/app/(site)/(auth)/actions";

export default function ResetPasswordPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zs-bg-primary py-20">
      <div className="zs-orb right-[-5%] bottom-[-5%] h-[400px] w-[400px] bg-zs-emerald opacity-10" />
      <div className="zs-orb top-[-5%] left-[-5%] h-[300px] w-[300px] bg-zs-blue opacity-10" />

      <div className="container relative z-content">
        <div className="mx-auto max-w-[500px]">
          <div className="zs-card p-10 sm:p-14 border-zs-blue/20">
            <div className="mb-10 text-center">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo/logo-white.svg"
                  alt="Zona Sur Tech"
                  width={160}
                  height={40}
                  className="object-contain"
                />
              </Link>
              <h1 className="mt-8 font-display text-2xl font-black tracking-tight text-zs-text-primary uppercase">
                Reset <span className="zs-text-gradient-brand">Security Key</span>
              </h1>
              <p className="mt-2 text-sm text-zs-text-secondary">
                Establish a new encrypted key for your identity.
              </p>
            </div>

            <form action={updatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted ml-1">
                  New Security Key
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="zs-input"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="zs-btn-brand w-full py-4 text-xs font-black tracking-[0.25em] uppercase hover:shadow-zs-glow-blue/40"
                >
                  ROTATE KEY
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(var(--color-zs-cyan) 0.5px, transparent 0.5px)",
          backgroundSize: "30px 30px",
        }}
      />
    </section>
  );
}
