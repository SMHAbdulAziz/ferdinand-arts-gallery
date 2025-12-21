# Pre-Deployment Checklist

## ✅ Completed Features

### 1. Raffle Protocol Implementation
- [x] Database schema with threshold fields
- [x] 6 API endpoints (draw, free-entry, outcome-summary, validate-config, status, purchase)
- [x] Frontend raffle entry page with countdown timer and threshold display
- [x] Results page with winner announcement
- [x] Protocols documentation page
- [x] Free email entry system (one per person per raffle)

### 2. Admin Authentication
- [x] Bearer token middleware in `/frontend/middleware/adminAuth.js`
- [x] Admin auth integrated into `/api/raffle/draw` endpoint
- [x] Validates `ADMIN_API_TOKEN` environment variable
- [x] Returns 401 for missing token, 403 for invalid token

### 3. Email Notification System
- [x] Comprehensive email service in `/frontend/services/emailService.js`
- [x] Multi-provider support (SendGrid, Gmail, SMTP)
- [x] 4 email templates:
  - Free entry confirmation
  - Winner announcement
  - Raffle ending reminder
  - Results announcement
- [x] Integrated into `/api/raffle/draw` (winner notifications)
- [x] Integrated into `/api/raffle/free-entry` (entry confirmations)
- [x] Non-blocking email delivery (doesn't prevent raffle operations)

---

## 🚀 Pre-Production Tasks

### Task 1: Configure Email Provider (REQUIRED)

Choose ONE option and configure environment variables in Railway:

#### Option A: SendGrid (Recommended) ⭐
**Cost:** Free tier 100 emails/day, paid from $19.95/month  
**Setup Time:** 5 minutes

1. Create account at https://sendgrid.com
2. Navigate to **Settings → API Keys**
3. Create new API key
4. In Railway backend environment:
   ```
   SENDGRID_API_KEY=SG.xxxxx
   EMAIL_FROM=noreply@thefundgallery.org
   ```

#### Option B: Gmail
**Cost:** Free (limited to ~300 emails/day)  
**Setup Time:** 10 minutes

1. Enable 2-Factor Authentication on Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. In Railway backend environment:
   ```
   GMAIL_EMAIL=your-email@gmail.com
   GMAIL_PASSWORD=generated_app_password
   EMAIL_FROM=your-email@gmail.com
   ```

#### Option C: Generic SMTP (Mailgun, AWS SES, etc.)
**Cost:** Varies by provider  
**Setup Time:** 15 minutes

1. Set up SMTP credentials with your provider
2. In Railway backend environment:
   ```
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_username
   SMTP_PASS=your_password
   SMTP_SECURE=false
   EMAIL_FROM=noreply@thefundgallery.org
   ```

### Task 2: Set Admin Token (REQUIRED)

1. Generate secure token:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Add to Railway backend environment:
   ```
   ADMIN_API_TOKEN=your_generated_token_here
   ```

### Task 3: Deploy Database Schema (REQUIRED)

The following schema changes must be applied to your production PostgreSQL database:

**If using Railway Postgres:**

1. Go to Railway → Select Postgres service
2. Click **Connect** → **Connect with Railway CLI** or **Adminer**
3. Execute [database/init.sql](database/init.sql)

**If using external database:**
```bash
psql postgresql://user:password@host:port/dbname < database/init.sql
```

**Changes applied:**
- Add 5 new columns to `raffles` table
- Create `free_raffle_entries` table
- Add `entry_method` column to `tickets` table
- Update `settings` with expanded raffle_config

### Task 4: Test the Complete Flow (RECOMMENDED)

Before announcing the raffle publicly, test:

#### 4a. Free Entry Test
```bash
curl -X POST https://your-domain.com/api/raffle/free-entry \
  -H "Content-Type: application/json" \
  -d '{
    "raffleId": "your-test-raffle-id",
    "email": "test@example.com"
  }'
```
✅ Should receive confirmation email  
✅ Check logs for success response

#### 4b. Ticket Purchase Test
Use PayPal checkout on your site to buy test tickets (sandbox mode)  
✅ Should see tickets added to raffle  
✅ Verify ticket count updates

#### 4c. Admin Draw Test
```bash
curl -X POST https://your-domain.com/api/raffle/draw \
  -H "Authorization: Bearer YOUR_ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raffleId": "your-test-raffle-id"
  }'
```
✅ Should select a winner  
✅ Winner should receive email notification  
✅ Check results page for outcome

---

## 📋 Railway Environment Variables Checklist

Before deploying, ensure your Railway backend service has all required variables:

```
✅ DATABASE_URL               (auto-set by Railway)
✅ PAYPAL_CLIENT_ID           (from PayPal Developer)
✅ PAYPAL_CLIENT_SECRET       (from PayPal Developer)
✅ PAYPAL_MODE                (set to 'sandbox' or 'live')
✅ ADMIN_API_TOKEN            (generated random token)
✅ [Email Provider]           (SendGrid/Gmail/SMTP - pick one)
✅ EMAIL_FROM                 (from email address)
✅ NODE_ENV                   (set to 'production')
```

### How to Add Variables to Railway

1. Go to your Railway project
2. Select **Backend** service (Next.js)
3. Navigate to **Variables** tab
4. Add each variable as new entry
5. **Important:** Do NOT commit these to Git or include in .env file
6. Click **Deploy** or wait for auto-deploy on git push

---

## 🔒 Security Checklist

Before production launch:

- [ ] `ADMIN_API_TOKEN` is long and randomly generated (32+ characters)
- [ ] All secrets are in Railway environment (not in code)
- [ ] `.env` file is in `.gitignore` (never committed)
- [ ] `PAYPAL_MODE` is set to `'live'` (not `'sandbox'`)
- [ ] Email API keys are valid and have not been exposed
- [ ] PostgreSQL database has daily backups configured
- [ ] HTTPS is enabled on your domain
- [ ] Admin token is only known by authorized personnel

---

## 📦 Deployment Commands

### Option 1: Automatic (Recommended)
Railway auto-deploys when you push to main:
```bash
git push origin main
```

### Option 2: Manual via Railway CLI
```bash
# Install Railway CLI if not already done
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway deploy
```

---

## ✨ Post-Deployment Verification

After deploying, verify everything works:

### 1. Check Logs
```bash
railway logs -f
```
Look for any errors. Should see normal request logs without email errors.

### 2. Test Public Pages
- Visit `/raffle` - should see raffle entry form
- Visit `/raffle-protocols` - should display protocol documentation
- Visit `/raffles` - should list active raffles

### 3. Test Free Entry
- Submit email on raffle page
- Check your email for confirmation
- Verify database has entry in `free_raffle_entries` table

### 4. Test Admin Draw (If Raffle Ready)
```bash
curl -X POST https://your-domain.com/api/raffle/draw \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"raffleId":"YOUR_RAFFLE_ID"}'
```
- Should return winner information
- Winner should receive email notification
- `/raffle-results` page should show outcome

---

## 🎯 Critical Success Factors

| Item | Status | Notes |
|------|--------|-------|
| Admin Token Set | ⬜ | Must be 32+ char random string |
| Email Provider Configured | ⬜ | Pick SendGrid, Gmail, or SMTP |
| Database Schema Applied | ⬜ | Run init.sql on production DB |
| Free Entry Works | ⬜ | Test email confirmation |
| Admin Draw Works | ⬜ | Test with Bearer token |
| Winner Email Sends | ⬜ | Verify receipt and correct details |

---

## 🆘 Troubleshooting

### "Missing authorization token"
- Ensure `ADMIN_API_TOKEN` is set in Railway
- Verify your curl/code is sending: `Authorization: Bearer YOUR_TOKEN`

### "Invalid admin token"
- Double-check the token matches exactly (no typos)
- Regenerate token if unsure: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Emails not sending
- Check email provider API key is correct
- Verify email provider account is active (not suspended)
- Look at Railway logs for error messages
- If using Gmail: ensure app password was generated (not regular password)
- If using SMTP: test connection with `telnet smtp.host.com 587`

### Database schema error
- Ensure PostgreSQL is accessible from Railway
- Check `DATABASE_URL` format is correct
- Verify database user has permissions to create tables
- Check for SQL syntax errors in init.sql

### Railway not auto-deploying
- Verify Railway webhook is connected to GitHub repo
- Check Railway logs for deployment errors
- Manually trigger deploy via Railway dashboard

---

## 📞 Support & Documentation

- **PayPal Integration:** https://developer.paypal.com/docs
- **SendGrid Docs:** https://sendgrid.com/docs
- **Railway Docs:** https://docs.railway.app
- **Next.js Guide:** https://nextjs.org/docs
- **Environment Variables:** See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)

---

## 🎉 Launch Readiness

Your raffle system is ready to launch when:

1. ✅ All environment variables are configured
2. ✅ Database schema is deployed
3. ✅ Free entry test succeeds with email
4. ✅ Admin draw test succeeds with email
5. ✅ Logs show no errors
6. ✅ Public pages load without issues

**Estimated time to production:** 30-60 minutes from now

---

**Last Updated:** December 21, 2025  
**Version:** 1.0 - Complete with Admin Auth & Email System
