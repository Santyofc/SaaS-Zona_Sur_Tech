import { MetadataRoute } from 'next'

/**
 * Task 1: Production-hardened robots.txt
 * - Protects auth, api, admin, static assets from indexing
 * - Explicitly blocks *.txt routes (resolves /auth/register.txt GSC issue)
 * - Blocks /_next/static/* to prevent font/media indexing
 * - Allows only canonical marketing pages
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/features',
          '/pricing',
          '/contact',
          '/about',
          '/blog',
          '/facturacion-electronica-costa-rica',
          '/software-para-pymes-costa-rica',
          '/sistema-inventario-costa-rica',
          '/docs',
          '/technology',
          '/sitemap.xml',
          '/robots.txt',
        ],
        disallow: [
          '/api/',
          '/auth/',
          '/app/',
          '/dashboard/',
          '/admin/',
          '/gateway/',
          '/oauth/',
          '/portfolio/',
          '/actions/',
          '/_next/',
          '/*.txt',
          '/*.log',
          '/*.env',
          '/ide/',
          '/docker/',
          '/coming-soon',
          '/test',
          '/error',
        ],
      },
      // Block AdsBot explicitly (it ignores Disallow)
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: ['/api/', '/auth/', '/app/', '/dashboard/'],
      },
    ],
    sitemap: 'https://zonasurtech.online/sitemap.xml',
    host: 'https://zonasurtech.online',
  }
}
