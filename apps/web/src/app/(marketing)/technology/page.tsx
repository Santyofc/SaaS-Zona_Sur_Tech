import { getPublishedEntryBySlug } from "@/lib/cms/queries";
import { Metadata } from "next";
import TechnologyClient from "./page.client";

const DEFAULT_METADATA: Metadata = {
    title: "Tecnología y Stack | Zona Sur Tech",
    description: "Conoce el motor detrás de nuestra infraestructura de baja latencia.",
};

export async function generateMetadata(): Promise<Metadata> {
    try {
        const entry = await getPublishedEntryBySlug("technology", "page");
        if (!entry) return DEFAULT_METADATA;

        const seo = (entry.seoMeta ?? {}) as { title?: string; description?: string; ogImage?: string; noindex?: boolean };
        return {
            title: seo.title || entry.title || DEFAULT_METADATA.title || undefined,
            description: seo.description || entry.excerpt || DEFAULT_METADATA.description || undefined,
            openGraph: {
                title: seo.title || entry.title || DEFAULT_METADATA.title || undefined,
                description: seo.description || entry.excerpt || DEFAULT_METADATA.description || undefined,
                images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
            },
            robots: seo.noindex ? { index: false, follow: false } : undefined,
        };
    } catch {
        return DEFAULT_METADATA;
    }
}

export default async function TechnologyPage() {
    const entry = await getPublishedEntryBySlug("technology", "page").catch(() => null);
    
    return (
        <TechnologyClient 
            pageTitle={entry?.title as string | null | undefined}
            pageSubtitle={entry?.excerpt as string | null | undefined}
        />
    );
}
