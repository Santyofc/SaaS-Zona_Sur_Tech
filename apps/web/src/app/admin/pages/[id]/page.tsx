/** /admin/pages/[id] — Edit existing CMS page */
import { notFound } from "next/navigation";
import { requireOrganization } from "@repo/auth";
import { getEntryById } from "@/lib/cms/queries";
import { EntryForm } from "@/components/cms/EntryForm.client";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditCmsPagePage({ params }: { params: { id: string } }) {
  const ctx = await requireOrganization();
  const entry = await getEntryById(ctx.organizationId, params.id);
  const publicHref =
    entry?.slug === "home"
      ? "/"
      : ["pricing", "technology", "systems"].includes(entry?.slug ?? "")
        ? `/${entry?.slug}`
        : `/pages/${entry?.slug}`;

  if (!entry || entry.collectionType !== "page") notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages" className="p-2 rounded-xl bg-zs-bg-secondary border border-zs-border text-zs-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white tracking-tight line-clamp-1">{entry.title}</h1>
          {entry.status === "published" && (
            <a
              href={publicHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-xs text-zs-emerald hover:underline mt-2"
            >
              <Globe className="w-3 h-3" /> Ver en sitio
            </a>
          )}
        </div>
      </div>
      <EntryForm
        collectionType="page"
        entryId={entry.id}
        defaultValues={{
          collectionType: "page",
          title: entry.title,
          slug: entry.slug,
          excerpt: entry.excerpt ?? undefined,
          coverImage: entry.coverImage ?? undefined,
          author: entry.author ?? undefined,
          content: (entry.content as any) ?? undefined,
          blocks: (entry.blocks as any) ?? undefined,
          status: entry.status as any,
          seoMeta: entry.seoMeta as any,
        }}
      />
    </div>
  );
}
