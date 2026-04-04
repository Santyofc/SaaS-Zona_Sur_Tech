/**
 * apps/web/src/lib/cms/queries.ts
 *
 * CMS query layer — pure read operations (no mutations).
 *
 * All queries accept an organizationId to enforce tenant isolation.
 * Used by both server actions and server components (RSC data fetching).
 * Never call these from the client.
 */
import { db, cmsEntries, cmsMedia, cmsSettings, organizations, eq, and, desc, asc, like, sql } from "@repo/db";
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

export function isCmsDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
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
): Promise<{ slug: string; updatedAt: Date | null }[]> {
  const results = await db
    .select({ 
      slug: cmsEntries.slug,
      updatedAt: cmsEntries.updatedAt
    })
    .from(cmsEntries)
    .where(
      and(
        eq(cmsEntries.collectionType, collectionType),
        eq(cmsEntries.status, "published")
      )
    )
    .orderBy(desc(cmsEntries.publishedAt));

  return results;
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

/**
 * Public-site settings resolver.
 * Prefers CMS_PUBLIC_ORG_ID when configured, otherwise falls back to the
 * first organization that actually has CMS settings.
 */
export async function getPublicCmsSettings(): Promise<Record<string, string>> {
  if (!isCmsDatabaseConfigured()) {
    return {};
  }

  const fallbackOrgId = await getPublicCmsOrganizationId();
  if (!fallbackOrgId) {
    return {};
  }

  const settings = await getCmsSettings(fallbackOrgId);

  return {
    ...settings,
    siteName: settings.site_name ?? "",
    siteDescription: settings.site_description ?? "",
    defaultAuthor: settings.default_author ?? "",
    logoUrl: settings.logo_url ?? "",
    faviconUrl: settings.favicon_url ?? "",
    accentColor: settings.accent_color ?? "",
    ogImageUrl: settings.og_image_url ?? "",
  };
}

export async function getPublicCmsOrganizationId(): Promise<string | null> {
  if (!isCmsDatabaseConfigured()) {
    return null;
  }

  const configuredOrgId = process.env.CMS_PUBLIC_ORG_ID;
  if (configuredOrgId) {
    return configuredOrgId;
  }

  const orgWithSettings = await db
    .select({ organizationId: cmsSettings.organizationId })
    .from(cmsSettings)
    .orderBy(desc(cmsSettings.updatedAt))
    .limit(1);

  const settingsOrgId = orgWithSettings[0]?.organizationId;
  if (settingsOrgId) {
    return settingsOrgId;
  }

  const firstOrganization = await db
    .select({ id: organizations.id })
    .from(organizations)
    .orderBy(desc(organizations.updatedAt))
    .limit(1);

  return firstOrganization[0]?.id ?? null;
}

/**
 * Returns a summary list of all entries for an org (Admin only).
 */
export async function getAdminEntryList(
  organizationId: string
): Promise<Array<{
  id: string;
  title: string;
  slug: string;
  collectionType: "post" | "page";
  status: "draft" | "published";
  updatedAt: Date;
}>> {
  const results = await db
    .select({
      id: cmsEntries.id,
      title: cmsEntries.title,
      slug: cmsEntries.slug,
      collectionType: cmsEntries.collectionType,
      status: cmsEntries.status,
      updatedAt: cmsEntries.updatedAt,
    })
    .from(cmsEntries)
    .where(eq(cmsEntries.organizationId, organizationId))
    .orderBy(desc(cmsEntries.updatedAt));

  return results as any;
}
