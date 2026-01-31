import { supabase } from './supabase';

// Sign up new user
export async function signUp(email, password, userData = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: window.location.origin
    }
  });

  if (error) throw error;

  // Create profile via serverless API (uses service role key)
  if (data.user) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/create-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: data.user.id,
          email: data.user.email,
          name: userData.name || email.split('@')[0],
          college: userData.college || null,
          phone: userData.phone || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile creation error:', errorData);
        throw new Error(errorData.error || 'Failed to create profile');
      }
    } catch (profileError) {
      console.error('Profile creation failed:', profileError);
      throw new Error('Database error saving new user');
    }
  }

  return data;
}

// Sign in existing user
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Get current session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Get user profile
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
