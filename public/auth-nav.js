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
      * {
        font-family: 'Orbitron', 'Inter', system-ui, sans-serif !important;
      }
      body {
        font-family: 'Orbitron', 'Inter', system-ui, sans-serif !important;
      }
      .auth-nav-btn {
        letter-spacing: 0.5px;
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

  // Render social media bar dynamically
  function renderSocialBar() {
    const isHomepage = window.location.pathname === '/' ||
      window.location.pathname.endsWith('index.html') ||
      window.location.pathname.endsWith('video-hero.html');

    if (!isHomepage) {
      // Remove social bar if not on homepage
      const existingBar = document.querySelector('.social-bar');
      if (existingBar) existingBar.remove();
      return;
    }

    let bar = document.querySelector('.social-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'social-bar';
      document.body.appendChild(bar);
    }

    bar.innerHTML = `
      <a class="social-btn" href="https://x.com/HackSRM" target="_blank" rel="noopener noreferrer" aria-label="X">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
      </a>
      <a class="social-btn" href="https://www.instagram.com/srmuap.infinitus" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      </a>
      <a class="social-btn" href="https://discord.gg/KggEYtZhM2" target="_blank" rel="noopener noreferrer" aria-label="Discord">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01 10.124 10.124 0 0 0 .372.292.075.075 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.054-3.03.08.08 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>
      </a>
      <a class="social-btn" href="https://www.linkedin.com/company/hacksrm-7-0/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <a class="social-btn" href="https://youtube.com/@hscksrm?si=rEdTYzwlbAvYQPj3" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      </a>
    `;
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
  const init = () => {
    updateAuthUI();
    renderSocialBar();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global refresh function
  window.refreshAuthUI = updateAuthUI;
})();
