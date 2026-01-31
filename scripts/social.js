(function(){
  function initSocialBar() {
    const bars = document.querySelectorAll('.social-bar');
    bars.forEach(bar => {
      bar.classList.add('social-bar--js');
      // create toggle for small screens
      const btn = document.createElement('button');
      btn.className = 'social-toggle';
      btn.setAttribute('aria-expanded','true');
      btn.style.cssText = 'position:fixed; right:12px; top:12px; z-index:10001; width:44px;height:44px;border-radius:10px;border:none;background:linear-gradient(90deg,#38bdf8,#a855f7);color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      document.body.appendChild(btn);

      function update() {
        if (window.innerWidth <= 640) {
          // hide inline bar and show toggle
          bar.style.position = 'fixed';
          bar.style.right = '12px';
          bar.style.top = '64px';
          bar.style.flexDirection = 'column';
          bar.style.background = 'rgba(11,10,26,0.6)';
          bar.style.border = '1px solid rgba(255,255,255,0.06)';
          bar.style.padding = '8px';
          bar.style.borderRadius = '12px';
          bar.style.display = 'none';
          btn.style.display = 'flex';
          btn.setAttribute('aria-expanded','false');
        } else {
          bar.style.position = '';
          bar.style.right = '';
          bar.style.top = '';
          bar.style.flexDirection = '';
          bar.style.background = '';
          bar.style.border = '';
          bar.style.padding = '';
          bar.style.borderRadius = '';
          bar.style.display = '';
          btn.style.display = 'none';
          btn.setAttribute('aria-expanded','true');
        }
      }

      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          bar.style.display = 'flex';
          btn.setAttribute('aria-expanded','false');
          btn.style.opacity = '0.9';
        } else {
          bar.style.display = 'none';
          btn.setAttribute('aria-expanded','true');
        }
      });

      window.addEventListener('resize', update);
      update();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSocialBar);
  else initSocialBar();
})();
