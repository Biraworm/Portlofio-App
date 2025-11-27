/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static optimization for pages that use Supabase
  output: 'standalone',
}

module.exports = nextConfig
