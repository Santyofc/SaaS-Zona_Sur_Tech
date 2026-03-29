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

import { getPublishedEntryBySlug } from "@/lib/cms/queries";

const DEFAULT_METADATA: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const entry = await getPublishedEntryBySlug("home", "page");
    if (!entry) return DEFAULT_METADATA;

    const seo = (entry.seoMeta ?? {}) as { title?: string; description?: string; ogImage?: string; noindex?: boolean };

    return {
      title: seo.title || entry.title || DEFAULT_METADATA.title || undefined,
      description: seo.description || entry.excerpt || DEFAULT_METADATA.description || undefined,
      alternates: DEFAULT_METADATA.alternates,
      openGraph: {
        ...DEFAULT_METADATA.openGraph,
        title: seo.title || entry.title || DEFAULT_METADATA.openGraph?.title || undefined,
        description: seo.description || entry.excerpt || DEFAULT_METADATA.openGraph?.description || undefined,
        images: seo.ogImage ? [{ url: seo.ogImage }] : DEFAULT_METADATA.openGraph?.images,
      },
      robots: seo.noindex ? { index: false, follow: false } : undefined,
    };
  } catch {
    return DEFAULT_METADATA;
  }
}

export default async function Home() {
  // Option for passing down CMS dynamic contents into React components
  // const entry = await getPublishedEntryBySlug("home").catch(() => null);
  return (
    <main className="relative bg-zs-bg-primary overflow-hidden font-mono selection:bg-zs-blue/30 selection:text-white">
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
