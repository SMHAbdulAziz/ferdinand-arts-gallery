#!/bin/bash
# Development deployment script for The FUND
# This script starts the application in development mode

set -e

echo "🎨 The FUND - Development Deployment"
echo "====================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env.local exists
if [ ! -f "./frontend/.env.local" ]; then
    echo "❌ Missing .env.local file. Copying from template..."
    cp "./frontend/.env.example" "./frontend/.env.local"
    echo "📝 Please edit ./frontend/.env.local with your Stripe keys"
fi

# Build and start development environment
echo "🐳 Building Docker containers..."
docker-compose -f docker-compose.yml build

echo "🚀 Starting development environment..."
docker-compose -f docker-compose.yml up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🎯 Starting frontend application..."
docker-compose -f docker-compose.yml up -d frontend

echo "✅ Development environment started successfully!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Database: postgresql://ferdinand_admin:dev_password@localhost:5432/ferdinand_arts"
echo ""
echo "📊 Check status with: docker-compose ps"
echo "📝 View logs with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"