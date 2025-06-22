-- Members table
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    membership_type TEXT NOT NULL,
    member_id TEXT UNIQUE NOT NULL,
    phone TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Member sessions table
CREATE TABLE IF NOT EXISTS member_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

-- Member preferences table
CREATE TABLE IF NOT EXISTS member_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    newsletter_opt_in BOOLEAN DEFAULT 1,
    event_notifications BOOLEAN DEFAULT 1,
    preferred_communication TEXT DEFAULT 'email',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

-- Tee times table
CREATE TABLE IF NOT EXISTS tee_times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    course_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    players INTEGER DEFAULT 1,
    player_names TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active',
    allow_additional_players BOOLEAN DEFAULT 1,
    created_by_admin BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

-- Dining reservations table
CREATE TABLE IF NOT EXISTS dining_reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    special_requests TEXT,
    status TEXT DEFAULT 'confirmed',
    created_by_admin BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

-- Guest passes table
CREATE TABLE IF NOT EXISTS guest_passes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    visit_date DATE NOT NULL,
    pass_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT,
    max_attendees INTEGER,
    cost DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'registered',
    FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE,
    UNIQUE(event_id, member_id)
);

-- Admin users table (for admin panel access)
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO admin_users (username, password_hash, full_name, role) 
VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'System Administrator', 'admin');

-- Insert email-based admin user for easier access (password: admin123)
INSERT OR IGNORE INTO admin_users (username, password_hash, full_name, role) 
VALUES ('admin@birchwoodcc.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Admin User', 'admin');

-- Insert test member accounts for development
INSERT OR IGNORE INTO members (email, password_hash, first_name, last_name, membership_type, member_id, phone, is_active) 
VALUES ('member@birchwoodcc.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'John', 'Doe', 'Full', 'BW001', '(231) 555-0123', 1);

INSERT OR IGNORE INTO members (email, password_hash, first_name, last_name, membership_type, member_id, phone, is_active) 
VALUES ('premium@birchwoodcc.com', 'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646', 'Jane', 'Smith', 'Premium', 'BW002', '(231) 555-0124', 1);

INSERT OR IGNORE INTO members (email, password_hash, first_name, last_name, membership_type, member_id, phone, is_active) 
VALUES ('basic@birchwoodcc.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Bob', 'Johnson', 'Basic', 'BW003', '(231) 555-0125', 1);

-- Insert member preferences for test accounts
INSERT OR IGNORE INTO member_preferences (member_id, newsletter_opt_in, event_notifications, preferred_communication)
VALUES (1, 1, 1, 'email'), (2, 1, 0, 'email'), (3, 0, 1, 'phone');

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users (id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_member_id ON members(member_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON member_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON member_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_preferences_member ON member_preferences(member_id);
CREATE INDEX IF NOT EXISTS idx_tee_times_member ON tee_times(member_id);
CREATE INDEX IF NOT EXISTS idx_tee_times_date ON tee_times(date);
CREATE INDEX IF NOT EXISTS idx_dining_member ON dining_reservations(member_id);
CREATE INDEX IF NOT EXISTS idx_dining_date ON dining_reservations(date);
CREATE INDEX IF NOT EXISTS idx_guest_passes_member ON guest_passes(member_id);
CREATE INDEX IF NOT EXISTS idx_guest_passes_code ON guest_passes(pass_code);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
