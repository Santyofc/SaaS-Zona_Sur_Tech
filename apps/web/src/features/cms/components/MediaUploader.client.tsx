"use client";
/**
 * MediaUploader — Client component for uploading files to Supabase Storage.
 * Calls the uploadMedia server action with FormData.
 */
import { useTransition, useState, useRef } from "react";
import { uploadMedia } from "@/lib/cms/actions";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";

export function MediaUploader({ onUploaded }: { onUploaded?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        await uploadMedia(formData);
        // Reset
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
        onUploaded?.();
      } catch (err: any) {
        setError(err?.message ?? "Error al subir");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-zs-rose/10 border border-zs-rose/20 text-zs-rose text-sm flex items-center gap-2">
          <X className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="border-2 border-dashed border-zs-border rounded-2xl p-8 text-center hover:border-zs-blue/40 transition-colors">
        {preview ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-xl mx-auto"
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="absolute -top-2 -right-2 p-1 bg-zs-bg-primary rounded-full border border-zs-border text-zs-text-muted hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <ImageIcon className="w-10 h-10 text-zs-text-muted" />
            <p className="text-sm text-zs-text-secondary">
              Arrastra o selecciona un archivo
            </p>
            <p className="text-xs text-zs-text-muted">
              JPG, PNG, WebP, AVIF, GIF, SVG, PDF · Máx 10MB
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          name="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ position: "relative" }}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-[0.15em] text-zs-text-muted mb-2">
          Alt text (accesibilidad)
        </label>
        <input
          type="text"
          name="alt"
          placeholder="Describe la imagen para lectores de pantalla"
          className="w-full bg-zs-bg-primary border border-zs-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zs-text-muted outline-none focus:border-zs-blue transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-zs-blue text-white text-sm font-bold rounded-xl hover:bg-zs-blue/80 transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {isPending ? "Subiendo..." : "Subir archivo"}
      </button>
    </form>
  );
}
