// Environment configuration for The FUND
// This file manages all environment variables and configuration settings

interface Config {
  // Database
  databaseUrl: string;
  
  // Stripe
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  
  // App
  nextAuthUrl: string;
  nextAuthSecret: string;
  nodeEnv: string;
  
  // Raffle Settings
  raffleTicketPrice: number;
  raffleArtworkValue: number;
  raffleTargetAmount: number;
  
  // Email (Optional)
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  adminEmail?: string;
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

function getOptionalEnvVar(name: string): string | undefined {
  return process.env[name];
}

function getNumericEnvVar(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }
  return parsed;
}

export const config: Config = {
  // Database
  databaseUrl: getEnvVar('DATABASE_URL'),
  
  // Stripe
  stripePublishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  stripeSecretKey: getEnvVar('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  
  // App
  nextAuthUrl: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  
  // Raffle Settings
  raffleTicketPrice: getNumericEnvVar('RAFFLE_TICKET_PRICE', 50),
  raffleArtworkValue: getNumericEnvVar('RAFFLE_ARTWORK_VALUE', 700),
  raffleTargetAmount: getNumericEnvVar('RAFFLE_TARGET_AMOUNT', 269000),
  
  // Email (Optional)
  smtpHost: getOptionalEnvVar('SMTP_HOST'),
  smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
  smtpUser: getOptionalEnvVar('SMTP_USER'),
  smtpPassword: getOptionalEnvVar('SMTP_PASSWORD'),
  adminEmail: getOptionalEnvVar('ADMIN_EMAIL'),
};

// Validate critical environment variables on startup
export function validateConfig(): void {
  const requiredVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXTAUTH_SECRET'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`  - ${varName}`));
    console.error('\n📝 Check your .env.local file and ENVIRONMENT_SETUP.md for guidance');
    
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
  } else {
    console.log('✅ Environment configuration validated successfully');
  }
}

export default config;