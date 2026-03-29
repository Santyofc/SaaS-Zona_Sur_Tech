import { MetadataRoute } from 'next'

const BASE_URL = 'https://zonasurtech.online'

/**
 * Production-hardened robots.txt
 * - Protects auth, api, admin, and system routes
 * - Allows canonical marketing and blog content
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/technology',
          '/systems',
          '/blog',
          '/sitemap.xml',
        ],
        disallow: [
          '/api/',
          '/auth/',
          '/admin/',
          '/dashboard/',
          '/gateway/',
          '/_next/',
          '/*.txt',
          '/*.log',
          '/*.env',
        ],
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: ['/api/', '/auth/', '/admin/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
