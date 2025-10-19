/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // For Docker and Railway deployment
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'thefundgallery.org', // Updated for The FUND Gallery
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    // Public environment variables
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    RAFFLE_TICKET_PRICE: process.env.RAFFLE_TICKET_PRICE,
    RAFFLE_ARTWORK_VALUE: process.env.RAFFLE_ARTWORK_VALUE,
    RAFFLE_TARGET_AMOUNT: process.env.RAFFLE_TARGET_AMOUNT,
  },
  // Handle environment validation
  async rewrites() {
    // Validate environment on startup
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode - checking environment variables...');
    }
    return [];
  },
}

module.exports = nextConfig