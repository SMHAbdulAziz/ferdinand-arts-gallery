-- Migration: Add address column to users table
-- This column stores structured address information as JSONB

ALTER TABLE users ADD COLUMN IF NOT EXISTS address JSONB;
