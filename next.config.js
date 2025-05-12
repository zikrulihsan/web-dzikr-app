/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Optimize for mobile first
  images: {
    domains: [],
  },
}

module.exports = nextConfig
