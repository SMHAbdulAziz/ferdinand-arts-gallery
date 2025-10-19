# The FUND - Docker Deployment Guide

This guide covers complete deployment setup for The FUND gallery website using Docker.

## 🚀 Quick Start

### Development Deployment
```bash
# 1. Navigate to project directory
cd "/Users/harveysearcy/Ferdinand Arts/gallery-website"

# 2. Run development deployment
./deploy-dev.sh

# 3. Access application
open http://localhost:3000
```

### Production Deployment
```bash
# 1. Configure production environment
cp .env.production .env.production.local
# Edit with your production values

# 2. Run production deployment (as root)
sudo ./deploy-prod.sh

# 3. Set up SSL certificates (see SSL Setup below)
```

## 📋 Prerequisites

### Required Software
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Git** (for code updates)

### Required Accounts & Keys
- **Stripe Account** - For payment processing
  - Test keys for development
  - Live keys for production
- **Domain Name** - For production (ferdinandarts.org)
- **SSL Certificate** - For HTTPS (Let's Encrypt recommended)

## 🔧 Configuration Files

### Environment Files
- **`.env.local`** - Development environment (safe defaults)
- **`.env.production`** - Production environment (requires setup)

### Docker Files
- **`docker-compose.yml`** - Multi-service configuration
- **`frontend/Dockerfile`** - Frontend container definition
- **`nginx/nginx.conf`** - Reverse proxy configuration

## 🐳 Docker Services

### Frontend (Next.js)
- **Port**: 3000
- **Purpose**: The FUND website
- **Features**: Stripe integration, raffle system, artist gallery

### PostgreSQL Database
- **Port**: 5432
- **Database**: ferdinand_arts
- **User**: ferdinand_admin
- **Features**: Persistent data, automatic backups

### Nginx (Production Only)
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Purpose**: Reverse proxy, SSL termination, static file serving
- **Features**: Rate limiting, security headers, compression

## 🔐 SSL Setup

### Using Let's Encrypt (Recommended)

1. **Install Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain Certificate**:
   ```bash
   sudo certbot certonly --webroot -w /var/www/certbot -d ferdinandarts.org -d www.ferdinandarts.org
   ```

3. **Copy Certificates**:
   ```bash
   sudo cp /etc/letsencrypt/live/ferdinandarts.org/fullchain.pem ./ssl/
   sudo cp /etc/letsencrypt/live/ferdinandarts.org/privkey.pem ./ssl/
   ```

4. **Set Permissions**:
   ```bash
   sudo chown -R $USER:$USER ./ssl/
   sudo chmod 600 ./ssl/privkey.pem
   ```

### Certificate Renewal
```bash
# Add to crontab for automatic renewal
0 12 * * * /usr/bin/certbot renew --quiet && docker-compose --profile production restart nginx
```

## 🔑 Environment Variables

### Critical Variables (Required)
```bash
# Database
DATABASE_URL="postgresql://ferdinand_admin:PASSWORD@postgres:5432/ferdinand_arts"
POSTGRES_PASSWORD="secure_password_here"

# Stripe (LIVE keys for production)
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Security
NEXTAUTH_SECRET="64_character_random_string"
NEXTAUTH_URL="https://ferdinandarts.org"
```

### Optional Variables
```bash
# Email notifications
SMTP_HOST="smtp.gmail.com"
SMTP_USER="noreply@ferdinandarts.org"
ADMIN_EMAIL="admin@ferdinandarts.org"

# Raffle settings
RAFFLE_TICKET_PRICE="50"
RAFFLE_TARGET_AMOUNT="269000"
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f frontend
docker-compose logs -f postgres

# Check application health
curl http://localhost:3000/api/health
```

### Database Backup
```bash
# Create backup
docker exec -t gallery-website_postgres_1 pg_dumpall -c -U ferdinand_admin > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
cat backup_file.sql | docker exec -i gallery-website_postgres_1 psql -U ferdinand_admin -d ferdinand_arts
```

### Updates & Deployment
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

**Stripe Payments Not Working**
```bash
# Verify environment variables
docker-compose exec frontend printenv | grep STRIPE

# Check webhook endpoint in Stripe dashboard
# URL should be: https://ferdinandarts.org/api/stripe/webhook
```

**SSL Certificate Issues**
```bash
# Check certificate validity
openssl x509 -in ./ssl/fullchain.pem -text -noout

# Test SSL configuration
curl -I https://ferdinandarts.org
```

### Performance Optimization

**Database Performance**
```sql
-- Connect to database
docker-compose exec postgres psql -U ferdinand_admin -d ferdinand_arts

-- Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 5;

-- Analyze table performance
ANALYZE;
```

**Frontend Performance**
```bash
# Check bundle size
docker-compose exec frontend npm run analyze

# Monitor memory usage
docker stats frontend
```

## 📞 Support

### Logs Location
- **Frontend**: `docker-compose logs frontend`
- **Database**: `docker-compose logs postgres`
- **Nginx**: `docker-compose logs nginx`

### Configuration Validation
```bash
# Test Nginx configuration
docker-compose exec nginx nginx -t

# Validate environment
docker-compose exec frontend node -e "require('./lib/config').validateConfig()"
```

### Emergency Contacts
- **Technical Issues**: admin@ferdinandarts.org
- **Payment Issues**: Check Stripe Dashboard
- **Server Issues**: Contact hosting provider

## 🎯 Production Checklist

Before going live:

- [ ] Domain DNS configured
- [ ] SSL certificates installed
- [ ] Production environment variables set
- [ ] Stripe live keys configured
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Firewall rules configured
- [ ] Email notifications tested
- [ ] Payment flow tested end-to-end

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Stripe Integration Guide](https://stripe.com/docs/payments/quickstart)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)