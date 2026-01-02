-- Migration: Add minimum_threshold_tickets column to raffles table
-- This column is critical for the raffle protocol - it defines the minimum
-- number of tickets that must be sold for the artwork to be awarded

ALTER TABLE raffles 
ADD COLUMN IF NOT EXISTS minimum_threshold_tickets INTEGER NOT NULL DEFAULT 0;

-- Verify the column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'raffles' AND column_name = 'minimum_threshold_tickets';
