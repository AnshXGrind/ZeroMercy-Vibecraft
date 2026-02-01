# 🔧 Database Error Fix - Registration Issue

## Problem
"Database error saving new user" when trying to register a new account.

## Root Cause
The **profiles table was missing** from the Supabase database. The registration flow creates a user in Supabase Auth, but then tries to save additional profile information (name, college, phone) to a `profiles` table that didn't exist.

## Solution Applied

### 1. Created Missing Database Migration
**File:** `supabase-migrations/00_profiles.sql`

This SQL file creates:
- ✅ `profiles` table with columns: id, email, name, phone, college, role
- ✅ Row Level Security (RLS) policies for data protection
- ✅ Indexes for fast queries
- ✅ Auto-update timestamp trigger
- ✅ Proper foreign key to auth.users

### 2. Improved Error Handling
**File:** `register.html` (updated)

Changes made:
- ✅ Better error messages showing actual error details
- ✅ Fallback to direct database insert if API endpoint not found (404)
- ✅ More detailed console logging for debugging
- ✅ Redirect to `/index.html` instead of non-existent `/dashboard`

### 3. Created Setup Helper Script
**File:** `setup-database.ps1`

Interactive PowerShell script to guide you through database setup.

---

## 🚀 How to Fix (Step-by-Step)

### Option 1: Run Setup Script (Easiest)
```powershell
cd d:\github\ZeroMercy-Vibecraft
.\setup-database.ps1
```
Then follow the on-screen instructions.

---

### Option 2: Manual Setup

#### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/opqstjxvkzdxkpzadihv/sql
2. Make sure you're logged into your Supabase account

#### Step 2: Create Profiles Table
1. Open file: `supabase-migrations/00_profiles.sql`
2. Copy ALL the contents
3. Paste into Supabase SQL Editor
4. Click **"RUN"** button (bottom right)
5. Wait for success message: ✅ "Success. No rows returned"

#### Step 3: Verify Quick Registrations Table
1. Open file: `supabase-migrations/01_quick_registrations.sql`
2. Copy ALL the contents
3. Paste into Supabase SQL Editor
4. Click **"RUN"** button
5. Wait for success message

#### Step 4: Verify Tables Exist
Run this query in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'quick_registrations');
```

You should see **2 rows** returned:
- profiles
- quick_registrations

---

## ✅ Testing Registration

### 1. Start Development Server
```powershell
cd d:\github\ZeroMercy-Vibecraft
npm run dev
```

### 2. Test Registration Flow
1. Open: http://localhost:5173/register.html
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
   - College: Test College (optional)
   - Phone: 1234567890 (optional)
3. Click "Create Account"
4. You should see: ✅ "Account created successfully!"
5. You'll be redirected to the home page

### 3. Verify User Created
**Check Auth Users:**
1. Go to: https://supabase.com/dashboard/project/opqstjxvkzdxkpzadihv/auth/users
2. You should see your test user in the list

**Check Profile Created:**
1. Go to: https://supabase.com/dashboard/project/opqstjxvkzdxkpzadihv/editor
2. Click on "profiles" table
3. You should see your user's profile with name, email, college, phone

---

## 🔍 Troubleshooting

### Issue: Still Getting "Database error saving new user"

**Check 1: Verify profiles table exists**
```sql
SELECT * FROM profiles LIMIT 1;
```
If error says "relation profiles does not exist" → Run migration again

**Check 2: Check browser console**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Common errors:
   - "new row violates row-level security policy" → RLS policy issue
   - "duplicate key value violates unique constraint" → User already exists
   - "relation profiles does not exist" → Table not created

**Check 3: Verify Environment Variables**
Open `.env.local` and confirm:
```env
VITE_SUPABASE_URL=https://opqstjxvkzdxkpzadihv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://opqstjxvkzdxkpzadihv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Check 4: Test API Endpoint**
If using Vercel/production:
```powershell
# Test create-profile endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/create-profile" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"user_id":"test-uuid","name":"Test","email":"test@example.com"}'
```

### Issue: API endpoint returns 404

This is normal during local development with `npm run dev`. The fallback mechanism will use direct database insert instead.

If you need the API to work locally:
```powershell
# Deploy to Vercel for proper serverless function support
vercel deploy
```

---

## 📊 What Was Changed?

### Files Created:
1. ✅ `supabase-migrations/00_profiles.sql` - Database schema for user profiles
2. ✅ `setup-database.ps1` - Interactive setup script
3. ✅ `DATABASE_FIX.md` - This documentation file

### Files Modified:
1. ✅ `register.html` - Better error handling and fallback logic (lines 450-480)

### No Breaking Changes:
- ✅ Login flow unchanged
- ✅ Event registration unchanged
- ✅ All other pages unchanged
- ✅ Build still works (`npm run build`)

---

## 🎯 What Happens During Registration Now?

### Registration Flow:
```
1. User fills form → register.html
                    ↓
2. Supabase Auth creates user account
                    ↓
3. Try API endpoint: /api/create-profile
                    ↓
4a. API works → Create profile via service role key
                    ↓
5. Success! → Redirect to home page
    
4b. API fails (404) → Fallback to direct insert
                    ↓
5. Success! → Redirect to home page
```

### Data Stored:
- **auth.users table** (managed by Supabase):
  - User ID (UUID)
  - Email
  - Password (hashed)
  - Email confirmation status

- **profiles table** (your custom table):
  - User ID (links to auth.users)
  - Name
  - Email (copy for easy access)
  - Phone (optional)
  - College (optional)
  - Role (default: 'user')
  - Timestamps

---

## 🔐 Security Notes

### Row Level Security (RLS) Enabled
The profiles table has strict security policies:
- ✅ Users can only read/update their own profile
- ✅ Admins can view all profiles
- ✅ Service role can create profiles (for registration API)
- ✅ Public cannot directly access profiles

### API Security
The `/api/create-profile` endpoint:
- ✅ Uses service role key (bypasses RLS)
- ✅ Only accessible via POST request
- ✅ Validates required fields (user_id, name)
- ✅ Returns proper error messages

---

## 📝 Next Steps After Fix

### Immediate:
1. ✅ Run database migrations (follow steps above)
2. ✅ Test registration with a new user
3. ✅ Verify user appears in Supabase Auth Users
4. ✅ Verify profile appears in profiles table

### Optional Enhancements:
1. Create admin panel to manage users
2. Add email verification requirement
3. Add password reset functionality
4. Add profile editing page
5. Add user dashboard

### Deploy to Production:
```powershell
# Build production version
npm run build

# Deploy to Vercel
vercel deploy --prod

# Or push to GitHub (if auto-deploy enabled)
git add .
git commit -m "Fix: Add profiles table and improve registration error handling"
git push origin main
```

---

## 📞 Support

If you still encounter issues:
1. Check browser console for errors (F12 → Console)
2. Check Supabase logs: https://supabase.com/dashboard/project/opqstjxvkzdxkpzadihv/logs
3. Verify both migrations ran successfully
4. Try with a different email address (user might already exist)

---

**✨ Summary:**
- ✅ Database migration created for profiles table
- ✅ Registration error handling improved
- ✅ Setup script created for easy database setup
- 🚀 Ready to test after running migrations!
