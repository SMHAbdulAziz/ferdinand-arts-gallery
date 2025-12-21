// Get raffle outcome and summary (PUBLIC - PROTOCOL compliance for transparency)
const { Pool } = require('pg');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { raffleId } = req.query;

  if (!raffleId) {
    return res.status(400).json({ error: 'raffleId required' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Get completed raffle with full details
    const raffleQuery = await pool.query(
      `SELECT 
         r.id,
         r.title,
         r.description,
         r.ticket_price,
         r.minimum_threshold_tickets,
         r.tickets_sold,
         r.total_revenue,
         r.status,
         r.threshold_met,
         r.outcome_type,
         r.cash_prize_percentage,
         r.outcome_timestamp,
         r.winner_id,
         a.title as artwork_title,
         a.estimated_value,
         a.images,
         a.description as artwork_description,
         ar.name as artist_name,
         u.first_name as winner_first_name,
         u.last_name as winner_last_name,
         u.email as winner_email
       FROM raffles r
       LEFT JOIN artworks a ON r.artwork_id = a.id
       LEFT JOIN artists ar ON a.artist_id = ar.id
       LEFT JOIN users u ON r.winner_id = u.id
       WHERE r.id = $1 AND r.status = 'completed'`,
      [raffleId]
    );

    if (raffleQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Completed raffle not found' });
    }

    const raffle = raffleQuery.rows[0];

    // Build outcome summary per PROTOCOL
    const summary = {
      raffle_id: raffle.id,
      raffle_title: raffle.title,
      raffle_description: raffle.description,
      
      // PROTOCOL Outcome Details
      outcome: {
        type: raffle.outcome_type, // ARTWORK_AWARDED or CASH_PRIZE_AWARDED
        threshold_met: raffle.threshold_met,
        tickets_required: raffle.minimum_threshold_tickets,
        tickets_sold: raffle.tickets_sold,
        total_pool: parseFloat(raffle.total_revenue),
        draw_timestamp: raffle.outcome_timestamp
      },

      // Artwork details (even if not awarded, transparency required)
      artwork: {
        title: raffle.artwork_title,
        artist: raffle.artist_name,
        estimated_value: raffle.estimated_value,
        description: raffle.artwork_description,
        images: raffle.images || []
      },

      // Winner information
      winner: raffle.winner_id ? {
        name: `${raffle.winner_first_name || ''} ${raffle.winner_last_name || ''}`.trim(),
        email: raffle.winner_email,
        prize: raffle.outcome_type === 'ARTWORK_AWARDED' 
          ? 'Original artwork with Certificate of Authenticity'
          : `Cash prize: $${(raffle.total_revenue * raffle.cash_prize_percentage / 100).toFixed(2)}`
      } : null,

      // PROTOCOL: Mandatory disclosure statement
      disclosure: raffle.outcome_type === 'ARTWORK_AWARDED'
        ? 'The minimum participation threshold was met. The winner receives the original artwork and Certificate of Authenticity.'
        : 'The minimum participation threshold was not met. Per raffle terms, the winner receives a cash prize instead of the artwork. The artwork remains available for future raffle or direct sale.'
    };

    // Get ticket entries count (both paid and free)
    const entriesQuery = await pool.query(
      `SELECT 
         (SELECT COUNT(*) FROM tickets WHERE raffle_id = $1 AND status = 'active') +
         (SELECT COUNT(*) FROM free_raffle_entries WHERE raffle_id = $1 AND status = 'valid') as total_entries`,
      [raffleId]
    );

    summary.total_entries = parseInt(entriesQuery.rows[0].total_entries);

    // Check if public disclosure is enabled
    const settingsQuery = await pool.query(
      `SELECT value FROM settings WHERE key = 'raffle_config'`
    );
    
    const raffleConfig = settingsQuery.rows[0]?.value || {};
    
    if (!raffleConfig.public_outcome_disclosure && !req.headers.authorization) {
      // Non-public outcome - only show to authorized users
      return res.status(403).json({ error: 'Outcome disclosure not yet publicly available' });
    }

    res.status(200).json({
      success: true,
      summary: summary
    });

  } catch (error) {
    console.error('Outcome summary error:', error);
    res.status(500).json({ error: 'Failed to fetch outcome summary', details: error.message });
  } finally {
    await pool.end();
  }
}
