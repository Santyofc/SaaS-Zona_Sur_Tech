"use client";
/**
 * SettingsForm — Client leaf for CMS settings.
 * Calls updateCmsSettings server action on submit.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { updateSettingsSchema, type UpdateSettingsInput } from "@repo/db/cms-schema";
import { updateCmsSettings } from "@/lib/cms/actions";
import { Save, Loader2, Check } from "lucide-react";

interface Props {
  defaultValues?: Partial<UpdateSettingsInput>;
}

export function SettingsForm({ defaultValues }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues,
  });

  const onSubmit = (data: UpdateSettingsInput) => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateCmsSettings(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err: any) {
        setError(err?.message ?? "Error al guardar");
      }
    });
  };

  const inputCls =
    "w-full bg-zs-bg-primary border border-zs-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zs-text-muted outline-none focus:border-zs-blue transition-colors";
  const labelCls =
    "block text-xs font-black uppercase tracking-[0.15em] text-zs-text-muted mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 rounded-xl bg-zs-rose/10 border border-zs-rose/20 text-zs-rose text-sm">
          {error}
        </div>
      )}
      {saved && (
        <div className="p-4 rounded-xl bg-zs-emerald/10 border border-zs-emerald/20 text-zs-emerald text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> Configuración guardada
        </div>
      )}

      <div>
        <label className={labelCls}>Nombre del sitio</label>
        <input
          {...register("siteName")}
          placeholder="ZonaSur Tech"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Descripción del sitio</label>
        <textarea
          {...register("siteDescription")}
          rows={2}
          placeholder="Plataforma SaaS de ERP y facturación electrónica..."
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Autor por defecto</label>
        <input
          {...register("defaultAuthor")}
          placeholder="Equipo ZonaSur Tech"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>URL del logo</label>
        <input
          {...register("logoUrl")}
          type="url"
          placeholder="https://..."
          className={inputCls}
        />
        {errors.logoUrl && (
          <p className="text-xs text-zs-rose mt-1">{errors.logoUrl.message}</p>
        )}
      </div>

      <div>
        <label className={labelCls}>Color de acento (hex)</label>
        <input
          {...register("accentColor")}
          placeholder="#2563eb"
          maxLength={7}
          className={inputCls}
        />
        {errors.accentColor && (
          <p className="text-xs text-zs-rose mt-1">
            {errors.accentColor.message}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-zs-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 bg-zs-blue text-white font-bold text-sm rounded-xl hover:bg-zs-blue/80 transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Guardar configuración
        </button>
      </div>
    </form>
  );
}
