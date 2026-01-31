# Build Reproducibility Guide - Infinitus Platform

> Complete step-by-step instructions to reproduce the production build from scratch

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** v18+ and npm v9+ installed
   ```bash
   node --version  # Should be v18.0.0 or higher
   npm --version   # Should be v9.0.0 or higher
   ```

2. **Git** installed
   ```bash
   git --version
   ```

3. **Supabase Account** (free tier)
   - Sign up at [supabase.com](https://supabase.com)

4. **Vercel Account** (free tier, optional for local dev)
   - Sign up at [vercel.com](https://vercel.com)

## 🚀 Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/AnshXGrind/ZeroMercy-Vibecraft.git

# Navigate to project directory
cd ZeroMercy-Vibecraft

# Verify files
ls -la
```

**Expected output**: You should see `package.json`, `vite.config.js`, `vercel.json`, and HTML files.

## 📦 Step 2: Install Dependencies

```bash
# Install all npm packages
npm install
```

**Expected output**:
```
added 250+ packages in ~30s
```

**Key packages installed**:
- `vite@5.0.0` - Build tool
- `react@18.2.0` - UI library
- `@supabase/supabase-js@2.93.3` - Database client
- `@vitejs/plugin-react@4.2.1` - React plugin for Vite

## 🔐 Step 3: Setup Environment Variables

### 3.1 Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Project Name**: vibecraft-infinitus
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your users
4. Wait 2-3 minutes for project creation

### 3.2 Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://opqstjxvkzdxkpzadihv.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`, keep this secret!)

### 3.3 Create `.env.local` File

```bash
# Create environment file in project root
touch .env.local
```

Add the following content (replace with your actual values):

```bash
# Supabase Configuration (Client-side - safe to expose)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (Server-only - KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Note**: 
- `VITE_*` variables are exposed to the browser (safe due to RLS)
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER be exposed to client-side code

## 🗄️ Step 4: Setup Database

### 4.1 Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-migrations/01_quick_registrations.sql`
3. Paste into SQL Editor
4. Click **Run**

**Expected output**: "Success. No rows returned"

### 4.2 Verify Tables Created

Go to **Table Editor** in Supabase Dashboard. You should see:
- ✅ `profiles` table
- ✅ `quick_registrations` table

### 4.3 Enable Row-Level Security

RLS is automatically enabled by the migration script. Verify:
1. Click on `profiles` table
2. Go to **Policies** tab
3. You should see policies for:
   - "Users can read own profile"
   - "Users can update own profile"
   - "Admins can read all profiles"

## 🔧 Step 5: Local Development

### 5.1 Start Development Server

```bash
# Run Vite dev server
npm run dev
```

**Expected output**:
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### 5.2 Test in Browser

1. Open `http://localhost:5173/video-hero.html`
2. You should see the Infinitus landing page with video background
3. Click "Register" and test user signup flow

### 5.3 Common Dev Issues

**Issue**: "Cannot find module '@supabase/supabase-js'"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Video not playing
- Check that `public/videos/hero-srm2.mp4` exists
- Check browser console for errors

**Issue**: Registration fails with "Could not find table"
- Verify database migration ran successfully
- Check Supabase logs in Dashboard → Logs

## 🏗️ Step 6: Production Build

### 6.1 Build Static Site

```bash
# Generate production build
npm run build
```

**Expected output**:
```
vite v5.4.21 building for production...
✓ 129 modules transformed.

dist/about.html              11.65 kB
dist/competition.html        25.11 kB
dist/event.html              25.49 kB
dist/video-hero.html         25.24 kB
dist/register.html           17.30 kB
dist/login.html              14.82 kB
...
dist/assets/app-abc123.js    45.23 kB │ gzip: 15.87 kB
dist/assets/app-def456.css   12.45 kB │ gzip: 3.21 kB

✓ built in 2.83s
```

**What happened**:
- Vite processed all HTML/JS/CSS files
- Environment variables injected into HTML
- Assets minified and hashed for cache busting
- Output written to `dist/` directory

### 6.2 Verify Build Output

```bash
# Check dist directory
ls -la dist/

# Preview production build locally
npm run preview
```

Navigate to `http://localhost:5174/` to test the production build.

### 6.3 Build Size Analysis

```bash
# Check total build size
du -sh dist/

# Expected: ~5-10 MB (including images/videos)
```

## ☁️ Step 7: Deploy to Vercel

### 7.1 Install Vercel CLI (Optional)

```bash
# Install globally
npm install -g vercel

# Login to Vercel
vercel login
```

### 7.2 Deploy via CLI

```bash
# Deploy to production
vercel --prod
```

**Expected output**:
```
Vercel CLI 32.0.0
🔍  Inspect: https://vercel.com/anshxgrind/vibecraft/...
✅  Production: https://zero-mercy-vibecraft.vercel.app
```

### 7.3 Deploy via Web UI (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `AnshXGrind/ZeroMercy-Vibecraft` repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**

**Deployment time**: ~2-3 minutes

### 7.4 Verify Production Deployment

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Test key pages:
   - Home: `/video-hero.html` or `/`
   - Events: `/event.html`
   - Registration: `/register.html`
3. Test registration flow end-to-end:
   - Sign up new user
   - Check Supabase Dashboard → Table Editor → `profiles`
   - Register for an event
   - Check `quick_registrations` table

## 🧪 Step 8: Testing & Validation

### 8.1 Functional Tests

**Test Registration**:
1. Go to `/register.html`
2. Fill form with test data
3. Click "Create Account"
4. Verify success message
5. Check Supabase `profiles` table

**Test Login**:
1. Go to `/login.html`
2. Enter credentials from step above
3. Click "Sign In"
4. Verify redirect to dashboard

**Test Event Registration**:
1. Login first
2. Go to `/event.html`
3. Click any event's "Register Now"
4. Fill form and submit
5. Check `quick_registrations` table

### 8.2 Performance Tests

**Lighthouse Audit**:
1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Run audit on production URL
4. Expected scores:
   - Performance: 90+
   - Accessibility: 85+
   - Best Practices: 90+
   - SEO: 85+

**Load Testing** (optional):
```bash
# Install Apache Bench
apt-get install apache2-utils

# Test 1000 requests with 10 concurrent connections
ab -n 1000 -c 10 https://your-production-url.vercel.app/
```

### 8.3 Browser Compatibility

Test on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## 🔍 Step 9: Troubleshooting

### Build Fails

**Error**: "Cannot find module 'vite'"
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error**: "Environment variable not found"
- Verify `.env.local` exists in project root
- Check variable names start with `VITE_`
- Restart dev server after adding variables

### Deployment Fails

**Error**: "Build command failed"
- Check Vercel build logs
- Ensure environment variables set in Vercel dashboard
- Try building locally first: `npm run build`

**Error**: "Serverless function error"
- Verify `SUPABASE_SERVICE_ROLE_KEY` set in Vercel
- Check function logs in Vercel dashboard
- Test API locally with `vercel dev`

### Database Issues

**Error**: "Could not find table 'quick_registrations'"
- Re-run migration SQL in Supabase SQL Editor
- Verify table exists in Table Editor
- Check RLS policies are enabled

**Error**: "JWT expired"
- Token expires after 1 hour by default
- User needs to re-login
- Check Supabase Auth settings for token expiry

## 📊 Build Metrics

**Expected metrics for successful build**:

| Metric | Expected Value |
|--------|---------------|
| Build Time | 2-4 seconds |
| Total Bundle Size | ~150 KB (gzipped) |
| Number of Assets | 30-50 files |
| HTML Pages | 25+ files |
| API Functions | 4 serverless functions |
| Node Modules | 250+ packages |
| Disk Usage | ~250 MB (with node_modules) |

## 🎯 Success Criteria

Your build is successful when:

- ✅ `npm run build` completes without errors
- ✅ `dist/` directory contains all HTML files
- ✅ Local preview works (`npm run preview`)
- ✅ Vercel deployment succeeds
- ✅ Production URL loads within 2 seconds
- ✅ User registration and login work
- ✅ Event registration stores data in Supabase
- ✅ No console errors in browser DevTools
- ✅ Lighthouse performance score > 90

## 📞 Support & Resources

**Documentation**:
- [Vite Docs](https://vitejs.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

**Project Files**:
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [HACKATHON_README.md](HACKATHON_README.md) - Project overview
- [AI_TOOLS.md](AI_TOOLS.md) - AI assistance details

**Team Contact**:
- GitHub: [@AnshXGrind](https://github.com/AnshXGrind)
- Repository: [ZeroMercy-Vibecraft](https://github.com/AnshXGrind/ZeroMercy-Vibecraft)

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Tested On**: Windows 11, macOS 14, Ubuntu 22.04
