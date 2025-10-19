#!/bin/bash

# Railway Deployment Script for Ferdinand Arts Gallery
# Run this script to deploy your gallery to Railway

set -e  # Exit on any error

echo "🚂 Ferdinand Arts Gallery - Railway Deployment"
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway:"
    railway login
fi

# Check if project is initialized
if [ ! -f "railway.json" ]; then
    echo "❌ Railway configuration not found!"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo "✅ Railway CLI installed"
echo "✅ User logged in"
echo "✅ Railway configuration found"

# Ask for confirmation
read -p "🚀 Ready to deploy? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Change to frontend directory (where the main app is)
cd frontend

echo "🔄 Deploying to Railway..."

# Deploy the application
railway up

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📝 Next steps:"
echo "1. Check Railway dashboard for deployment status"
echo "2. Add PostgreSQL database if not already added:"
echo "   railway add postgresql"
echo "3. Set up environment variables in Railway dashboard"
echo "4. Run database migrations:"
echo "   railway run npm run migrate"
echo "5. Configure custom domain (optional)"
echo ""
echo "🔗 Railway Dashboard: https://railway.app/dashboard"
echo ""
echo "⚠️  Don't forget to:"
echo "   - Set up Stripe webhook with your Railway URL"
echo "   - Update environment variables"
echo "   - Test payment functionality"