-- Quick database initialization for Railway
-- Run this directly in Railway's PostgreSQL console

-- Create database extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    location VARCHAR(255),
    birth_date DATE,
    profile_image VARCHAR(500),
    social_media JSONB,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    education_goal TEXT,
    education_fund_target DECIMAL(10,2) DEFAULT 0,
    education_fund_raised DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    medium VARCHAR(255),
    dimensions VARCHAR(100),
    creation_date DATE,
    estimated_value DECIMAL(10,2),
    images JSONB,
    certificate_info JSONB,
    series_info VARCHAR(255),
    limited_edition_info VARCHAR(255),
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    country_code VARCHAR(10),
    address JSONB,
    role VARCHAR(50) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    remember_token VARCHAR(255),
    remember_token_expires TIMESTAMP,
    marketing_consent BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{"marketing": true, "raffle_updates": true}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raffles table
CREATE TABLE IF NOT EXISTS raffles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ticket_price DECIMAL(8,2) NOT NULL,
    max_tickets INTEGER,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    drawing_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'scheduled',
    winner_id UUID REFERENCES users(id),
    tickets_sold INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    artist_share_percentage DECIMAL(5,2) DEFAULT 70.00,
    foundation_share_percentage DECIMAL(5,2) DEFAULT 30.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ticket_number INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_intent_id VARCHAR(255),
    entry_method VARCHAR(50) DEFAULT 'paid',
    status VARCHAR(50) DEFAULT 'active',
    UNIQUE(raffle_id, ticket_number)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    raffle_id UUID REFERENCES raffles(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    description TEXT,
    metadata JSONB,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Ferdinand as artist
INSERT INTO artists (name, bio, location, education_goal, education_fund_target)
VALUES (
    'Ferdinand Ssekyanja',
    'A talented young artist with a passion for aviation and vibrant African-inspired contemporary art.',
    'Uganda',
    'To pursue aviation education and become a commercial pilot while continuing to create inspiring artwork.',
    10000.00
) ON CONFLICT DO NOTHING;

-- Insert Playful Giraffe artwork
INSERT INTO artworks (artist_id, title, description, medium, dimensions, estimated_value, status)
SELECT 
    a.id,
    'Playful Giraffe',
    'A vibrant acrylic painting that captures the playful spirit of the giraffe rendered in bold strokes and an expressive color palette.',
    'Acrylic on Canvas',
    '100cm × 100cm',
    700.00,
    'in_raffle'
FROM artists a 
WHERE a.name = 'Ferdinand Ssekyanja'
ON CONFLICT DO NOTHING;

-- Insert active raffle
INSERT INTO raffles (
    artwork_id, title, description, ticket_price, max_tickets, 
    start_date, end_date, status, tickets_sold, total_revenue
)
SELECT 
    aw.id,
    'Playful Giraffe Raffle',
    'Win Ferdinand''s beautiful "Playful Giraffe" artwork while supporting his aviation education dreams.',
    25.00,
    100,
    NOW(),
    NOW() + INTERVAL '15 days',
    'active',
    0,
    0.00
FROM artworks aw 
WHERE aw.title = 'Playful Giraffe'
ON CONFLICT DO NOTHING;