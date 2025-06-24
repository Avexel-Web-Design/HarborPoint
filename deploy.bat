@echo off
REM Deployment script for Birchwood Country Club (Windows)
REM This script ensures the production database has all necessary tables

echo 🚀 Starting Birchwood CC deployment...

REM Step 1: Build the application
echo 📦 Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    exit /b 1
)

REM Step 2: Initialize/update the production database schema
echo 🗄️ Setting up production database schema...
call wrangler d1 execute birchwood-members --file=./production-schema.sql --remote
if %errorlevel% neq 0 (
    echo ❌ Database setup failed!
    exit /b 1
)

REM Step 3: Deploy to Cloudflare Pages
echo ☁️ Deploying to Cloudflare Pages...
call wrangler pages deploy dist
if %errorlevel% neq 0 (
    echo ❌ Deployment failed!
    exit /b 1
)

echo ✅ Deployment complete!
echo.
echo 🔧 Troubleshooting:
echo If you still experience issues:
echo 1. Check the Cloudflare Pages function logs in the dashboard
echo 2. Verify the database binding is correct in wrangler.toml
echo 3. Ensure all environment variables are set correctly
echo.
echo 📋 Test the deployment:
echo 1. Try logging in with: member@birchwoodcc.com / secret123
echo 2. Navigate to tee times and tennis courts
echo 3. Check browser console for any error messages

pause
