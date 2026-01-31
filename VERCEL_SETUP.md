# Vercel Deployment Setup

## Required Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables.
Set them for **Production**, **Preview**, and **Development**.

### Frontend Variables (client-side, safe to expose)
```
VITE_SUPABASE_URL=https://opqstjxvkzdxkpzadihv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcXN0anh2a3pkeGtwemFkaWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODM5OTAsImV4cCI6MjA4NTQ1OTk5MH0.4948VdIyY2HqmHXZEK61SABo2BURSCtAO75P9lum2RQ
VITE_API_URL=https://your-vercel-project.vercel.app/api
```

### Server Variables (serverless functions only, NEVER expose)
```
SUPABASE_URL=https://opqstjxvkzdxkpzadihv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcXN0anh2a3pkeGtwemFkaWh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg4Mzk5MCwiZXhwIjoyMDg1NDU5OTkwfQ.HRJAD2TJk6by0R6xhPjvil7VwlnpSU7CeTk5Zmoklk4
NODE_ENV=production
```

## Important Notes

1. **NEVER** prefix server secrets with `VITE_` - they will be exposed in client bundles
2. After adding env vars, redeploy: `vercel --prod` or push to main branch
3. Update `VITE_API_URL` after first deploy with your actual Vercel domain
4. The service role key has admin access - rotate it immediately if exposed

## Deployment Steps

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Add environment variables in Vercel dashboard
4. Deploy: `vercel --prod`
5. Update `VITE_API_URL` with your deployment URL
6. Redeploy after updating env vars

## API Endpoints Available

- `GET /api/health` - Health check
- `POST /api/create-profile` - Create user profile (called by register flow)
- `GET /api/events` - List events
- `POST /api/events` - Create event (admin only)
- `GET /api/registrations` - List user registrations
- `POST /api/registrations` - Register for event
- `DELETE /api/registrations` - Cancel registration

## Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials
3. Run: `npm run dev`
4. Backend will be available at `/api/*` endpoints
