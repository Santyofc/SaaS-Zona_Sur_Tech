import Image from "next/image";
import Link from "next/link";
import { forgotPassword } from "@/app/(site)/(auth)/actions";

const ForgotPasswordPage = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zs-bg-primary py-20">
      <div className="zs-orb right-[-5%] top-[-5%] h-[400px] w-[400px] bg-zs-blue opacity-10" />
      <div className="zs-orb bottom-[-5%] left-[-5%] h-[300px] w-[300px] bg-zs-cyan opacity-10" />

      <div className="container relative z-content">
        <div className="mx-auto max-w-[500px]">
          <div className="zs-card p-10 sm:p-14">
            <div className="mb-10 text-center">
              <Link href="/" className="inline-block transition-transform hover:scale-105">
                <Image
                  src="/images/logo/logo-white.svg"
                  alt="Zona Sur Tech"
                  width={180}
                  height={45}
                  className="object-contain"
                />
              </Link>
              <h1 className="mt-8 font-display text-2xl font-black tracking-tighter text-zs-text-primary">
                RECOVER <span className="zs-text-gradient-brand">IDENTITY</span>
              </h1>
              <p className="mt-2 text-sm text-zs-text-secondary">
                Initialize secure link transmission to restore access.
              </p>
            </div>

            <form action={forgotPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted ml-1">
                  Target Identity (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="operator@zonasur.tech"
                  className="zs-input"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="zs-btn-brand w-full py-4 text-xs font-black tracking-[0.25em] uppercase"
                >
                  DISPATCH SIGNAL
                </button>
              </div>
            </form>

            <div className="mt-10 text-center">
              <Link
                href="/signin"
                className="text-sm font-bold text-zs-text-secondary hover:text-zs-blue transition-colors underline-offset-4 hover:underline"
              >
                Return to Gateway
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-zs-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-zs-border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </section>
  );
};

export default ForgotPasswordPage;
