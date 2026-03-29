/**
 * packages/db/src/cms-schema.ts
 *
 * Zod validation layer for all CMS input.
 * Keeps validators co-located with the Drizzle schema so they can be
 * imported by both server actions and API routes without circular deps.
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/**
 * Slug must be lowercase, alphanumeric + hyphens, 1–128 chars.
 * The auto-generator in the UI should produce this format.
 */
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(128, "Slug must be 128 characters or less")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase, with hyphens only (no spaces or special chars)"
  );

export const cmsStatusSchema = z.enum(["draft", "published", "archived"]);
export const cmsCollectionTypeSchema = z.enum(["post", "page"]);

// ---------------------------------------------------------------------------
// SEO metadata bag
// ---------------------------------------------------------------------------

export const seoMetaSchema = z
  .object({
    title: z.string().max(60, "SEO title max 60 chars").optional(),
    description: z.string().max(160, "Meta description max 160 chars").optional(),
    ogImage: z.string().url("OG image must be a valid URL").optional(),
    noindex: z.boolean().optional().default(false),
  })
  .optional();

export type SeoMeta = z.infer<typeof seoMetaSchema>;

// ---------------------------------------------------------------------------
// Block types (pages)
// ---------------------------------------------------------------------------

const heroBlockSchema = z.object({
  type: z.literal("hero"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  backgroundImage: z.string().url().optional(),
});

const featuresBlockSchema = z.object({
  type: z.literal("features"),
  title: z.string().optional(),
  items: z.array(
    z.object({
      icon: z.string().optional(),
      title: z.string().min(1),
      description: z.string(),
    })
  ),
});

const ctaBlockSchema = z.object({
  type: z.literal("cta"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
});

const richTextBlockSchema = z.object({
  type: z.literal("richtext"),
  /** Raw markdown or HTML string */
  body: z.string().min(1),
});

const imageBlockSchema = z.object({
  type: z.literal("image"),
  src: z.string().url("Image src must be a URL"),
  alt: z.string(),
  caption: z.string().optional(),
});

// Union of all allowed block types
export const blockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  featuresBlockSchema,
  ctaBlockSchema,
  richTextBlockSchema,
  imageBlockSchema,
]);

export type Block = z.infer<typeof blockSchema>;

export const blocksSchema = z.array(blockSchema);

// ---------------------------------------------------------------------------
// cms_entries
// ---------------------------------------------------------------------------

export const createEntrySchema = z.object({
  collectionType: cmsCollectionTypeSchema,
  title: z.string().min(1, "Title is required").max(200, "Title max 200 chars"),
  slug: slugSchema,
  excerpt: z.string().max(500, "Excerpt max 500 chars").optional(),
  coverImage: z.string().url("Cover image must be a URL").optional().or(z.literal("")),
  author: z.string().max(100).optional(),
  /** JSON content for posts (rich-text AST or raw markdown string) */
  content: z.unknown().optional(),
  /** JSON blocks for pages */
  blocks: blocksSchema.optional(),
  seoMeta: seoMetaSchema,
  status: cmsStatusSchema.default("draft"),
});

export const updateEntrySchema = createEntrySchema
  .partial()
  .extend({
    id: z.string().uuid("Entry ID must be a UUID"),
  });

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;

// ---------------------------------------------------------------------------
// cms_media
// ---------------------------------------------------------------------------

export const createMediaSchema = z.object({
  storagePath: z.string().min(1, "Storage path is required"),
  publicUrl: z.string().url("Public URL must be a valid URL"),
  filename: z.string().min(1),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().positive().optional(),
  alt: z.string().max(300).optional(),
});

export type CreateMediaInput = z.infer<typeof createMediaSchema>;

// ---------------------------------------------------------------------------
// cms_settings
// ---------------------------------------------------------------------------

export const updateSettingsSchema = z.object({
  siteName: z.string().max(100).optional(),
  siteDescription: z.string().max(300).optional(),
  defaultAuthor: z.string().max(100).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  faviconUrl: z.string().url().optional().or(z.literal("")),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color").optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: cmsStatusSchema.optional(),
  search: z.string().max(100).optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
