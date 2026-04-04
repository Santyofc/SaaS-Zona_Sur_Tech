/** /admin/pages — CMS Pages list (identical structure to posts, different collection type) */
import Link from "next/link";
import { listEntries } from "@/lib/cms/queries";
import { deleteEntry } from "@/lib/cms/actions";
import { requireOrganization } from "@repo/auth";
import { PlusCircle, Pencil, Trash2, LayoutTemplate, Eye } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Páginas | CMS ZonaSur Tech" };

export default async function CmsPagesPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const ctx = await requireOrganization();
  const page = Number(searchParams.page ?? 1);
  const status = searchParams.status as "draft" | "published" | "archived" | undefined;

  const { items: pages, total, totalPages } = await listEntries(
    ctx.organizationId,
    "page",
    { page, limit: 20, status }
  );

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      published: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      draft: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      archived: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    };
    return map[s] ?? map.draft;
  };

  const resolvePublicHref = (slug: string) => {
    if (slug === "home") return "/";
    if (["pricing", "technology", "systems"].includes(slug)) return `/${slug}`;
    return `/pages/${slug}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Páginas CMS</h1>
          <p className="text-sm text-zs-text-secondary mt-1">{total} página{total !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zs-blue text-white text-sm font-bold rounded-xl hover:bg-zs-blue/80 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Nueva Página
        </Link>
      </div>

      <div className="rounded-2xl border border-zs-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zs-border">
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">Título</th>
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted hidden md:table-cell">Slug</th>
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">Estado</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zs-text-muted text-sm">
                  <LayoutTemplate className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No hay páginas CMS. Crea la primera.
                </td>
              </tr>
            ) : (
              pages.map((p) => (
                <tr key={p.id} className="border-b border-zs-border/50 hover:bg-zs-bg-surface transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-white text-sm">{p.title}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <code className="text-xs text-zs-text-secondary font-mono">/{p.slug}</code>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      {p.status === "published" && (
                        <a
                          href={resolvePublicHref(p.slug)}
                          target="_blank"
                          rel="noopener"
                          className="p-1.5 text-zs-text-muted hover:text-zs-cyan transition-colors"
                          title="Ver en sitio"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <Link href={`/admin/pages/${p.id}`} className="p-1.5 text-zs-text-muted hover:text-white transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteEntry(p.id);
                        }}
                      >
                        <button type="submit" className="p-1.5 text-zs-text-muted hover:text-zs-rose transition-colors">
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
    </div>
  );
}
