/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // This is correct for Railway
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'thefundgallery.org',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    RAFFLE_TICKET_PRICE: process.env.RAFFLE_TICKET_PRICE,
    RAFFLE_ARTWORK_VALUE: process.env.RAFFLE_ARTWORK_VALUE,
    RAFFLE_TARGET_AMOUNT: process.env.RAFFLE_TARGET_AMOUNT,
  },
}

module.exports = nextConfig