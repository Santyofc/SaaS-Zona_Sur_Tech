/** /admin/posts/new — Create new post */
import { EntryForm } from "@/components/cms/EntryForm.client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Nuevo Post | CMS" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2 rounded-xl bg-zs-bg-secondary border border-zs-border text-zs-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Nuevo Post</h1>
          <p className="text-sm text-zs-text-secondary mt-1">Blog / Content Marketing</p>
        </div>
      </div>
      <EntryForm collectionType="post" />
    </div>
  );
}
