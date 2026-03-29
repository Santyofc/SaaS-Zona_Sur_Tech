-- 0006_add_cms_module.sql
-- CMS Module: entries, media, settings
-- Generated from packages/db/src/schema.ts (cmsEntries, cmsMedia, cmsSettings)

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE "cms_entry_status" AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "cms_collection_type" AS ENUM ('post', 'page');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ---------------------------------------------------------------------------
-- cms_entries — Unified content model (blog posts + pages)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "cms_entries" (
  "id"              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "collection_type" "cms_collection_type" NOT NULL DEFAULT 'post',

  -- Core content
  "title"           text NOT NULL,
  "slug"            text NOT NULL,
  "excerpt"         text,
  "cover_image"     text,
  "author"          text,

  -- Flexible JSON content
  "content"         jsonb,       -- Rich-text / markdown AST (posts)
  "blocks"          jsonb,       -- Block layout (pages)
  "seo_meta"        jsonb,       -- { title, description, og_image, noindex }

  "status"          "cms_entry_status" NOT NULL DEFAULT 'draft',
  "published_at"    timestamptz,

  "created_by"      uuid REFERENCES "users"("id"),
  "updated_by"      uuid REFERENCES "users"("id"),
  "created_at"      timestamptz NOT NULL DEFAULT now(),
  "updated_at"      timestamptz NOT NULL DEFAULT now()
);

-- Indexes for cms_entries
CREATE UNIQUE INDEX IF NOT EXISTS "idx_cms_entries_org_type_slug"
  ON "cms_entries" ("organization_id", "collection_type", "slug");
CREATE INDEX IF NOT EXISTS "idx_cms_entries_org_id"
  ON "cms_entries" ("organization_id");
CREATE INDEX IF NOT EXISTS "idx_cms_entries_status"
  ON "cms_entries" ("status");
CREATE INDEX IF NOT EXISTS "idx_cms_entries_collection_type"
  ON "cms_entries" ("collection_type");
CREATE INDEX IF NOT EXISTS "idx_cms_entries_published_at"
  ON "cms_entries" ("published_at");

-- ---------------------------------------------------------------------------
-- cms_media — Supabase Storage reference table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "cms_media" (
  "id"              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,

  "storage_path"    text NOT NULL,    -- Supabase Storage path
  "public_url"      text NOT NULL,    -- CDN URL
  "filename"        text NOT NULL,    -- Original filename
  "mime_type"       text,
  "size_bytes"      integer,
  "alt"             text,             -- Accessibility alt text

  "uploaded_by"     uuid REFERENCES "users"("id"),
  "created_at"      timestamptz NOT NULL DEFAULT now()
);

-- Indexes for cms_media
CREATE INDEX IF NOT EXISTS "idx_cms_media_org_id"
  ON "cms_media" ("organization_id");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_cms_media_storage_path"
  ON "cms_media" ("storage_path");

-- ---------------------------------------------------------------------------
-- cms_settings — Per-org key-value config
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "cms_settings" (
  "id"              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "key"             text NOT NULL,
  "value"           text,

  "updated_by"      uuid REFERENCES "users"("id"),
  "updated_at"      timestamptz NOT NULL DEFAULT now()
);

-- Indexes for cms_settings
CREATE UNIQUE INDEX IF NOT EXISTS "idx_cms_settings_org_key"
  ON "cms_settings" ("organization_id", "key");

-- ---------------------------------------------------------------------------
-- RLS policies for CMS tables
-- ---------------------------------------------------------------------------

ALTER TABLE "cms_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cms_media"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cms_settings" ENABLE ROW LEVEL SECURITY;

-- Permissive policies for service role (Drizzle uses service role)
CREATE POLICY IF NOT EXISTS "cms_entries_service_all" ON "cms_entries"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "cms_media_service_all" ON "cms_media"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "cms_settings_service_all" ON "cms_settings"
  FOR ALL USING (true) WITH CHECK (true);

-- Public read for published entries (for public blog/pages)
CREATE POLICY IF NOT EXISTS "cms_entries_public_read" ON "cms_entries"
  FOR SELECT USING ("status" = 'published');
