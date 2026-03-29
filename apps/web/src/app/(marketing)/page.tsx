import { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import StatsTape from "./components/StatsTape";
import FeaturesGrid from "./components/FeaturesGrid";
import CTASection from "./components/CTASection";
import SEOContextLinks from "./components/SEOContextLinks";
import EcosystemBento from "./components/EcosystemBento";
import dynamic from "next/dynamic";

const LiveEmulators = dynamic(() => import("./components/LiveEmulators.client"), {
  ssr: false,
});

/**
 * Task 2: Per-page metadata with explicit canonical for homepage.
 * This overrides the root layout's fallback metadata.
 */
export const metadata: Metadata = {
  title: "ERP y Facturación Electrónica en Costa Rica | ZonaSur Tech",
  description:
    "Software ERP y Facturación Electrónica para PYMES costarricenses. Cumplimiento con Ministerio de Hacienda versión 4.3. Inventario, CRM y marketplace en una sola plataforma.",
  alternates: {
    canonical: "https://zonasurtech.online",
  },
  openGraph: {
    title: "ERP y Facturación Electrónica en Costa Rica | ZonaSur Tech",
    description:
      "Plataforma SaaS completa para PYMES en Costa Rica. Facturación electrónica Hacienda v4.3, inventario multi-sucursal, CRM y más.",
    url: "https://zonasurtech.online",
    images: [
      {
        url: "/images/og/og-home.png",
        width: 1200,
        height: 630,
        alt: "ZonaSur Tech - ERP y Facturación Electrónica para PYMES en Costa Rica",
      },
    ],
  },
};

export default function Home() {
  return (
    <main
      className="relative bg-zs-bg-primary overflow-hidden font-mono selection:bg-zs-blue/30 selection:text-white"
      // Task 7: LD+JSON structured data for Google
    >
      {/* Schema.org SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "ZonaSur Tech",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: "https://zonasurtech.online",
            description:
              "ERP y Facturación Electrónica para PYMES costarricenses. Cumplimiento con Ministerio de Hacienda versión 4.3.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "CRC",
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "47",
            },
            provider: {
              "@type": "Organization",
              name: "ZonaSur Tech",
              url: "https://zonasurtech.online",
              logo: "https://zonasurtech.online/images/logo/logo.png",
              address: {
                "@type": "PostalAddress",
                addressCountry: "CR",
              },
            },
          }),
        }}
      />

      {/* Static background effects — pure CSS, no JS */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-zs-blue/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-zs-violet/5 rounded-full blur-[150px]" />
      </div>

      <HeroSection />
      <StatsTape />
      <FeaturesGrid />
      <LiveEmulators />
      <EcosystemBento />
      <SEOContextLinks />
      <CTASection />
    </main>
  );
}
