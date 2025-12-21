// Free raffle entry via email (PROTOCOL COMPLIANT - optional entry method)
const { Pool } = require('pg');
const emailService = require('../../../services/emailService');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { raffleId, email } = req.body;

  if (!raffleId || !email) {
    return res.status(400).json({ error: 'raffleId and email required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Check raffle exists and is active
    const raffleQuery = await pool.query(
      `SELECT id, status, title FROM raffles WHERE id = $1`,
      [raffleId]
    );

    if (raffleQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    const raffle = raffleQuery.rows[0];

    if (raffle.status !== 'active') {
      return res.status(400).json({ error: 'Raffle is not active' });
    }

    // Check if free entries are enabled (from settings)
    const settingsQuery = await pool.query(
      `SELECT value FROM settings WHERE key = 'raffle_config'`
    );
    
    const raffleConfig = settingsQuery.rows[0]?.value || {};
    if (!raffleConfig.free_entry_enabled) {
      return res.status(400).json({ error: 'Free entries are not enabled for this raffle' });
    }

    // PROTOCOL: Check for duplicate (one free entry per person per raffle)
    const existingQuery = await pool.query(
      `SELECT id FROM free_raffle_entries 
       WHERE raffle_id = $1 AND email = $2 AND status = 'valid'`,
      [raffleId, email.toLowerCase()]
    );

    if (existingQuery.rows.length > 0) {
      return res.status(400).json({ 
        error: 'You have already entered this raffle for free. One free entry per person per raffle.' 
      });
    }

    // Insert free entry
    const insertQuery = await pool.query(
      `INSERT INTO free_raffle_entries (raffle_id, email, status)
       VALUES ($1, $2, 'valid')
       RETURNING id, entry_date`,
      [raffleId, email.toLowerCase()]
    );

    const entry = insertQuery.rows[0];

    // Send confirmation email
    await emailService.sendFreeEntryConfirmation(
      email,
      raffle.title,
      raffleId
    );

    res.status(201).json({
      success: true,
      message: 'Free entry confirmed. You have equal odds with paid entries.',
      entry_id: entry.id,
      entry_date: entry.entry_date,
      disclaimer: 'You have identical odds of winning as paid ticket holders. No purchase is necessary to enter or win.'
    });

  } catch (error) {
    console.error('Free entry error:', error);
    
    // Check for constraint violation (duplicate entry)
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'You have already entered this raffle for free.' 
      });
    }

    res.status(500).json({ error: 'Failed to process free entry', details: error.message });
  } finally {
    await pool.end();
  }
}
