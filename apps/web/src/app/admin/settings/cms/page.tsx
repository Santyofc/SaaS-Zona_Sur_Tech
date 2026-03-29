/** /admin/settings — CMS Settings page */
import { getMembershipContext } from "@repo/auth";
import { getCmsSettings } from "@/lib/cms/queries";
import { SettingsForm } from "@/components/cms/SettingsForm.client";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configuración CMS | ZonaSur Tech" };

export default async function CmsSettingsPage() {
  const ctx = await getMembershipContext();
  const settings = await getCmsSettings(ctx.organizationId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-zs-blue/10 flex items-center justify-center text-zs-blue">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Configuración CMS
          </h1>
          <p className="text-sm text-zs-text-secondary mt-0.5">
            Ajustes globales del sistema de contenidos
          </p>
        </div>
      </div>

      <div className="zs-card p-8">
        <SettingsForm
          defaultValues={{
            siteName: settings.site_name ?? "",
            siteDescription: settings.site_description ?? "",
            defaultAuthor: settings.default_author ?? "",
            logoUrl: settings.logo_url ?? "",
            accentColor: settings.accent_color ?? "",
          }}
        />
      </div>
    </div>
  );
}
