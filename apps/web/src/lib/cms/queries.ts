/**
 * apps/web/src/lib/cms/queries.ts
 *
 * CMS query layer — pure read operations (no mutations).
 *
 * All queries accept an organizationId to enforce tenant isolation.
 * Used by both server actions and server components (RSC data fetching).
 * Never call these from the client.
 */
import { db, cmsEntries, cmsMedia, cmsSettings, eq, and, desc, asc, like, sql } from "@repo/db";
import type { PaginationInput } from "@repo/db/cms-schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EntryRow = typeof cmsEntries.$inferSelect;
export type MediaRow = typeof cmsMedia.$inferSelect;
export type SettingRow = typeof cmsSettings.$inferSelect;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------

/**
 * Paginated list of entries for a given org + collection type.
 * Supports status filter and search on title.
 */
export async function listEntries(
  organizationId: string,
  collectionType: "post" | "page",
  pagination: PaginationInput
): Promise<PaginatedResult<EntryRow>> {
  const { page, limit, status, search } = pagination;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(cmsEntries.organizationId, organizationId),
    eq(cmsEntries.collectionType, collectionType),
  ];

  if (status) {
    conditions.push(eq(cmsEntries.status, status));
  }

  if (search) {
    conditions.push(like(cmsEntries.title, `%${search}%`));
  }

  const where = and(...conditions);

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(cmsEntries)
      .where(where)
      .orderBy(desc(cmsEntries.updatedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(cmsEntries)
      .where(where),
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Fetches a single entry by ID, scoped to org.
 */
export async function getEntryById(
  organizationId: string,
  entryId: string
): Promise<EntryRow | undefined> {
  const results = await db
    .select()
    .from(cmsEntries)
    .where(
      and(
        eq(cmsEntries.organizationId, organizationId),
        eq(cmsEntries.id, entryId)
      )
    )
    .limit(1);

  return results[0];
}

/**
 * Fetches a published entry by slug — used for public rendering.
 * Does NOT filter by organizationId for public blog (assumes global slug lookup).
 * For multi-tenant public sites, pass organizationId too.
 */
export async function getPublishedEntryBySlug(
  slug: string,
  collectionType: "post" | "page"
): Promise<EntryRow | undefined> {
  const results = await db
    .select()
    .from(cmsEntries)
    .where(
      and(
        eq(cmsEntries.slug, slug),
        eq(cmsEntries.collectionType, collectionType),
        eq(cmsEntries.status, "published")
      )
    )
    .limit(1);

  return results[0];
}

/**
 * Fetches all published post slugs — used for generateStaticParams.
 */
export async function getAllPublishedSlugs(
  collectionType: "post" | "page"
): Promise<string[]> {
  const results = await db
    .select({ slug: cmsEntries.slug })
    .from(cmsEntries)
    .where(
      and(
        eq(cmsEntries.collectionType, collectionType),
        eq(cmsEntries.status, "published")
      )
    )
    .orderBy(desc(cmsEntries.publishedAt));

  return results.map((r) => r.slug);
}

/**
 * Latest N published posts — used for blog index and RSS.
 */
export async function getLatestPosts(limit = 10): Promise<EntryRow[]> {
  return db
    .select()
    .from(cmsEntries)
    .where(
      and(
        eq(cmsEntries.collectionType, "post"),
        eq(cmsEntries.status, "published")
      )
    )
    .orderBy(desc(cmsEntries.publishedAt))
    .limit(limit);
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export async function listMedia(
  organizationId: string,
  page = 1,
  limit = 40
): Promise<PaginatedResult<MediaRow>> {
  const offset = (page - 1) * limit;

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(cmsMedia)
      .where(eq(cmsMedia.organizationId, organizationId))
      .orderBy(desc(cmsMedia.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(cmsMedia)
      .where(eq(cmsMedia.organizationId, organizationId)),
  ]);

  const total = countResult[0]?.count ?? 0;

  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getMediaById(
  organizationId: string,
  mediaId: string
): Promise<MediaRow | undefined> {
  const results = await db
    .select()
    .from(cmsMedia)
    .where(
      and(
        eq(cmsMedia.organizationId, organizationId),
        eq(cmsMedia.id, mediaId)
      )
    )
    .limit(1);

  return results[0];
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

/**
 * Returns all settings for an org as a plain key→value Record.
 */
export async function getCmsSettings(
  organizationId: string
): Promise<Record<string, string>> {
  const rows = await db
    .select()
    .from(cmsSettings)
    .where(eq(cmsSettings.organizationId, organizationId));

  return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
}
