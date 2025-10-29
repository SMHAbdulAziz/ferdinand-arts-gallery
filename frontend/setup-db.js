// One-time database setup using public database URL
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  // Use the public database URL for external connections
  const connectionString = process.env.DATABASE_PUBLIC_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_PUBLIC_URL not found');
    process.exit(1);
  }

  console.log('🔄 Connecting to database via public URL...');
  
  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    // Run migrations
    console.log('🔄 Running database migrations...');
    const sqlPath = path.join(__dirname, '../database/init.sql');
    
    if (fs.existsSync(sqlPath)) {
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (error) {
          // Ignore "already exists" errors
          if (!error.message.includes('already exists')) {
            console.warn('⚠️ Migration warning:', error.message);
          }
        }
      }
      
      console.log('✅ Database migrations completed');
    }

    // Seed data
    console.log('🌱 Seeding database...');
    
    // Check if Ferdinand exists
    let artistResult = await pool.query('SELECT id FROM artists WHERE name = $1', ['Ferdinand Ssekyanja']);
    let artistId;

    if (artistResult.rows.length > 0) {
      artistId = artistResult.rows[0].id;
      console.log('✅ Artist already exists');
    } else {
      artistResult = await pool.query(`
        INSERT INTO artists (name, bio, location, education_goal, education_fund_target)
        VALUES ($1, $2, $3, $4, $5) RETURNING id
      `, [
        'Ferdinand Ssekyanja',
        'A talented young artist with a passion for aviation and vibrant African-inspired contemporary art.',
        'Uganda',
        'To pursue aviation education and become a commercial pilot while continuing to create inspiring artwork.',
        10000.00
      ]);
      artistId = artistResult.rows[0].id;
      console.log('✅ Artist created');
    }

    // Check if artwork exists
    let artworkResult = await pool.query('SELECT id FROM artworks WHERE title = $1', ['Playful Giraffe']);
    let artworkId;

    if (artworkResult.rows.length > 0) {
      artworkId = artworkResult.rows[0].id;
      console.log('✅ Artwork already exists');
    } else {
      artworkResult = await pool.query(`
        INSERT INTO artworks (artist_id, title, description, medium, dimensions, estimated_value, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
      `, [
        artistId,
        'Playful Giraffe',
        'A vibrant acrylic painting that captures the playful spirit of the giraffe rendered in bold strokes and an expressive color palette.',
        'Acrylic on Canvas',
        '100cm × 100cm',
        700.00,
        'in_raffle'
      ]);
      artworkId = artworkResult.rows[0].id;
      console.log('✅ Artwork created');
    }

    // Check if raffle exists
    let raffleResult = await pool.query('SELECT id, tickets_sold FROM raffles WHERE title = $1', ['Playful Giraffe Raffle']);

    if (raffleResult.rows.length > 0) {
      console.log('✅ Raffle already exists with', raffleResult.rows[0].tickets_sold, 'tickets sold');
    } else {
      raffleResult = await pool.query(`
        INSERT INTO raffles (
          artwork_id, title, description, ticket_price, max_tickets, 
          start_date, end_date, status, tickets_sold, total_revenue
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
      `, [
        artworkId,
        'Playful Giraffe Raffle',
        'Win Ferdinand\'s beautiful "Playful Giraffe" artwork while supporting his aviation education dreams.',
        25.00, 100,
        new Date(),
        new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        'active', 0, 0.00
      ]);
      console.log('✅ Active raffle created');
    }

    console.log('🎉 Database setup complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();