/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * Task 8: Performance — compiler optimizations
   */
  compiler: {
    // Remove console.log in production (reduces JS bundle size)
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  /**
   * Task 8: Image optimization — next/image config
   * Limits allowed external image domains, enables AVIF for 40% smaller images
   */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  /**
   * Task 6 + 8: HTTP Headers
   * X-Robots-Tag on static assets to prevent indexing
   * Cache-Control for performance
   */
  async headers() {
    return [
      // Block /_next/static/* from being indexed by Google
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Block font files specifically
      {
        source: '/_next/static/media/:path*.woff2',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Security + SEO headers for all pages
      {
        source: '/:path*',
        headers: [
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), camera=(), microphone=()',
          },
        ],
      },
    ]
  },

  /**
   * Task 8: Redirects — permanent 301 for legacy URLs
   */
  async redirects() {
    return [
      // Consolidate any legacy auth.txt references with 301
      {
        source: '/auth/:path*.txt',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
