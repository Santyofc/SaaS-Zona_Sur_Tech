import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";

const navPrimary = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Use Cases", path: "/use-cases" },
  { name: "Pricing", path: "/pricing" },
];

const navLegal = [
  { name: "Privacy", path: "/legal/privacy" },
  { name: "Terms", path: "/legal/terms" },
  { name: "Cookies", path: "/legal/cookies" },
  { name: "Security", path: "/security" },
];

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-zs-border bg-zs-bg-primary/80 backdrop-blur-xl">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 left-[14%] h-44 w-44 rounded-full bg-zs-cyan/10 blur-3xl" />
        <div className="absolute bottom-0 right-[12%] h-52 w-52 rounded-full bg-zs-violet/10 blur-3xl" />
      </div>

      <div className="container relative py-14">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/images/logo/logo.png" alt="Zona Sur Tech" width={42} height={42} className="rounded-lg" />
              <span className="text-sm font-black uppercase tracking-[0.22em] text-zs-text-primary">
                Zona Sur <span className="text-zs-cyan">Tech</span>
              </span>
            </Link>
            <p className="max-w-xl text-sm leading-relaxed text-zs-text-secondary">
              Plataforma SaaS para operar procesos, equipos y automatizaciones con una estética clara y una capa técnica lista para producción.
            </p>
            <div className="flex items-center gap-2">
              <a aria-label="GitHub" href="https://github.com/Santyofc" target="_blank" rel="noreferrer" className="rounded-xl border border-zs-border bg-zs-bg-secondary p-2.5 text-zs-text-secondary transition hover:text-zs-cyan hover:border-zs-cyan/60">
                <Github className="h-4 w-4" />
              </a>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/in/santi-delgados/" target="_blank" rel="noreferrer" className="rounded-xl border border-zs-border bg-zs-bg-secondary p-2.5 text-zs-text-secondary transition hover:text-zs-cyan hover:border-zs-cyan/60">
                <Linkedin className="h-4 w-4" />
              </a>
              <a aria-label="Email" href="mailto:no-reply@zonasurtech.online" className="rounded-xl border border-zs-border bg-zs-bg-secondary p-2.5 text-zs-text-secondary transition hover:text-zs-cyan hover:border-zs-cyan/60">
                <Mail className="h-4 w-4" />
              </a>
              <a aria-label="WhatsApp" href="https://wa.me/50662584390" target="_blank" rel="noreferrer" className="rounded-xl border border-zs-border bg-zs-bg-secondary p-2.5 text-zs-text-secondary transition hover:text-zs-cyan hover:border-zs-cyan/60">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-zs-text-primary">Product</h4>
            <ul className="space-y-2.5">
              {navPrimary.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm text-zs-text-secondary transition hover:text-zs-text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-zs-text-primary">Legal</h4>
            <ul className="space-y-2.5">
              {navLegal.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm text-zs-text-secondary transition hover:text-zs-text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-zs-border pt-6 text-xs text-zs-text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Zona Sur Tech. All rights reserved.</p>
          <p className="uppercase tracking-[0.14em]">Built for velocity and operational clarity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
