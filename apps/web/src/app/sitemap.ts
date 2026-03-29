import { MetadataRoute } from 'next'

const BASE_URL = 'https://zonasurtech.online'

/**
 * Task 3: Complete production sitemap
 * - All indexable marketing pages with proper priorities
 * - Dynamic-ready (can extend with DB queries)
 * - lastModified drives Cache-Control for Googlebot
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/facturacion-electronica-costa-rica`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/software-para-pymes-costa-rica`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sistema-inventario-costa-rica`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/use-cases`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/technology`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Blog posts (Task 7: SEO content)
    {
      url: `${BASE_URL}/blog/facturacion-electronica-hacienda-costa-rica`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/erp-para-pymes-costa-rica`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/inventario-multi-sucursal-costa-rica`,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  return staticPages
}
