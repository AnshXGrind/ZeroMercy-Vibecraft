# Infinitus - Vercel Deployment Guide

## Prerequisites
- Supabase project created
- Vercel account connected to GitHub

## Step 1: Apply Database Schema
1. Open Supabase SQL Editor
2. Run `backend/supabase_schema.sql`
3. Verify tables created: `profiles`, `events`, `registrations`

## Step 2: Configure Environment Variables

### In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add the following:

```
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...your-anon-key
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...your-service-role-key
```

### Get Supabase Keys:
- Go to Supabase Dashboard → Project Settings → API
- Copy `Project URL` → use for both `*_SUPABASE_URL`
- Copy `anon public` key → use for `VITE_SUPABASE_ANON_KEY`
- Copy `service_role` key → use for `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **NEVER commit service role key to git**

## Step 3: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or push to GitHub (auto-deploy if connected).

## Step 4: Test Authentication
1. Visit `/register` - create account
2. Visit `/login` - sign in
3. Check navbar shows "Dashboard" + "Logout"
4. Visit `/dashboard` - see profile

## API Endpoints (Serverless)
- `GET /api/events` - List events
- `POST /api/events` - Create event (admin)
- `GET /api/registrations` - User's registrations
- `POST /api/registrations` - Register for event
- `DELETE /api/registrations/:id` - Cancel registration

## Troubleshooting

### Meta tag placeholders showing:
- Vite needs env vars at build time
- Set in Vercel env vars, not `.env.local`
- Redeploy after adding env vars

### CORS errors:
- Check Supabase RLS policies are enabled
- Verify anon key has proper permissions

### Profile not creating:
- Check `backend/supabase_schema.sql` trigger exists
- Manually insert profile if needed

## Security Checklist
✓ Service role key only in Vercel env (server-side)
✓ Anon key in frontend (public, restricted by RLS)
✓ RLS policies enabled on all tables
✓ `.env.local` in `.gitignore`
