import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import Providers from "./providers";
import dynamic from "next/dynamic";
import { Metadata, Viewport } from "next";
import { Inter, Syne, DM_Sans } from "next/font/google";

const BASE_URL = "https://zonasurtech.online";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,          // Preload critical font
  fallback: ["system-ui", "arial"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  preload: false,         // Non-critical, load async
  fallback: ["system-ui"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,         // Non-critical, load async
  fallback: ["system-ui"],
});

/**
 * Task 2: Root metadata — establishes metadataBase so all
 * per-page `alternates.canonical` resolve correctly.
 * This is the ONLY place metadataBase is declared.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // Fallback title/description — pages override via their own `export const metadata`
  title: {
    default: "ZonaSur Tech | ERP y Facturación Electrónica Costa Rica",
    template: "%s | ZonaSur Tech",
  },
  description:
    "Software ERP y Facturación Electrónica para PYMES en Costa Rica. Cumplimos con Hacienda (v4.3), marketplace, inventario y CRM en una sola plataforma.",

  // Canonical — pages override their own; root points to homepage
  alternates: {
    canonical: BASE_URL,
  },

  // OpenGraph
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: BASE_URL,
    siteName: "ZonaSur Tech",
    title: "ZonaSur Tech | ERP y Facturación Electrónica Costa Rica",
    description:
      "Plataforma SaaS de gestión empresarial para PYMES costarricenses. Facturación electrónica Hacienda, inventario, CRM y más.",
    images: [
      {
        url: "/images/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "ZonaSur Tech - ERP y Facturación Electrónica Costa Rica",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    site: "@zonasurtech",
    creator: "@zonasurtech",
    title: "ZonaSur Tech | ERP y Facturación Electrónica Costa Rica",
    description:
      "Plataforma SaaS de gestión empresarial para PYMES costarricenses.",
    images: ["/images/og/og-default.png"],
  },

  // Robots meta (belt-and-suspenders with robots.ts)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Prevent indexing of static assets via meta
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

  // Verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "",
  },

  // Icons
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

/** Task 8: Viewport export (separated from metadata per Next.js 14 best practice) */
export const viewport: Viewport = {
  themeColor: "#0b0f17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Deferred client-only components — ssr:false keeps them off the critical path
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
      <body className="bg-zs-bg-primary">
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
