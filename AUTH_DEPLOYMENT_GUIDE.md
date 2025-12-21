# Deployment & Testing Guide for Authentication System

## ✅ Completed in This Phase

### Authentication System
- ✅ User registration (signup endpoint)
- ✅ User login (login endpoint with JWT)
- ✅ Session management (7-day JWT tokens)
- ✅ Secure password hashing (PBKDF2)
- ✅ React Context for auth state management
- ✅ Protected routes and route guards
- ✅ Logout functionality

### Frontend Pages
- ✅ `/login` - User login form page
- ✅ `/signup` - User registration form page
- ✅ `/dashboard` - Protected user dashboard with:
  - User profile overview
  - Raffle tickets tab (active/completed)
  - Purchase history tab with spending summary
  - Transaction details table

### API Endpoints
- ✅ `POST /api/auth/signup` - User registration
- ✅ `POST /api/auth/login` - User authentication
- ✅ `GET /api/auth/me` - Current user info
- ✅ `GET /api/user/tickets` - User's raffle tickets
- ✅ `GET /api/user/history` - Purchase history

### UI/UX Enhancements
- ✅ Updated Header component with auth links
- ✅ User dropdown menu with Dashboard and Logout
- ✅ Login/Sign up links in navigation when not authenticated
- ✅ User avatar display when authenticated
- ✅ Toast notifications for all auth operations

### Documentation
- ✅ AUTHENTICATION_GUIDE.md - Complete auth system documentation
- ✅ API endpoint specifications
- ✅ Frontend component usage examples
- ✅ Environment variable setup guide

---

## 🚀 Deployment Steps

### Step 1: Verify Local Build
```bash
cd frontend
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
```

### Step 2: Add Environment Variables to Railway

Navigate to your Railway project settings and add:

```
JWT_SECRET=<generate-secure-random-string>
```

**To generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example value (32+ characters):
```
a3f8e2c1d9b4f7e6a1c3d5b8f9e2a4c6
```

### Step 3: Monitor Deployment

1. Go to Railway dashboard
2. Select your service
3. Click "Deployments" tab
4. Monitor the build progress
5. Check "Logs" tab for any errors

**Common Issues:**
- `Module not found: jsonwebtoken` → JWT_SECRET not set
- `Cannot connect to database` → DATABASE_URL not configured
- `Port 3000 already in use` → Check process running on port 3000

### Step 4: Test in Production

Once deployed, test these endpoints:

```bash
# Test signup (replace YOUR_URL with your Railway URL)
curl -X POST https://YOUR_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Test login
curl -X POST https://YOUR_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Test dashboard access
# 1. Open browser and go to https://YOUR_URL/login
# 2. Enter test credentials
# 3. Verify redirect to dashboard
# 4. Check tickets and history tabs load correctly
```

---

## 📋 Pre-Deployment Checklist

- [ ] All authentication files committed to GitHub
- [ ] npm install completed locally (package-lock.json updated)
- [ ] No console errors in local dev (`npm run dev`)
- [ ] Local build completes without errors (`npm run build`)
- [ ] JWT_SECRET generated and ready to add to Railway
- [ ] DATABASE_URL already configured on Railway
- [ ] Email configuration already in place (SMTP credentials)
- [ ] README.md and DEPLOYMENT_GUIDE.md updated with auth info
- [ ] Team informed about new auth system

---

## 🔐 Security Verification Checklist

- [ ] Password hashing uses PBKDF2 (not plain text)
- [ ] JWT tokens expire after 7 days
- [ ] Protected API endpoints validate Bearer tokens
- [ ] No sensitive data in localStorage except auth token
- [ ] CORS headers properly configured
- [ ] Database password fields are hashed
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] No hardcoded secrets in code
- [ ] API endpoints reject requests without valid tokens

---

## 📊 Post-Deployment Testing

### Test Signup Flow
1. Navigate to `/signup`
2. Fill in form with:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: SecurePass123
3. Click "Sign Up"
4. Should be automatically logged in and redirected to `/dashboard`
5. Verify user profile displays at top of dashboard

### Test Login Flow
1. Click "Logout" button on dashboard
2. Navigate to `/login`
3. Enter email: john@example.com
4. Enter password: SecurePass123
5. Click "Login"
6. Should be redirected to `/dashboard`
7. Verify user profile displays

### Test Protected Routes
1. Open new browser tab
2. Navigate directly to `/dashboard`
3. Should be redirected to `/login` (not authenticated)
4. Login again
5. Should be able to access `/dashboard`

### Test Data Display
1. On dashboard, check "My Raffle Tickets" tab
2. Verify any purchased tickets appear
3. Check "Purchase History" tab
4. Verify transactions and spending summary display
5. If no tickets yet, that's OK (feature is working)

### Test Navigation
1. On any page, verify Header shows correct auth state
2. If logged in: User name, avatar, and dropdown visible
3. If logged out: Login and Sign Up links visible
4. Click user dropdown, verify Dashboard and Logout options

### Test Error Handling
1. Try signup with existing email → Should show error
2. Try login with wrong password → Should show error
3. Try accessing API without token → Should get 401 error
4. Try accessing with expired token → Should get 401 error

---

## 🔄 Continuous Integration Check

Monitor Railway deployment logs for:

```
✓ Build completed successfully
✓ Deployment successful
✓ Health check passed
✓ Service is running
```

If you see errors like:
```
Cannot find module 'jsonwebtoken'
```

This means package-lock.json is out of sync. Solution:
```bash
npm install  # Locally
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main
# Trigger Railway rebuild
```

---

## 📞 Support & Troubleshooting

### Issue: "Login doesn't work in production"
**Solution:**
1. Check JWT_SECRET is set: Railway → Settings → Environment variables
2. Check DATABASE_URL is valid
3. Check logs: Railway → Logs
4. Verify email/password used for signup

### Issue: "Dashboard shows loading forever"
**Solution:**
1. Check browser console (F12) for errors
2. Check API endpoints are responding: `/api/auth/me`
3. Verify JWT_SECRET set on Railway
4. Check database connectivity

### Issue: "Database error on signup"
**Solution:**
1. Verify `users` table exists: `SELECT * FROM users LIMIT 1;`
2. Check database connection string (DATABASE_URL)
3. Run migrations if needed: `npm run migrate`
4. Check logs for detailed error

### Issue: "CORS error when calling API"
**Solution:**
1. Check that API routes are in `/frontend/pages/api/`
2. Verify environment variables are set
3. Check CORS headers in middleware
4. Test with curl to isolate issue

### Issue: "Can't find /dashboard or /login pages"
**Solution:**
1. Verify files exist:
   - `/frontend/pages/dashboard.js`
   - `/frontend/pages/login.js`
   - `/frontend/pages/signup.js`
2. Rebuild: `npm run build`
3. Check for TypeScript errors: `npm run type-check`

---

## 🎯 Next Phase Items

After successful deployment:

1. **Payment Integration**
   - Link raffle purchases to authenticated users
   - Update `/api/raffle/purchase.js` to require auth token
   - Store `user_id` with each ticket purchase

2. **Email Verification**
   - Send confirmation email on signup
   - Add email_verified workflow
   - Restrict features until verified

3. **Password Reset**
   - Create `/forgot-password` page
   - Add `/api/auth/reset-password` endpoint
   - Send reset email with token

4. **User Profile**
   - Add profile editing page
   - Allow users to update name, phone, address
   - Add preferences and settings

5. **Admin Dashboard**
   - Viewing all users
   - Managing raffles and tickets
   - Viewing analytics and reports

6. **Advanced Features**
   - Raffle notifications
   - Email on raffle results
   - Ticket sharing functionality
   - Referral system

---

## 📝 Rollback Instructions

If something goes wrong in production:

1. **Quick Rollback:**
   ```bash
   git revert 813c32da  # Revert auth commit
   git push origin main
   # Railway will auto-redeploy
   ```

2. **Manual Rollback:**
   - Go to Railway dashboard
   - Click "Deployments"
   - Select previous working deployment
   - Click "Redeploy"

3. **Database Rollback:**
   - Auth system doesn't require schema changes
   - User data will remain in database
   - Just delete JWT_SECRET from env vars if needed

---

## ✅ Deployment Sign-Off Checklist

- [ ] All tests passing locally
- [ ] GitHub commits pushed successfully
- [ ] Railway build completed without errors
- [ ] JWT_SECRET environment variable set
- [ ] Login page accessible and working
- [ ] Signup page accessible and working
- [ ] Dashboard accessible when authenticated
- [ ] Dashboard redirects to login when not authenticated
- [ ] Header shows correct auth state
- [ ] API endpoints responding correctly
- [ ] No console errors in browser
- [ ] Email system still working (verified from previous phase)
- [ ] Database still accessible and healthy
- [ ] Team notifications sent about new auth features

---

## 🎉 Success Criteria

The authentication system is successfully deployed when:

✅ Users can sign up with email/password  
✅ Users can log in and receive JWT token  
✅ Users can view their dashboard with tickets  
✅ Users can log out and are redirected  
✅ Unauthenticated users cannot access protected pages  
✅ All API endpoints validate authentication  
✅ No console errors in browser or server logs  
✅ Performance metrics are normal (no slowdowns)  
✅ Email system continues to work for notifications  

---

## 📞 Questions or Issues?

Reference these documents:
- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Complete auth system docs
- [DEPLOYMENT_GUIDE.md](./gallery-website/DEPLOYMENT_GUIDE.md) - General deployment guide
- [railway.json](./gallery-website/railway.json) - Railway configuration
