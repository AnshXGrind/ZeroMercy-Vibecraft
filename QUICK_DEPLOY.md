# 🚀 Quick Deploy Commands

## Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build (localhost:5174)
```

## Deploy to Vercel

### Method 1: Vercel CLI (Fastest)
```bash
npm install -g vercel
vercel --prod
```

### Method 2: Git Push (Recommended)
```bash
git add .
git commit -m "Fixed all bugs, ready for Vercel deployment"
git push origin main
```
Then connect your repo on vercel.com

### Method 3: One Command Deploy
```bash
vercel --prod --yes
```

## Build Verification ✅
- Build completed successfully ✓
- All 11 HTML pages included ✓
- React components bundled ✓
- Assets optimized ✓
- Preview server running on http://localhost:5174 ✓

## What's Deployed
- Main site: `/` → video-hero.html
- Event page with 3D cards
- All static pages (about, sponsors, FAQ, etc.)
- Event detail pages
- Login/Register forms
- PWA manifest

## Post-Deployment Checklist
- [ ] Visit your Vercel URL
- [ ] Test main page loads
- [ ] Check event page interactions
- [ ] Verify mobile responsiveness
- [ ] Test all navigation links
- [ ] Confirm video background plays

---
💡 **Tip**: Vercel auto-detects the config from `vercel.json` - no manual setup needed!
