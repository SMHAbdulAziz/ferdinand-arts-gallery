-- Add missing columns to raffles table for threshold and outcome tracking
ALTER TABLE raffles 
ADD COLUMN IF NOT EXISTS threshold_met BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS outcome_type VARCHAR(50) DEFAULT 'pending';

-- Verify the columns exist
\d raffles
