# Admin Panel Quick Start Guide

## Getting Started

### 1. Admin Login
1. Navigate to `https://www.thefundgallery.org/login`
2. Sign in with your admin account credentials
3. You'll be redirected to the admin dashboard at `/admin`

### 2. Admin Dashboard (`/admin`)
The main hub for all admin operations showing:
- **Stats Cards**: Active raffles, tickets sold, total revenue, Ferdinand's fund progress
- **Ferdinand's Education Fund**: Visual progress bar toward the $269,000 goal
- **Recent Ticket Purchases**: Last 3 transactions
- **Quick Actions**: Buttons for common tasks

## Managing Raffles

### Create a Raffle
1. Click **"+ New Raffle"** button on `/admin/raffles`
2. Fill in the form:
   - **Title**: Raffle name (e.g., "Playful Giraffe")
   - **Ticket Price**: Cost per ticket in dollars
   - **Max Tickets**: Total tickets available
   - **Minimum Threshold**: Tickets needed to award artwork
   - **Start Date**: When raffle goes live
   - **End Date**: When raffle closes
   - **Artwork ID**: Link to artwork (optional)
   - **Cash Prize %**: Percent winner gets if threshold not met
3. Click **"Create Raffle"**

### Edit a Raffle
1. Go to `/admin/raffles`
2. Find the raffle in the list
3. Click **"Edit"**
4. Modify any fields
5. Click **"Update Raffle"**

### Change Raffle Status
From the raffle list, use the status buttons:
- **Activate**: Make raffle active (before start date)
- **Edit**: Modify raffle details
- **Delete**: Remove raffle (with confirmation)

Status flow:
- `scheduled` → `active` → `completed`
- Can also mark as `cancelled` if needed

## Managing Tickets

### View All Tickets (`/admin/tickets`)
- Lists all raffle tickets purchased
- Shows: Ticket number, buyer email, raffle name, purchase date, status

### Filter Tickets
- **By Status**: Active, Refunded, or Cancelled
- Multiple filters can be combined

### Ticket Details
Each ticket shows:
- Unique ticket number
- User who purchased
- Which raffle they entered
- When it was purchased
- Current status

## Managing Users

### View All Users (`/admin/users`)
- Complete list of platform users
- See: Name, email, role, verification status, join date

### Filter Users
- **By Role**: Admin or Regular User
- Helps identify administrators vs. participants

### User Verification Status
- **Verified**: Email confirmed and account active
- **Pending**: Email verification still needed

## Managing Artworks

### Add New Artwork (`/admin/artworks/new`)
1. Click **"Add New Artwork"** on dashboard
2. Fill in artwork details:
   - **Title** *Required: Artwork name
   - **Artist**: Creator's name
   - **Medium**: Material/technique (e.g., "Oil on Canvas")
   - **Dimensions**: Size (e.g., "24 x 36 inches")
   - **Creation Date**: When artwork was created
   - **Estimated Value**: Dollar amount
   - **Series Info**: Part of a series?
   - **Limited Edition**: Edition information
   - **Description**: Full artwork description
3. Click **"Create Artwork"**

### Artwork Status
Artworks can be in one of these states:
- `available` - Available for raffle
- `in_raffle` - Currently part of an active raffle
- `sold` - Sold (raffle winner awarded)
- `reserved` - Reserved for future raffle

## Key Features

### Real-Time Updates
- Data refreshes automatically when you make changes
- No need to manually refresh the page

### Input Validation
- Required fields are marked with *
- Form won't submit if required fields are empty
- Invalid values show error messages

### Confirmations
- Deleting items requires confirmation
- Success/error alerts appear after operations

### Date & Time Handling
- Use the datetime picker for accurate date/time
- Dates are stored in UTC and displayed in your timezone

## Common Tasks

### Task: Launch a Raffle Campaign
1. Create artwork (if new): `/admin/artworks/new`
2. Create raffle: `/admin/raffles` → "New Raffle"
3. Set status to "active" when ready
4. Monitor tickets and revenue

### Task: Check Campaign Performance
1. View tickets: `/admin/tickets`
2. Check dashboard stats
3. Monitor Ferdinand's Fund progress
4. View recent purchases

### Task: Manage User Access
1. View all users: `/admin/users`
2. Filter by role to find admins
3. Verify email status for new signups

### Task: Respond to Issues
1. Check recent tickets for problem transactions
2. Note ticket IDs and user emails
3. Use email to contact users if needed

## Troubleshooting

### "Failed to create raffle"
- Check that all required fields are filled
- Ensure max_tickets ≥ minimum_threshold_tickets
- Verify end_date is after start_date
- Check database connection in logs

### "Missing authorization token"
- Make sure you're logged in
- Token expires - try logging out and in again
- Clear browser cache and try again

### Changes not appearing
- Refresh the page manually (F5 or Cmd+R)
- Check network tab in browser dev tools for errors
- Verify you have admin role

## Tips & Best Practices

1. **Always set realistic thresholds** - Make minimum_threshold_tickets achievable
2. **Plan dates carefully** - Set end dates well in advance
3. **Keep descriptions detailed** - Better descriptions help with conversions
4. **Monitor progress** - Check tickets regularly to see engagement
5. **Update status timely** - Change status from scheduled→active→completed as raffle progresses
6. **Back up important data** - Keep records of raffle IDs and winners
7. **Test before launch** - Create a test raffle first to verify workflow

## API Reference (For Developers)

All admin endpoints require: `Authorization: Bearer {ADMIN_API_TOKEN}`

### Raffles
- `GET /api/admin/raffles` - List all raffles
- `POST /api/admin/raffles` - Create raffle
- `PUT /api/admin/raffles/[id]` - Update raffle
- `PATCH /api/admin/raffles/[id]` - Change status
- `DELETE /api/admin/raffles/[id]` - Delete raffle

### Tickets  
- `GET /api/admin/tickets` - List all tickets

### Users
- `GET /api/admin/users` - List all users

### Artworks
- `GET /api/admin/artworks` - List all artworks
- `POST /api/admin/artworks` - Create artwork

## Support

For issues or questions:
1. Check the logs: `/railway logs/`
2. Review this guide's troubleshooting section
3. Check database for data consistency
4. Contact development team with specific error details
