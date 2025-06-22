-- Migration to add allow_additional_players column to tee_times table
-- Run this if you have existing data

-- Check if column exists first, then add it if it doesn't
ALTER TABLE tee_times ADD COLUMN allow_additional_players BOOLEAN DEFAULT 1;

-- Update existing records to allow additional players by default
UPDATE tee_times SET allow_additional_players = 1 WHERE allow_additional_players IS NULL;
