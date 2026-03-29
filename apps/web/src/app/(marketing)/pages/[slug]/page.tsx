/**
 * /pages/[slug] — Public CMS page renderer
 *
 * - ISR with `revalidate: 3600` (revalidates every hour)
 * - On-demand revalidation via revalidateTag("cms-entry-SLUG") from server actions
 * - Full SEO metadata from the entry's seoMeta bag
 * - 404 via notFound() if slug doesn't exist or is not published
 * - Renders page blocks via BlockRenderer
 */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedEntryBySlug, getAllPublishedSlugs } from "@/lib/cms/queries";
import { BlockRenderer } from "@/components/cms/BlockRenderer";
import type { Block } from "@repo/db/cms-schema";
import { MarkdownRenderer } from "@/components/cms/MarkdownRenderer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const BASE_URL = "https://zonasurtech.online";

// ---------------------------------------------------------------------------
// ISR: revalidate every hour, on-demand via revalidateTag
// ---------------------------------------------------------------------------
export const revalidate = 3600;

// ---------------------------------------------------------------------------
// Static params — pre-render all published page slugs at build time
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs("page");
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Dynamic SEO metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let entry;
  try {
    entry = await getPublishedEntryBySlug(slug, "page");
  } catch {
    return { title: "Página no encontrada | ZonaSur Tech" };
  }

  if (!entry) {
    return { title: "Página no encontrada | ZonaSur Tech" };
  }

  const seo = (entry.seoMeta ?? {}) as { title?: string; description?: string; ogImage?: string; noindex?: boolean };

  return {
    title: seo?.title ?? entry.title,
    description: seo?.description ?? entry.excerpt ?? undefined,
    alternates: {
      canonical: `${BASE_URL}/pages/${entry.slug}`,
    },
    openGraph: {
      title: seo?.title ?? entry.title,
      description: seo?.description ?? entry.excerpt ?? undefined,
      url: `${BASE_URL}/pages/${entry.slug}`,
      type: "website",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function CmsPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let entry;
  try {
    entry = await getPublishedEntryBySlug(slug, "page");
  } catch {
    notFound();
  }

  if (!entry) notFound();

  // Pages use blocks; fallback to content markdown if no blocks
  const blocks = (entry.blocks as Block[] | null) ?? [];
  const hasBlocks = blocks.length > 0;
  const contentData = entry.content as { raw?: string } | null;
  const markdownBody = contentData?.raw ?? "";

  return (
    <div className="min-h-screen">
      {/* Navigation breadcrumb */}
      <div className="pt-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zs-text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Render blocks or fallback to markdown */}
      {hasBlocks ? (
        <BlockRenderer blocks={blocks} />
      ) : markdownBody ? (
        <section className="px-4 pb-24">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-10">
              {entry.title}
            </h1>
            <MarkdownRenderer content={markdownBody} />
          </div>
        </section>
      ) : (
        <section className="px-4 pb-24 pt-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              {entry.title}
            </h1>
            {entry.excerpt && (
              <p className="text-lg text-zs-text-secondary max-w-2xl mx-auto">
                {entry.excerpt}
              </p>
            )}
          </div>
        </section>
      )}

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: entry.title,
            description: entry.excerpt,
            url: `${BASE_URL}/pages/${entry.slug}`,
            publisher: {
              "@type": "Organization",
              name: "ZonaSur Tech",
              url: BASE_URL,
            },
          }),
        }}
      />
    </div>
  );
}
