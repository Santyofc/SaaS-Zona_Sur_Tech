/** /admin/media — Media library (upload + gallery grid) */
import { getMembershipContext } from "@repo/auth";
import { listMedia } from "@/lib/cms/queries";
import { deleteMedia } from "@/lib/cms/actions";
import { MediaUploader } from "@/components/cms/MediaUploader.client";
import { Trash2, Copy, Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Media | CMS ZonaSur Tech" };

export default async function CmsMediaPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const ctx = await getMembershipContext();
  const page = Number(searchParams.page ?? 1);

  const { items: media, total, totalPages } = await listMedia(
    ctx.organizationId,
    page,
    24
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Media Library
        </h1>
        <p className="text-sm text-zs-text-secondary mt-1">
          {total} archivo{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Upload form */}
      <div className="zs-card p-6">
        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-zs-text-muted mb-4">
          Subir nuevo archivo
        </h2>
        <MediaUploader />
      </div>

      {/* Gallery grid */}
      {media.length === 0 ? (
        <div className="text-center py-16 text-zs-text-muted">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay archivos todavía</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => {
            const isImage = item.mimeType?.startsWith("image/");
            return (
              <div
                key={item.id}
                className="group relative rounded-xl border border-zs-border overflow-hidden bg-zs-bg-secondary hover:border-zs-blue/40 transition-colors"
              >
                {/* Thumbnail */}
                <div className="aspect-square flex items-center justify-center bg-zs-bg-primary">
                  {isImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.publicUrl}
                      alt={item.alt ?? item.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <ImageIcon className="w-8 h-8 mx-auto text-zs-text-muted mb-1" />
                      <span className="text-[10px] text-zs-text-muted uppercase font-bold">
                        {item.mimeType?.split("/")[1] ?? "file"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info + Actions overlay */}
                <div className="absolute inset-0 bg-zs-bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <p className="text-[10px] text-zs-text-secondary font-mono line-clamp-1 px-2 text-center">
                    {item.filename}
                  </p>

                  <div className="flex gap-2">
                    {/* Copy URL */}
                    <button
                      type="button"
                      onClick={undefined} // Copy handled client-side — this is RSC so we show the URL as fallback
                      className="p-2 rounded-lg bg-zs-bg-secondary border border-zs-border text-zs-text-muted hover:text-white transition-colors"
                      title={item.publicUrl}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <form
                      action={async () => {
                        "use server";
                        await deleteMedia(item.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-2 rounded-lg bg-zs-bg-secondary border border-zs-border text-zs-text-muted hover:text-zs-rose transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Size badge */}
                {item.sizeBytes && (
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-sm">
                    {(item.sizeBytes / 1024).toFixed(0)}KB
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/media?page=${p}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                p === page
                  ? "bg-zs-blue text-white"
                  : "bg-zs-bg-secondary text-zs-text-secondary hover:text-white"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
