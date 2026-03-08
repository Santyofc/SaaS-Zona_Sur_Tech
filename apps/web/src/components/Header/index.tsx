"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

import menuData from "./menuData";

const Header = () => {
  const pathUrl = usePathname();
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string; name?: string } } | null>(null);

  // Fetch Supabase session on mount
  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    // Clear the unified session cookie
    document.cookie = "session=; Max-Age=0; path=/;";
    window.location.href = "/";
  };

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: any) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const { theme, setTheme } = useTheme();
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email;

  return (
    <>
      <header
        className={`ud-header left-0 top-0 z-40 flex w-full items-center transition-all duration-300 ${sticky
          ? "fixed z-[999] border-b border-zs-blue/10 bg-zs-bg-primary/80 backdrop-blur-xl shadow-zs-glow-blue/5"
          : "absolute bg-transparent"
          }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4">
              <Link
                href="/"
                className={`navbar-logo block w-full transition-transform hover:scale-105 ${sticky ? "py-2" : "py-5"
                  } `}
              >
                <Image
                  src="/images/logo/logo-white.svg"
                  alt="Zona Sur Tech"
                  width={sticky ? 50 : 60}
                  height={sticky ? 40 : 50}
                  className="header-logo object-contain"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-zs-emerald focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? " top-[7px] rotate-45" : " "
                      } ${sticky ? "bg-zs-text-primary" : "bg-white"}`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? "opacity-0 " : " "
                      } ${sticky ? "bg-zs-text-primary" : "bg-white"}`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? " top-[-8px] -rotate-45" : " "
                      } ${sticky ? "bg-zs-text-primary" : "bg-white"}`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border border-zs-border bg-zs-bg-secondary px-6 py-4 duration-300 overflow-hidden lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${navbarOpen
                    ? "visibility top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                    }`}
                >
                  <ul className="block lg:ml-8 lg:flex lg:gap-x-8 xl:ml-14 xl:gap-x-12">
                    {menuData.map((menuItem, index) =>
                      menuItem.path ? (
                        <li key={index} className="group relative">
                          <Link
                            scroll={false}
                            href={menuItem.path}
                            className={`ud-menu-scroll flex py-2 text-sm font-bold tracking-tight uppercase transition-colors lg:inline-flex lg:px-0 lg:py-6 ${sticky
                              ? "text-zs-text-secondary hover:text-zs-blue"
                              : "text-white/80 hover:text-white"
                              } ${pathUrl === menuItem?.path && (sticky ? "text-zs-blue" : "text-white font-black underline decoration-zs-blue decoration-2 underline-offset-8")
                              }`}
                          >
                            {menuItem.title}
                          </Link>
                        </li>
                      ) : (
                        <li className="submenu-item group relative" key={index}>
                          <button
                            onClick={() => handleSubmenu(index)}
                            className={`ud-menu-scroll flex items-center justify-between py-2 text-sm font-bold tracking-tight uppercase transition-colors lg:inline-flex lg:px-0 lg:py-6 ${sticky
                              ? "text-zs-text-secondary hover:text-zs-blue"
                              : "text-white/80 hover:text-white"
                              }`}
                          >
                            {menuItem.title}
                            <span className="pl-1 transition-transform group-hover:rotate-180">
                              <svg width="12" height="12" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z" fill="currentColor" />
                              </svg>
                            </span>
                          </button>

                          <div
                            className={`submenu absolute left-0 top-full w-[250px] rounded-xl border border-zs-border bg-zs-bg-secondary/95 backdrop-blur-xl p-4 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 lg:block ${openIndex === index ? "visible opacity-100 block" : ""}`}
                          >
                            {menuItem?.submenu?.map((submenuItem: any, i: number) => (
                              <Link
                                href={submenuItem.path}
                                key={i}
                                className={`block rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${pathUrl === submenuItem.path
                                  ? "bg-zs-blue/10 text-zs-blue"
                                  : "text-zs-text-secondary hover:bg-zs-white/5 hover:text-zs-text-primary"
                                  }`}
                              >
                                {submenuItem.title}
                              </Link>
                            ))}
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                </nav>
              </div>
              <div className="hidden items-center justify-end gap-x-6 sm:flex lg:pr-0">
                {user ? (
                  <div className="flex items-center gap-4">
                    <p className={`text-xs font-black uppercase tracking-[0.2em] ${sticky ? "text-zs-text-primary" : "text-white"}`}>
                      {displayName}
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="text-xs font-black tracking-widest uppercase text-zs-text-secondary hover:text-zs-emerald transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${sticky ? "text-zs-text-primary hover:text-zs-blue" : "text-white hover:text-white/80"}`}
                    >
                      Identity Link
                    </Link>
                    <Link
                      href="/signup"
                      className="zs-btn-brand py-2.5 px-6 text-[10px] font-black tracking-[0.25em] uppercase"
                    >
                      Initialize
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
