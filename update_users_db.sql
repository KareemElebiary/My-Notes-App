USE my_notes_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add user_id to notes table
-- We check if the column exists first to avoid errors on re-runs (simple way: just try adding it, ignore if exists, but for script cleanliness we'll just add it)
-- Since this is a simple local setup, I'll just ALTER command.
ALTER TABLE notes ADD COLUMN user_id INT;
ALTER TABLE notes ADD CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update editor_content table to be user-specific
-- First, let's clear the old single-row structure if we want a clean slate, or modify it.
-- Let's TRUNCATE it to start fresh with users.
TRUNCATE TABLE editor_content;

ALTER TABLE editor_content ADD COLUMN user_id INT NOT NULL;
ALTER TABLE editor_content ADD CONSTRAINT fk_editor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Remove the old auto-increment primary key if it's just meant to be one-per-user, 
-- or keep it and add a unique constraint on user_id.
-- Let's add a unique constraint on user_id so each user has only one editor state.
ALTER TABLE editor_content ADD CONSTRAINT unique_user_editor UNIQUE (user_id);
