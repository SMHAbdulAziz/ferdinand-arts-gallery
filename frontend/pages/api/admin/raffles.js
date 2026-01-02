// Admin raffle management endpoints
const { Pool } = require('pg');
const { withAdminAuth } = require('../../../middleware/adminAuth');

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

export default withAdminAuth(handler);

async function handleGetRaffles(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, title, status, tickets_sold, max_tickets, start_date, end_date FROM raffles ORDER BY created_at DESC'
    );

    res.status(200).json({
      success: true,
      raffles: result.rows
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch raffles' });
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
    cash_prize_percentage
  } = req.body;

  // Validate required fields
  if (!title || !ticket_price || !max_tickets || !start_date || !end_date) {
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
    const result = await pool.query(
      `INSERT INTO raffles (
        title, description, ticket_price, max_tickets, 
        minimum_threshold_tickets, status, start_date, end_date,
        artwork_id, cash_prize_percentage, tickets_sold, total_revenue, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, 0, NOW())
      RETURNING id, title, status`,
      [
        title, description, ticket_price, max_tickets,
        minimum_threshold_tickets, status, start_date, end_date,
        artwork_id || null, cash_prize_percentage
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Raffle created successfully',
      raffle: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
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
