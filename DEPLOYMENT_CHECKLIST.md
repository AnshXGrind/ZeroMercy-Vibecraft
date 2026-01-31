# Deployment Verification Checklist

## ✅ Completed
- [x] Fixed video background path from `./videos/` to `/videos/hero-bg.mp4`
- [x] Added `publicDir` and `copyPublicDir` to Vite config
- [x] Created serverless API endpoints in `/api`
- [x] Updated auth flow to use serverless profile creation
- [x] Configured environment variables in `.env.local` and `.env.example`
- [x] Built project successfully with videos in dist folder
- [x] Committed and pushed all changes to GitHub

## 🔄 Vercel Deployment Steps

### 1. Add Environment Variables (CRITICAL)
Go to **Vercel Dashboard → Project → Settings → Environment Variables**

**Frontend Variables** (Production + Preview + Development):
```
VITE_SUPABASE_URL=https://opqstjxvkzdxkpzadihv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcXN0anh2a3pkeGtwemFkaWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODM5OTAsImV4cCI6MjA4NTQ1OTk5MH0.4948VdIyY2HqmHXZEK61SABo2BURSCtAO75P9lum2RQ
VITE_API_URL=https://your-vercel-domain.vercel.app/api
```

**Server Variables** (Production + Preview + Development):
```
SUPABASE_URL=https://opqstjxvkzdxkpzadihv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcXN0anh2a3pkeGtwemFkaWh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg4Mzk5MCwiZXhwIjoyMDg1NDU5OTkwfQ.HRJAD2TJk6by0R6xhPjvil7VwlnpSU7CeTk5Zmoklk4
NODE_ENV=production
```

### 2. Vercel Auto-Deploy
- Push to GitHub triggers automatic Vercel deployment
- Wait for build to complete (usually 2-3 minutes)
- Check deployment logs for any errors

### 3. Update VITE_API_URL After First Deploy
After first successful deploy:
1. Copy your Vercel deployment URL (e.g., `https://yourproject.vercel.app`)
2. Update `VITE_API_URL` in Vercel env vars to: `https://yourproject.vercel.app/api`
3. Trigger redeploy (or push another commit)

### 4. Verify Video Works
- Visit your Vercel URL
- Check if background video plays on homepage
- Open DevTools → Network tab → filter by "hero-bg.mp4"
- Should see 200 OK response with proper Content-Type: video/mp4

### 5. Test Registration Flow
1. Navigate to `/register`
2. Create a new account
3. Check browser console for any errors
4. Verify profile creation in Supabase dashboard
5. Check that no "Database error saving new user" appears

## 📋 API Endpoints Available
- `GET /api/health` - Health check
- `POST /api/create-profile` - Create user profile (server-side)
- `GET /api/events` - List all events
- `POST /api/events` - Create event (admin only)
- `GET /api/registrations` - List user registrations
- `POST /api/registrations` - Register for event
- `DELETE /api/registrations` - Cancel registration

## 🐛 Troubleshooting

### Video Not Playing
- Check browser console for 404 errors
- Verify `/videos/hero-bg.mp4` exists in deployed site
- Check Network tab for MIME type (should be `video/mp4`)
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Database Error on Register
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel (server-side only)
- Check Vercel function logs: `vercel logs <deployment-url>`
- Ensure Supabase RLS policies allow service role access

### Environment Variables Not Working
- Make sure variables are set for the correct environment (Production/Preview)
- Variables with `VITE_` prefix are embedded at build time
- Redeploy after changing env vars

## 🔗 Useful Links
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard/project/opqstjxvkzdxkpzadihv
- GitHub Repo: https://github.com/AnshXGrind/ZeroMercy-Vibecraft

## ✨ What Changed

### Video Fix
- Changed from `./videos/hero-bg.mp4` (relative) to `/videos/hero-bg.mp4` (absolute)
- Vite now explicitly copies `public/` directory to `dist/`
- Vercel serves `/videos/*` with correct MIME type and caching headers

### Auth Fix
- Profile creation now uses serverless API (`/api/create-profile`)
- Server-side uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS
- Fixes "Database error saving new user" issue
- More secure - no service key exposed to client

### API Endpoints
- Serverless functions in `/api` directory
- Proper CORS headers for all endpoints
- JWT verification for protected routes
- Admin role checks for sensitive operations
