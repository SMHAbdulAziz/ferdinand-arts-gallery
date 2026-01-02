// Admin ticket management endpoints
const { Pool } = require('pg');
const { withAdminAuth } = require('../../../middleware/adminAuth');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetTickets(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetTickets(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
        t.id, 
        t.raffle_id, 
        t.user_id, 
        t.ticket_number, 
        t.purchase_date, 
        t.status,
        r.title as raffle_title,
        u.email as user_email
      FROM tickets t
      LEFT JOIN raffles r ON t.raffle_id = r.id
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.purchase_date DESC`
    );

    res.status(200).json({
      success: true,
      tickets: result.rows
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

export default withAdminAuth(handler);
