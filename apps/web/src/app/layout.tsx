import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import Providers from "./providers";
import dynamic from "next/dynamic";
import { Metadata, Viewport } from "next";
import { Inter, Syne, DM_Sans } from "next/font/google";

const BASE_URL = "https://zonasurtech.online";

/**
 * TASK 6: Font Optimization
 *
 * Rules applied:
 * - `display: "swap"` on all fonts — prevents FOIT (Flash of Invisible Text),
 *   the primary font-related LCP killer.
 * - `preload: true` ONLY on Inter (body font, first paint critical).
 * - Syne + DM_Sans: `preload: false` — display fonts used for headings,
 *   the browser will find them in the CSS without blocking LCP.
 * - `adjustFontFallback: true` (default) — Next.js generates a metric-matched
 *   fallback that prevents layout shift when the real font loads (CLS fix).
 * - `fallback` arrays provide metric-matched system fonts so the page is
 *   readable immediately, reducing LCP even before font arrives.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,           // Critical: body text
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  preload: false,          // Non-critical: heading font, defer
  fallback: ["Georgia", "serif"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,          // Non-critical: secondary font
  fallback: ["system-ui", "sans-serif"],
});

/**
 * TASK 7: Metadata with preconnect + critical preloads.
 * metadataBase drives all relative canonical URLs throughout the app.
 */
import { getPublishedEntryBySlug, getPublicCmsSettings } from "@/lib/cms/queries";

export async function generateMetadata(): Promise<Metadata> {
  let settings: Record<string, string> = {};
  try {
    settings = await getPublicCmsSettings();
  } catch {
    // Silent fail — use defaults
  }

  const siteName = settings.siteName || settings.site_name || "ZonaSur Tech";
  const siteDescription =
    settings.siteDescription ||
    settings.site_description ||
    "ZonaSur Tech | El Business OS para empresas sofisticadas en Costa Rica. Automatización, Inteligencia y Control Operativo.";
  const ogImageUrl = settings.ogImageUrl || settings.og_image_url || "/images/og/og-default.png";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `${siteName} | Business OS & SaaS Engine`,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    alternates: {
      canonical: BASE_URL,
    },
    openGraph: {
      type: "website",
      locale: "es_CR",
      url: BASE_URL,
      siteName: siteName,
      title: `${siteName} | Business OS, Automatización e IA`,
      description: siteDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} - Business OS, Automatización e IA`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Business OS, Automatización e IA`,
      description: siteDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#06080f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Deferred client-only components — ssr:false keeps them off the critical path
// These are UX enhancements, not content — safe to load after LCP
const ScrollToTop = dynamic(() => import("../components/ScrollToTop"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`!scroll-smooth ${inter.variable} ${syne.variable} ${dmSans.variable}`}
      lang="es"
    >
      <head>
        {/*
          TASK 7: DNS preconnect for critical origins.
          These cannot be expressed via metadata.links in Next.js 14,
          so they're placed directly in <head> via the layout.
          
          NOTE: fonts.googleapis.com is preconnected because next/font
          downloads font files at build time, but the preconnect hints
          help subresource loading for any remaining third-party references.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://www.googletagmanager.com"
        />
      </head>
      <body className="bg-zs-bg-primary">
        <Providers>
          <div className="isolate relative min-h-screen">
            {children}
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
