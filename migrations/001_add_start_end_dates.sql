-- Migration: Add start_date and end_date columns, remove due_date
-- This migration updates the tasks table to support date ranges

-- Add new columns
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_date TIMESTAMP;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;

-- Migrate existing due_date data to end_date
UPDATE tasks SET end_date = due_date WHERE due_date IS NOT NULL;

-- Drop old column
ALTER TABLE tasks DROP COLUMN IF EXISTS due_date;
