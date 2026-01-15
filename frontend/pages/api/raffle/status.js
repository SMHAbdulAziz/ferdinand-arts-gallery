// Get current raffle status and ticket counts (PROTOCOL COMPLIANT)
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
    // Get the active raffle with artwork details
    const raffleQuery = await pool.query(`
      SELECT 
        r.id,
        r.title,
        r.description,
        r.ticket_price,
        r.max_tickets,
        r.minimum_threshold_tickets,
        r.tickets_sold,
        r.total_revenue,
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
        a.creation_date as painting_year,
        ar.name as artist_name
      FROM raffles r
      LEFT JOIN artworks a ON r.artwork_id = a.id
      LEFT JOIN artists ar ON a.artist_id = ar.id
      WHERE r.status = 'active'
      ORDER BY r.created_at DESC
      LIMIT 1
    `);

    if (raffleQuery.rows.length === 0) {
      return res.status(404).json({ error: 'No active raffle found' });
    }

    const raffle = raffleQuery.rows[0];
    
    // Ensure numeric values (PostgreSQL DECIMAL returns strings in JSON)
    const totalRevenue = parseFloat(raffle.total_revenue) || 0;
    
    // Calculate remaining tickets
    const ticketsRemaining = raffle.max_tickets ? raffle.max_tickets - raffle.tickets_sold : null;
    
    // Calculate days remaining
    const endDate = new Date(raffle.end_date);
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

    // PROTOCOL: Calculate threshold status
    const ticketsNeededForThreshold = Math.max(0, raffle.minimum_threshold_tickets - raffle.tickets_sold);
    const thresholdPercentage = Math.round((raffle.tickets_sold / raffle.minimum_threshold_tickets) * 100);

    res.status(200).json({
      success: true,
      raffle: {
        ...raffle,
        total_revenue: totalRevenue,
        tickets_remaining: ticketsRemaining,
        days_remaining: daysRemaining,
        images: raffle.images || [],
        // PROTOCOL: Threshold information for display
        threshold: {
          minimum_required: raffle.minimum_threshold_tickets,
          tickets_sold: raffle.tickets_sold,
          tickets_needed: ticketsNeededForThreshold,
          percentage_to_threshold: thresholdPercentage,
          threshold_met: raffle.tickets_sold >= raffle.minimum_threshold_tickets
        },
        // PROTOCOL: Outcome scenarios for transparency
        outcome_scenarios: {
          if_threshold_met: 'One winner will receive the original artwork and Certificate of Authenticity',
          if_threshold_not_met: `One winner will receive a cash prize of approximately $${(totalRevenue * raffle.cash_prize_percentage / 100).toFixed(2)}`
        }
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch raffle status' });
  } finally {
    await pool.end();
  }
}