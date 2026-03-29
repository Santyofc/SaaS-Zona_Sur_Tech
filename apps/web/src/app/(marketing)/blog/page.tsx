/**
 * /blog — Blog index page
 * Server Component — fetches latest published posts from CMS.
 */
import { Metadata } from "next";
import Link from "next/link";
import { getLatestPosts } from "@/lib/cms/queries";
import { Calendar, User, ArrowRight, FileText } from "lucide-react";
import { AdBanner } from "@/components/ui/AdBanner";

const BASE_URL = "https://zonasurtech.online";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | Facturación Electrónica y ERP Costa Rica | ZonaSur Tech",
  description:
    "Artículos sobre facturación electrónica, ERP, inventario y gestión empresarial para PYMES en Costa Rica.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: "Blog ZonaSur Tech | ERP y Facturación Costa Rica",
    description:
      "Artículos técnicos sobre facturación electrónica Hacienda, ERP y gestión empresarial para PYMES costarricenses.",
    url: `${BASE_URL}/blog`,
  },
};

export default async function BlogIndexPage() {
  let posts: Awaited<ReturnType<typeof getLatestPosts>> = [];

  try {
    posts = await getLatestPosts(30);
  } catch {
    // DB might not be ready on first build — gracefully show empty state
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase italic mb-4">
            Blog
          </h1>
          <p className="text-lg text-zs-text-secondary max-w-2xl mx-auto">
            Guías, tutoriales y novedades sobre facturación electrónica, ERP e
            inventario para PYMES en Costa Rica.
          </p>
        </header>

        <AdBanner />

        {posts.length === 0 ? (
          <div className="text-center py-20 text-zs-text-muted">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Próximamente — contenido en desarrollo</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <article className="zs-card p-8 transition-colors hover:border-zs-blue/40">
                  <div className="flex flex-col md:flex-row gap-6">
                    {post.coverImage && (
                      <div className="md:w-48 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-zs-bg-primary border border-zs-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white group-hover:text-zs-blue transition-colors line-clamp-2 mb-3">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-sm text-zs-text-secondary line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-zs-text-muted">
                        {post.author && (
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {post.author}
                          </span>
                        )}
                        {post.publishedAt && (
                          <time
                            dateTime={post.publishedAt.toISOString()}
                            className="flex items-center gap-1.5"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            {new Intl.DateTimeFormat("es-CR", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }).format(post.publishedAt)}
                          </time>
                        )}
                        <span className="flex items-center gap-1 text-zs-blue opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                          Leer más <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
