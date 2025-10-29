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
      // Record the raffle entry in your database
      // const raffleEntry = await createRaffleEntry({
      //   email,
      //   name,
      //   amount: parseFloat(amount),
      //   paymentId: orderId,
      //   paymentProvider: 'paypal'
      // });

      // Calculate ministry donation (10%)
      const donationAmount = parseFloat(amount) * 0.1;
      
      res.status(200).json({ 
        success: true, 
        message: 'Raffle entry recorded',
        donation: donationAmount
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('PayPal verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
}