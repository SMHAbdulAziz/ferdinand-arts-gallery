# Environment Configuration Guide

This guide explains how to set up environment variables for the Ferdinand Arts Foundation website.

## Files Overview

- **`.env.example`** - Template with all required variables
- **`.env.local`** - Development environment (pre-configured for local testing)
- **`.env.production`** - Production environment (create when deploying)

## Setup Instructions

### For Development (Local Testing)

1. The `.env.local` file is already configured for development
2. **Update Stripe Test Keys:**
   - Visit: https://dashboard.stripe.com/test/apikeys
   - Copy your Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy your Secret Key → `STRIPE_SECRET_KEY`
   - Set up webhook endpoint → `STRIPE_WEBHOOK_SECRET`

### For Production Deployment

1. Copy `.env.example` to `.env.production`
2. Fill in all production values:
   - **Database**: Real PostgreSQL connection string
   - **Stripe**: Live API keys (not test keys)
   - **Security**: Strong passwords and secrets
   - **Email**: Production SMTP settings

## Key Environment Variables

### Critical for Functionality
```bash
DATABASE_URL          # PostgreSQL connection
STRIPE_SECRET_KEY     # Stripe payments (keep secret!)
NEXTAUTH_SECRET       # Authentication security
```

### Public (Safe to Expose)
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Stripe frontend
RAFFLE_TICKET_PRICE                 # $50 per ticket
RAFFLE_ARTWORK_VALUE               # $700 artwork value
```

## Security Notes

⚠️ **Never commit real API keys to version control**
✅ **Use test keys for development**
🔒 **Keep secret keys in production environment only**

## Stripe Setup Process

1. **Create Stripe Account**: https://stripe.com
2. **Get Test Keys**: Dashboard → Developers → API Keys
3. **Set up Webhooks**: Dashboard → Webhooks → Add endpoint
4. **Test Payments**: Use test card numbers for development

## Database Setup

The website expects a PostgreSQL database with the schema defined in:
`/gallery-website/database/init.sql`

For local development, you can use the Docker setup which includes PostgreSQL.

## Next Steps

1. Update `.env.local` with your Stripe test keys
2. Start the development server: `npm run dev`
3. Test raffle ticket purchasing with Stripe test cards
4. Configure production environment when ready to deploy