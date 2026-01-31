# Supabase Database Setup

## Quick Setup (Copy & Paste)

### 1. Open Supabase SQL Editor
Visit: https://supabase.com/dashboard/project/opqstjxvkzdxkpzadihv/sql

### 2. Run Migration SQL

Copy the entire contents of `supabase-migrations/01_quick_registrations.sql` and paste into the SQL Editor, then click "Run".

**Or copy this directly:**

```sql
-- Create the quick_registrations table
CREATE TABLE IF NOT EXISTS public.quick_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  registration_number text NOT NULL,
  event_name text NOT NULL,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quick_registrations_email ON public.quick_registrations(email);
CREATE INDEX IF NOT EXISTS idx_quick_registrations_reg_number ON public.quick_registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_quick_registrations_event ON public.quick_registrations(event_name);
CREATE INDEX IF NOT EXISTS idx_quick_registrations_created_at ON public.quick_registrations(created_at DESC);

-- Enable RLS
ALTER TABLE public.quick_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Allow public inserts for quick registrations"
  ON public.quick_registrations FOR INSERT TO public WITH CHECK (true);

-- Allow users to view their own
CREATE POLICY "Users can view their own registrations"
  ON public.quick_registrations FOR SELECT TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Allow admins to view all
CREATE POLICY "Admins can view all registrations"
  ON public.quick_registrations FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Allow admins to manage all
CREATE POLICY "Admins can manage all registrations"
  ON public.quick_registrations FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
```

### 3. Verify Table Creation

Run this query to confirm:

```sql
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quick_registrations'
ORDER BY ordinal_position;
```

You should see columns: id, name, email, phone, registration_number, event_name, created_at

### 4. Test a Sample Insert (Optional)

```sql
INSERT INTO public.quick_registrations (name, email, phone, registration_number, event_name)
VALUES ('Test User', 'test@example.com', '1234567890', 'AP12345678901', 'HackSRM Hackathon');

SELECT * FROM public.quick_registrations ORDER BY created_at DESC LIMIT 5;
```

## What This Does

- **Creates `quick_registrations` table** for event sign-ups without requiring full user accounts
- **Indexes** on email, reg number, event name for fast lookups
- **RLS Policies**:
  - Anyone can insert (public event registrations)
  - Authenticated users can view their own registrations
  - Admins can view and manage all registrations

## Existing Tables Status

Your Supabase project should now have:
- ✅ `profiles` (user profiles)
- ✅ `events` (event listings)
- ✅ `registrations` (full user registrations)
- ✅ `quick_registrations` (anonymous/quick registrations) ← NEW

## Troubleshooting

### "Table already exists" error
Table was created successfully before. You can verify with:
```sql
SELECT * FROM public.quick_registrations LIMIT 1;
```

### "Permission denied" error
Check RLS policies are created:
```sql
SELECT * FROM pg_policies WHERE tablename = 'quick_registrations';
```

### Frontend still shows error
1. Hard refresh your deployed site (Ctrl+Shift+R)
2. Check browser console for actual error message
3. Verify Supabase URL and anon key are correct in Vercel env vars

## Need to Reset?

Drop and recreate:
```sql
DROP TABLE IF EXISTS public.quick_registrations CASCADE;
-- Then run the CREATE TABLE commands above again
```
