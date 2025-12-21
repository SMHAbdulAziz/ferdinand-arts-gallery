# Quick Start: Admin Auth & Email Setup

## 🚀 60-Second Setup

### Step 1: Generate Admin Token (30 seconds)

Run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

You'll get something like:
```
a3f7e2c9b1d4f8a6c5e2b9f1d4c7a9e2f5b8d1c4e7a9f2b5d8c1e4a7b9f2
```

**Copy this token - you'll need it next.**

### Step 2: Configure Email Provider (2 minutes)

**SendGrid (Recommended):**

1. Go to https://sendgrid.com/free
2. Click "Create Free Account"
3. Complete signup
4. Go to **Settings → API Keys**
5. Click "Create API Key"
6. Copy the key

**OR Gmail:**

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the generated password

### Step 3: Add to Railway (1 minute)

1. Go to https://railway.app/dashboard
2. Select your project
3. Click **Backend** service
4. Go to **Variables** tab
5. Add these variables:

```
ADMIN_API_TOKEN = your_token_from_step_1
SENDGRID_API_KEY = your_sendgrid_key_from_step_2
EMAIL_FROM = noreply@thefundgallery.org
```

**Or if using Gmail instead of SendGrid:**

```
ADMIN_API_TOKEN = your_token_from_step_1
GMAIL_EMAIL = your_email@gmail.com
GMAIL_PASSWORD = your_app_password_from_step_2
EMAIL_FROM = your_email@gmail.com
```

6. Click **Deploy** (or wait 30 seconds for auto-deploy)

### Step 4: Test It Works (30 seconds)

Test the admin endpoint:

```bash
curl -X POST https://your-domain.com/api/raffle/draw \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"raffleId":"test"}'
```

Should return either:
- ✅ `{"error": "Raffle not found"}` - Auth works!
- ❌ `{"error": "Missing authorization token"}` - Token not configured
- ❌ `{"error": "Invalid admin token"}` - Token doesn't match

---

## ✅ You're Done!

Your system now has:
- ✅ Admin authentication protecting the draw endpoint
- ✅ Email notifications for winners and free entries
- ✅ Multi-provider email support

### Next: Deploy the Database Schema

The last step is updating your PostgreSQL with the new schema. See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md#task-3-deploy-database-schema-required) for detailed instructions.

---

## 📝 What Each Variable Does

| Variable | Purpose | Example |
|----------|---------|---------|
| `ADMIN_API_TOKEN` | Secret token for running raffle draws | `a3f7e2c9b1d4...` |
| `SENDGRID_API_KEY` | Email service API key (SendGrid) | `SG.xxxxxxxxxxxx` |
| `GMAIL_EMAIL` | Gmail address (Gmail option) | `name@gmail.com` |
| `GMAIL_PASSWORD` | Gmail app password (Gmail option) | `abcd efgh ijkl mnop` |
| `EMAIL_FROM` | "From" email address for all emails | `noreply@thefundgallery.org` |

---

## 🔒 Keep Your Token Secret

Your `ADMIN_API_TOKEN` is like a password. **Never:**
- Commit it to Git
- Share it in emails or chat
- Put it in client-side code
- Hardcode it anywhere

**Do:**
- Keep it in Railway environment variables
- Only give to authorized admins
- Rotate it periodically

---

## 📞 Need Help?

### "Missing authorization token"
→ Check that `ADMIN_API_TOKEN` is in Railway environment

### "Invalid admin token"  
→ Ensure the token in your curl matches exactly

### Email not working
→ Check email provider API key is correct and active

### Can't find API key
→ See detailed setup in [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)

---

**That's it! Your raffle admin system is live.**

Go to the next step: [Database Schema Deployment](ENV_SETUP_GUIDE.md#task-3-deploy-database-schema-required)
