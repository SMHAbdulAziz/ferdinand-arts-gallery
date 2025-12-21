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

    // Get user's transaction history
    const result = await query(
      `SELECT 
        t.id,
        t.type,
        t.amount,
        t.currency,
        t.status,
        t.description,
        t.created_at,
        r.title as raffle_title,
        r.id as raffle_id
      FROM transactions t
      LEFT JOIN raffles r ON t.raffle_id = r.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC`,
      [decoded.userId]
    );

    const transactions = result.rows.map(row => ({
      id: row.id,
      type: row.type,
      amount: parseFloat(row.amount),
      currency: row.currency,
      status: row.status,
      description: row.description,
      createdAt: row.created_at,
      raffle: row.raffle_title ? {
        title: row.raffle_title,
        id: row.raffle_id
      } : null
    }));

    // Calculate summary
    const totalSpent = transactions
      .filter(t => t.type === 'ticket_purchase' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTickets = await query(
      'SELECT COUNT(*) as count FROM tickets WHERE user_id = $1',
      [decoded.userId]
    );

    return res.status(200).json({
      success: true,
      summary: {
        totalSpent,
        totalTickets: parseInt(totalTickets.rows[0].count),
        totalTransactions: transactions.length
      },
      transactions
    });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({ error: 'Failed to get purchase history' });
  }
}
