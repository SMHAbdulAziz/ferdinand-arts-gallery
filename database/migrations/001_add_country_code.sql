-- Migration: Add country_code column to users table
-- This column stores the country code (e.g., +1, +44, +91) for the user's phone number

ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code VARCHAR(10);
