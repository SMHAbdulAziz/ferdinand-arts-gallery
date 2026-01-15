-- Migration: Update Playful Giraffe Raffle Settings
-- Updates ticket price to $10, threshold to 500, and max tickets to 1000

UPDATE raffles 
SET 
    ticket_price = 10.00,
    minimum_threshold_tickets = 500,
    max_tickets = 1000,
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Playful Giraffe Raffle' 
  AND status = 'active';

-- Verify the update
SELECT id, title, ticket_price, minimum_threshold_tickets, max_tickets, status 
FROM raffles 
WHERE title = 'Playful Giraffe Raffle';
