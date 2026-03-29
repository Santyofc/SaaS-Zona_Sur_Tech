"use server";
/**
 * apps/web/src/lib/cms/actions.ts
 *
 * CMS Server Actions — all mutations go through here.
 *
 * Pattern followed (same as apps/web/src/app/admin/actions.ts):
 * 1. requireCmsPermission() guards every action
 * 2. Zod validates all input before touching the DB
 * 3. revalidatePath() clears the ISR cache on mutations
 * 4. Returns { success: true, data } or throws
 */
import { revalidatePath, revalidateTag } from "next/cache";
import { db, cmsEntries, cmsMedia, cmsSettings, eq, and } from "@repo/db";
import {
  createEntrySchema,
  updateEntrySchema,
  createMediaSchema,
  updateSettingsSchema,
  type CreateEntryInput,
  type UpdateEntryInput,
  type CreateMediaInput,
  type UpdateSettingsInput,
} from "@repo/db/cms-schema";
import { requireCmsPermission } from "./permissions";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Internal: Supabase Storage client (service role for server-side uploads)
// ---------------------------------------------------------------------------

function createStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const CMS_STORAGE_BUCKET = "cms-media";

// ---------------------------------------------------------------------------
// Entries — CRUD
// ---------------------------------------------------------------------------

/**
 * Creates a new CMS entry (post or page).
 * Validates, checks permission, inserts, then revalidates ISR cache.
 */
export async function createEntry(rawInput: CreateEntryInput) {
  const ctx = await requireCmsPermission("cms:write");
  const input = createEntrySchema.parse(rawInput);

  const [entry] = await db
    .insert(cmsEntries)
    .values({
      organizationId: ctx.organizationId,
      collectionType: input.collectionType,
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      coverImage: input.coverImage || null,
      author: input.author,
      content: input.content ?? null,
      blocks: input.blocks ?? null,
      seoMeta: input.seoMeta ?? null,
      status: input.status,
      publishedAt: input.status === "published" ? new Date() : null,
      createdBy: ctx.userId,
      updatedBy: ctx.userId,
    })
    .returning();

  // Revalidate admin list pages
  revalidatePath(`/admin/${input.collectionType}s`);

  return { success: true, data: entry };
}

/**
 * Updates an existing entry.
 * Only the entry's owning org can update it (tenant check via organizationId).
 */
export async function updateEntry(rawInput: UpdateEntryInput) {
  const ctx = await requireCmsPermission("cms:write");
  const input = updateEntrySchema.parse(rawInput);

  // Determine if we're publishing for the first time
  const wasPublished = input.status === "published";

  const [entry] = await db
    .update(cmsEntries)
    .set({
      ...(input.title !== undefined && { title: input.title }),
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
      ...(input.coverImage !== undefined && { coverImage: input.coverImage || null }),
      ...(input.author !== undefined && { author: input.author }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.blocks !== undefined && { blocks: input.blocks }),
      ...(input.seoMeta !== undefined && { seoMeta: input.seoMeta }),
      ...(input.status !== undefined && { status: input.status }),
      ...(wasPublished && { publishedAt: new Date() }),
      updatedBy: ctx.userId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(cmsEntries.id, input.id),
        eq(cmsEntries.organizationId, ctx.organizationId)
      )
    )
    .returning();

  if (!entry) throw new Error("Entry not found or permission denied");

  // Invalidate ISR cache for this slug
  revalidateTag(`cms-entry-${entry.slug}`);
  revalidatePath(`/blog/${entry.slug}`);
  revalidatePath(`/admin/${entry.collectionType}s`);

  return { success: true, data: entry };
}

/**
 * Changes only the status of an entry (draft → published, etc.)
 * Requires cms:publish permission.
 */
export async function publishEntry(entryId: string, status: "draft" | "published" | "archived") {
  const ctx = await requireCmsPermission("cms:publish");

  const [entry] = await db
    .update(cmsEntries)
    .set({
      status,
      publishedAt: status === "published" ? new Date() : undefined,
      updatedBy: ctx.userId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(cmsEntries.id, entryId),
        eq(cmsEntries.organizationId, ctx.organizationId)
      )
    )
    .returning();

  if (!entry) throw new Error("Entry not found or permission denied");

  revalidateTag(`cms-entry-${entry.slug}`);
  revalidatePath(`/blog/${entry.slug}`);

  return { success: true, data: entry };
}

/**
 * Hard-deletes an entry. Requires cms:delete permission.
 */
export async function deleteEntry(entryId: string) {
  const ctx = await requireCmsPermission("cms:delete");

  const [deleted] = await db
    .delete(cmsEntries)
    .where(
      and(
        eq(cmsEntries.id, entryId),
        eq(cmsEntries.organizationId, ctx.organizationId)
      )
    )
    .returning({ slug: cmsEntries.slug, type: cmsEntries.collectionType });

  if (!deleted) throw new Error("Entry not found or permission denied");

  revalidateTag(`cms-entry-${deleted.slug}`);
  revalidatePath(`/blog/${deleted.slug}`);
  revalidatePath(`/admin/${deleted.type}s`);

  return { success: true };
}

// ---------------------------------------------------------------------------
// Media — Upload + Delete
// ---------------------------------------------------------------------------

/**
 * Uploads a file to Supabase Storage and records it in cms_media.
 *
 * The file should be sent as a FormData from the client:
 *   const formData = new FormData();
 *   formData.append("file", file);
 *   formData.append("alt", "Description");
 */
export async function uploadMedia(formData: FormData) {
  const ctx = await requireCmsPermission("cms:write");

  const file = formData.get("file") as File | null;
  const alt = (formData.get("alt") as string) ?? "";

  if (!file) throw new Error("No file provided");

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File exceeds the 10MB limit");
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml", "application/pdf"];
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error(`File type '${file.type}' is not allowed`);
  }

  const supabase = createStorageClient();

  // Build storage path: orgId/year-month/filename-uuid.ext
  const ext = file.name.split(".").pop() ?? "bin";
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const uniqueFilename = `${file.name.replace(/\.[^.]+$/, "")}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const storagePath = `${ctx.organizationId}/${yearMonth}/${uniqueFilename}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(CMS_STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(CMS_STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  const publicUrl = urlData.publicUrl;

  // Record in DB
  const mediaInput = createMediaSchema.parse({
    storagePath,
    publicUrl,
    filename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    alt,
  });

  const [media] = await db
    .insert(cmsMedia)
    .values({
      organizationId: ctx.organizationId,
      ...mediaInput,
      uploadedBy: ctx.userId,
    })
    .returning();

  revalidatePath("/admin/media");

  return { success: true, data: media };
}

/**
 * Hard-deletes a media record and its Supabase Storage file.
 */
export async function deleteMedia(mediaId: string) {
  const ctx = await requireCmsPermission("cms:delete");

  const [media] = await db
    .delete(cmsMedia)
    .where(
      and(
        eq(cmsMedia.id, mediaId),
        eq(cmsMedia.organizationId, ctx.organizationId)
      )
    )
    .returning();

  if (!media) throw new Error("Media not found or permission denied");

  // Delete from Supabase Storage
  const supabase = createStorageClient();
  const { error } = await supabase.storage
    .from(CMS_STORAGE_BUCKET)
    .remove([media.storagePath]);

  if (error) {
    // Non-fatal: log but don't throw — DB record is already gone
    console.error("[CMS] Storage delete failed:", error.message);
  }

  revalidatePath("/admin/media");

  return { success: true };
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

/**
 * Upserts multiple CMS settings for an org.
 * Each key-value pair is upserted individually to support partial updates.
 */
export async function updateCmsSettings(rawInput: UpdateSettingsInput) {
  const ctx = await requireCmsPermission("cms:settings");
  const input = updateSettingsSchema.parse(rawInput);

  // Map camelCase keys to storage keys
  const keyMap: Record<keyof UpdateSettingsInput, string> = {
    siteName: "site_name",
    siteDescription: "site_description",
    defaultAuthor: "default_author",
    logoUrl: "logo_url",
    faviconUrl: "favicon_url",
    accentColor: "accent_color",
  };

  const entries = Object.entries(input) as [keyof UpdateSettingsInput, string | undefined][];

  await Promise.all(
    entries
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) =>
        db
          .insert(cmsSettings)
          .values({
            organizationId: ctx.organizationId,
            key: keyMap[key],
            value: value ?? "",
            updatedBy: ctx.userId,
          })
          .onConflictDoUpdate({
            target: [cmsSettings.organizationId, cmsSettings.key],
            set: { value: value ?? "", updatedBy: ctx.userId, updatedAt: new Date() },
          })
      )
  );

  revalidatePath("/admin/settings");

  return { success: true };
}
