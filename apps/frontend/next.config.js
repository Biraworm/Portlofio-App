/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static optimization for pages that use Supabase
  // output: 'standalone', // Removed to allow static export if needed
}

module.exports = nextConfig
