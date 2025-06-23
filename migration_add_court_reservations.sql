-- Add tennis and pickleball court reservations table
CREATE TABLE IF NOT EXISTS court_reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    court_type TEXT NOT NULL CHECK (court_type IN ('tennis', 'pickleball')),
    court_number INTEGER,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- duration in minutes
    notes TEXT,
    status TEXT DEFAULT 'active',
    created_by_admin BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_court_reservations_member ON court_reservations(member_id);
CREATE INDEX IF NOT EXISTS idx_court_reservations_date ON court_reservations(date);
CREATE INDEX IF NOT EXISTS idx_court_reservations_court_type ON court_reservations(court_type);
CREATE INDEX IF NOT EXISTS idx_court_reservations_court_number ON court_reservations(court_number);
