import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { cmsEntries } from './src/schema';

// Setup connection to Supabase pooler (same as previous script)
const sql = postgres('postgresql://postgres.rmkkrunxloleranvshto:Santidevs2212@aws-1-us-east-1.pooler.supabase.com:5432/postgres', {
  ssl: 'require',
});
const db = drizzle(sql);

// Set default organization ID (admin's org)
// Warning: Assuming there's only 1 org or we can grab the first one
async function getDefaultOrgId() {
  const [org] = await sql`SELECT id FROM organizations LIMIT 1`;
  return org.id;
}

const markdownDir = path.join(process.cwd(), '../../apps/web/markdown/blog');

function parseMDX(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const rawFrontmatter = match[1];
  const markdownBody = content.replace(frontmatterRegex, '').trim();
  
  const meta = {};
  rawFrontmatter.split('\n').forEach(line => {
    const splitIndex = line.indexOf(':');
    if (splitIndex !== -1) {
      const key = line.slice(0, splitIndex).trim();
      let value = line.slice(splitIndex + 1).trim();
      // Remove quotes
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      meta[key] = value;
    }
  });

  return { meta, markdownBody };
}

async function run() {
  if (!fs.existsSync(markdownDir)) {
    console.log('Markdown directory not found. Skipping migration.');
    return;
  }

  const orgId = await getDefaultOrgId();
  if (!orgId) throw new Error('No organization found in DB. Cannot insert posts.');

  const files = fs.readdirSync(markdownDir).filter(f => f.endsWith('.mdx'));
  console.log(`Found ${files.length} MDX files to migrate.`);

  for (const file of files) {
    const filePath = path.join(markdownDir, file);
    const parsed = parseMDX(filePath);
    if (!parsed) {
      console.log(`⚠️ Skipped ${file}: No frontmatter found.`);
      continue;
    }
    
    const slug = file.replace('.mdx', '');
    const title = parsed.meta.title || slug;
    const excerpt = parsed.meta.excerpt || '';
    const status = 'published'; 
    const publishedAt = parsed.meta.date ? new Date(parsed.meta.date) : new Date();

    console.log(`📦 Migrating: ${slug}...`);

    try {
      await db.insert(cmsEntries).values({
        organizationId: orgId,
        collectionType: 'post',
        title,
        slug,
        excerpt,
        content: { raw: parsed.markdownBody },
        status,
        publishedAt,
        seoMeta: { title, description: excerpt },
      }).onConflictDoUpdate({
        target: [cmsEntries.organizationId, cmsEntries.collectionType, cmsEntries.slug],
        set: {
          title,
          excerpt,
          content: { raw: parsed.markdownBody },
          updatedAt: new Date()
        }
      });
      console.log(`   ✅ Success`);
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }
  }

  console.log('\nMigration complete.');
}

run()
  .catch(console.error)
  .finally(() => sql.end());
