# Development Login Credentials

This document contains the default login credentials for testing the BirchwoodCC application in development mode.

## Test Member Account

**Email:** `member@birchwoodcc.com`  
**Password:** `member123`  
**Member ID:** `BW001`  
**Membership Type:** `general`

## Admin Account

**Option 1 - Username-based:**
**Username:** `admin`  
**Password:** `admin123`  
**Role:** `admin`  

**Option 2 - Email-based (easier for browsers):**
**Username:** `admin@birchwoodcc.com`  
**Password:** `admin123`  
**Role:** `admin`

## Password Hashing Information

The current implementation uses SHA-256 hashing for passwords. Here are the hashed versions:

- `member123` → `ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f`
- `admin123` → `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`

## Setting Up Test Data

To set up the test accounts, run the following SQL commands on your database:

```sql
-- Insert test member
INSERT OR IGNORE INTO members (
    email, password_hash, first_name, last_name, 
    membership_type, member_id, phone, is_active
) VALUES (
    'member@birchwoodcc.com', 
    'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    'John', 'Doe', 'Full', 'BW001', '(231) 555-0123', 1
);

-- Update/Insert admin users with correct password hash
UPDATE admin_users SET password_hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' 
WHERE username = 'admin';

INSERT OR IGNORE INTO admin_users (username, password_hash, full_name, role) 
VALUES ('admin@birchwoodcc.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Admin User', 'admin');
```

## Additional Test Members

You can create additional test members with these credentials:

### Property Member
**Email:** `premium@birchwoodcc.com`  
**Password:** `premium123`  
**Member ID:** `BW002`  
**Membership Type:** `property`

### Social Member  
**Email:** `basic@birchwoodcc.com`  
**Password:** `basic123`  
**Member ID:** `BW003`  
**Membership Type:** `social`

## Important Security Notes

⚠️ **WARNING**: These are development-only credentials with simple SHA-256 hashing.

**For Production:**
- Use proper password hashing libraries (bcrypt, scrypt, or Argon2)
- Use strong, unique passwords
- Implement proper password policies
- Use environment variables for admin credentials
- Enable proper session security and HTTPS
- Implement rate limiting for login attempts

## Quick Setup Commands

To quickly hash a new password for testing:

```javascript
// Run this in browser console or Node.js
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Example usage:
hashPassword('your_password_here').then(console.log);
```
