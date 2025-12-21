# User Authentication & Dashboard System

## Overview

This document describes the complete user authentication and dashboard system implemented for THE FUND Gallery. Users can now sign up, log in, and access their raffle tickets and purchase history.

## Features

### Authentication
- **Sign Up**: Create new user accounts with email and password
- **Login**: Authenticate with email and password to receive JWT token
- **Token Management**: 7-day JWT tokens stored in localStorage
- **Automatic Session Recovery**: Stored tokens are verified on app load
- **Logout**: Clear session and redirect to home page

### User Dashboard
- **Profile Overview**: Display user name and email
- **Raffle Tickets Tab**: View all purchased and free raffle tickets
- **Purchase History Tab**: View transaction history with summary
- **Active Raffles**: See tickets for currently active raffles
- **Past Results**: View completed raffle results and outcomes

### Security
- **Password Hashing**: PBKDF2 with 1000 iterations and 64-byte salt
- **JWT Tokens**: Signed with environment variable JWT_SECRET
- **Protected Routes**: Dashboard and other protected pages redirect to login
- **Bearer Token Auth**: API endpoints validate tokens in Authorization header
- **Password Requirements**: Minimum 8 characters, uppercase, lowercase, and number

## File Structure

```
frontend/
├── context/
│   └── AuthContext.js          # Global auth state management
├── pages/
│   ├── login.js                # Login form page
│   ├── signup.js               # Sign up form page
│   ├── dashboard.js            # Protected user dashboard
│   └── api/
│       ├── auth/
│       │   ├── signup.js       # User registration endpoint
│       │   ├── login.js        # User login endpoint
│       │   └── me.js           # Get current user endpoint
│       └── user/
│           ├── tickets.js      # Get user's raffle tickets
│           └── history.js      # Get user's purchase history
├── components/
│   └── layout/
│       └── Header.tsx          # Updated with auth links
├── utils/
│   ├── auth.js                 # Auth utility functions
│   └── protectedRoute.js       # Route protection helpers
└── pages/
    └── _app.tsx                # Updated with AuthProvider
```

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGc..."
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGc..."
}
```

#### GET `/api/auth/me`
Get current authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "user",
  "emailVerified": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### User Data

#### GET `/api/user/tickets`
Get all raffle tickets for authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "tickets": [
    {
      "id": "uuid",
      "ticketNumber": 42,
      "purchaseDate": "2024-01-15T10:30:00Z",
      "entryMethod": "paid",
      "status": "active",
      "raffle": {
        "id": "uuid",
        "title": "Modern Art Collection Raffle",
        "status": "active",
        "ticketPrice": 50,
        "endDate": "2024-02-01T23:59:59Z",
        "ticketsSold": 250,
        "maxTickets": 500,
        "thresholdMet": true,
        "outcomeType": null,
        "artwork": {
          "title": "Abstract Dreams",
          "estimatedValue": 5000
        }
      }
    }
  ]
}
```

#### GET `/api/user/history`
Get user's transaction history and spending summary.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "summary": {
    "totalSpent": 250.00,
    "totalTickets": 5,
    "totalTransactions": 5
  },
  "transactions": [
    {
      "id": "uuid",
      "type": "ticket_purchase",
      "amount": 50.00,
      "currency": "USD",
      "status": "completed",
      "description": "Raffle Ticket Purchase",
      "createdAt": "2024-01-15T10:30:00Z",
      "raffle": {
        "id": "uuid",
        "title": "Modern Art Collection Raffle"
      }
    }
  ]
}
```

## Frontend Components

### AuthContext
Global state management for authentication.

**Usage:**
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, loading, login, signup, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <div>Welcome, {user.firstName}!</div>;
  }

  return (
    <button onClick={() => login('user@example.com', 'password')}>
      Login
    </button>
  );
}
```

### Protected Routes
Wrap components to require authentication.

**Usage:**
```jsx
import { withProtectedRoute } from '../utils/protectedRoute';

function DashboardPage() {
  return <div>Your dashboard</div>;
}

export default withProtectedRoute(DashboardPage);
```

### Navigation Updates
The Header component now displays:
- User avatar with name when logged in
- Dropdown menu with Dashboard and Logout options
- Login and Sign Up links when not authenticated
- "Support Artists" button remains visible for authenticated users

## Environment Variables

Add these to your Railway environment:

```
JWT_SECRET=your-secure-random-string-minimum-32-characters
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Schema

The users table is already created with:
- `id` (UUID primary key)
- `email` (unique)
- `password_hash` (PBKDF2)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `phone` (VARCHAR)
- `address` (JSONB)
- `role` (VARCHAR)
- `email_verified` (BOOLEAN)
- `marketing_consent` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

The tickets table has been updated with:
- `user_id` (Foreign key to users table)

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

Example valid passwords:
- `SecurePass123`
- `MyRaffle2024!`
- `Art1stsSupport`

## Token Storage & Lifecycle

1. **Login**: Token received from API and stored in localStorage
2. **App Load**: Token retrieved from localStorage and verified via `/api/auth/me`
3. **API Requests**: Token sent in `Authorization: Bearer {token}` header
4. **Expiration**: Token expires after 7 days (must re-login)
5. **Logout**: Token cleared from localStorage

## Testing the System

### Local Testing
1. Start the development server: `npm run dev`
2. Navigate to `/signup` and create an account
3. Automatically redirected to `/dashboard` after signup
4. View your raffle tickets and purchase history
5. Log out and verify redirect to home page
6. Log back in via `/login`

### Endpoints to Test
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Get current user (replace TOKEN with actual token)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get user tickets
curl http://localhost:3000/api/user/tickets \
  -H "Authorization: Bearer TOKEN"

# Get user history
curl http://localhost:3000/api/user/history \
  -H "Authorization: Bearer TOKEN"
```

## Next Steps

1. **Payment Integration**: Update payment endpoints to associate tickets with authenticated users
2. **Email Verification**: Implement email confirmation on signup
3. **Password Reset**: Add forgot password functionality
4. **Profile Editing**: Allow users to update their profile information
5. **Analytics**: Track user engagement and raffle participation

## Security Considerations

- ✅ Passwords hashed with PBKDF2 (not stored in plain text)
- ✅ JWT tokens signed with secret environment variable
- ✅ Bearer token validation on all protected endpoints
- ✅ CORS configuration in place (if needed)
- ⚠️ TODO: Implement CSRF protection for state-changing operations
- ⚠️ TODO: Add rate limiting to auth endpoints
- ⚠️ TODO: Implement email verification flow

## Troubleshooting

### "Missing authentication token"
- Ensure you're sending token in `Authorization: Bearer {token}` header
- Check that token hasn't expired (refresh by logging in again)

### "Invalid email" error
- Verify email format is correct (user@example.com)
- Check for typos

### "Password does not meet requirements"
- Password must be 8+ characters
- Must contain uppercase, lowercase, and number
- Example: `SecurePass123`

### Dashboard shows "Loading..."
- Check browser console for errors
- Verify `/api/auth/me` endpoint is working (test with curl)
- Ensure JWT_SECRET is set on Railway

### "User not found" on login
- Verify account was created with correct email
- Check database: `SELECT email FROM users;`
- Try signing up again if account doesn't exist
