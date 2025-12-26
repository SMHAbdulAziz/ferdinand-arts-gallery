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
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://newassets.hcaptcha.com https://*.hcaptcha.com blob:; style-src 'self' 'unsafe-inline' https://newassets.hcaptcha.com https://*.hcaptcha.com; frame-src 'self' https://newassets.hcaptcha.com https://*.hcaptcha.com; connect-src 'self' https://newassets.hcaptcha.com https://*.hcaptcha.com https://api.stripe.com; img-src 'self' data: https:; font-src 'self' data: https:;",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig