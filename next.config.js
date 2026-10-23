/** @type {import('next').NextConfig} */
const nextConfig = {
  // Semua halaman statis: build menghasilkan folder `out` untuk Cloudflare
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  // Optimize for mobile first
  images: {
    domains: [],
    unoptimized: true,
  },
}

module.exports = nextConfig
