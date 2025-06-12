/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    DIFY_API_KEY: process.env.DIFY_API_KEY,
  },
}

export default nextConfig