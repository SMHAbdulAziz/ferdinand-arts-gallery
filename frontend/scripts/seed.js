// Seed script to create initial raffle data
const { Pool } = require('pg');

async function seedDatabase() {
  const connectionString = process.env.DATABASE_URL || 
                          process.env.POSTGRES_URL || 
                          process.env.DATABASE_PRIVATE_URL ||
                          process.env.DATABASE_PUBLIC_URL;
  
  console.log('🔍 Available environment variables:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');
  console.log('DATABASE_PRIVATE_URL:', process.env.DATABASE_PRIVATE_URL ? 'SET' : 'NOT SET');
  console.log('DATABASE_PUBLIC_URL:', process.env.DATABASE_PUBLIC_URL ? 'SET' : 'NOT SET');
  
  if (!connectionString) {
    console.error('❌ No database connection string found');
    console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('POSTGRES')));
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    // Check if Ferdinand already exists
    let artistResult = await pool.query('SELECT id FROM artists WHERE name = $1', ['Ferdinand Ssekyanja']);
    let artistId;

    if (artistResult.rows.length > 0) {
      artistId = artistResult.rows[0].id;
      console.log('✅ Artist already exists:', artistId);
    } else {
      // Create Ferdinand as an artist
      artistResult = await pool.query(`
        INSERT INTO artists (name, bio, location, education_goal, education_fund_target)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [
        'Ferdinand Ssekyanja',
        'A talented young artist with a passion for aviation and vibrant African-inspired contemporary art.',
        'Uganda',
        'To pursue aviation education and become a commercial pilot while continuing to create inspiring artwork.',
        10000.00
      ]);
      artistId = artistResult.rows[0].id;
      console.log('✅ Artist created:', artistId);
    }

    // Check if artwork already exists
    let artworkResult = await pool.query('SELECT id FROM artworks WHERE title = $1', ['Playful Giraffe']);
    let artworkId;

    if (artworkResult.rows.length > 0) {
      artworkId = artworkResult.rows[0].id;
      console.log('✅ Artwork already exists:', artworkId);
    } else {
      // Create the Playful Giraffe artwork
      artworkResult = await pool.query(`
        INSERT INTO artworks (artist_id, title, description, medium, dimensions, estimated_value, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
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
      artworkId = artworkResult.rows[0].id;
      console.log('✅ Artwork created:', artworkId);
    }

    // Check if raffle already exists
    let raffleResult = await pool.query('SELECT id FROM raffles WHERE title = $1', ['Playful Giraffe Raffle']);
    let raffleId;

    if (raffleResult.rows.length > 0) {
      raffleId = raffleResult.rows[0].id;
      console.log('✅ Raffle already exists:', raffleId);
    } else {
      // Create the active raffle
      raffleResult = await pool.query(`
        INSERT INTO raffles (
          artwork_id, 
          title, 
          description, 
          ticket_price, 
          max_tickets, 
          start_date, 
          end_date, 
          status,
          tickets_sold,
          total_revenue
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        artworkId,
        'Playful Giraffe Raffle',
        'Win Ferdinand\'s beautiful "Playful Giraffe" artwork while supporting his aviation education dreams.',
        25.00,
        100,
        new Date(),
        new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        'active',
        0, // Start with 0 tickets sold
        0.00 // Start with $0 revenue
      ]);
      raffleId = raffleResult.rows[0].id;
      console.log('✅ Raffle created:', raffleId);
    }
    console.log('✅ Raffle created/updated:', raffleId);

    console.log('🎉 Database seeded successfully!');
    console.log('📊 Raffle Details:');
    console.log(`   - Artist: Ferdinand Ssekyanja`);
    console.log(`   - Artwork: Playful Giraffe`);
    console.log(`   - Ticket Price: $25`);
    console.log(`   - Max Tickets: 100`);
    console.log(`   - Status: Active`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();