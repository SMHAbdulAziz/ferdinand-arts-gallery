// Admin raffle management endpoints
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetRaffles(req, res);
  } else if (req.method === 'POST') {
    return handleCreateRaffle(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

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
    res.status(500).json({ error: 'Failed to create raffle' });
  }
}
