import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db, cmsEntries, and, eq } from "@repo/db";
import { getPublicCmsOrganizationId, isCmsDatabaseConfigured } from "@/lib/cms/queries";
import { revalidatePath, revalidateTag } from "next/cache";

interface GollumPage {
  action: "created" | "edited" | "deleted";
  page_name: string;
  title: string;
  summary?: string;
  html_url?: string;
}

interface GollumPayload {
  pages?: GollumPage[];
  repository?: {
    name?: string;
    full_name?: string;
    owner?: { login?: string };
  };
  sender?: {
    login?: string;
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s/-]/g, "")
    .trim()
    .replace(/[\/\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildDocsSlug(pageName: string) {
  return `docs-${slugify(pageName)}`;
}

function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) {
    return false;
  }

  const expectedSignature = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex")}`;

  return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
}

function buildWikiRawUrl(owner: string, repo: string, pageName: string) {
  const path = pageName
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://raw.githubusercontent.com/wiki/${owner}/${repo}/${path}.md`;
}

function extractExcerpt(markdown: string) {
  return markdown
    .replace(/^#.*$/gm, "")
    .split(/\n\s*\n/)
    .map((block) => block.replace(/[#>*_`-]/g, "").trim())
    .find(Boolean)
    ?.slice(0, 240);
}

async function upsertWikiPage(params: {
  organizationId: string;
  owner: string;
  repo: string;
  page: GollumPage;
  actor?: string;
}) {
  const slug = buildDocsSlug(params.page.page_name);

  if (params.page.action === "deleted") {
    await db
      .update(cmsEntries)
      .set({
        status: "archived",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(cmsEntries.organizationId, params.organizationId),
          eq(cmsEntries.collectionType, "page"),
          eq(cmsEntries.slug, slug),
        ),
      );

    revalidateTag(`cms-entry-${slug}`);
    revalidatePath("/docs");
    revalidatePath(`/docs/${slug.replace(/^docs-/, "")}`);
    return { slug, action: "archived" as const };
  }

  const rawUrl = buildWikiRawUrl(params.owner, params.repo, params.page.page_name);
  const response = await fetch(rawUrl, {
    headers: {
      "User-Agent": "zonasurtech-wiki-sync",
      Accept: "text/plain",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch wiki markdown for ${params.page.page_name}`);
  }

  const markdown = await response.text();
  const excerpt =
    params.page.summary?.trim() || extractExcerpt(markdown) || "Contenido sincronizado desde GitHub Wiki.";

  await db
    .insert(cmsEntries)
    .values({
      organizationId: params.organizationId,
      collectionType: "page",
      title: params.page.title,
      slug,
      excerpt,
      author: "GitHub Wiki",
      content: {
        format: "markdown",
        raw: markdown,
        source: "github_wiki",
        wikiPageName: params.page.page_name,
        wikiUrl: params.page.html_url,
        syncedBy: params.actor ?? "github",
      },
      seoMeta: {
        title: `${params.page.title} | Documentacion`,
        description: excerpt,
        noindex: false,
      },
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [cmsEntries.organizationId, cmsEntries.collectionType, cmsEntries.slug],
      set: {
        title: params.page.title,
        excerpt,
        author: "GitHub Wiki",
        content: {
          format: "markdown",
          raw: markdown,
          source: "github_wiki",
          wikiPageName: params.page.page_name,
          wikiUrl: params.page.html_url,
          syncedBy: params.actor ?? "github",
        },
        seoMeta: {
          title: `${params.page.title} | Documentacion`,
          description: excerpt,
          noindex: false,
        },
        status: "published",
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  revalidateTag(`cms-entry-${slug}`);
  revalidatePath("/docs");
  revalidatePath(`/docs/${slug.replace(/^docs-/, "")}`);

  return { slug, action: "upserted" as const };
}

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ ok: false, error: "GITHUB_WEBHOOK_SECRET is not configured" }, { status: 500 });
  }

  if (!isCmsDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "CMS database is not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  if (event === "ping") {
    return NextResponse.json({ ok: true, event: "ping" });
  }

  if (event !== "gollum") {
    return NextResponse.json({ ok: true, ignored: true, event });
  }

  const payload = JSON.parse(rawBody) as GollumPayload;
  const organizationId = await getPublicCmsOrganizationId();

  if (!organizationId) {
    return NextResponse.json({ ok: false, error: "No public CMS organization could be resolved" }, { status: 500 });
  }

  const owner = process.env.GITHUB_WIKI_OWNER || payload.repository?.owner?.login || "Santyofc";
  const repo = process.env.GITHUB_WIKI_REPO || payload.repository?.name || "SaaS-Zona_Sur_Tech";
  const pages = payload.pages ?? [];

  const synced = [];
  for (const page of pages) {
    synced.push(await upsertWikiPage({
      organizationId,
      owner,
      repo,
      page,
      actor: payload.sender?.login,
    }));
  }

  return NextResponse.json({
    ok: true,
    event,
    synced,
  });
}
