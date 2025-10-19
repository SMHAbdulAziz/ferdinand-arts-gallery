// Webhook endpoint to handle Stripe events
import { NextApiRequest, NextApiResponse } from 'next';
import { stripe, WEBHOOK_EVENTS } from '../../../lib/stripe';
import { config } from '../../../lib/config';
import { buffer } from 'micro';

// Disable body parsing for webhook
export const config_webhook = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, config.stripeWebhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Handle the event
  try {
    switch (event.type) {
      case WEBHOOK_EVENTS.PAYMENT_INTENT_SUCCEEDED:
        await handlePaymentSuccess(event.data.object);
        break;
        
      case WEBHOOK_EVENTS.PAYMENT_INTENT_PAYMENT_FAILED:
        await handlePaymentFailure(event.data.object);
        break;
        
      case WEBHOOK_EVENTS.CHARGE_DISPUTE_CREATED:
        await handleDispute(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  console.log('✅ Payment succeeded:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    metadata: paymentIntent.metadata,
  });

  // TODO: Save ticket purchase to database
  // TODO: Send confirmation email
  // TODO: Update raffle progress
  
  const quantity = parseInt(paymentIntent.metadata.quantity || '1');
  const customerEmail = paymentIntent.metadata.customer_email;
  const customerName = paymentIntent.metadata.customer_name;
  
  console.log(`🎫 ${quantity} raffle ticket(s) purchased by ${customerName} (${customerEmail})`);
}

async function handlePaymentFailure(paymentIntent: any) {
  console.log('❌ Payment failed:', {
    id: paymentIntent.id,
    last_payment_error: paymentIntent.last_payment_error,
    metadata: paymentIntent.metadata,
  });

  // TODO: Log failed payment attempt
  // TODO: Send notification to admin if needed
}

async function handleDispute(charge: any) {
  console.log('⚠️ Dispute created:', {
    id: charge.id,
    amount: charge.amount,
    reason: charge.reason,
  });

  // TODO: Notify admin of dispute
  // TODO: Log dispute for review
}

export { config_webhook as config };