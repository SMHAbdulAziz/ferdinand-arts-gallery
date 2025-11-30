/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // This is correct for Railway
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    RAFFLE_TICKET_PRICE: process.env.RAFFLE_TICKET_PRICE,
    RAFFLE_ARTWORK_VALUE: process.env.RAFFLE_ARTWORK_VALUE,
    RAFFLE_TARGET_AMOUNT: process.env.RAFFLE_TARGET_AMOUNT,
  },
}

module.exports = nextConfig