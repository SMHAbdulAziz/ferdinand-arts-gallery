// Admin raffle detail endpoints (edit, delete, change status)
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function handler(req, res) {
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

export default handler;

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
    cash_prize_percentage,
    medium,
    dimensions,
    painting_year,
    estimated_value
  } = req.body;

  // Validate required fields
  if (!title || !ticket_price || !max_tickets || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate that max_tickets >= minimum_threshold_tickets
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
    console.log('Updating raffle with ID:', raffleId);
    console.log('Update data:', { title, ticket_price, maxTicketsNum, thresholdTicketsNum, status });
    
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
        medium = $11,
        dimensions = $12,
        painting_year = $13,
        estimated_value = $14,
        updated_at = NOW()
      WHERE id = $15
      RETURNING id, title, status`,
      [
        title, description, ticket_price, maxTicketsNum,
        thresholdTicketsNum, status, start_date, end_date,
        artwork_id || null, cash_prize_percentage || 70,
        medium || null, dimensions || null, painting_year || null, estimated_value || null,
        raffleId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    console.log('Raffle updated successfully:', result.rows[0]);
    res.status(200).json({
      success: true,
      message: 'Raffle updated successfully',
      raffle: result.rows[0]
    });
  } catch (error) {
    console.error('Database error updating raffle:', error.message, error.detail);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to update raffle',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function handlePatchRaffle(req, res, raffleId) {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    console.log(`Updating raffle ${raffleId} status to ${status}`);
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

    console.log('Status updated successfully:', result.rows[0]);
    res.status(200).json({
      success: true,
      message: 'Raffle status updated successfully',
      raffle: result.rows[0]
    });
  } catch (error) {
    console.error('Database error updating status:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to update raffle status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function handleDeleteRaffle(req, res, raffleId) {
  try {
    console.log(`Deleting raffle with ID: ${raffleId}`);
    const result = await pool.query(
      'DELETE FROM raffles WHERE id = $1 RETURNING id',
      [raffleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    console.log('Raffle deleted successfully');
    res.status(200).json({
      success: true,
      message: 'Raffle deleted successfully'
    });
  } catch (error) {
    console.error('Database error deleting raffle:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to delete raffle',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
