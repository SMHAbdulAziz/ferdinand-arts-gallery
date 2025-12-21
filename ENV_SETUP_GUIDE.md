# Environment Variables Setup Guide

## Overview
This document outlines all required and optional environment variables for the raffle system with admin authentication and email notifications.

## Critical Variables (Required for Production)

### Database Configuration
```
DATABASE_URL=postgresql://user:password@host:port/dbname
```
- Connection string to your PostgreSQL database
- Railway: This should already be set up in your Railway environment

### PayPal Configuration
```
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=live|sandbox
```
- Get from: https://developer.paypal.com/
- `PAYPAL_MODE`: Set to `sandbox` for testing, `live` for production

### Admin Authentication
```
ADMIN_API_TOKEN=your_secure_random_token
```
- Generate a secure random token (minimum 32 characters)
- **IMPORTANT:** Use `crypto.randomBytes(32).toString('hex')` or similar
- This token is required for executing raffle draws
- Keep this secret and never expose in client-side code

Example token generation:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Email Configuration (Pick ONE option)

#### Option A: SendGrid (Recommended)
```
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@thefundgallery.org
```
- Get from: https://sendgrid.com/
- Free tier: 100 emails/day
- Production tier: Up to 500K emails/month

#### Option B: Gmail
```
GMAIL_EMAIL=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
```
- Requires: Google App Password (not regular password)
- Get here: https://myaccount.google.com/apppasswords
- Limited to ~300 emails/day

#### Option C: Generic SMTP (Mailgun, AWS SES, etc.)
```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_username
SMTP_PASS=your_password
EMAIL_FROM=noreply@thefundgallery.org
```

### Node Environment
```
NODE_ENV=production|development
```
- Set to `production` for deployed applications
- Set to `development` for local testing

## Optional Variables

### Logging & Monitoring
```
LOG_LEVEL=debug|info|warn|error
SENTRY_DSN=your_sentry_project_url
```

### Analytics
```
GOOGLE_ANALYTICS_ID=your_ga_id
```

## Railway.app Setup

### Step 1: Add Variables to Railway

1. Go to your Railway project
2. Select your **Backend** service (Next.js)
3. Go to **Variables** tab
4. Add the following variables:

```
DATABASE_URL=<copy from your Postgres service>
PAYPAL_CLIENT_ID=<your_paypal_id>
PAYPAL_CLIENT_SECRET=<your_paypal_secret>
PAYPAL_MODE=sandbox|live
ADMIN_API_TOKEN=<generated_secure_token>
SENDGRID_API_KEY=<your_sendgrid_key>
EMAIL_FROM=noreply@thefundgallery.org
NODE_ENV=production
```

### Step 2: Get Database Connection String

1. Go to your Railway **Postgres** service
2. Click **Connect**
3. Copy the connection string (format: `postgresql://...`)
4. Paste as `DATABASE_URL` in Backend service

### Step 3: Generate Admin Token

Run in your terminal:
```bash
node -e "console.log('ADMIN_API_TOKEN=' + require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add to Railway variables.

## How to Use Admin Token

### Making Admin Requests

When executing a raffle draw, include the admin token in the request:

```bash
curl -X POST https://your-domain.com/api/raffle/draw \
  -H "Authorization: Bearer YOUR_ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raffleId": "raffle-uuid"
  }'
```

### Node.js Example

```javascript
const response = await fetch('/api/raffle/draw', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.ADMIN_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    raffleId: raffleId
  })
});
```

## Email Testing in Development

### Console Logging Mode
If no email provider is configured, emails are logged to console:
```
📧 EMAIL (Console Mode): {
  to: user@example.com,
  subject: Free Entry Confirmed - Raffle Title,
  timestamp: 2025-12-21T...
}
```

### SendGrid Sandbox Mode
```
SENDGRID_API_KEY=your_api_key
SENDGRID_SANDBOX_MODE=true  # (optional for testing)
```

## Security Best Practices

✅ **DO:**
- Store all sensitive variables in Railway environment (not in .env file)
- Rotate `ADMIN_API_TOKEN` periodically
- Use strong, randomly generated tokens
- Keep `PAYPAL_CLIENT_SECRET` and email API keys secret
- Use SendGrid or similar service instead of storing raw SMTP credentials

❌ **DON'T:**
- Commit `.env` files to GitHub
- Expose `ADMIN_API_TOKEN` in client-side code
- Share credentials in chat, emails, or documentation
- Use weak tokens (like "password" or sequential numbers)
- Store credentials in code comments

## Verifying Setup

### 1. Check Database Connection
```bash
# From Railway CLI
railway connect postgres
# Should connect successfully
```

### 2. Test Email Service
The system will log to console if email provider is not configured.

### 3. Verify Admin Token
Try making a request without proper auth:
```bash
curl -X POST https://your-domain.com/api/raffle/draw
# Should return: 401 Unauthorized
```

## Troubleshooting

### Issue: "Missing authorization token"
**Solution:** Add `ADMIN_API_TOKEN` to Railway environment variables

### Issue: "Invalid admin token"
**Solution:** Ensure the token in request matches exactly with `ADMIN_API_TOKEN` in environment

### Issue: Email not sending
**Solution:**
1. Check email provider API key is correct
2. Check `EMAIL_FROM` is valid
3. Check email service isn't in spam folder
4. Look for errors in Railway logs

### Issue: Database connection failed
**Solution:**
1. Verify `DATABASE_URL` format
2. Check database service is running in Railway
3. Test connection with `railway connect postgres`

## Environment Variable Checklist

Before deploying to production:

- [ ] DATABASE_URL is set and valid
- [ ] PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are set
- [ ] PAYPAL_MODE is set to 'live' (or 'sandbox' for testing)
- [ ] ADMIN_API_TOKEN is set to secure random value
- [ ] Email provider is configured (SENDGRID_API_KEY or SMTP settings)
- [ ] EMAIL_FROM is set to valid email address
- [ ] NODE_ENV is set to 'production'
- [ ] All variables have been tested with actual requests

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [PayPal Developer](https://developer.paypal.com)
- [SendGrid Setup](https://sendgrid.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Last Updated:** December 21, 2025
