"use client";
/**
 * EntryForm — Functional create/edit form for CMS entries (posts & pages).
 *
 * Used by:
 *   /admin/posts/new
 *   /admin/posts/[id]
 *   /admin/pages/new
 *   /admin/pages/[id]
 *
 * Features:
 * - react-hook-form + Zod validation (client-side)
 * - Slug auto-generation from title
 * - Status toggle (draft / published)
 * - SEO meta fields
 * - Inline server action call on submit
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { createEntrySchema, type Block, type CreateEntryInput } from "@repo/db/cms-schema";
import { createEntry, updateEntry } from "@/lib/cms/actions";
import { Loader2, Save, Globe, FileText } from "lucide-react";

interface EntryFormProps {
  collectionType: "post" | "page";
  /** Pre-fills the form for edit mode */
  defaultValues?: Partial<CreateEntryInput> & { id?: string };
  entryId?: string;
}

interface EntryFormValues extends Omit<CreateEntryInput, "content" | "blocks"> {
  contentRaw?: string;
  tagsText?: string;
  blocksJson?: string;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 128);
}

export function EntryForm({ collectionType, defaultValues, entryId }: EntryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!entryId;
  const existingContent =
    defaultValues?.content && typeof defaultValues.content === "object"
      ? (defaultValues.content as { raw?: string; tags?: string[] })
      : null;
  const existingBlocks = Array.isArray(defaultValues?.blocks)
    ? (defaultValues.blocks as Block[])
    : [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(createEntrySchema),
    defaultValues: {
      collectionType,
      status: "draft",
      ...defaultValues,
      contentRaw: existingContent?.raw ?? "",
      tagsText: existingContent?.tags?.join(", ") ?? "",
      blocksJson: existingBlocks.length > 0 ? JSON.stringify(existingBlocks, null, 2) : "",
    },
  });

  const titleValue = watch("title");

  // Auto-generate slug from title (only if slug is empty)
  const handleTitleBlur = () => {
    const currentSlug = watch("slug");
    if (!currentSlug && titleValue) {
      setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  };

  const onSubmit = (data: EntryFormValues) => {
    setServerError(null);
    startTransition(async () => {
      try {
        let parsedBlocks: Block[] | undefined;

        if (collectionType === "page" && data.blocksJson?.trim()) {
          const candidate = JSON.parse(data.blocksJson) as Block[];
          if (!Array.isArray(candidate)) {
            throw new Error("Los bloques deben ser un arreglo JSON valido");
          }
          parsedBlocks = candidate;
        }

        const tags = (data.tagsText ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

        const payload: CreateEntryInput = {
          collectionType,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          author: data.author,
          seoMeta: data.seoMeta,
          status: data.status,
          content: data.contentRaw?.trim()
            ? {
                format: "markdown",
                raw: data.contentRaw,
                ...(tags.length > 0 ? { tags } : {}),
              }
            : undefined,
          blocks: parsedBlocks,
        };

        if (isEdit) {
          await updateEntry({ ...payload, id: entryId! });
        } else {
          await createEntry(payload);
        }
        router.push(`/admin/${collectionType}s`);
        router.refresh();
      } catch (err: any) {
        setServerError(err?.message ?? "An unexpected error occurred");
      }
    });
  };

  const inputCls = (hasError?: boolean) =>
    `w-full bg-zs-bg-primary border ${
      hasError ? "border-zs-rose/50 focus:border-zs-rose" : "border-zs-border focus:border-zs-blue"
    } rounded-xl px-4 py-3 text-sm text-white placeholder:text-zs-text-muted outline-none transition-colors`;

  const labelCls = "block text-xs font-black uppercase tracking-[0.15em] text-zs-text-muted mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {serverError && (
        <div className="p-4 rounded-xl bg-zs-rose/10 border border-zs-rose/20 text-zs-rose text-sm">
          {serverError}
        </div>
      )}

      {/* Title */}
      <div>
        <label className={labelCls} htmlFor="entry-title">
          Título *
        </label>
        <input
          id="entry-title"
          {...register("title")}
          onBlur={handleTitleBlur}
          placeholder={collectionType === "post" ? "Como ordenar procesos antes de automatizar con IA" : "Business OS para equipos en crecimiento"}
          className={inputCls(!!errors.title)}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-zs-rose">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className={labelCls} htmlFor="entry-slug">
          Slug *
        </label>
        <div className="flex items-center">
          <span className="px-3 py-3 text-xs text-zs-text-muted bg-zs-bg-secondary border border-r-0 border-zs-border rounded-l-xl">
            {collectionType === "post" ? "/blog/" : "/pages/"}
          </span>
          <input
            id="entry-slug"
            {...register("slug")}
            placeholder={collectionType === "post" ? "ordenar-procesos-antes-de-automatizar" : "business-os"}
            className={`${inputCls(!!errors.slug)} rounded-l-none`}
          />
        </div>
        {errors.slug && (
          <p className="mt-1 text-xs text-zs-rose">{errors.slug.message}</p>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelCls} htmlFor="entry-excerpt">
          Extracto
        </label>
        <textarea
          id="entry-excerpt"
          {...register("excerpt")}
          rows={3}
          placeholder="Breve descripción del contenido (aparece en listas y SEO)"
          className={inputCls(!!errors.excerpt)}
        />
        {errors.excerpt && (
          <p className="mt-1 text-xs text-zs-rose">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Author */}
      <div>
        <label className={labelCls} htmlFor="entry-author">
          Autor
        </label>
        <input
          id="entry-author"
          {...register("author")}
          placeholder="Equipo ZonaSur Tech"
          className={inputCls()}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className={labelCls} htmlFor="entry-cover">
          URL de imagen de portada
        </label>
        <input
          id="entry-cover"
          {...register("coverImage")}
          type="url"
          placeholder="https://..."
          className={inputCls(!!errors.coverImage)}
        />
        {errors.coverImage && (
          <p className="mt-1 text-xs text-zs-rose">{errors.coverImage.message}</p>
        )}
      </div>

      <div>
        <label className={labelCls} htmlFor="entry-content">
          {collectionType === "post" ? "Contenido en Markdown" : "Contenido base en Markdown"}
        </label>
        <textarea
          id="entry-content"
          {...register("contentRaw")}
          rows={16}
          placeholder={
            collectionType === "post"
              ? "# Idea principal\n\nExplique el problema, la solucion y el siguiente paso."
              : "# Contexto\n\nUse este campo si quiere una pagina simple basada en markdown."
          }
          className={inputCls()}
        />
        <p className="mt-2 text-xs text-zs-text-muted">
          {collectionType === "post"
            ? "Este contenido se renderiza en el blog publico."
            : "Si tambien define bloques JSON, los bloques tendran prioridad en la pagina publica."}
        </p>
      </div>

      <div>
        <label className={labelCls} htmlFor="entry-tags">
          Tags
        </label>
        <input
          id="entry-tags"
          {...register("tagsText")}
          placeholder="automatizacion, ia, procesos"
          className={inputCls()}
        />
        <p className="mt-2 text-xs text-zs-text-muted">
          Separados por comas. Solo se usan en posts.
        </p>
      </div>

      {collectionType === "page" && (
        <div>
          <label className={labelCls} htmlFor="entry-blocks">
            Bloques JSON
          </label>
          <textarea
            id="entry-blocks"
            {...register("blocksJson")}
            rows={18}
            placeholder={`[\n  {\n    "type": "hero",\n    "title": "Business OS para su empresa",\n    "subtitle": "Ordene procesos, automatice tareas e implemente IA con criterio",\n    "ctaLabel": "Agendar llamada",\n    "ctaHref": "/contact"\n  }\n]`}
            className={inputCls()}
          />
          <p className="mt-2 text-xs text-zs-text-muted">
            Opcional. Use bloques para paginas visuales. Si el JSON no es valido, no se guardara.
          </p>
        </div>
      )}

      {/* SEO */}
      <fieldset className="border border-zs-border rounded-xl p-6 space-y-4">
        <legend className="text-xs font-black uppercase tracking-[0.15em] text-zs-text-muted px-2">
          SEO
        </legend>
        <div>
          <label className={labelCls} htmlFor="seo-title">SEO Title (max 60)</label>
          <input
            id="seo-title"
            {...register("seoMeta.title")}
            placeholder="Business OS para empresas en Costa Rica | ZonaSur Tech"
            className={inputCls()}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="seo-desc">Meta Description (max 160)</label>
          <textarea
            id="seo-desc"
            {...register("seoMeta.description")}
            rows={2}
            placeholder="Ayudamos a ordenar procesos, automatizar tareas e implementar IA con criterio."
            className={inputCls()}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="seo-og">OG Image URL</label>
          <input
            id="seo-og"
            {...register("seoMeta.ogImage")}
            type="url"
            placeholder="https://..."
            className={inputCls()}
          />
        </div>
      </fieldset>

      {/* Status + Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-zs-border">
        <div className="flex gap-3">
          {(["draft", "published"] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("status")}
                value={s}
                className="accent-zs-blue"
              />
              <span className="flex items-center gap-1.5 text-sm text-zs-text-secondary capitalize">
                {s === "published" ? (
                  <Globe className="w-3.5 h-3.5 text-zs-emerald" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-zs-amber" />
                )}
                {s === "published" ? "Publicar" : "Borrador"}
              </span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 bg-zs-blue text-white font-bold text-sm rounded-xl hover:bg-zs-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEdit ? "Guardar cambios" : "Crear"}
        </button>
      </div>
    </form>
  );
}
