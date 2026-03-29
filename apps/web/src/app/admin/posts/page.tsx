/**
 * /admin/posts — CMS Posts List
 * Server Component — data fetched at request time, no client needed.
 */
import Link from "next/link";
import { listEntries } from "@/lib/cms/queries";
import { deleteEntry, publishEntry } from "@/lib/cms/actions";
import { requireOrganization } from "@repo/auth";
import { PlusCircle, Eye, Pencil, Trash2, Globe, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Posts | CMS ZonaSur Tech",
};

export default async function CmsPostsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; q?: string };
}) {
  const ctx = await requireOrganization();
  const page = Number(searchParams.page ?? 1);
  const status = searchParams.status as "draft" | "published" | "archived" | undefined;

  const { items: posts, total, totalPages } = await listEntries(
    ctx.organizationId,
    "post",
    { page, limit: 20, status, search: searchParams.q }
  );

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      published: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      draft: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      archived: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    };
    return map[s] ?? map.draft;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Posts</h1>
          <p className="text-sm text-zs-text-secondary mt-1">
            {total} entrada{total !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zs-blue text-white text-sm font-bold rounded-xl hover:bg-zs-blue/80 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Nuevo Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "published", "draft", "archived"] as const).map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/posts" : `/admin/posts?status=${f}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
              (f === "all" && !status) || f === status
                ? "bg-zs-blue text-white"
                : "bg-zs-bg-secondary text-zs-text-secondary hover:text-white"
            }`}
          >
            {f === "all" ? "Todos" : f}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zs-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zs-border">
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">Título</th>
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted hidden md:table-cell">Slug</th>
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">Estado</th>
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted hidden lg:table-cell">Fecha</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zs-text-muted text-sm">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No hay posts. Crea el primero.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-zs-border/50 hover:bg-zs-bg-surface transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-white text-sm line-clamp-1">{post.title}</span>
                    {post.excerpt && (
                      <p className="text-xs text-zs-text-muted line-clamp-1 mt-0.5">{post.excerpt}</p>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <code className="text-xs text-zs-text-secondary font-mono">{post.slug}</code>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-xs text-zs-text-muted">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("es-CR")
                        : new Date(post.updatedAt).toLocaleDateString("es-CR")}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      {post.status === "published" && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener"
                          className="p-1.5 text-zs-text-muted hover:text-zs-cyan transition-colors"
                          title="Ver en sitio"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="p-1.5 text-zs-text-muted hover:text-white transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteEntry(post.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 text-zs-text-muted hover:text-zs-rose transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/posts?page=${p}${status ? `&status=${status}` : ""}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                p === page ? "bg-zs-blue text-white" : "bg-zs-bg-secondary text-zs-text-secondary hover:text-white"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
