/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['dbtpdgpnuwalspbfbidd.supabase.co'],
  },
}

module.exports = nextConfig
