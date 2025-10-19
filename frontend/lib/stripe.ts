// Stripe configuration for The FUND
import Stripe from 'stripe';
import { config } from './config';

// Initialize Stripe with secret key (server-side only)
export const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Stripe configuration constants
export const STRIPE_CONFIG = {
  publishableKey: config.stripePublishableKey,
  currency: 'usd',
  
  // Raffle ticket product
  raffleTicket: {
    name: 'The FUND - Raffle Ticket',
    description: 'Support Ferdinand\'s aviation education fund through art raffle',
    price: config.raffleTicketPrice * 100, // Convert to cents
    currency: 'usd',
  },
  
  // Payment intent configuration
  paymentIntentConfig: {
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      foundation: 'The FUND',
      purpose: 'Aviation Education Fund',
      artwork: 'Playful Giraffe',
      artwork_value: config.raffleArtworkValue.toString(),
    },
  },
} as const;

// Webhook event types we handle
export const WEBHOOK_EVENTS = {
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
  CHARGE_DISPUTE_CREATED: 'charge.dispute.created',
} as const;

// Helper function to format amount for display
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Helper function to calculate raffle progress
export function calculateRaffleProgress(totalSales: number): {
  percentage: number;
  remaining: number;
  ticketsSold: number;
  totalNeeded: number;
} {
  const ticketsSold = Math.floor(totalSales / config.raffleTicketPrice);
  const totalNeeded = Math.ceil(config.raffleTargetAmount / config.raffleTicketPrice);
  const percentage = Math.min((ticketsSold / totalNeeded) * 100, 100);
  const remaining = Math.max(totalNeeded - ticketsSold, 0);
  
  return {
    percentage,
    remaining,
    ticketsSold,
    totalNeeded,
  };
}

export default stripe;