import { MetadataRoute } from 'next'
import { getAllPublishedSlugs, isCmsDatabaseConfigured } from '@/lib/cms/queries'

const BASE_URL = 'https://zonasurtech.online'

/**
 * Dynamic Sitemap Generator
 * - Fetches all published posts and pages from CMS
 * - Combines with core static marketing routes
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Core static routes that are always present
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/technology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/systems`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  if (!isCmsDatabaseConfigured()) {
    return staticRoutes;
  }

  try {
    // 2. Fetch all published blog posts
    const posts = await getAllPublishedSlugs("post");
    const blogRoutes: MetadataRoute.Sitemap = posts.map(({ slug, updatedAt }) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: updatedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    // 3. Fetch all generic CMS pages (if any are not handled by hybrid routes)
    const pages = await getAllPublishedSlugs("page");
    const pageRoutes: MetadataRoute.Sitemap = pages
      .filter(({ slug }) => !['home', 'pricing', 'technology', 'systems'].includes(slug))
      .map(({ slug, updatedAt }) => ({
        url: `${BASE_URL}/${slug}`,
        lastModified: updatedAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      }));

    return [...staticRoutes, ...blogRoutes, ...pageRoutes];
  } catch {
    return staticRoutes;
  }
}
