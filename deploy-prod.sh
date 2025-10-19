#!/bin/bash
# Production deployment script for The FUND
# This script deploys the application in production mode with SSL and optimizations

set -e

echo "🎨 The FUND - Production Deployment"bash
# Production deployment script for Ferdinand Arts Foundation
# This script deploys the application to production with SSL and security

set -e

echo "🎨 Ferdinand Arts Foundation - Production Deployment"
echo "===================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root for production deployment"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if production environment file exists
if [ ! -f "./.env.production" ]; then
    echo "❌ Missing .env.production file. Copying from template..."
    cp "./.env.production" "./.env.production.new"
    echo "📝 Please edit ./.env.production with your production values"
    echo "⚠️  CRITICAL: Update all passwords and API keys!"
    exit 1
fi

# Validate critical environment variables
echo "🔍 Validating production environment..."
source ./.env.production

if [[ "$STRIPE_SECRET_KEY" == *"test"* ]]; then
    echo "❌ WARNING: You're using Stripe TEST keys in production!"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

if [ "$POSTGRES_PASSWORD" = "CHANGE_THIS_TO_SECURE_PASSWORD" ]; then
    echo "❌ Please change the default database password in .env.production"
    exit 1
fi

# Backup existing data (if any)
if docker volume ls | grep -q "ferdinand_db_data"; then
    echo "💾 Creating database backup..."
    mkdir -p ./backups
    docker run --rm \
        -v ferdinand_db_data:/data \
        -v $(pwd)/backups:/backup \
        alpine tar czf /backup/db_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
fi

# Build production images
echo "🐳 Building production Docker images..."
docker-compose --profile production build --no-cache

# Start database first
echo "🗄️ Starting PostgreSQL database..."
docker-compose --profile production up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 15

# Start frontend application
echo "🚀 Starting frontend application..."
docker-compose --profile production up -d frontend

# Start Nginx (production only)
echo "🌐 Starting Nginx reverse proxy..."
docker-compose --profile production up -d nginx

echo "✅ Production deployment completed successfully!"
echo ""
echo "🌐 Application URLs:"
echo "   HTTPS: https://ferdinandarts.org"
echo "   HTTP: http://ferdinandarts.org (redirects to HTTPS)"
echo ""
echo "🔧 Next steps:"
echo "   1. Configure your domain DNS to point to this server"
echo "   2. Set up SSL certificates (see SSL_SETUP.md)"
echo "   3. Configure monitoring and backups"
echo ""
echo "📊 Check status with: docker-compose --profile production ps"
echo "📝 View logs with: docker-compose --profile production logs -f"
echo "🛑 Stop with: docker-compose --profile production down"