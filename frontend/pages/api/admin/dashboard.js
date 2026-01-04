// Get dashboard statistics from the database
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
    // Get active raffles count
    const activeRafflesResult = await pool.query(`
      SELECT COUNT(*) as count FROM raffles WHERE status = 'active'
    `);
    const activeRaffles = parseInt(activeRafflesResult.rows[0].count);

    // Get total raffles count
    const totalRafflesResult = await pool.query(`
      SELECT COUNT(*) as count FROM raffles
    `);
    const totalRaffles = parseInt(totalRafflesResult.rows[0].count);

    // Get tickets sold and revenue data
    const ticketsResult = await pool.query(`
      SELECT 
        COALESCE(SUM(tickets_sold), 0) as tickets_sold,
        COALESCE(SUM(total_revenue), 0) as total_revenue
      FROM raffles
    `);
    const ticketData = ticketsResult.rows[0];
    const totalTicketsSold = parseInt(ticketData.tickets_sold);
    const totalRevenue = parseFloat(ticketData.total_revenue);

    // Get Ferdinand's fund info
    const ferdinandResult = await pool.query(`
      SELECT 
        education_fund_target,
        education_fund_raised
      FROM artists
      WHERE name = 'Ferdinand Ssekyanja'
    `);
    
    let ferdinandFund = 0;
    let ferdinandFundTarget = 269000;
    
    if (ferdinandResult.rows.length > 0) {
      ferdinandFund = parseFloat(ferdinandResult.rows[0].education_fund_raised) || 0;
      ferdinandFundTarget = parseFloat(ferdinandResult.rows[0].education_fund_target) || 269000;
    }

    // Get recent ticket purchases (last 5)
    const recentTicketsResult = await pool.query(`
      SELECT 
        u.email,
        r.title as raffle_title,
        COUNT(t.id) as tickets_purchased,
        COALESCE(SUM(r.ticket_price * COUNT(t.id)), 0) as total_amount,
        MAX(t.purchase_date) as purchase_date
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      JOIN raffles r ON t.raffle_id = r.id
      WHERE t.status = 'active'
      GROUP BY u.email, r.title
      ORDER BY MAX(t.purchase_date) DESC
      LIMIT 5
    `);

    const recentTickets = recentTicketsResult.rows.map(row => ({
      email: row.email,
      raffle: row.raffle_title,
      tickets: parseInt(row.tickets_purchased),
      amount: parseFloat(row.total_amount),
      date: row.purchase_date ? new Date(row.purchase_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalRaffles,
        activeRaffles,
        totalTicketsSold,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        ferdinandFund: Math.round(ferdinandFund * 100) / 100,
        ferdinandFundTarget: Math.round(ferdinandFundTarget * 100) / 100
      },
      recentTickets
    });

  } catch (error) {
    console.error('Dashboard query error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: error.message });
  } finally {
    await pool.end();
  }
}
