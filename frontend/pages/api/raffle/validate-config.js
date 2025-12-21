// Validate raffle configuration (prevent mid-raffle changes per PROTOCOL)
const { Pool } = require('pg');

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Add auth check for admin-only access
  const { raffleId, field, value } = req.body;

  if (!raffleId) {
    return res.status(400).json({ error: 'raffleId required' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Get raffle status
    const raffleQuery = await pool.query(
      `SELECT status, start_date FROM raffles WHERE id = $1`,
      [raffleId]
    );

    if (raffleQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Raffle not found' });
    }

    const raffle = raffleQuery.rows[0];
    const isActive = raffle.status === 'active' || new Date(raffle.start_date) < new Date();

    // PROTOCOL: Prevent changes once raffle has started
    if (isActive && req.method === 'POST') {
      return res.status(400).json({
        error: 'Cannot modify raffle configuration after raffle has started',
        message: 'Per Raffle Protocols: ticket price and threshold cannot change after launch',
        status: raffle.status
      });
    }

    // List of fields that cannot be changed after launch
    const protectedFields = [
      'ticket_price',
      'minimum_threshold_tickets',
      'max_tickets',
      'start_date',
      'end_date'
    ];

    if (req.method === 'POST') {
      if (protectedFields.includes(field)) {
        return res.status(400).json({
          success: false,
          allowed: false,
          reason: `Field "${field}" cannot be modified (protected per Raffle Protocols)`,
          protected_fields: protectedFields
        });
      }

      // Field is allowed to change
      return res.status(200).json({
        success: true,
        allowed: true,
        raffle_id: raffleId,
        message: `Field "${field}" can be safely modified`
      });
    }

    // GET: Return validation summary
    res.status(200).json({
      success: true,
      raffle_id: raffleId,
      status: raffle.status,
      is_active: isActive,
      protected_fields: protectedFields,
      can_modify: !isActive,
      message: isActive 
        ? 'Raffle is active - only view operations allowed'
        : 'Raffle is not yet active - configuration changes allowed'
    });

  } catch (error) {
    console.error('Config validation error:', error);
    res.status(500).json({ error: 'Failed to validate configuration', details: error.message });
  } finally {
    await pool.end();
  }
}
