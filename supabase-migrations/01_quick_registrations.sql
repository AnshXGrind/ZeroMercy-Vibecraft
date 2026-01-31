-- Migration: Create quick_registrations table for event sign-ups
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/opqstjxvkzdxkpzadihv/sql

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

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_quick_registrations_email ON public.quick_registrations(email);
CREATE INDEX IF NOT EXISTS idx_quick_registrations_reg_number ON public.quick_registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_quick_registrations_event ON public.quick_registrations(event_name);
CREATE INDEX IF NOT EXISTS idx_quick_registrations_created_at ON public.quick_registrations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.quick_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public event registrations)
-- You can tighten this later to require authentication
CREATE POLICY "Allow public inserts for quick registrations"
  ON public.quick_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to view their own registrations
CREATE POLICY "Users can view their own registrations"
  ON public.quick_registrations
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Allow admins to view all registrations
CREATE POLICY "Admins can view all registrations"
  ON public.quick_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update/delete registrations
CREATE POLICY "Admins can manage all registrations"
  ON public.quick_registrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add comment
COMMENT ON TABLE public.quick_registrations IS 'Quick event registrations without requiring full user accounts';
