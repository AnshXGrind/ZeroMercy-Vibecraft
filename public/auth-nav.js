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

  // Create global styles for auth buttons and nav
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
      
      /* Auth Buttons */
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

      /* Premium Nav Icons */
      .top-glass-tab {
        pointer-events: auto;
        background: transparent;
        border: none;
        color: var(--text-primary, #eae8ff);
        padding: 0;
        border-radius: 0;
        font-size: 0.95rem;
        font-weight: 600;
        display: flex;
        gap: 12px;
        max-width: 980px;
        width: min(980px, 96%);
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      }
      .top-glass-tab .tab-btn {
        background: transparent;
        border: none;
        color: var(--text-primary, #eae8ff);
        padding: 10px 18px;
        border-radius: 999px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
      }
      .top-glass-tab .tab-btn svg {
        width: 18px;
        height: 18px;
        transition: transform 0.3s ease, filter 0.3s ease;
        filter: drop-shadow(0 0 2px rgba(56, 189, 248, 0.3));
      }
      .top-glass-tab .tab-btn:hover {
        background: rgba(56, 189, 248, 0.08);
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.1);
        transform: translateY(-2px);
      }
      .top-glass-tab .tab-btn:hover svg {
        transform: scale(1.1);
        filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.6));
      }
      .top-glass-tab .tab-btn.active {
        background: rgba(56, 189, 248, 0.12);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.2);
        box-shadow: 0 0 20px rgba(56, 189, 248, 0.15);
      }

      /* Social Bar Styles */
      .social-bar {
        position: fixed;
        right: 24px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 16px;
        z-index: 9999;
        pointer-events: auto;
        align-items: flex-end;
      }
      .social-btn {
        width: 48px;
        height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #eae8ff;
        text-decoration: none;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      .social-btn::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .social-btn:hover {
        transform: translateY(-4px) scale(1.05);
        border-color: rgba(56, 189, 248, 0.4);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(56, 189, 248, 0.2);
      }
      .social-btn:hover::before {
        opacity: 1;
      }
      .social-btn svg {
        width: 22px;
        height: 22px;
        z-index: 1;
        transition: transform 0.3s ease;
      }
      .social-btn:hover svg {
        transform: scale(1.1); 
      }

      @media (max-width: 880px) {
        .social-bar { right: 12px; }
        .social-btn { width: 40px; height: 40px; }
        .social-btn svg { width: 18px; height: 18px; }
      }
      @media (max-width: 640px) {
        .social-bar {
          right: 12px;
          top: auto;
          bottom: 20px;
          transform: none;
          flex-direction: row;
        }
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

  // Find or create Top Navigation Bar (Center)
  function renderTopNav() {
    // Look for existing container created by HTML, or create one
    let container = document.querySelector('.top-tab-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'top-tab-container';
      container.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:9999;width:100%;padding:0 20px;pointer-events:none;display:flex;justify-content:center;';
      document.body.prepend(container);
    } else {
      // Ensure styles are enforced if element existed
      container.style.zIndex = '9999';
    }

    // Clear any existing content (hardcoded HTML)
    container.innerHTML = '';

    const nav = document.createElement('div');
    nav.className = 'top-glass-tab';

    // Define Links with Premium Icons
    const links = [
      { href: '/', label: 'Home', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>' },
      { href: '/event', label: 'Events', icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>' },
      { href: '/aloha', label: 'Aloha', icon: '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>' },
      { href: '/competition', label: 'Competitions', icon: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>' },
      { href: '/workshop', label: 'Workshops', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>' },
      { href: '/about', label: 'About', icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>' }
    ];

    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

    links.forEach(link => {
      const a = document.createElement('a');
      a.className = 'tab-btn';
      if (link.href === currentPath || (link.href !== '/' && currentPath.startsWith(link.href))) {
        a.classList.add('active');
      }
      a.href = link.href;
      a.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${link.icon}</svg>
            ${link.label}
        `;
      nav.appendChild(a);
    });

    container.appendChild(nav);
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

  // Render social media bar dynamically with PREMIUM ICONS
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

    // High quality filled/glow SVG icons
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

  // Initialize on DOM ready
  const init = () => {
    renderTopNav(); // New: Centralized Navigation
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
