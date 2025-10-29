#!/bin/bash

# Railway post-build script to run migrations
echo "🚀 Running post-build database setup..."

# Run migrations
echo "📊 Running database migrations..."
cd frontend && npm run migrate

# Run seed data (only if migration succeeds)
if [ $? -eq 0 ]; then
    echo "🌱 Seeding database with initial data..."
    npm run seed
else
    echo "❌ Migration failed, skipping seed"
    exit 1
fi

echo "✅ Database setup complete!"