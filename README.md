# THE FUND Gallery Website

A Docker-containerized web application for raffling artwork to support young artists' education goals.

## Project Overview

This gallery website supports THE FUND's mission to help talented young artists like Ferdinand Ssekyanja from Uganda achieve their educational dreams through art sales and raffles.

### Features

- **Artist Galleries**: Showcase artwork with high-quality images and detailed descriptions
- **Raffle System**: Secure ticket purchasing and automated winner selection
- **Payment Processing**: Stripe integration for seamless transactions
- **Admin Dashboard**: Manage artworks, raffles, users, and view analytics
- **Email Notifications**: Automated winner announcements and marketing campaigns
- **Certificate Generation**: Digital authenticity certificates for artwork
- **Mobile Responsive**: Optimized for all devices

## Technology Stack

- **Frontend**: Next.js (React) with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL
- **Payment**: Stripe
- **Email**: SendGrid/Mailgun
- **Container**: Docker & Docker Compose
- **Proxy**: Nginx

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for development)
- Stripe account for payment processing

### Setup

1. **Clone and navigate to the project:**
   ```bash
   cd gallery-website
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys and settings
   ```

3. **Start the application:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Development Setup

For local development without Docker:

```bash
# Install backend dependencies
cd backend
npm install
npm run dev

# Install frontend dependencies (new terminal)
cd frontend
npm install
npm run dev
```

## Architecture

```
gallery-website/
├── frontend/           # Next.js React application
│   ├── components/     # Reusable React components
│   ├── pages/         # Next.js pages and API routes
│   ├── styles/        # CSS and styling
│   └── utils/         # Utility functions
├── backend/           # Node.js Express API
│   ├── controllers/   # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API route definitions
│   ├── middleware/    # Authentication, validation, etc.
│   └── utils/         # Helper functions
├── database/          # Database schemas and migrations
├── nginx/            # Nginx configuration
└── uploads/          # File storage (development)
```

## Database Schema

### Core Tables

- **artists**: Artist profiles and information
- **artworks**: Individual artwork details and images
- **raffles**: Raffle configurations and status
- **tickets**: Individual raffle ticket purchases
- **users**: User accounts and authentication
- **transactions**: Payment and transaction history

## API Endpoints

### Public Endpoints
- `GET /api/artworks` - List all available artworks
- `GET /api/artworks/:id` - Get artwork details
- `GET /api/raffles/active` - List active raffles
- `POST /api/tickets/purchase` - Purchase raffle tickets
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Admin Endpoints (Protected)
- `POST /api/artworks` - Add new artwork
- `PUT /api/artworks/:id` - Update artwork
- `POST /api/raffles` - Create new raffle
- `POST /api/raffles/:id/draw` - Conduct raffle drawing
- `GET /api/analytics` - View analytics dashboard

## Deployment

### Production Environment

1. **Set up production environment variables**
2. **Configure SSL certificates**
3. **Set up production database**
4. **Deploy with Docker Compose:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment Variables

Required environment variables for production:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Strong random string for JWT tokens
- `STRIPE_SECRET_KEY`: Production Stripe secret key
- `EMAIL_SERVICE_API_KEY`: Email service API key
- SSL certificate paths for HTTPS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security Considerations

- All payment processing handled securely through Stripe
- User authentication with JWT tokens
- Input validation and sanitization
- Rate limiting on API endpoints
- HTTPS in production
- Environment variable security

## Support

For support or questions about THE FUND project:
- Email: support@thefund.org
- Documentation: [Link to detailed docs]

## License

This project is created to support THE FUND's mission of helping young artists achieve their educational goals.

---

**THE FUND** - Supporting talented young artists through art and education.