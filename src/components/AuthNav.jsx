import React, { useState, useEffect } from 'react';
import { getSession, signOut, getUserProfile } from '../lib/auth';

export default function AuthNav() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    getSession().then(session => {
      setSession(session);
      if (session?.user) {
        getUserProfile(session.user.id).then(setProfile).catch(console.error);
      }
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = window.supabase?.auth?.onAuthStateChange?.(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          getUserProfile(session.user.id).then(setProfile).catch(console.error);
        } else {
          setProfile(null);
        }
      }
    ) || { data: { subscription: null } };

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setSession(null);
      setProfile(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="auth-nav-loading">
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="auth-nav-buttons">
        <a href="/login" className="btn-secondary">Sign In</a>
        <a href="/register" className="btn-primary">Register</a>
      </div>
    );
  }

  return (
    <div className="auth-nav-user">
      <a href="/dashboard" className="btn-secondary">
        {profile?.name || 'Dashboard'}
      </a>
      <button onClick={handleSignOut} className="btn-primary">
        Logout
      </button>
    </div>
  );
}
