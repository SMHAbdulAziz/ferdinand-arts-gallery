// Handle PayPal webhook/completion
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, payerId, amount, email, name } = req.body;

    // Verify the payment with PayPal API
    const paypalAuth = await fetch(`${process.env.PAYPAL_MODE === 'live' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com'}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const authData = await paypalAuth.json();

    // Get order details from PayPal
    const orderDetails = await fetch(`${process.env.PAYPAL_MODE === 'live' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com'}/v2/checkout/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Accept': 'application/json'
      }
    });

    const order = await orderDetails.json();

    if (order.status === 'COMPLETED') {
      // Connect to database and record the purchase
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });

      try {
        // Get the active raffle (assuming there's one active raffle for Ferdinand's Giraffe)
        const raffleQuery = await pool.query(
          "SELECT id, tickets_sold, ticket_price FROM raffles WHERE status = 'active' LIMIT 1"
        );
        
        if (raffleQuery.rows.length === 0) {
          return res.status(400).json({ error: 'No active raffle found' });
        }

        const raffle = raffleQuery.rows[0];
        const ticketCount = Math.floor(parseFloat(amount) / raffle.ticket_price);

        // Create or get user
        let user;
        const userQuery = await pool.query(
          'SELECT id FROM users WHERE email = $1',
          [email]
        );

        if (userQuery.rows.length > 0) {
          user = userQuery.rows[0];
        } else {
          const newUserQuery = await pool.query(
            'INSERT INTO users (email, first_name, last_name) VALUES ($1, $2, $3) RETURNING id',
            [email, name ? name.split(' ')[0] : '', name ? name.split(' ').slice(1).join(' ') : '']
          );
          user = newUserQuery.rows[0];
        }

        // Create tickets
        for (let i = 0; i < ticketCount; i++) {
          const ticketNumber = raffle.tickets_sold + i + 1;
          await pool.query(
            'INSERT INTO tickets (raffle_id, user_id, ticket_number, stripe_payment_intent_id) VALUES ($1, $2, $3, $4)',
            [raffle.id, user.id, ticketNumber, orderId]
          );
        }

        // Update raffle tickets sold count
        await pool.query(
          'UPDATE raffles SET tickets_sold = tickets_sold + $1, total_revenue = total_revenue + $2 WHERE id = $3',
          [ticketCount, parseFloat(amount), raffle.id]
        );

        // Record transaction
        await pool.query(
          'INSERT INTO transactions (user_id, raffle_id, type, amount, stripe_payment_intent_id, status, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [user.id, raffle.id, 'ticket_purchase', parseFloat(amount), orderId, 'completed', `PayPal purchase for ${ticketCount} raffle tickets`]
        );

        // Calculate ministry donation (10%)
        const donationAmount = parseFloat(amount) * 0.1;
        
        res.status(200).json({ 
          success: true, 
          message: 'Raffle entry recorded',
          donation: donationAmount,
          ticketCount: ticketCount,
          newTicketsSold: raffle.tickets_sold + ticketCount
        });
        
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ error: 'Failed to record raffle entry' });
      } finally {
        await pool.end();
      }
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('PayPal verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
}