// Execute raffle drawing and determine outcome (PROTOCOL COMPLIANT)
const { Pool } = require('pg');
const crypto = require('crypto');
const emailService = require('../../../services/emailService');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ADMIN AUTHENTICATION REQUIRED
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  // Validate admin token
  const adminToken = process.env.ADMIN_API_TOKEN;
  if (!adminToken || token !== adminToken) {
    return res.status(403).json({ error: 'Invalid admin token' });
  }

  const raffleId = req.query.raffleId || req.body.raffleId;

  if (!raffleId) {
    return res.status(400).json({ error: 'raffleId required' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Get raffle details
    const raffleQuery = await pool.query(
      `SELECT id, artwork_id, ticket_price, max_tickets, minimum_threshold_tickets, 
              tickets_sold, total_revenue, status, cash_prize_percentage, artist_share_percentage, title
       FROM raffles WHERE id = $1`,
      [raffleId]
    );

    if (raffleQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    const raffle = raffleQuery.rows[0];

    // Verify raffle is completed or should be drawn
    if (raffle.status !== 'completed' && raffle.status !== 'active') {
      return res.status(400).json({ error: `Raffle status is ${raffle.status}, cannot draw` });
    }

    // PROTOCOL: Evaluate threshold
    const thresholdMet = raffle.tickets_sold >= raffle.minimum_threshold_tickets;
    const outcomeType = thresholdMet ? 'ARTWORK_AWARDED' : 'CASH_PRIZE_AWARDED';

    // Get all eligible tickets (paid + free entries)
    const ticketsQuery = await pool.query(
      `SELECT t.id, t.user_id, t.ticket_number
       FROM tickets t
       WHERE t.raffle_id = $1 AND t.status = 'active'
       UNION ALL
       SELECT gen_random_uuid() as id, NULL as user_id, ROW_NUMBER() OVER (ORDER BY fre.id) as ticket_number
       FROM free_raffle_entries fre
       WHERE fre.raffle_id = $1 AND fre.status = 'valid'`,
      [raffleId]
    );

    const allEntries = ticketsQuery.rows;

    if (allEntries.length === 0) {
      return res.status(400).json({ error: 'No eligible entries for drawing' });
    }

    // PROTOCOL: Randomly select winner (cryptographically secure)
    const randomIndex = crypto.randomInt(0, allEntries.length);
    const winnerEntry = allEntries[randomIndex];

    // Get or create user for free-entry winners
    let winnerId = winnerEntry.user_id;
    let winnerEmail = null;

    if (!winnerId) {
      // This is a free entry, need to identify them
      const freeEntryQuery = await pool.query(
        `SELECT fre.email FROM free_raffle_entries fre 
         WHERE fre.raffle_id = $1 AND fre.status = 'valid'
         LIMIT 1 OFFSET $2`,
        [raffleId, randomIndex]
      );
      
      if (freeEntryQuery.rows.length > 0) {
        const email = freeEntryQuery.rows[0].email;
        winnerEmail = email;
        // Find or create user
        const userQuery = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userQuery.rows.length > 0) {
          winnerId = userQuery.rows[0].id;
        }
      }
    } else {
      // Get email for paid ticket winner
      const userQuery = await pool.query('SELECT email FROM users WHERE id = $1', [winnerId]);
      if (userQuery.rows.length > 0) {
        winnerEmail = userQuery.rows[0].email;
      }
    }

    // Update raffle with outcome
    const drawTimestamp = new Date();
    await pool.query(
      `UPDATE raffles 
       SET winner_id = $1, 
           threshold_met = $2, 
           outcome_type = $3, 
           outcome_timestamp = $4,
           status = 'completed',
           drawing_date = $4
       WHERE id = $5`,
      [winnerId, thresholdMet, outcomeType, drawTimestamp, raffleId]
    );

    // Update artwork status based on outcome
    if (thresholdMet) {
      await pool.query(
        `UPDATE artworks SET status = 'sold' 
         WHERE id = (SELECT artwork_id FROM raffles WHERE id = $1)`,
        [raffleId]
      );
    }

    // Record raffle outcome transaction
    const prizeAmount = thresholdMet 
      ? raffle.total_revenue * (raffle.artist_share_percentage / 100)
      : raffle.total_revenue * (raffle.cash_prize_percentage / 100);

    await pool.query(
      `INSERT INTO transactions (user_id, raffle_id, type, amount, status, description, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        winnerId,
        raffleId,
        outcomeType === 'ARTWORK_AWARDED' ? 'artwork_award' : 'cash_prize',
        prizeAmount,
        'completed',
        `Raffle drawing completed - ${outcomeType}`,
        JSON.stringify({
          threshold_met: thresholdMet,
          tickets_sold: raffle.tickets_sold,
          minimum_threshold: raffle.minimum_threshold_tickets,
          total_pool: raffle.total_revenue
        })
      ]
    );

    // Send winner notification email
    if (winnerEmail) {
      const prizeText = thresholdMet 
        ? 'Original artwork + Certificate of Authenticity'
        : `Cash prize of $${prizeAmount.toFixed(2)}`;
      
      await emailService.sendWinnerNotification(
        winnerEmail,
        raffle.title,
        outcomeType,
        prizeText,
        raffleId
      );
    }

    res.status(200).json({
      success: true,
      raffle_id: raffleId,
      outcome_type: outcomeType,
      threshold_met: thresholdMet,
      tickets_sold: raffle.tickets_sold,
      minimum_threshold: raffle.minimum_threshold_tickets,
      winner_id: winnerId,
      winner_email: winnerEmail,
      prize_amount: prizeAmount,
      draw_timestamp: drawTimestamp,
      message: `Raffle drawing complete. ${outcomeType}: winner notified at ${winnerEmail}.`
    });

  } catch (error) {
    console.error('Draw error:', error);
    res.status(500).json({ error: 'Failed to execute raffle drawing', details: error.message });
  } finally {
    await pool.end();
  }
}
