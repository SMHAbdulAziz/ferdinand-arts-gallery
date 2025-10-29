// Emergency database setup endpoint - DELETE AFTER USE
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  // Only allow GET requests and add a simple security check
  if (req.method !== 'GET' || req.query.secret !== 'setup-database-2025') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    return res.status(500).json({ error: 'No database connection' });
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Setting up database...');
    
    // Create tables and seed data
    const setupQueries = [
      // Enable UUID extension
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
      
      // Artists table
      `CREATE TABLE IF NOT EXISTS artists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        location VARCHAR(255),
        education_goal TEXT,
        education_fund_target DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Artworks table
      `CREATE TABLE IF NOT EXISTS artworks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        medium VARCHAR(255),
        dimensions VARCHAR(100),
        estimated_value DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Raffles table
      `CREATE TABLE IF NOT EXISTS raffles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        ticket_price DECIMAL(8,2) NOT NULL,
        max_tickets INTEGER,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'scheduled',
        tickets_sold INTEGER DEFAULT 0,
        total_revenue DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Tickets table
      `CREATE TABLE IF NOT EXISTS tickets (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        ticket_number INTEGER NOT NULL,
        purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        stripe_payment_intent_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        UNIQUE(raffle_id, ticket_number)
      )`,
      
      // Transactions table
      `CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id),
        raffle_id UUID REFERENCES raffles(id),
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        stripe_payment_intent_id VARCHAR(255),
        status VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    // Execute table creation
    for (const query of setupQueries) {
      await pool.query(query);
    }

    // Insert seed data
    // Insert Ferdinand
    const artistResult = await pool.query(`
      INSERT INTO artists (name, bio, location, education_goal, education_fund_target)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      'Ferdinand Ssekyanja',
      'A talented young artist with a passion for aviation and vibrant African-inspired contemporary art.',
      'Uganda',
      'To pursue aviation education and become a commercial pilot while continuing to create inspiring artwork.',
      10000.00
    ]);

    let artistId;
    if (artistResult.rows.length > 0) {
      artistId = artistResult.rows[0].id;
    } else {
      const existingArtist = await pool.query('SELECT id FROM artists WHERE name = $1', ['Ferdinand Ssekyanja']);
      artistId = existingArtist.rows[0].id;
    }

    // Insert artwork
    const artworkResult = await pool.query(`
      INSERT INTO artworks (artist_id, title, description, medium, dimensions, estimated_value, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      artistId,
      'Playful Giraffe',
      'A vibrant acrylic painting that captures the playful spirit of the giraffe rendered in bold strokes and an expressive color palette.',
      'Acrylic on Canvas',
      '100cm × 100cm',
      700.00,
      'in_raffle'
    ]);

    let artworkId;
    if (artworkResult.rows.length > 0) {
      artworkId = artworkResult.rows[0].id;
    } else {
      const existingArtwork = await pool.query('SELECT id FROM artworks WHERE title = $1', ['Playful Giraffe']);
      artworkId = existingArtwork.rows[0].id;
    }

    // Insert raffle
    await pool.query(`
      INSERT INTO raffles (
        artwork_id, title, description, ticket_price, max_tickets, 
        start_date, end_date, status, tickets_sold, total_revenue
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT DO NOTHING
    `, [
      artworkId,
      'Playful Giraffe Raffle',
      'Win Ferdinand\'s beautiful "Playful Giraffe" artwork while supporting his aviation education dreams.',
      25.00,
      100,
      new Date(),
      new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      'active',
      0,
      0.00
    ]);

    res.status(200).json({ 
      success: true, 
      message: 'Database setup complete!',
      artistId,
      artworkId
    });

  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
}