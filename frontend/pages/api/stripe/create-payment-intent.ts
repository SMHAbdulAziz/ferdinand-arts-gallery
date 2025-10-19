// API endpoint to create payment intent for raffle tickets
import { NextApiRequest, NextApiResponse } from 'next';
import { stripe, STRIPE_CONFIG } from '../../../lib/stripe';
import { config } from '../../../lib/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { quantity = 1, email, customerName } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1 || quantity > 10) {
      return res.status(400).json({ 
        error: 'Invalid quantity. Must be between 1 and 10 tickets.' 
      });
    }

    // Calculate total amount
    const totalAmount = quantity * config.raffleTicketPrice * 100; // Convert to cents

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: STRIPE_CONFIG.currency,
      ...STRIPE_CONFIG.paymentIntentConfig,
      metadata: {
        ...STRIPE_CONFIG.paymentIntentConfig.metadata,
        quantity: quantity.toString(),
        customer_email: email || '',
        customer_name: customerName || '',
        ticket_price: config.raffleTicketPrice.toString(),
        raffle_name: 'Playful Giraffe',
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      quantity,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}