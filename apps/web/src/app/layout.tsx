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
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "ZonaSur Tech | ERP y Facturación Electrónica Costa Rica",
    template: "%s | ZonaSur Tech",
  },
  description:
    "Software ERP y Facturación Electrónica para PYMES en Costa Rica. Cumplimos con Hacienda (v4.3), marketplace, inventario y CRM en una sola plataforma.",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "es_CR",
    url: BASE_URL,
    siteName: "ZonaSur Tech",
    title: "ZonaSur Tech | ERP y Facturación Electrónica Costa Rica",
    description:
      "Plataforma SaaS de gestión empresarial para PYMES costarricenses.",
    images: [
      {
        url: "/images/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "ZonaSur Tech - ERP y Facturación Electrónica Costa Rica",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@zonasurtech",
    creator: "@zonasurtech",
    title: "ZonaSur Tech | ERP y Facturación Electrónica Costa Rica",
    description: "Plataforma SaaS de gestión empresarial para PYMES costarricenses.",
    images: ["/images/og/og-default.png"],
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

  keywords: [
    "facturación electrónica Costa Rica",
    "ERP Costa Rica",
    "software PYMES Costa Rica",
    "Hacienda Costa Rica",
    "inventario Costa Rica",
    "ZonaSur Tech",
  ],

  authors: [{ name: "ZonaSur Tech", url: BASE_URL }],
  creator: "ZonaSur Tech",
  publisher: "ZonaSur Tech",

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "",
  },

  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

/**
 * TASK 7: Preconnect hints.
 * These are injected via the <head> through Next.js metadata links.
 * Preconnect resolves DNS+TCP+TLS for critical third-party origins
 * before the browser needs them, reducing connection latency.
 */
export const links = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
  { rel: "dns-prefetch", href: "https://pagead2.googlesyndication.com" },
];

export const viewport: Viewport = {
  themeColor: "#06080f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Deferred client-only components — ssr:false keeps them off the critical path
// These are UX enhancements, not content — safe to load after LCP
const HackerCursor = dynamic(
  () =>
    import("../components/ui/HackerCursor.client").then((mod) => ({
      default: mod.HackerCursor,
    })),
  { ssr: false }
);

const ZSCommand = dynamic(
  () =>
    import("../components/Common/ZSCommand").then((mod) => ({
      default: mod.ZSCommand,
    })),
  { ssr: false }
);

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
        <script
          async
          {...{ "custom-element": "amp-auto-ads" } as any}
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        ></script>
      </head>
      <body className="bg-zs-bg-primary">
        {/* @ts-expect-error Custom AMP web component */}
        <amp-auto-ads type="adsense" data-ad-client="ca-pub-8338467922774671"></amp-auto-ads>
        <Providers>
          <div className="isolate relative min-h-screen">
            <HackerCursor />
            <ZSCommand />
            {children}
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
