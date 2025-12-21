// Admin raffle detail endpoints (edit, delete, change status)
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Raffle ID is required' });
  }

  if (req.method === 'PUT') {
    return handleUpdateRaffle(req, res, id);
  } else if (req.method === 'PATCH') {
    return handlePatchRaffle(req, res, id);
  } else if (req.method === 'DELETE') {
    return handleDeleteRaffle(req, res, id);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleUpdateRaffle(req, res, raffleId) {
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

  try {
    const result = await pool.query(
      `UPDATE raffles SET
        title = $1,
        description = $2,
        ticket_price = $3,
        max_tickets = $4,
        minimum_threshold_tickets = $5,
        status = $6,
        start_date = $7,
        end_date = $8,
        artwork_id = $9,
        cash_prize_percentage = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING id, title, status`,
      [
        title, description, ticket_price, max_tickets,
        minimum_threshold_tickets, status, start_date, end_date,
        artwork_id || null, cash_prize_percentage, raffleId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Raffle updated successfully',
      raffle: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to update raffle' });
  }
}

async function handlePatchRaffle(req, res, raffleId) {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE raffles SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING id, title, status`,
      [status, raffleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Raffle status updated successfully',
      raffle: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to update raffle status' });
  }
}

async function handleDeleteRaffle(req, res, raffleId) {
  try {
    const result = await pool.query(
      'DELETE FROM raffles WHERE id = $1 RETURNING id',
      [raffleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Raffle deleted successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to delete raffle' });
  }
}
