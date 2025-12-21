-- Initialize database schema for THE FUND Gallery

-- Create database extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Artists table
CREATE TABLE artists (
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
CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    medium VARCHAR(255),
    dimensions VARCHAR(100),
    creation_date DATE,
    estimated_value DECIMAL(10,2),
    images JSONB, -- Array of image URLs
    certificate_info JSONB,
    series_info VARCHAR(255),
    limited_edition_info VARCHAR(255),
    status VARCHAR(50) DEFAULT 'available', -- available, in_raffle, sold, reserved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    address JSONB,
    role VARCHAR(50) DEFAULT 'user', -- user, admin
    email_verified BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raffles table
CREATE TABLE raffles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ticket_price DECIMAL(8,2) NOT NULL,
    max_tickets INTEGER,
    minimum_threshold_tickets INTEGER NOT NULL, -- PROTOCOL: minimum tickets to award artwork
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    drawing_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, active, completed, cancelled
    winner_id UUID REFERENCES users(id),
    tickets_sold INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    artist_share_percentage DECIMAL(5,2) DEFAULT 70.00,
    foundation_share_percentage DECIMAL(5,2) DEFAULT 30.00,
    threshold_met BOOLEAN DEFAULT NULL, -- NULL until raffle ends, then TRUE/FALSE
    outcome_type VARCHAR(50) DEFAULT NULL, -- ARTWORK_AWARDED or CASH_PRIZE_AWARDED
    cash_prize_percentage DECIMAL(5,2) DEFAULT 70.00, -- PROTOCOL: % of pool winner gets if threshold missed
    outcome_timestamp TIMESTAMP, -- When outcome was determined
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ticket_number INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_intent_id VARCHAR(255),
    entry_method VARCHAR(50) DEFAULT 'paid', -- paid or free_entry (PROTOCOL compliant)
    status VARCHAR(50) DEFAULT 'active', -- active, refunded, cancelled
    UNIQUE(raffle_id, ticket_number)
);

-- Free raffle entries table (email-based, no purchase)
CREATE TABLE free_raffle_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'valid', -- valid, used, cancelled
    UNIQUE(raffle_id, email) -- One free entry per person per raffle (PROTOCOL requirement)
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    raffle_id UUID REFERENCES raffles(id),
    type VARCHAR(50) NOT NULL, -- ticket_purchase, artist_payout, foundation_allocation, refund
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    status VARCHAR(50) NOT NULL, -- pending, completed, failed, refunded
    description TEXT,
    metadata JSONB,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email subscriptions table
CREATE TABLE email_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    subscription_source VARCHAR(100), -- raffle_entry, newsletter_signup, purchase
    preferences JSONB DEFAULT '{"marketing": true, "raffle_updates": true, "winner_announcements": true}'
);

-- Settings table for application configuration
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX idx_artworks_status ON artworks(status);
CREATE INDEX idx_raffles_status ON raffles(status);
CREATE INDEX idx_raffles_dates ON raffles(start_date, end_date);
CREATE INDEX idx_tickets_raffle_id ON tickets(raffle_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('site_config', '{"site_name": "THE FUND Gallery", "tagline": "Supporting Young Artists Through Art", "contact_email": "info@thefund.org"}', 'Basic site configuration'),
('raffle_config', '{"default_duration_days": 30, "min_ticket_price": 25, "max_ticket_price": 100, "max_tickets_per_user": null, "free_entry_enabled": true, "free_entry_limit_per_person": 1, "allow_config_changes_after_launch": false, "winner_notification_days": 2, "public_outcome_disclosure": true}', 'Default raffle configuration per Raffle Protocols'),
('payment_config', '{"currency": "USD", "artist_share_default": 70, "foundation_share_default": 30, "cash_prize_percentage": 70}', 'Payment and revenue sharing configuration'),
('email_config', '{"from_name": "THE FUND Gallery", "from_email": "noreply@thefund.org", "reply_to": "support@thefund.org"}', 'Email configuration');

-- Insert Ferdinand as the first artist
INSERT INTO artists (
    name, 
    bio, 
    location, 
    contact_email,
    education_goal,
    education_fund_target,
    profile_image
) VALUES (
    'Ferdinand Ssekyanja',
    'A talented young painter from Entebbe, Uganda, known for his vibrant acrylic paintings that capture the playful spirit of African wildlife. Ferdinand combines bold strokes with expressive color palettes, creating artwork that brings joy and creativity to viewers. His whimsical style and layered textures invite imagination while portraying realism and personality in every piece.',
    'Entebbe, Uganda',
    'ferdinandarts@gmail.com',
    'To pursue pilot training and aviation engineering education in the United States',
    269000.00,
    '/images/artists/ferdinand-profile.jpg'
);

-- Get Ferdinand's ID for artwork insertion
DO $$
DECLARE
    ferdinand_id UUID;
BEGIN
    SELECT id INTO ferdinand_id FROM artists WHERE name = 'Ferdinand Ssekyanja';
    
    -- Insert the Playful Giraffe artwork
    INSERT INTO artworks (
        artist_id,
        title,
        description,
        medium,
        dimensions,
        creation_date,
        estimated_value,
        images,
        certificate_info,
        series_info,
        limited_edition_info,
        status
    ) VALUES (
        ferdinand_id,
        'Playful Giraffe',
        'A vibrant acrylic painting that captures the playful spirit of the giraffe rendered in bold strokes and an expressive color palette of warm colors against a teal background. The giraffe''s whimsical pose with tongue extended brings humor and joy to the canvas. The energetic palette knife work and layered textures invite imagination and creativity, portraying realism and personality.',
        'Acrylic on Canvas',
        '100cm x 100cm',
        '2024-07-21',
        700.00,
        '["images/artworks/playful-giraffe-main.jpg", "images/artworks/playful-giraffe-detail1.jpg", "images/artworks/playful-giraffe-detail2.jpg"]',
        '{"title": "Playful Giraffe", "artist": "Ferdinand Ssekyanja", "medium": "Acrylic on Canvas", "dimensions": "100cm x 100cm", "date_completed": "21/07/2024", "authenticity_note": "This piece is unique authentic artwork and isn''t a retrofit or print. The rights to the painting remains with the artist.", "witness_signatures": true}',
        'Limited to 5 pieces per animal species',
        'This piece being 1 of 5 of the giraffe series',
        'available'
    );
END $$;