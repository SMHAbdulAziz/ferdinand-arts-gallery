// PayPal configuration for The FUND
import { config } from './config';

// PayPal configuration constants
export const PAYPAL_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  mode: process.env.PAYPAL_MODE || 'sandbox', // 'sandbox' or 'production'
  currency: 'USD',
  
  // Raffle ticket product
  raffleTicket: {
    name: 'The FUND - Raffle Ticket',
    description: 'Support Ferdinand\'s aviation education fund through art raffle',
    price: config.raffleTicketPrice, // PayPal uses regular dollars, not cents
    currency: 'USD',
  },
  
  // PayPal API endpoints
  apiBase: process.env.PAYPAL_MODE === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com',
    
  // Order configuration
  orderConfig: {
    intent: 'CAPTURE',
    application_context: {
      brand_name: 'The FUND Gallery',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/raffle`,
    },
  },
} as const;

// PayPal webhook event types we handle
export const PAYPAL_WEBHOOK_EVENTS = {
  PAYMENT_CAPTURE_COMPLETED: 'PAYMENT.CAPTURE.COMPLETED',
  PAYMENT_CAPTURE_DENIED: 'PAYMENT.CAPTURE.DENIED',
  PAYMENT_CAPTURE_PENDING: 'PAYMENT.CAPTURE.PENDING',
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

// Helper function to get PayPal access token
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_CONFIG.apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  const data = await response.json();
  return data.access_token;
}

export default PAYPAL_CONFIG;