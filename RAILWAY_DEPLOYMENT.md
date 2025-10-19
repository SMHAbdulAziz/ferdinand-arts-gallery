# Railway Deployment Guide for Ferdinand Arts Gallery

## Prerequisites
1. Create a Railway account at https://railway.app
2. Install Railway CLI: `npm install -g @railway/cli`
3. Have your Stripe keys ready
4. Push your code to GitHub (Railway connects to GitHub)

## Deployment Steps

### 1. Connect to Railway
```bash
railway login
railway init
```

### 2. Set Environment Variables
In Railway dashboard or via CLI:

```bash
# Database (Railway will auto-generate PostgreSQL)
railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}

# Stripe Configuration  
railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
railway variables set STRIPE_SECRET_KEY=sk_live_your_key_here
railway variables set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
railway variables set NODE_ENV=production
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_URL=https://your-app.railway.app

# Raffle Settings
railway variables set RAFFLE_TICKET_PRICE=25
railway variables set RAFFLE_ARTWORK_VALUE=5000
railway variables set RAFFLE_TARGET_AMOUNT=2500

# Email (if using SendGrid)
railway variables set SENDGRID_API_KEY=your_sendgrid_key
railway variables set EMAIL_FROM=noreply@ferdinandarts.org
```

### 3. Add PostgreSQL Database
```bash
railway add postgresql
```

### 4. Deploy
```bash
railway up
```

## Important Notes

### Database Migration
After first deployment, run database migrations:
```bash
railway run npm run migrate
```

### Domain Setup
1. In Railway dashboard, go to your service
2. Click "Settings" → "Domains" 
3. Add custom domain: ferdinandarts.org
4. Update DNS records as shown

### Stripe Webhooks
1. In Stripe dashboard, add webhook endpoint:
   - URL: `https://your-app.railway.app/api/stripe/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### Environment Variables Priority
Railway will automatically inject:
- `DATABASE_URL` (from PostgreSQL service)
- `PORT` (for the application)
- `RAILWAY_ENVIRONMENT` 

## Estimated Costs
- Starter: $5/month (512MB RAM, 1GB storage)
- Pro: $20/month (8GB RAM, 100GB storage)
- PostgreSQL: Included in plan

## Monitoring
- Railway provides built-in metrics
- Logs available in dashboard
- Health checks configured via `/api/health`

## Troubleshooting
- Check build logs in Railway dashboard
- Verify all environment variables are set
- Ensure database migrations ran successfully
- Test Stripe webhooks in Stripe dashboard