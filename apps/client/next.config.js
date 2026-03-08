/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@repo/auth', '@repo/db', '@repo/ui'],
}

module.exports = nextConfig
