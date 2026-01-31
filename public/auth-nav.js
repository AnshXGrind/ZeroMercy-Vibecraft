// Global auth navigation state manager
// Include this in all pages that need auth UI updates

(function() {
  'use strict';

  const SUPABASE_URL = document.querySelector('meta[name="supabase-url"]')?.content || '';
  const SUPABASE_ANON_KEY = document.querySelector('meta[name="supabase-anon-key"]')?.content || '';

  let supabaseClient = null;

  // Initialize Supabase if credentials available
  if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('%') && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.error('Supabase init error:', e);
    }
  }

  // Find or create auth nav container in top-right
  function getOrCreateAuthNav() {
    let container = document.querySelector('.top-right-auth-nav');
    if (!container) {
      container = document.createElement('div');
      container.className = 'top-right-auth-nav';
      container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10002;display:flex;gap:12px;align-items:center;';
      document.body.appendChild(container);
    }
    return container;
  }

  // Render auth buttons (signed out state)
  function renderSignedOut() {
    const container = getOrCreateAuthNav();
    container.innerHTML = `
      <a href="/login" style="padding:8px 16px;border-radius:6px;background:transparent;border:1px solid rgba(255,255,255,0.2);color:#eae8ff;text-decoration:none;font-weight:600;font-size:0.9rem;transition:all 150ms;">Sign In</a>
      <a href="/register" style="padding:8px 18px;border-radius:6px;background:#38bdf8;color:#071124;text-decoration:none;font-weight:700;font-size:0.9rem;transition:all 150ms;">Register</a>
    `;
  }

  // Render auth buttons (signed in state)
  function renderSignedIn(userName) {
    const container = getOrCreateAuthNav();
    container.innerHTML = `
      <a href="/dashboard" style="padding:8px 16px;border-radius:6px;background:transparent;border:1px solid rgba(255,255,255,0.2);color:#eae8ff;text-decoration:none;font-weight:600;font-size:0.9rem;transition:all 150ms;">${userName || 'Dashboard'}</a>
      <button id="logoutBtn" style="padding:8px 18px;border-radius:6px;background:#ff3cac;color:white;border:none;font-weight:700;font-size:0.9rem;cursor:pointer;transition:all 150ms;">Logout</button>
    `;

    // Attach logout handler
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  }

  // Handle logout
  async function handleLogout() {
    if (!supabaseClient) return;
    
    try {
      await supabaseClient.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out');
    }
  }

  // Check auth state and render appropriate UI
  async function updateAuthUI() {
    if (!supabaseClient) {
      renderSignedOut();
      return;
    }

    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (session?.user) {
        // Get profile for display name
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('name')
          .eq('id', session.user.id)
          .single();

        renderSignedIn(profile?.name);
      } else {
        renderSignedOut();
      }
    } catch (error) {
      console.error('Auth UI error:', error);
      renderSignedOut();
    }
  }

  // Listen to auth state changes
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        updateAuthUI();
      } else if (event === 'SIGNED_OUT') {
        renderSignedOut();
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAuthUI);
  } else {
    updateAuthUI();
  }

  // Expose global refresh function
  window.refreshAuthUI = updateAuthUI;
})();
