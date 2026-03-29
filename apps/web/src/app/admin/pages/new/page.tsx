/** /admin/pages/new */
import { EntryForm } from "@/components/cms/EntryForm.client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nueva Página | CMS" };

export default function NewCmsPagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages" className="p-2 rounded-xl bg-zs-bg-secondary border border-zs-border text-zs-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight">Nueva Página CMS</h1>
      </div>
      <EntryForm collectionType="page" />
    </div>
  );
}
