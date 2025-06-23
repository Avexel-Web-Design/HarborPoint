-- Migration to support individual member bookings for tee times
-- This allows each member who joins a tee time to have their own booking record

-- Create new table for individual tee time bookings
CREATE TABLE IF NOT EXISTS tee_time_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    course_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    players INTEGER DEFAULT 1,
    player_names TEXT, -- Names of players in this specific booking (e.g., "John Smith, Jane Doe")
    notes TEXT,
    status TEXT DEFAULT 'active',
    allow_additional_players BOOLEAN DEFAULT 1, -- Only applies to the first booking of a time slot
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

-- Create indexes for the new table
CREATE INDEX IF NOT EXISTS idx_tee_time_bookings_member ON tee_time_bookings(member_id);
CREATE INDEX IF NOT EXISTS idx_tee_time_bookings_date ON tee_time_bookings(date);
CREATE INDEX IF NOT EXISTS idx_tee_time_bookings_slot ON tee_time_bookings(course_name, date, time);

-- Note: We'll keep the old tee_times table for now to avoid breaking existing data
-- The application will gradually migrate to using tee_time_bookings
