// Get upcoming/scheduled raffles (PROTOCOL COMPLIANT)
const { Pool } = require('pg');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Get upcoming raffles (scheduled or pending status)
    const rafflesQuery = await pool.query(`
      SELECT 
        r.id,
        r.title,
        r.description,
        r.ticket_price,
        r.max_tickets,
        r.minimum_threshold_tickets,
        r.start_date,
        r.end_date,
        r.status,
        r.cash_prize_percentage,
        a.title as artwork_title,
        a.description as artwork_description,
        a.estimated_value,
        a.images,
        a.medium,
        a.dimensions,
        ar.name as artist_name
      FROM raffles r
      LEFT JOIN artworks a ON r.artwork_id = a.id
      LEFT JOIN artists ar ON a.artist_id = ar.id
      WHERE r.status IN ('scheduled', 'upcoming')
      ORDER BY r.start_date ASC
    `);

    const raffles = rafflesQuery.rows.map((raffle) => ({
      ...raffle,
      images: raffle.images || [],
      launch_date: raffle.start_date
    }));

    res.status(200).json({
      success: true,
      raffles: raffles,
      count: raffles.length
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming raffles' });
  } finally {
    await pool.end();
  }
}
