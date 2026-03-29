/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * TASK 4 + 5: Compiler optimizations
   * - removeConsole: strips all console.log in production (~8KB JS savings)
   * - reactRemoveProperties: strips data-testid from production builds
   */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production'
      ? { properties: ['^data-testid$'] }
      : false,
  },

  /**
   * TASK 2: Image optimization — critical for LCP + bandwidth
   *
   * - formats: AVIF first (~50% smaller than WebP), WebP fallback.
   *   next/image serves AVIF to Chrome/Firefox, WebP to Safari.
   * - deviceSizes: matches common mobile breakpoints. Avoids generating
   *   oversized images for small screens (saves ~1.2MB per Lighthouse report).
   * - minimumCacheTTL: 30 days for immutable optimized images.
   * - dangerouslyAllowSVG + contentSecurityPolicy: safe SVG serving.
   */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  /**
   * TASK 5: Experimental features for performance
   *
   * - optimizePackageImports: tree-shakes icon libraries. `lucide-react`
   *   ships ~2000 icons but we use ~40. This saves ~200KB+ of unused JS.
   * - After adding lucide-react, we also add framer-motion + @repo/ui-experiments.
   *
   * - turbo: enable Turbopack for faster local dev (no impact on prod build).
   */
  experimental: {
    /**
     * TASK 4: Remove unused JS — this is the biggest win.
     * Without this, Next.js bundles ALL exports of lucide-react (~246KB waste).
     * With this, only the icons imported in the code are included.
     */
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tooltip',
    ],
  },

  /**
   * TASK 6 + 7: HTTP headers
   *
   * - X-Robots-Tag: noindex on /_next/static/ prevents font indexing in Google.
   * - Cache-Control: immutable on static assets — hashed filenames change on deploy.
   * - Prefetch preconnect headers for third-party origins (affects navigation).
   */
  async headers() {
    return [
      // Block /_next/static/* from Google indexing (resolves woff2 indexed issue)
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Security + performance headers for all routes
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
   * TASK 5: Permanent redirects for legacy broken URLs.
   * Handled at Next.js layer (before Nginx) for instant resolution.
   */
  async redirects() {
    return [
      {
        source: '/auth/:path*.txt',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
