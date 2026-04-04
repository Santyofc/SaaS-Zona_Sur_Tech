import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublishedEntryBySlug, getAllPublishedSlugs } from "@/lib/cms/queries";
import { MarkdownRenderer } from "@/components/cms/MarkdownRenderer";

const BASE_URL = "https://zonasurtech.online";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs("page");

    return slugs
      .filter(({ slug }) => slug.startsWith("docs-"))
      .map(({ slug }) => ({ slug: slug.replace(/^docs-/, "") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublishedEntryBySlug(`docs-${slug}`, "page").catch(() => null);

  if (!entry) {
    return { title: "Documento no encontrado | ZonaSur Tech" };
  }

  const seo = (entry.seoMeta ?? {}) as { title?: string; description?: string; ogImage?: string; noindex?: boolean };

  return {
    title: seo.title ?? entry.title,
    description: seo.description ?? entry.excerpt ?? undefined,
    alternates: {
      canonical: `${BASE_URL}/docs/${slug}`,
    },
    openGraph: {
      title: seo.title ?? entry.title,
      description: seo.description ?? entry.excerpt ?? undefined,
      url: `${BASE_URL}/docs/${slug}`,
      type: "article",
    },
    robots: seo.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function DocsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getPublishedEntryBySlug(`docs-${slug}`, "page").catch(() => null);

  if (!entry) {
    notFound();
  }

  const contentData = entry.content as { raw?: string; wikiUrl?: string } | null;
  const markdownBody = contentData?.raw ?? "";
  const wikiUrl = contentData?.wikiUrl;

  return (
    <article className="min-h-screen pt-32 pb-24 px-4 bg-zs-bg-primary">
      <div className="container mx-auto max-w-3xl">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-sm text-zs-text-muted hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a documentación
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          {entry.title}
        </h1>

        {entry.excerpt && (
          <p className="text-lg text-zs-text-secondary leading-relaxed mb-8">
            {entry.excerpt}
          </p>
        )}

        {wikiUrl && (
          <p className="text-sm text-zs-text-muted mb-10">
            Fuente sincronizada desde{" "}
            <a href={wikiUrl} target="_blank" rel="noopener noreferrer" className="text-zs-blue hover:underline">
              GitHub Wiki
            </a>
          </p>
        )}

        <MarkdownRenderer content={markdownBody} />
      </div>
    </article>
  );
}
