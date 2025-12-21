import { verifyToken, extractToken } from '../../../utils/auth';
import { query } from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get user's tickets with raffle info
    const result = await query(
      `SELECT 
        t.id,
        t.ticket_number,
        t.purchase_date,
        t.entry_method,
        t.status,
        r.id as raffle_id,
        r.title as raffle_title,
        r.status as raffle_status,
        r.ticket_price,
        r.end_date,
        r.tickets_sold,
        r.max_tickets,
        r.threshold_met,
        r.outcome_type,
        a.title as artwork_title,
        a.estimated_value
      FROM tickets t
      JOIN raffles r ON t.raffle_id = r.id
      LEFT JOIN artworks a ON r.artwork_id = a.id
      WHERE t.user_id = $1
      ORDER BY t.purchase_date DESC`,
      [decoded.userId]
    );

    const tickets = result.rows.map(row => ({
      id: row.id,
      ticketNumber: row.ticket_number,
      purchaseDate: row.purchase_date,
      entryMethod: row.entry_method,
      status: row.status,
      raffle: {
        id: row.raffle_id,
        title: row.raffle_title,
        status: row.raffle_status,
        ticketPrice: row.ticket_price,
        endDate: row.end_date,
        ticketsSold: row.tickets_sold,
        maxTickets: row.max_tickets,
        thresholdMet: row.threshold_met,
        outcomeType: row.outcome_type,
        artwork: {
          title: row.artwork_title,
          estimatedValue: row.estimated_value
        }
      }
    }));

    return res.status(200).json({
      success: true,
      tickets
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    return res.status(500).json({ error: 'Failed to get user tickets' });
  }
}
