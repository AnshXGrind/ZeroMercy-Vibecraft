# PowerShell deployment script for Windows

Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Check if changes exist
$changes = git status --short
if ($changes) {
    Write-Host "📝 Committing changes..." -ForegroundColor Yellow
    git add .
    git commit -m "Fix: Video playback, clean URLs, navigation, and all deployment issues"
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Blue
}

Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host "✅ Pushed to GitHub" -ForegroundColor Green

Write-Host ""
Write-Host "🎯 Deployment will start automatically on Vercel" -ForegroundColor Magenta
Write-Host ""
Write-Host "Monitor deployment at: https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Your site: https://zeromercy01.vercel.app/" -ForegroundColor White
Write-Host ""
Write-Host "✨ Done!" -ForegroundColor Green
