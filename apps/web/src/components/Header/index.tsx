"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

import menuData from "./menuData";

type AuthUser = {
  email?: string;
  user_metadata?: { full_name?: string; name?: string };
} | null;

const Header = () => {
  const pathname = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [sticky, setSticky] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleStickyNavbar = () => setSticky(window.scrollY >= 36);
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const handleSubmenu = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    document.cookie = "session=; Max-Age=0; path=/;";
    window.location.href = "/";
  };

  const displayName =
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? "Operator";

  return (
    <header
      className={`fixed left-0 top-0 z-[999] w-full border-b transition-all duration-300 ${
        sticky
          ? "border-zs-border bg-zs-bg-overlay shadow-[0_10px_40px_rgba(2,6,23,0.45)]"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between px-4 py-3 lg:py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-zs-border bg-zs-bg-secondary">
              <Image
                src="/images/logo/logo.png"
                alt="Zona Sur Tech"
                width={44}
                height={44}
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </span>
            <span className="hidden text-xs font-black uppercase tracking-[0.28em] text-zs-text-primary sm:block">
              Zona Sur <span className="text-zs-cyan">Tech</span>
            </span>
          </Link>

          <button
            aria-label="Mobile Menu"
            className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg border border-zs-border bg-zs-bg-secondary p-2.5 lg:hidden"
            onClick={() => setNavbarOpen((open) => !open)}
          >
            <span className={`my-1 block h-0.5 w-6 bg-zs-text-primary transition ${navbarOpen ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`my-1 block h-0.5 w-6 bg-zs-text-primary transition ${navbarOpen ? "opacity-0" : ""}`} />
            <span className={`my-1 block h-0.5 w-6 bg-zs-text-primary transition ${navbarOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>

          <nav
            className={`absolute right-4 top-full z-30 w-[280px] rounded-2xl border border-zs-border bg-zs-bg-secondary/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:static lg:w-auto lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none ${
              navbarOpen ? "visible translate-y-2 opacity-100" : "invisible opacity-0 lg:visible lg:translate-y-0 lg:opacity-100"
            }`}
          >
            <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-7">
              {menuData.map((menuItem, index) =>
                menuItem.path ? (
                  <li key={index}>
                    <Link
                      href={menuItem.path}
                      scroll={false}
                      className={`inline-flex w-full rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] transition lg:w-auto lg:px-0 lg:py-1 ${
                        pathname === menuItem.path
                          ? "text-zs-cyan"
                          : "text-zs-text-secondary hover:text-zs-text-primary"
                      }`}
                    >
                      {menuItem.title}
                    </Link>
                  </li>
                ) : (
                  <li key={index} className="relative">
                    <button
                      onClick={() => handleSubmenu(index)}
                      className="inline-flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-zs-text-secondary transition hover:text-zs-text-primary lg:w-auto lg:px-0"
                    >
                      {menuItem.title}
                      <span className="ml-2 text-zs-cyan">▾</span>
                    </button>
                    <div
                      className={`left-0 top-full mt-1 w-full rounded-xl border border-zs-border bg-zs-bg-primary/95 p-2 backdrop-blur-xl lg:absolute lg:mt-3 lg:w-[230px] ${
                        openIndex === index ? "block" : "hidden lg:group-hover:block"
                      }`}
                    >
                      {menuItem.submenu?.map((submenuItem, i: number) => {
                        if (!submenuItem.path) return null;
                        return (
                          <Link
                            key={i}
                            href={submenuItem.path}
                            className={`block rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                              pathname === submenuItem.path
                                ? "bg-zs-bg-surface text-zs-cyan"
                                : "text-zs-text-secondary hover:bg-zs-bg-surface hover:text-zs-text-primary"
                            }`}
                          >
                            {submenuItem.title}
                          </Link>
                        );
                      })}
                    </div>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="hidden items-center gap-4 pl-6 lg:flex">
            {user ? (
              <>
                <span className="rounded-full border border-zs-border bg-zs-bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zs-text-secondary">
                  {displayName}
                </span>
                <button
                  onClick={handleSignOut}
                  className="zs-btn-ghost px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em]"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="zs-btn-ghost px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em]"
                >
                  Sign In
                </Link>
                <Link href="/signup" className="zs-btn-brand px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                  Start Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
