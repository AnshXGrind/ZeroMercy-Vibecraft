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
      
      /* Floating Navigation (No Bar) */
      .nav-dock-container {
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        display: flex;
        justify-content: center;
        width: auto;
        pointer-events: none;
      }

      .glass-dock {
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 0;
        background: transparent;
        box-shadow: none;
        border: none;
      }

      /* Floating Buttons */
      .dock-btn {
        pointer-events: auto;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        background: rgba(15, 15, 30, 0.6);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }

      .dock-btn:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(56, 189, 248, 0.15);
        border-color: rgba(56, 189, 248, 0.3);
      }

      .dock-btn.active {
        color: #38bdf8;
        background: rgba(56, 189, 248, 0.1);
        border-color: rgba(56, 189, 248, 0.4);
        box-shadow: 0 0 20px rgba(56, 189, 248, 0.15);
      }

      .dock-btn svg {
        width: 22px;
        height: 22px;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .dock-btn:hover svg {
        transform: scale(1.1);
      }

      /* Tooltip */
      .dock-btn::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 600;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
        white-space: nowrap;
        pointer-events: none;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      }

      .dock-btn:hover::after {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
      }

      /* Divider - Hidden in ghost mode */
      .dock-divider {
        display: none;
      }

      /* Profile/Auth Button */
      .dock-auth-btn {
        pointer-events: auto;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2));
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }
      
      .dock-auth-btn:hover {
        transform: scale(1.05) translateY(-2px);
        border-color: rgba(56, 189, 248, 0.5);
        box-shadow: 0 10px 30px rgba(56, 189, 248, 0.25);
      }
      
      .dock-auth-btn img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .dock-auth-login {
        background: rgba(15, 15, 30, 0.6);
        border: 1px dashed rgba(255, 255, 255, 0.3);
        border-radius: 14px;
      }
      
      .dock-auth-login:hover {
        background: rgba(56, 189, 248, 0.15);
        border-style: solid;
        border-color: #38bdf8;
      }

      @media (max-width: 640px) {
        .glass-dock {
          padding: 0;
          gap: 10px;
          bottom: 24px;
          top: auto; 
          width: auto;
          justify-content: center;
        }
        .dock-btn, .dock-auth-btn {
          width: 42px;
          height: 42px;
        }
        .dock-btn::after {
          bottom: 55px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Render the Dock
  function renderDock() {
    let container = document.querySelector('.nav-dock-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'nav-dock-container';
      document.body.prepend(container);
    }

    const dock = document.createElement('div');
    dock.className = 'glass-dock';

    dock.appendChild(divider1);

    // Social Items
    const socialItems = [
      { href: 'https://x.com/HackSRM', label: 'X', icon: '<path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />' },
      { href: 'https://www.instagram.com/srmuap.infinitus', label: 'Instagram', icon: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>' },
      { href: 'https://discord.gg/KggEYtZhM2', label: 'Discord', icon: '<path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M7.5 7.5c3.5-1 5.5-1 9 0" /><path d="M7 16.5c3.5 1 6.5 1 10 0" /><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />' },
      { href: 'https://youtube.com/@hscksrm', label: 'YouTube', icon: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>' }
    ];

    socialItems.forEach(item => {
      const a = document.createElement('a');
      a.className = 'dock-btn';
      a.href = item.href;
      a.target = '_blank';
      a.setAttribute('data-tooltip', item.label);
      a.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.8">${item.icon}</svg>`;
      dock.appendChild(a);
    });

    // Divider
    const divider2 = document.createElement('div');
    divider2.className = 'dock-divider';
    dock.appendChild(divider2);

    // Auth Container Slot
    const authSlot = document.createElement('div');
    authSlot.id = 'dock-auth-slot';
    dock.appendChild(authSlot);

    container.innerHTML = '';
    container.appendChild(dock);
  }

  // Render auth buttons (signed out state)
  function renderSignedOut() {
    const container = document.getElementById('dock-auth-slot');
    if (!container) return; // Should be created by renderDock
    container.innerHTML = `
      <a href="/login" class="dock-btn dock-auth-login" data-tooltip="Sign In">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
      </a>
    `;
  }

  // Render auth buttons (signed in state)
  function renderSignedIn(userName) {
    const container = document.getElementById('dock-auth-slot');
    if (!container) return;

    // Generate initials
    const initials = userName ? userName.substring(0, 2).toUpperCase() : 'ME';

    container.innerHTML = `
      <div class="dock-auth-btn" id="logoutBtn" data-tooltip="${userName || 'Profile'} (Logout)">
        <span>${initials}</span>
      </div>
    `;

    // Attach logout handler
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  }

  // Handle logout
  async function handleLogout() {
    if (!supabaseClient) return;
    try {
      if (confirm('Log out?')) {
        await supabaseClient.auth.signOut();
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
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

  // Remove Social Bar (Since it's now in the Dock)
  function removeSocialBar() {
    const existingBar = document.querySelector('.social-bar');
    if (existingBar) existingBar.remove();
    // Remove any leftover side controls as well
    const leftControls = document.querySelector('.left-controls');
    if (leftControls) leftControls.remove();
  }

  // Initialize on DOM ready
  const init = () => {
    injectStyles();
    renderDock();
    updateAuthUI();
    removeSocialBar();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global functions
  window.refreshAuthUI = updateAuthUI;
})();
