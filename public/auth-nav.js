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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
      </a>
      <a class="social-btn" href="https://www.instagram.com/srmuap.infinitus" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
      <a class="social-btn" href="https://discord.gg/KggEYtZhM2" target="_blank" rel="noopener noreferrer" aria-label="Discord">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M7.5 7.5c3.5-1 5.5-1 9 0" /><path d="M7 16.5c3.5 1 6.5 1 10 0" /><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" /></svg>
      </a>
      <a class="social-btn" href="https://www.linkedin.com/company/hacksrm-7-0/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
      </a>
      <a class="social-btn" href="https://youtube.com/@hscksrm?si=rEdTYzwlbAvYQPj3" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
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
