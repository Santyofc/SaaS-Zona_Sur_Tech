import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * API Route: /api/cms/revalidate
 * 
 * Secure endpoint to force Next.js cache revalidation for CMS content.
 * Used by the Admin UI to provide "Instant Sync".
 * 
 * Query Params:
 * - secret: Must match process.env.CMS_REVALIDATE_SECRET
 * - slug: The slug of the entry to revalidate (or 'all')
 * - type: 'post' | 'page' | 'settings'
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  // 1. Security check
  if (secret !== process.env.CMS_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
  }

  if (!type) {
    return NextResponse.json({ message: "Type parameter is required" }, { status: 400 });
  }

  try {
    const revalidatePageSlug = (entrySlug: string) => {
      if (entrySlug === "home") {
        revalidatePath("/", "page");
        return;
      }

      revalidatePath(`/pages/${entrySlug}`, "page");
      revalidatePath(`/${entrySlug}`, "page");
    };

    // 2. Perform Revalidation based on type and slug
    if (type === "settings") {
      // Revalidate global elements (Root Layout / Cache tags)
      revalidatePath("/", "layout");
      revalidateTag("cms-settings");
      return NextResponse.json({ revalidated: true, type: "settings", now: Date.now() });
    }

    if (type === "post" && slug) {
      if (slug === "all") {
        revalidatePath("/blog", "page");
      } else {
        revalidatePath(`/blog/${slug}`, "page");
        revalidatePath("/blog", "page"); // update list
      }
      revalidateTag(`cms-entry-${slug}`);
      return NextResponse.json({ revalidated: true, type: "post", slug, now: Date.now() });
    }

    if (type === "page" && slug) {
      revalidatePageSlug(slug);
      revalidateTag(`cms-entry-${slug}`);
      return NextResponse.json({ revalidated: true, type: "page", slug, now: Date.now() });
    }

    return NextResponse.json({ message: "Condition not handled" }, { status: 400 });
  } catch (err) {
    console.error("Revalidation Error:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
