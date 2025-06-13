/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DIFY_API_KEY: process.env.DIFY_API_KEY,
  },
  // Enable standalone output for Docker
  output: 'standalone',
  // Optimize for production
  swcMinify: true,
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
}

export default nextConfig
