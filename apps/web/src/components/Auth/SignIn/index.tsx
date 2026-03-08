"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import SocialSignIn from "../SocialSignIn";
import SwitchOption from "../SwitchOption";
import MagicLink from "../MagicLink";
import Loader from "@/components/Common/Loader";
import { signIn } from "@/app/(site)/(auth)/actions";

/**
 * ════════════════════════════════════════════════════════════
 * SIGN IN COMPONENT — Zona Sur Tech
 * Estética Hacker-Tech / Premium Interaction
 * ════════════════════════════════════════════════════════════
 */

const Signin = () => {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [isPassword, setIsPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn(formData);
      toast.success("Welcome back to Zona Sur Tech");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zs-bg-primary py-20">
      {/* Decorative Orbs */}
      <div className="zs-orb left-[-10%] top-[-10%] h-[500px] w-[500px] bg-zs-blue opacity-10" />
      <div className="zs-orb bottom-[-10%] right-[-10%] h-[400px] w-[400px] bg-zs-violet opacity-10" />

      <div className="container relative z-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[500px]"
        >
          <div className="zs-card p-8 sm:p-12">
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
                Access <span className="zs-text-gradient">Mission Control</span>
              </h1>
              <p className="mt-2 text-sm text-zs-text-secondary">
                Enter your credentials to manage your tech ecosystem.
              </p>
            </div>

            <SocialSignIn />

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zs-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-zs-text-muted">
                <span className="bg-zs-bg-secondary px-4 py-1 rounded-full">Secure Gateway</span>
              </div>
            </div>

            <SwitchOption
              isPassword={isPassword}
              setIsPassword={setIsPassword}
            />

            <AnimatePresence mode="wait">
              {isPassword ? (
                <motion.form
                  key="password-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted ml-1">
                      Identity (Email)
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="operator@zonasur.tech"
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="zs-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zs-text-muted ml-1">
                        Access Key
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-[10px] font-bold uppercase tracking-widest text-zs-blue hover:text-zs-blue-lt"
                      >
                        Reset Key?
                      </Link>
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="zs-input"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="zs-btn-brand w-full py-4 text-base tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Initialize Session
                      {loading ? <Loader className="w-5 h-5" /> : (
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      )}
                    </span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="magic-link"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <MagicLink />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 pt-8 border-t border-zs-border text-center">
              <p className="text-sm text-zs-text-secondary">
                New operator?{" "}
                <Link href="/signup" className="font-bold text-zs-cyan hover:text-zs-emerald transition-colors underline-offset-4 hover:underline">
                  Register Identity
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Futuristic Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-zs-bg-primary)_100%)] opacity-50" />
    </section>
  );
};

export default Signin;
