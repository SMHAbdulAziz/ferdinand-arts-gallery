-- Migration: Add entry_method column to tickets table
-- This column tracks whether a ticket was purchased (paid) or from a free entry (free_entry)

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS entry_method VARCHAR(50) DEFAULT 'paid';
