import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/app/', 
        '/auth/', 
        '/dashboard/', 
        '/admin/', 
        '/*.txt$', // Bloquear archivos .txt volátiles como register.txt
        '/.env', 
        '/api/health' // Ya que es solo para monitoreo interno
      ],
    },
    sitemap: 'https://zonasurtech.online/sitemap.xml',
  }
}
