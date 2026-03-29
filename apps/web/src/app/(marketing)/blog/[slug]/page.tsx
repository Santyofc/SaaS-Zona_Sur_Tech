/**
 * /blog/[slug] — Public blog post page
 *
 * - ISR with `revalidate: 3600` (revalidates every hour)
 * - On-demand revalidation via revalidateTag("cms-entry-SLUG") from server actions
 * - Full SEO metadata from the entry's seoMeta bag
 * - 404 via notFound() if slug doesn't exist or is not published
 * - Renders markdown content through safe remark pipeline (no raw dangerouslySetInnerHTML)
 */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedEntryBySlug, getAllPublishedSlugs } from "@/lib/cms/queries";
import { MarkdownRenderer } from "@/components/cms/MarkdownRenderer";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import { AdBanner } from "@/components/ui/AdBanner";

const BASE_URL = "https://zonasurtech.online";

// ---------------------------------------------------------------------------
// ISR: revalidate every hour, on-demand via revalidateTag
// ---------------------------------------------------------------------------
export const revalidate = 3600;

// ---------------------------------------------------------------------------
// Static params — pre-render all published slugs at build time
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs("post");
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    // DB may not be available at build time (first deploy)
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
    entry = await getPublishedEntryBySlug(slug, "post");
  } catch {
    return { title: "Post no encontrado | ZonaSur Tech" };
  }

  if (!entry) {
    return { title: "Post no encontrado | ZonaSur Tech" };
  }

  const seo = (entry.seoMeta ?? {}) as { title?: string; description?: string; ogImage?: string; noindex?: boolean };

  return {
    title: seo?.title ?? entry.title,
    description: seo?.description ?? entry.excerpt ?? undefined,
    alternates: {
      canonical: `${BASE_URL}/blog/${entry.slug}`,
    },
    openGraph: {
      title: seo?.title ?? entry.title,
      description: seo?.description ?? entry.excerpt ?? undefined,
      url: `${BASE_URL}/blog/${entry.slug}`,
      type: "article",
      publishedTime: entry.publishedAt?.toISOString(),
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let entry;
  try {
    entry = await getPublishedEntryBySlug(slug, "post");
  } catch {
    notFound();
  }

  if (!entry) notFound();

  // Extract markdown body from content JSON
  const contentData = entry.content as
    | { format?: string; raw?: string; tags?: string[] }
    | null;
  const markdownBody = contentData?.raw ?? "";
  const tags = contentData?.tags ?? [];

  return (
    <article className="min-h-screen">
      {/* Hero header */}
      <header className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-zs-text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            {entry.title}
          </h1>

          {entry.excerpt && (
            <p className="text-lg text-zs-text-secondary leading-relaxed mb-8">
              {entry.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zs-text-muted">
            {entry.author && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {entry.author}
              </span>
            )}
            {entry.publishedAt && (
              <time
                dateTime={entry.publishedAt.toISOString()}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {new Intl.DateTimeFormat("es-CR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(entry.publishedAt)}
              </time>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-zs-blue/10 text-zs-blue border border-zs-blue/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="h-px bg-zs-border mt-10" />
        </div>
      </header>

      {/* Cover image */}
      {entry.coverImage && (
        <div className="px-4 pb-12">
          <div className="container mx-auto max-w-4xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.coverImage}
              alt={entry.title}
              className="w-full rounded-2xl border border-zs-border"
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* Body — safe markdown renderer via remark pipeline */}
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-3xl">
          <AdBanner />
          <MarkdownRenderer content={markdownBody} />
          <div className="mt-12">
            <AdBanner />
          </div>
        </div>
      </section>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: entry.title,
            description: entry.excerpt,
            datePublished: entry.publishedAt?.toISOString(),
            author: {
              "@type": "Organization",
              name: entry.author ?? "ZonaSur Tech",
            },
            publisher: {
              "@type": "Organization",
              name: "ZonaSur Tech",
              url: BASE_URL,
            },
            mainEntityOfPage: `${BASE_URL}/blog/${entry.slug}`,
            image: entry.coverImage ?? undefined,
          }),
        }}
      />
    </article>
  );
}
