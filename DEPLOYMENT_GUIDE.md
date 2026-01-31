# Infinitus - Complete Production Deployment

## ✅ What's Been Implemented

### Backend (Vercel Serverless)
- ✓ `/api/events.js` - Event management (GET, POST, PUT)
- ✓ `/api/registrations.js` - User registrations (GET, POST, DELETE)
- ✓ Admin-only routes with JWT verification
- ✓ CORS configured for frontend

### Authentication (Supabase)
- ✓ Email/password sign up with profile creation
- ✓ Sign in with JWT session management
- ✓ Sign out functionality
- ✓ Persistent auth state across pages
- ✓ Protected routes (Dashboard requires login)

### Frontend Auth UI
- ✓ New `/login` page with error handling and loading states
- ✓ New `/register` page with profile fields (name, email, password, college, phone)
- ✓ Dynamic navbar: shows "Sign In/Register" when logged out, "Dashboard/Logout" when logged in
- ✓ Auth state injected into all pages via `/auth-nav.js`
- ✓ Toast notifications for user feedback

### Database Schema
- ✓ `profiles` table with user data
- ✓ `events` table with categories, dates, location, capacity
- ✓ `registrations` table with payment status tracking
- ✓ RLS policies for security
- ✓ Triggers for auto-profile creation
- ✓ Capacity enforcement with database functions

## 🚀 Deployment Steps

### 1. Set Up Supabase

```bash
# Go to supabase.com → Create New Project
# Copy these values from Project Settings → API:
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...  (starts with eyJ)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  (different from anon key)
```

### 2. Apply Database Schema

1. Open Supabase SQL Editor
2. Paste contents of `backend/supabase_schema.sql`
3. Run the SQL
4. Verify tables created: `profiles`, `events`, `registrations`

### 3. Configure Environment Variables

**Local Development** (`.env.local`):
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
```

**Vercel Production**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Apply to: Production, Preview, Development

### 4. Deploy to Vercel

**Option A: GitHub (Recommended)**
```bash
git add .
git commit -m "Add Supabase auth and serverless API"
git push origin main
# Vercel auto-deploys if connected
```

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel --prod
```

### 5. Test Authentication Flow

1. Visit `https://your-domain.vercel.app/register`
2. Create account (check Supabase Auth → Users)
3. Sign in at `/login`
4. Verify navbar shows "Dashboard" + "Logout"
5. Click Dashboard → see your profile
6. Click Logout → navbar resets to "Sign In/Register"

## 📁 Key Files

- `/api/*` - Vercel serverless functions
- `/backend/supabase_schema.sql` - Database schema
- `/login.html`, `/register.html` - Standalone auth pages
- `/public/auth-nav.js` - Global auth UI script
- `vite.config.js` - Env injection plugin

## 🔒 Security

- Service role key ONLY in Vercel env vars (server-side)
- Anon key in frontend (public, restricted by RLS)
- RLS policies enabled on all tables
- `.env.local` in `.gitignore`

## 📞 Support

- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
