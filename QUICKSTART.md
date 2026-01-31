# Quick Start - Test Auth Locally

## 1. Set Environment Variables

Create `.env.local`:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 2. Apply Database Schema

1. Go to Supabase SQL Editor
2. Run `backend/supabase_schema.sql`

## 3. Install & Build

```bash
npm install
npm run build
npm run preview
```

## 4. Test Auth Flow

1. Open http://localhost:5174
2. Click "Register" in navbar
3. Create account
4. Verify navbar shows "Dashboard" + "Logout"
5. Click "Logout" → navbar resets

## 5. Deploy

```bash
# Push to GitHub (if Vercel connected)
git add .
git commit -m "Deploy with auth"
git push

# OR use Vercel CLI
vercel --prod
```

## API Test

```bash
# Get events (public)
curl https://your-domain.vercel.app/api/events

# Register for event (needs auth token)
curl -X POST https://your-domain.vercel.app/api/registrations \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"event_id":"event-uuid-here"}'
```

---

**Status**: ✅ Production-ready
**Stack**: Vercel (frontend + serverless) + Supabase (auth + database)
