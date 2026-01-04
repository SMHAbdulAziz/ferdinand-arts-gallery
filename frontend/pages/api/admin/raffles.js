// Admin raffle management endpoints
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetRaffles(req, res);
  } else if (req.method === 'POST') {
    return handleCreateRaffle(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;

async function handleGetRaffles(req, res) {
  try {
    console.log('Fetching raffles...');
    const result = await pool.query(
      `SELECT 
        r.id, 
        r.title, 
        r.description, 
        r.status, 
        r.tickets_sold, 
        r.max_tickets, 
        r.start_date, 
        r.end_date, 
        r.ticket_price, 
        r.minimum_threshold_tickets, 
        r.artwork_id, 
        r.cash_prize_percentage, 
        r.medium, 
        r.dimensions,
        a.estimated_value,
        a.creation_date as painting_year
      FROM raffles r
      LEFT JOIN artworks a ON r.artwork_id = a.id
      ORDER BY r.created_at DESC`
    );

    console.log(`Found ${result.rows.length} raffles`);
    res.status(200).json({
      success: true,
      raffles: result.rows
    });
  } catch (error) {
    console.error('Database error fetching raffles:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch raffles',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function handleCreateRaffle(req, res) {
  const {
    title,
    description,
    ticket_price,
    max_tickets,
    minimum_threshold_tickets,
    status,
    start_date,
    end_date,
    artwork_id,
    cash_prize_percentage,
    medium,
    dimensions
  } = req.body;

  console.log('Creating raffle with data:', {
    title,
    ticket_price,
    max_tickets,
    minimum_threshold_tickets,
    status
  });

  // Validate required fields
  if (!title || !ticket_price || !max_tickets || !start_date || !end_date) {
    console.warn('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate threshold vs max tickets
  const maxTicketsNum = parseInt(max_tickets);
  const thresholdTicketsNum = parseInt(minimum_threshold_tickets) || 0;
  
  if (thresholdTicketsNum > maxTicketsNum) {
    return res.status(400).json({ 
      error: 'Minimum threshold tickets cannot exceed max tickets',
      details: `Threshold (${thresholdTicketsNum}) must be <= Max Tickets (${maxTicketsNum})`
    });
  }

  // Validate dates
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  if (endDate <= startDate) {
    return res.status(400).json({ 
      error: 'End date must be after start date' 
    });
  }

  try {
    console.log('Inserting into database with values:', {
      title,
      ticket_price,
      max_tickets: maxTicketsNum,
      minimum_threshold_tickets: thresholdTicketsNum,
      status,
      start_date,
      end_date,
      artwork_id: artwork_id || null,
      cash_prize_percentage: cash_prize_percentage || 70,
      medium,
      dimensions
    });

    const result = await pool.query(
      `INSERT INTO raffles (
        title, description, ticket_price, max_tickets, 
        minimum_threshold_tickets, status, start_date, end_date,
        artwork_id, cash_prize_percentage, medium, dimensions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, title, status`,
      [
        title, description, ticket_price, maxTicketsNum,
        thresholdTicketsNum, status, start_date, end_date,
        artwork_id || null, cash_prize_percentage || 70,
        medium || null, dimensions || null
      ]
    );

    console.log('Raffle created successfully:', result.rows[0]);
    res.status(201).json({
      success: true,
      message: 'Raffle created successfully',
      raffle: result.rows[0]
    });
  } catch (error) {
    console.error('Database error creating raffle:', error.message);
    console.error('Error details:', error);
    // Check for specific database errors
    if (error.message && error.message.includes('duplicate')) {
      return res.status(400).json({ error: 'A raffle with this title already exists' });
    }
    res.status(500).json({ 
      error: 'Failed to create raffle',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
