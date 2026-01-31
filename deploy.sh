#!/bin/bash

echo "🚀 Deploying to Vercel..."
echo ""

# Check if changes exist
if [[ -n $(git status -s) ]]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Fix: Video playback, clean URLs, navigation, and all deployment issues"
    echo "✅ Changes committed"
else
    echo "ℹ️  No changes to commit"
fi

echo ""
echo "📤 Pushing to GitHub..."
git push origin main
echo "✅ Pushed to GitHub"

echo ""
echo "🎯 Deployment will start automatically on Vercel"
echo ""
echo "Monitor deployment at: https://vercel.com/dashboard"
echo ""
echo "Your site: https://zeromercy01.vercel.app/"
echo ""
echo "✨ Done!"
