"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import SocialSignIn from "../SocialSignIn";
import SwitchOption from "../SwitchOption";
import { useState } from "react";
import MagicLink from "../MagicLink";
import Loader from "@/components/Common/Loader";
import { signUp } from "@/app/(site)/(auth)/actions";

/**
 * ════════════════════════════════════════════════════════════
 * SIGN UP COMPONENT — Zona Sur Tech
 * Estética Hacker-Tech / Premium Interaction
 * ════════════════════════════════════════════════════════════
 */

const SignUp = () => {
  const router = useRouter();
  const [isPassword, setIsPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signUp(formData);
      toast.success("Identity registration initiated. Please check your email.");
      router.push("/signin");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zs-bg-primary py-20">
      {/* Decorative Orbs */}
      <div className="zs-orb right-[-10%] top-[-10%] h-[500px] w-[500px] bg-zs-cyan opacity-10" />
      <div className="zs-orb bottom-[-10%] left-[-10%] h-[400px] w-[400px] bg-zs-emerald opacity-10" />

      <div className="container relative z-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[500px]"
        >
          <div className="zs-card p-8 sm:p-12 border-zs-emerald/20">
            {/* Logo & Identity */}
            <div className="mb-10 text-center">
              <Link href="/" className="inline-block group transition-transform hover:scale-105">
                <div className="relative h-12 w-48 mx-auto">
                  <Image
                    src="/images/logo/logo.svg"
                    alt="Zona Sur Tech"
                    fill
                    priority
                    className="object-contain dark:hidden"
                  />
                  <Image
                    src="/images/logo/logo-white.svg"
                    alt="Zona Sur Tech"
                    fill
                    priority
                    className="hidden dark:block object-contain"
                  />
                </div>
              </Link>
              <h1 className="mt-6 font-display text-2xl font-black tracking-tight text-zs-text-primary">
                Register <span className="zs-text-gradient-brand">New Identity</span>
              </h1>
              <p className="mt-2 text-sm text-zs-text-secondary">
                Join the Zona Sur Tech ecosystem and start scaling.
              </p>
            </div>

            <SocialSignIn />

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zs-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-zs-text-muted">
                <span className="bg-zs-bg-secondary px-4 py-1 rounded-full">Secure Registration</span>
              </div>
            </div>

            <SwitchOption
              isPassword={isPassword}
              setIsPassword={setIsPassword}
            />

            <AnimatePresence mode="wait">
              {isPassword ? (
                <motion.form
                  key="signup-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Operator Name"
                      className="zs-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted ml-1">
                      Identity (Email)
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="operator@zonasur.tech"
                      className="zs-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted ml-1">
                      Security Key
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      className="zs-input"
                    />
                  </div>

                  <div className="py-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="zs-btn-brand w-full py-4 text-sm font-black tracking-[0.2em] uppercase disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Initialize Protocol
                        {loading ? <Loader className="w-5 h-5" /> : (
                          <svg className="w-4 h-4 transition-transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="magic-link-signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <MagicLink />
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-zs-text-muted">
              By registering, you agree to our{" "}
              <Link href="/privacy" className="text-zs-text-secondary hover:text-zs-emerald transition-colors">
                Privacy Protocol
              </Link>{" "}
              &{" "}
              <Link href="/terms" className="text-zs-text-secondary hover:text-zs-emerald transition-colors">
                Usage Terms
              </Link>
            </p>

            <div className="mt-10 pt-8 border-t border-zs-border text-center">
              <p className="text-sm text-zs-text-secondary">
                Existing operator?{" "}
                <Link href="/signin" className="font-bold text-zs-blue hover:text-zs-blue-lt transition-colors underline-offset-4 hover:underline">
                  Resume Session
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid Background Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(var(--color-zs-cyan) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
    </section>
  );
};

export default SignUp;
