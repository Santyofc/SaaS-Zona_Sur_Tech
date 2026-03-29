/** /admin/posts/[id] — Edit existing post */
import { notFound } from "next/navigation";
import { getMembershipContext } from "@repo/auth";
import { getEntryById } from "@/lib/cms/queries";
import { EntryForm } from "@/components/cms/EntryForm.client";
import { ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const ctx = await getMembershipContext();
  const entry = await getEntryById(ctx.organizationId, params.id);
  return { title: entry ? `Editar: ${entry.title}` : "Post no encontrado" };
}

export default async function EditPostPage({ params }: Props) {
  const ctx = await getMembershipContext();
  const entry = await getEntryById(ctx.organizationId, params.id);

  if (!entry || entry.collectionType !== "post") notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2 rounded-xl bg-zs-bg-secondary border border-zs-border text-zs-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white tracking-tight line-clamp-1">
            {entry.title}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <code className="text-xs text-zs-text-muted font-mono">/blog/{entry.slug}</code>
            {entry.status === "published" && (
              <a
                href={`/blog/${entry.slug}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 text-xs text-zs-emerald hover:underline"
              >
                <Globe className="w-3 h-3" /> Ver en sitio
              </a>
            )}
          </div>
        </div>
      </div>

      <EntryForm
        collectionType="post"
        entryId={entry.id}
        defaultValues={{
          collectionType: "post",
          title: entry.title,
          slug: entry.slug,
          excerpt: entry.excerpt ?? undefined,
          coverImage: entry.coverImage ?? undefined,
          author: entry.author ?? undefined,
          status: entry.status as "draft" | "published" | "archived",
          seoMeta: entry.seoMeta as any,
        }}
      />
    </div>
  );
}
