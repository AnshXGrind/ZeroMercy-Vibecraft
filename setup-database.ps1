# Supabase Database Setup Script
# This script helps you set up the database tables in Supabase

Write-Host "🚀 Supabase Database Setup for Vibecraft" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

$projectUrl = "https://opqstjxvkzdxkpzadihv.supabase.co"
$projectId = "opqstjxvkzdxkpzadihv"
$sqlEditorUrl = "https://supabase.com/dashboard/project/$projectId/sql"

Write-Host "📋 Migration Files to Execute:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. supabase-migrations/00_profiles.sql" -ForegroundColor White
Write-Host "   Creates the 'profiles' table for user accounts" -ForegroundColor Gray
Write-Host ""
Write-Host "2. supabase-migrations/01_quick_registrations.sql" -ForegroundColor White
Write-Host "   Creates the 'quick_registrations' table for event sign-ups" -ForegroundColor Gray
Write-Host ""

Write-Host "📍 Steps to Set Up Database:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Step 1: Open Supabase SQL Editor" -ForegroundColor Green
Write-Host "        URL: $sqlEditorUrl" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 2: Execute 00_profiles.sql" -ForegroundColor Green
Write-Host "        - Copy contents of supabase-migrations/00_profiles.sql" -ForegroundColor Gray
Write-Host "        - Paste into SQL Editor" -ForegroundColor Gray
Write-Host "        - Click 'RUN' button" -ForegroundColor Gray
Write-Host "        - Wait for 'Success' message" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 3: Execute 01_quick_registrations.sql" -ForegroundColor Green
Write-Host "        - Copy contents of supabase-migrations/01_quick_registrations.sql" -ForegroundColor Gray
Write-Host "        - Paste into SQL Editor" -ForegroundColor Gray
Write-Host "        - Click 'RUN' button" -ForegroundColor Gray
Write-Host "        - Wait for 'Success' message" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 4: Verify Tables Created" -ForegroundColor Green
Write-Host "        - Go to Table Editor: https://supabase.com/dashboard/project/$projectId/editor" -ForegroundColor Gray
Write-Host "        - You should see 'profiles' and 'quick_registrations' tables" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 Quick Check Query (Optional):" -ForegroundColor Cyan
Write-Host "   Run this in SQL Editor to verify tables exist:" -ForegroundColor Gray
Write-Host ""
Write-Host "   SELECT table_name FROM information_schema.tables" -ForegroundColor Yellow
Write-Host "   WHERE table_schema = 'public'" -ForegroundColor Yellow
Write-Host "   AND table_name IN ('profiles', 'quick_registrations');" -ForegroundColor Yellow
Write-Host ""

$openEditor = Read-Host "Would you like to open the SQL Editor in your browser? (Y/N)"
if ($openEditor -eq 'Y' -or $openEditor -eq 'y') {
    Write-Host "🌐 Opening SQL Editor..." -ForegroundColor Green
    Start-Process $sqlEditorUrl
    Write-Host ""
    Write-Host "✅ Browser opened. Please execute the migration files manually." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✅ Setup instructions displayed. Execute migrations manually at:" -ForegroundColor Green
    Write-Host "   $sqlEditorUrl" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📚 Additional Resources:" -ForegroundColor Cyan
Write-Host "   - Supabase Dashboard: https://supabase.com/dashboard/project/$projectId" -ForegroundColor Gray
Write-Host "   - Table Editor: https://supabase.com/dashboard/project/$projectId/editor" -ForegroundColor Gray
Write-Host "   - API Docs: https://supabase.com/dashboard/project/$projectId/api" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ After running migrations, test registration at: http://localhost:5173/register.html" -ForegroundColor Green
Write-Host ""
