#!/usr/bin/env node
/**
 * scripts/migrate-markdown-to-cms.mjs
 *
 * Migrates existing markdown blog posts from apps/web/markdown/blog/
 * into the cms_entries table.
 *
 * Usage:
 *   DATABASE_URL=postgres://... ORGANIZATION_ID=<uuid> node scripts/migrate-markdown-to-cms.mjs
 *
 * Options:
 *   --dry-run    Print what would be inserted without writing to DB
 *   --overwrite  Re-insert entries even if slug already exists (upsert)
 *
 * What it does:
 * 1. Reads every .md/.mdx file from apps/web/markdown/blog/
 * 2. Parses YAML frontmatter (title, date, excerpt, coverImage, author, tags)
 * 3. Stores the raw markdown body as content: { format: "markdown", raw: "..." }
 * 4. Inserts into cms_entries with status: "published" (preserves slug)
 * 5. Reports what was inserted and any skipped/failed entries
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, "../apps/web/markdown/blog");

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const OVERWRITE = args.includes("--overwrite");

// ---------------------------------------------------------------------------
// Env validation
// ---------------------------------------------------------------------------

const DATABASE_URL = process.env.DATABASE_URL;
const ORGANIZATION_ID = process.env.ORGANIZATION_ID;
const CREATED_BY = process.env.CREATED_BY ?? null; // optional user UUID

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

if (!ORGANIZATION_ID) {
  console.error("❌ ORGANIZATION_ID environment variable is required (your org UUID)");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Frontmatter parser (no external dep — simple YAML block extraction)
// ---------------------------------------------------------------------------

/**
 * Parses the YAML frontmatter block from a markdown string.
 * Returns { frontmatter: Record<string,any>, body: string }
 *
 * @param {string} raw
 */
function parseFrontmatter(raw) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = raw.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: raw };
  }

  const yamlBlock = match[1];
  const body = match[2].trim();

  // Minimal YAML parser: handles key: value and key: [array]
  const frontmatter = {};
  for (const line of yamlBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const rawValue = line.slice(colonIdx + 1).trim();

    // Array: [a, b, c]
    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      frontmatter[key] = rawValue
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
    } else {
      // Strip surrounding quotes
      frontmatter[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }

  return { frontmatter, body };
}

/**
 * Converts a filename to a slug.
 * "facturacion-electronica.mdx" → "facturacion-electronica"
 * @param {string} filename
 */
function filenameToSlug(filename) {
  return filename
    .replace(/\.(md|mdx)$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\n🗂  CMS Migration — Markdown → Database`);
  console.log(`   Directory : ${BLOG_DIR}`);
  console.log(`   Org ID    : ${ORGANIZATION_ID}`);
  console.log(`   Dry Run   : ${DRY_RUN}`);
  console.log(`   Overwrite : ${OVERWRITE}`);
  console.log("");

  // Connect (only if not dry-run)
  const sql = DRY_RUN
    ? null
    : postgres(DATABASE_URL, { max: 1 });

  let files;
  try {
    files = await fs.readdir(BLOG_DIR);
  } catch {
    console.error(`❌ Cannot read directory: ${BLOG_DIR}`);
    process.exit(1);
  }

  const mdFiles = files.filter((f) => /\.(md|mdx)$/.test(f));

  if (mdFiles.length === 0) {
    console.log("⚠️  No markdown files found.");
    process.exit(0);
  }

  console.log(`📄 Found ${mdFiles.length} file(s):\n`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const filename of mdFiles) {
    const filePath = path.join(BLOG_DIR, filename);

    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const { frontmatter, body } = parseFrontmatter(raw);

      const slug = frontmatter.slug ?? filenameToSlug(filename);
      const title = frontmatter.title ?? slug;
      const excerpt = frontmatter.excerpt ?? null;
      const coverImage = frontmatter.coverImage ?? null;
      const author = frontmatter.author ?? "Equipo ZonaSur Tech";
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
      const dateStr = frontmatter.date ?? new Date().toISOString().split("T")[0];
      const publishedAt = new Date(dateStr);

      /** Content stored as a JSON bag: { format: "markdown", raw: "..." } */
      const content = {
        format: "markdown",
        raw: body,
        tags,
      };

      const seoMeta = {
        title: frontmatter.title?.slice(0, 60) ?? null,
        description: excerpt?.slice(0, 160) ?? null,
        ogImage: coverImage ?? null,
        noindex: false,
      };

      if (DRY_RUN) {
        console.log(`  [DRY] Would insert: "${title}" → slug: "${slug}"`);
        inserted++;
        continue;
      }

      // Check for existing slug
      const existing = await sql`
        SELECT id FROM cms_entries
        WHERE organization_id = ${ORGANIZATION_ID}
          AND collection_type = 'post'
          AND slug = ${slug}
        LIMIT 1
      `;

      if (existing.length > 0 && !OVERWRITE) {
        console.log(`  ⏭  Skipping "${slug}" — already exists (use --overwrite to replace)`);
        skipped++;
        continue;
      }

      if (existing.length > 0 && OVERWRITE) {
        // Update existing
        await sql`
          UPDATE cms_entries
          SET
            title = ${title},
            excerpt = ${excerpt},
            cover_image = ${coverImage},
            author = ${author},
            content = ${JSON.stringify(content)},
            seo_meta = ${JSON.stringify(seoMeta)},
            status = 'published',
            published_at = ${publishedAt},
            updated_at = NOW()
          WHERE organization_id = ${ORGANIZATION_ID}
            AND collection_type = 'post'
            AND slug = ${slug}
        `;
        console.log(`  ♻️  Updated: "${title}" (${slug})`);
      } else {
        // Insert new
        await sql`
          INSERT INTO cms_entries (
            organization_id,
            collection_type,
            title,
            slug,
            excerpt,
            cover_image,
            author,
            content,
            seo_meta,
            status,
            published_at,
            created_by,
            updated_by
          ) VALUES (
            ${ORGANIZATION_ID},
            'post',
            ${title},
            ${slug},
            ${excerpt},
            ${coverImage},
            ${author},
            ${JSON.stringify(content)},
            ${JSON.stringify(seoMeta)},
            'published',
            ${publishedAt},
            ${CREATED_BY},
            ${CREATED_BY}
          )
        `;
        console.log(`  ✅ Inserted: "${title}" (${slug})`);
      }

      inserted++;
    } catch (err) {
      console.error(`  ❌ Failed: ${filename} — ${err.message}`);
      failed++;
    }
  }

  if (sql) await sql.end();

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Inserted : ${inserted}
  ⏭  Skipped  : ${skipped}
  ❌ Failed   : ${failed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
