# Troubleshooting Guide - Tee Times & Tennis Courts Not Working in Production

## Issue Summary
Tee times and tennis court bookings work perfectly in local development (`npm run dev` with `wrangler pages dev`) but fail completely in Cloudflare Pages production deployment.

## Root Causes Identified

### 1. Missing Database Tables
The production database likely doesn't have the new table structures:
- `tee_time_bookings` (instead of legacy `tee_times`)  
- `court_reservations` (new table for tennis/pickleball)

### 2. CORS Issues
API endpoints may not have proper CORS headers for cross-origin requests in production.

### 3. Environment Variable Issues
Database bindings or JWT secrets might not be properly configured in production.

## Solutions Applied

### ✅ Database Schema Fix
- Created `production-schema.sql` with all required tables and indexes
- Includes both new tables (`tee_time_bookings`, `court_reservations`) and legacy compatibility

### ✅ CORS Headers Added
- Added proper CORS headers to all API endpoints
- Added OPTIONS method handling for preflight requests
- Created `public/_headers` file for edge-level CORS

### ✅ Enhanced Error Logging
- Added detailed debugging logs to all API functions
- Improved error messages with stack traces and environment info
- Added database connection validation

### ✅ Deployment Scripts
- Created `deploy.bat` (Windows) and `deploy.sh` (Linux/Mac)
- Automated database setup and deployment process

## Deployment Steps

### 1. Run the Production Database Setup
```bash
# Windows
deploy.bat

# Linux/Mac  
chmod +x deploy.sh
./deploy.sh
```

### 2. Manual Database Setup (if needed)
```bash
# Apply the complete schema to production database
wrangler d1 execute birchwood-members --file=./production-schema.sql --remote

# Verify tables exist
wrangler d1 execute birchwood-members --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

### 3. Check Database Binding
Verify `wrangler.toml` has correct database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "birchwood-members"
database_id = "9884a7ff-30a3-40bb-9806-d8e9120a4e85"  # Should match your actual DB ID
```

### 4. Deploy with Proper Build
```bash
npm run build
wrangler pages deploy dist
```

## Testing the Fix

### 1. Check Cloudflare Pages Logs
- Go to Cloudflare Dashboard → Pages → Your Project → Functions
- Look for console.log entries from the API calls
- Check for database connection and authentication logs

### 2. Test API Endpoints Directly
Open browser dev tools and test:
```javascript
// Test authentication
fetch('/api/auth/me', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log);

// Test tee times available
fetch('/api/tee-times/available?date=2025-06-24&courseId=birches')
  .then(r => r.json()) 
  .then(console.log);

// Test tennis courts available
fetch('/api/tennis-courts/available?date=2025-06-24&courtType=tennis', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log);
```

### 3. Check Browser Console
- Login with test account: `member@birchwoodcc.com` / `secret123`
- Navigate to Tee Times and Tennis Courts pages
- Look for API call logs and any error messages

## Common Issues & Fixes

### Issue: "Unauthorized" Errors
**Cause**: Authentication not working in production
**Fix**: Check cookie settings and JWT_SECRET environment variable

### Issue: "Table doesn't exist" Errors  
**Cause**: Database migrations not applied
**Fix**: Run `wrangler d1 execute birchwood-members --file=./production-schema.sql --remote`

### Issue: CORS Errors
**Cause**: Missing CORS headers
**Fix**: Already applied in this update - redeploy the functions

### Issue: 500 Internal Server Error
**Cause**: Various - check function logs
**Fix**: Look at Cloudflare Pages function logs for specific error details

## Verification Checklist

- [ ] Database tables exist (`tee_time_bookings`, `court_reservations`)
- [ ] Test member accounts can login
- [ ] Tee times page loads available slots
- [ ] Tennis courts page shows court availability
- [ ] Can create new bookings/reservations
- [ ] Error messages are meaningful (not generic 500 errors)

## Debug Commands

```bash
# Check database structure
wrangler d1 execute birchwood-members --command="SELECT name FROM sqlite_master WHERE type='table';" --remote

# Check if test members exist
wrangler d1 execute birchwood-members --command="SELECT email, first_name, last_name FROM members LIMIT 5;" --remote

# Check tee time bookings table
wrangler d1 execute birchwood-members --command="SELECT COUNT(*) as count FROM tee_time_bookings;" --remote

# Check court reservations table  
wrangler d1 execute birchwood-members --command="SELECT COUNT(*) as count FROM court_reservations;" --remote
```

## Next Steps if Issues Persist

1. **Check Cloudflare Pages Function Logs** - Most important for debugging
2. **Verify Environment Variables** - JWT_SECRET, database bindings
3. **Test Database Connectivity** - Run simple queries to verify connection
4. **Check Network Tab** - Look for failed API calls and response details
5. **Compare Local vs Production** - Ensure same data and configuration

The enhanced logging should now provide much better error messages to help identify any remaining issues.
