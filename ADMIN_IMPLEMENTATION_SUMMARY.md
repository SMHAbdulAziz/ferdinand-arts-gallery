# Admin Dashboard & Raffle Management Implementation

## Overview
Comprehensive admin functionality has been implemented for THE FUND Gallery platform, enabling administrators to manage raffles, tickets, users, and artworks.

## Key Features Implemented

### 1. **Authentication & Security**
- ✅ Added `withAdminAuth` middleware for protecting admin-only endpoints
- ✅ Token-based authentication using `Authorization: Bearer <token>` header
- ✅ Configured `ADMIN_API_TOKEN` environment variable for admin access
- ✅ Admin token validation in `.env.local` and `.env.example`

**Files Modified:**
- `/frontend/middleware/adminAuth.js` - Converted to CommonJS for compatibility
- `/frontend/.env.local` - Added `ADMIN_API_TOKEN`
- `/frontend/.env.example` - Added documentation for `ADMIN_API_TOKEN`

### 2. **Admin Raffle Management**
- ✅ Create new raffles with full configuration
- ✅ Edit existing raffles
- ✅ Change raffle status (scheduled, active, completed, cancelled)
- ✅ Delete raffles
- ✅ View all raffles with pagination support

**Features:**
- Title, description, ticket pricing
- Max tickets and minimum threshold configuration
- Start/end dates with datetime picker
- Artwork linking
- Cash prize percentage settings (for threshold-not-met scenario)
- Real-time status indicators and color coding

**Files Modified:**
- `/frontend/pages/admin/raffles.tsx` - Updated to include auth tokens in all API calls
- `/frontend/pages/api/admin/raffles.js` - Added `withAdminAuth` middleware
- `/frontend/pages/api/admin/raffles/[id].js` - Added `withAdminAuth` middleware

### 3. **Admin Tickets Management** 
**New Page: `/admin/tickets`**
- View all raffle tickets
- Filter by status (active, refunded, cancelled)
- See purchase details and user information
- Track revenue from ticket sales

**Files Created:**
- `/frontend/pages/admin/tickets.tsx` - Ticket listing and filtering
- `/frontend/pages/api/admin/tickets.js` - API endpoint for tickets

### 4. **Admin Users Management**
**New Page: `/admin/users`**
- View all platform users
- Filter by role (admin, user)
- See email verification status
- Track user registration dates
- Monitor user activity

**Files Created:**
- `/frontend/pages/admin/users.tsx` - User listing and filtering
- `/frontend/pages/api/admin/users.js` - API endpoint for users

### 5. **Admin Artworks Management**
**New Page: `/admin/artworks/new`**
- Add new artworks to the platform
- Fill in artwork details:
  - Title, artist, medium
  - Dimensions and creation date
  - Estimated value
  - Series and limited edition info
  - Description

**Features:**
- Artist attribution
- Detailed metadata storage
- Status management (available, in_raffle, sold, reserved)
- Seamless integration with raffle system

**Files Created:**
- `/frontend/pages/admin/artworks/new.tsx` - New artwork form
- `/frontend/pages/api/admin/artworks.js` - API endpoint for artworks

### 6. **Admin Dashboard Navigation**
**Updated Page: `/admin`**
- Quick action buttons for creating raffles and artworks
- Links to manage raffles, tickets, and users
- Dashboard stats and Ferdinand's Fund progress tracker
- Recent ticket purchases overview

**Files Modified:**
- `/frontend/pages/admin/index.tsx` - Navigation updated to include new features

### 7. **URL Redirects**
**New Page: `/admin/raffles/new`**
- Smart redirect to `/admin/raffles` with new form displayed
- Maintains consistent user experience

**Files Created:**
- `/frontend/pages/admin/raffles/new.tsx` - Redirect logic

## Authentication Flow

### Backend Protection
1. Frontend includes `Authorization: Bearer {token}` header in all admin API requests
2. Middleware validates token against `ADMIN_API_TOKEN` environment variable
3. Invalid/missing tokens return 401/403 errors
4. Token validation happens before any database operations

### Frontend Integration
All admin pages:
1. Retrieve auth token from `localStorage.getItem('authToken')`
2. Include in Authorization header for all API calls
3. Handle 401/403 responses gracefully
4. Redirect to login on authentication failure

## Database Schema Integration

### Tables Used
- **raffles** - Raffle configuration and status
- **tickets** - Individual ticket records
- **users** - User accounts and roles
- **artworks** - Artwork metadata and details

### Key Indexes for Performance
- `idx_raffles_status` - Fast raffle filtering
- `idx_raffles_dates` - Efficient date range queries
- `idx_tickets_raffle_id` - Quick ticket lookups

## Environment Configuration

### Required Variables
```env
# Admin API Authentication
ADMIN_API_TOKEN="your_secure_admin_api_token_here"

# Database Connection
DATABASE_URL="postgresql://user:password@host:5432/database"

# Node Environment
NODE_ENV="production"  # or "development"
```

### Development Setup
```env
ADMIN_API_TOKEN="dev_admin_token_for_local_testing_change_in_production"
DATABASE_URL="postgresql://ferdinand_admin:dev_password@localhost:5432/ferdinand_arts"
```

## Security Best Practices Implemented

1. **Token-Based Auth** - Stateless, scalable authentication
2. **Middleware Protection** - Auth check happens before handler execution
3. **Error Messages** - Generic error responses to prevent token enumeration
4. **Environment Variables** - Sensitive data never hardcoded
5. **Optional DB Sessions** - Extensible for more complex auth scenarios

## Future Enhancement Opportunities

1. **Role-Based Access Control** - Different permissions for different admin types
2. **Admin Activity Logging** - Audit trail of admin actions
3. **JWT Tokens** - More sophisticated token management with expiration
4. **Session Management** - Persistent admin sessions with database storage
5. **Bulk Operations** - Batch import/export for raffles, users, artworks
6. **Analytics Dashboard** - More detailed stats and revenue tracking
7. **Email Notifications** - Trigger automated emails on raffle events
8. **API Documentation** - OpenAPI/Swagger documentation for admin APIs

## Testing Checklist

- [ ] Admin login and token retrieval
- [ ] Create raffle with all fields
- [ ] Edit existing raffle
- [ ] Change raffle status
- [ ] Delete raffle (with confirmation)
- [ ] View tickets with filtering
- [ ] View users with filtering
- [ ] Add new artwork with full details
- [ ] Verify 401/403 errors with invalid tokens
- [ ] Test in both development and production

## Deployment Notes

1. Generate a strong `ADMIN_API_TOKEN` for production
2. Store in Railway environment variables
3. Ensure `DATABASE_URL` is correctly configured
4. Test admin endpoints before going live
5. Consider setting up admin user accounts in the database
6. Monitor logs for authentication errors
