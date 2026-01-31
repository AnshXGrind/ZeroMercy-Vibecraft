// Global auth navigation state manager
// Include this in all pages that need auth UI updates

(function () {
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

  // Create global styles for auth buttons
  function injectStyles() {
    if (document.getElementById('auth-nav-styles')) return;

    // Inject Google Fonts link for Orbitron
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.id = 'auth-nav-styles';
    style.textContent = `
      .auth-nav-btn, .top-glass-tab .tab-btn {
        font-family: 'Orbitron', 'Inter', system-ui, sans-serif !important;
        letter-spacing: 0.5px;
      }
      .auth-nav-btn {
        padding: 8px 18px;
        border-radius: 8px;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.25);
        color: #eae8ff;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 200ms ease;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .auth-nav-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(34, 211, 238, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
      .auth-nav-btn.primary {
        background: linear-gradient(90deg, #38bdf8, #a855f7);
        border: none;
        color: #fff;
        font-weight: 700;
      }
      .auth-nav-btn.logout {
        border-color: rgba(239, 68, 68, 0.3);
      }
      .auth-nav-btn.logout:hover {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.6);
      }
    `;
    document.head.appendChild(style);
  }

  // Find or create auth nav container in top-right
  function getOrCreateAuthNav() {
    injectStyles();
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
      <a href="/login" class="auth-nav-btn">Login</a>
    `;
  }

  // Render auth buttons (signed in state)
  function renderSignedIn(userName) {
    const container = getOrCreateAuthNav();
    container.innerHTML = `
      <a href="/dashboard" class="auth-nav-btn">${userName || 'Dashboard'}</a>
      <button id="logoutBtn" class="auth-nav-btn logout">Logout</button>
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
