-- Migration: Change artwork_id from UUID to TEXT to accept URL strings
-- This allows raffles to store artwork URLs directly instead of UUID references

-- Drop the foreign key constraint first
ALTER TABLE raffles DROP CONSTRAINT IF EXISTS raffles_artwork_id_fkey;

-- Change the column type from UUID to TEXT
ALTER TABLE raffles ALTER COLUMN artwork_id TYPE TEXT;

-- Add a comment explaining the change
COMMENT ON COLUMN raffles.artwork_id IS 'URL string reference to artwork image (e.g., https://example.com/image.jpg)';
