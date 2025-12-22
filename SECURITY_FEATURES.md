# Remember Me & reCAPTCHA Setup Guide

## Overview

Four key features have been implemented:

1. **Remember Me on This Device** - Persistent login with secure cookies
2. **Google reCAPTCHA v3** - Human verification to prevent bot attacks
3. **International Phone Validation** - Accurate phone number validation for all countries
4. **User Profile Management** - Keep contact and address information up-to-date

---

## 1. Remember Me Feature

### How It Works

- User checks "Remember me on this device" during login
- A secure 64-character token is generated and stored in the database
- An HTTP-only secure cookie is set (30-day expiration)
- On next visit, if cookie is valid, user is auto-logged in
- Token is cleared from database when user logs out

### Database Setup

The `users` table needs two new columns:

```sql
ALTER TABLE users ADD COLUMN remember_token VARCHAR(255);
ALTER TABLE users ADD COLUMN remember_token_expires TIMESTAMP;
```

### API Endpoints

**POST /api/auth/login**
- Now accepts `rememberMe` boolean in request body
- Returns `rememberMe` flag in response
- Sets HTTP-only cookie if remember-me is enabled

**POST /api/auth/remember-me**
- Verifies remember-me cookie and returns new JWT
- Used automatically on app startup

**POST /api/auth/logout**
- Clears remember-me token from database
- Deletes remember-me cookie

### Frontend Features

**Login Form**
```
☐ Remember me on this device
```

Checkbox automatically handles:
- Collecting user preference
- Passing to login endpoint
- Setting auth state with role

---

## 2. Google reCAPTCHA v3 Setup

### Prerequisites

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Click "Create" or "+" button

### Configuration Steps

**Create New Site:**

1. **Label**: "THE FUND Gallery" (or your site name)
2. **reCAPTCHA Type**: Select **reCAPTCHA v3**
3. **Domains**: Add your domain(s):
   - `localhost` (for local development)
   - `thefundgallery.org` (production)
   - `*.railway.app` (if using Railway)
4. **Accept reCAPTCHA Terms**: Check the box
5. **Click Create**

### Get Your Keys

After creating, you'll see:
- **Site Key** (public, share freely)
- **Secret Key** (keep private, never commit)

### Add Environment Variables

**Local (.env.local file):**
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_SITE_KEY_HERE
RECAPTCHA_SECRET_KEY=YOUR_SECRET_KEY_HERE
```

**Railway Environment Variables:**

1. Go to your Railway project
2. Click "Variables" tab
3. Add both variables:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = Your site key
   - `RECAPTCHA_SECRET_KEY` = Your secret key

⚠️ **Important**: The `NEXT_PUBLIC_` prefix makes the site key visible to the browser (this is normal and expected for reCAPTCHA v3). The secret key must NEVER be exposed.

### How It Works

**Client Side (Invisible):**
- reCAPTCHA script is loaded in `_app.tsx`
- On form submission, a token is generated
- Token is sent to backend with login/signup request
- User doesn't see any popup (v3 is invisible)

**Server Side (Verification):**
- Backend verifies token with Google servers
- Returns a **score** between 0.0 and 1.0:
  - `1.0` = Very likely legitimate user
  - `0.0` = Very likely bot
- Threshold: `0.5` (adjustable in code)
- Requests below threshold are rejected

### Scoring System

Edit the threshold in `/frontend/utils/recaptchaServer.js`:

```javascript
const threshold = 0.5; // Adjust based on your needs
// 0.9 = Very strict (may reject legitimate users)
// 0.5 = Balanced (default)
// 0.2 = Lenient (may allow bots)
```

**Recommended values:**
- **High security**: 0.8-0.9
- **Balanced**: 0.5-0.7
- **Low friction**: 0.3-0.5

### Testing reCAPTCHA

In the [Admin Console](https://www.google.com/recaptcha/admin), you can:
- View analytics and traffic
- See score distribution
- Monitor bot attempts
- Generate test tokens for development

---

## Database Schema

```sql
-- Existing columns
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  role VARCHAR DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- NEW: Remember Me Support
  remember_token VARCHAR(255),
  remember_token_expires TIMESTAMP,
  
  -- Existing
  preferences JSONB,
  address JSONB
);

-- Index for faster remember-me lookups
CREATE INDEX idx_users_remember_token ON users(remember_token);
```

---

## Security Best Practices

### Remember Me

✅ **What's Protected:**
- Token is stored as plain string (you should hash it in production)
- Cookie is HTTP-only (can't be accessed by JavaScript)
- Cookie is Secure flag (only sent over HTTPS)
- SameSite=Strict (prevents CSRF attacks)
- 30-day expiration

🔒 **Production Improvement:**
```javascript
// Hash the remember token before storing
const rememberTokenHash = hashPassword(rememberToken);
await query(
  'UPDATE users SET remember_token = $1 WHERE id = $2',
  [rememberTokenHash, userId]
);
```

### reCAPTCHA v3

✅ **What's Protected:**
- Prevents automated signup/login attempts
- Bot score-based filtering
- Invisible to users (no friction)
- Server-side verification required

⚠️ **Limitations:**
- Score is indicative, not guaranteed
- Won't stop determined attackers
- Should be combined with rate limiting
- Monitor admin console for trends

**Next Steps for Hardening:**
1. Implement rate limiting on login endpoint
2. Add account lockout after N failed attempts
3. Implement IP-based blocking for suspicious activity
4. Add email verification for new accounts

---

## Testing

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000/login`

**Test Cases:**
1. Login without remember-me → token NOT stored
2. Login with remember-me → cookie set, 30-day expiration
3. Refresh page → auto-login without form submission
4. Logout → cookie cleared, token deleted from DB
5. Try accessing admin without auth → redirected to login

### Testing reCAPTCHA

In your Google reCAPTCHA Admin Console:
- Generate test tokens for development
- Monitor requests in real-time
- Check analytics dashboard

---

## Troubleshooting

### Remember Me Not Working

**Issue**: User logs in, but not remembered on refresh

**Solutions:**
1. Check if `remember_token` and `remember_token_expires` columns exist
2. Verify cookie is being set (check browser DevTools > Application > Cookies)
3. Check if `credentials: 'include'` is in fetch calls
4. Verify token hasn't expired

### reCAPTCHA Errors

**Issue**: "reCAPTCHA not loaded" or verification fails

**Solutions:**
1. Verify environment variables are set correctly
2. Check that site key matches in Google Admin Console
3. Ensure domain is added to allowed domains
4. Check browser console for JavaScript errors
5. Verify secret key is correct on backend

**Common Errors:**
- `ERR_RECAPTCHA_INVALID_SITE_KEY` → Wrong site key in env vars
- `Invalid site key` → Domain not added to Google Console
- `Invalid request signature` → Wrong secret key

### Cookie Not Set

**Issue**: HTTP-only cookie not appearing in browser

**Solutions:**
1. Check if `SameSite=Strict` is compatible with your setup
2. Ensure requests use `credentials: 'include'`
3. Verify HTTPS is being used (required for Secure flag)
4. Check server response headers for `Set-Cookie`

---

## Monitoring

### Recommended Metrics to Track

1. **Remember Me Usage:**
   - % of users checking remember-me
   - Average cookie lifespan
   - Auto-login conversion rate

2. **reCAPTCHA Scores:**
   - Average score distribution
   - % of requests rejected
   - Spam/bot patterns

### Queries to Monitor

```sql
-- Check active remember-me tokens
SELECT COUNT(*) as active_tokens 
FROM users 
WHERE remember_token IS NOT NULL 
AND remember_token_expires > NOW();

-- Check for suspicious login patterns
SELECT email, COUNT(*) as failed_attempts 
FROM auth_logs 
WHERE result = 'failed' 
GROUP BY email 
HAVING COUNT(*) > 5;
```

---

## 3. International Phone Number Validation

### Overview

Phone numbers are validated using `libphonenumber-js`, which is Google's international phone number library ported to JavaScript. This ensures accurate validation across all countries without artificial digit restrictions.

### How It Works

**Client Side:**
- Real-time validation as user types
- Shows error message if number is invalid for selected country
- Submit button disabled until phone is valid
- User can change country code and validation updates automatically

**Server Side:**
- Parses phone number with selected country code using libphonenumber-js
- Validates against international phone standards
- Stores formatted international number (e.g., "+1 (555) 123-4567")
- Returns descriptive error if number is invalid

### Supported Countries

The signup form includes 20+ countries with proper validation:

- 🇺🇸 United States (+1) - 10 digits
- 🇬🇧 United Kingdom (+44) - 10-11 digits
- 🇮🇳 India (+91) - 10 digits
- 🇨🇳 China (+86) - 11 digits
- 🇯🇵 Japan (+81) - 10 digits
- 🇫🇷 France (+33) - 9 digits
- 🇩🇪 Germany (+49) - 10-11 digits
- 🇮🇹 Italy (+39) - 10 digits
- 🇪🇸 Spain (+34) - 9 digits
- 🇳🇱 Netherlands (+31) - 9 digits
- 🇸🇪 Sweden (+46) - 9 digits
- 🇳🇴 Norway (+47) - 8 digits
- 🇨🇭 Switzerland (+41) - 9 digits
- 🇦🇹 Austria (+43) - 10 digits
- 🇦🇺 Australia (+61) - 9 digits
- 🇳🇿 New Zealand (+64) - 9-10 digits
- 🇧🇧 Barbados (+1-246) - 10 digits
- 🇧🇸 Bahamas (+1-242) - 10 digits
- 🇧🇲 Bermuda (+1-441) - 10 digits
- 🇯🇲 Jamaica (+1-876) - 10 digits

### Adding More Countries

Edit [signup.js](gallery-website/frontend/pages/signup.js) to add more country options in the dropdown:

```jsx
<option value="+55">🇧🇷 +55</option>  {/* Brazil */}
<option value="+1-52">🇲🇽 +1-52</option>  {/* Mexico */}
<option value="+27">🇿🇦 +27</option>  {/* South Africa */}
```

The validation will automatically work for any valid country code recognized by libphonenumber-js.

### Validation Rules

Each country has different phone number requirements:

| Country | Code | Typical Length | Format |
|---------|------|---|---------|
| US/Canada | +1 | 10 | (555) 123-4567 |
| UK | +44 | 10-11 | 20 7946 0958 |
| France | +33 | 9 | 1 42 68 53 00 |
| Germany | +49 | 10-11 | 30 12345678 |
| India | +91 | 10 | 9876543210 |
| China | +86 | 11 | 10 1234 5678 |

The library handles all these variations automatically based on the selected country code.

### Troubleshooting Phone Validation

**Issue**: "Invalid phone number for this country"

**Solutions:**
1. Verify you selected the correct country from the dropdown
2. Check that the phone number is complete for your country
3. Try entering without special characters: `5551234567`
4. Ensure all required digits are included (varies by country)

**Issue**: Submit button is disabled even with a valid number

**Solution**: The button disables when:
- Phone validation error exists
- Form is being submitted (shows "Creating Account...")

Clear the error by:
1. Changing the country code to match your number
2. Re-entering the phone number
3. Pressing backspace and adding digits back

---

## 4. User Profile Management

### Overview

Users can manage and update their personal information at any time through the profile page. This ensures contact details and mailing address are always current for raffle win notifications and prize shipments.

### Accessing the Profile Page

**From the Dashboard:**
1. Log in to your account
2. Click "My Profile" button in the top right
3. Or navigate to `/profile`

### What Can Be Updated

**Personal Information:**
- First Name
- Last Name
- Email (read-only - cannot be changed)

**Contact Information:**
- Phone Number (with country code)
- Validated using libphonenumber-js for accuracy

**Mailing Address:**
- Street Address
- City
- State / Province
- ZIP / Postal Code
- Country

### How It Works

**Client Side:**
- Form loads with current information from user profile
- Phone validation occurs in real-time as user types
- Submit button disabled until phone is valid (if provided)
- Success message shown after profile is updated
- Address stored as structured JSONB object

**Server Side:**
- PUT `/api/profile` endpoint validates all data
- Phone number validated against international standards
- Address stored with all fields structured for easy querying
- Returns updated user object with all changes
- Requires valid JWT token (user must be logged in)

### Data Storage

Address is stored as JSONB in the database:

```json
{
  "street": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "United States"
}
```

This structure allows:
- Easy filtering/sorting by location
- Integration with shipping services
- Accurate win notifications

### Phone Validation

Same validation as signup form:
- Real-time feedback as user types
- Shows error if number is invalid for selected country
- Supports 20+ countries with proper digit requirements
- Stores formatted international number (e.g., "+1 (555) 123-4567")

### Why This Matters

**For Winners:**
- We can contact winners about their prize immediately
- Ensures we have correct mailing address for shipment
- No delays due to outdated contact information

**For Purchasers:**
- Order updates can be sent to correct phone number
- Purchases shipped to confirmed address
- Billing and shipping address match current information

**For Users:**
- Update info anytime without re-registering
- Easy to manage multiple addresses (update as needed)
- One-click access from dashboard

### Troubleshooting

**Issue**: "Cannot update profile" error

**Solutions:**
1. Ensure you're logged in (check for valid session)
2. Verify phone number is valid for selected country
3. Check internet connection
4. Try refreshing the page and logging in again

**Issue**: Changes don't appear after saving

**Solutions:**
1. Refresh page to see updated information
2. Verify save was successful (look for green success message)
3. Check browser DevTools for any error messages
4. Contact support if issue persists

---

- [Google reCAPTCHA v3 Docs](https://developers.google.com/recaptcha/docs/v3)
- [HTTP-only Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Security)
- [SameSite Cookie Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [libphonenumber-js Documentation](https://gitlab.com/catamphetamine/libphonenumber-js)

