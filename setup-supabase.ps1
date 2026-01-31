# Supabase Setup Script
# This script opens Supabase SQL Editor for you to run the migration

Write-Host "Setting up Supabase database..." -ForegroundColor Cyan
Write-Host ""
Write-Host "STEP 1: Open Supabase SQL Editor" -ForegroundColor Yellow
Write-Host "Opening https://supabase.com/dashboard/project/opqstjxvkzdxkpzadihv/sql" -ForegroundColor Gray
Start-Process "https://supabase.com/dashboard/project/opqstjxvkzdxkpzadihv/sql"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "STEP 2: Copy the SQL migration" -ForegroundColor Yellow
$sqlContent = Get-Content ".\supabase-migrations\01_quick_registrations.sql" -Raw
Set-Clipboard -Value $sqlContent
Write-Host "[OK] SQL copied to clipboard!" -ForegroundColor Green

Write-Host ""
Write-Host "STEP 3: Paste and Execute" -ForegroundColor Yellow
Write-Host "1. Paste the SQL into the editor (Ctrl+V)" -ForegroundColor Gray
Write-Host "2. Click 'Run' or press Ctrl+Enter" -ForegroundColor Gray
Write-Host "3. Verify: You should see 'Success. No rows returned'" -ForegroundColor Gray

Write-Host ""
Write-Host "STEP 4: Verify the table" -ForegroundColor Yellow
Write-Host "Run this query to verify:" -ForegroundColor Gray
Write-Host "SELECT * FROM public.quick_registrations LIMIT 1;" -ForegroundColor White

Write-Host ""
Write-Host 'Press any key when done...' -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

Write-Host ""
Write-Host "[SUCCESS] Setup complete! Your quick_registrations table is ready." -ForegroundColor Green
