/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chickenbone.dev',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig
