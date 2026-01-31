import { supabase } from './lib/supabase';

export function initRegistration() {
    const style = document.createElement('style');
    style.textContent = `
    .reg-modal-overlay {
      position: fixed; inset: 0; z-index: 20000; 
      background: rgba(11,10,26,0.95); backdrop-filter: blur(10px);
      display: none; align-items: center; justify-content: center; padding: 20px;
      font-family: Inter, system-ui, sans-serif;
    }
    .reg-modal-content {
      background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1);
      padding: 32px; border-radius: 16px; maxWidth: 480px; width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      color: #eae8ff;
    }
    .reg-modal-content h2 { margin-bottom: 8px; font-size: 1.8rem; }
    .reg-modal-content p { color: rgba(234, 232, 255, 0.7); margin-bottom: 24px; }
    .reg-form { display: flex; flexDirection: column; gap: 16px; }
    .reg-form-group { margin-bottom: 16px; }
    .reg-label { display: block; margin-bottom: 6px; font-size: 0.85rem; color: #38bdf8; }
    .reg-input { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; }
    .reg-reg-input-wrap { display: flex; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0 12px; }
    .reg-reg-prefix { fontWeight: 800; color: #a855f7; opacity: 0.8; margin-right: 4px; }
    .reg-reg-input { flex: 1; padding: 12px; background: transparent; border: none; color: #fff; outline: none; }
    .reg-btn-row { display: flex; gap: 12px; margin-top: 12px; }
    .reg-btn-cancel { flex: 1; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; borderRadius: 8px; cursor: pointer; }
    .reg-btn-submit { flex: 2; padding: 12px; background: linear-gradient(90deg, #38bdf8, #a855f7); border: none; color: #fff; fontWeight: 800; borderRadius: 8px; cursor: pointer; }
    .reg-error { background: rgba(239, 68, 68, 0.1); color: #f87171; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem; border: 1px solid rgba(239, 68, 68, 0.2); display: none; }
    .reg-success-toast { position: fixed; bottom: 24px; right: 24px; z-index: 20001; background: rgba(34, 197, 94, 0.1); color: #4ade80; padding: 16px 24px; border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2); backdrop-filter: blur(10px); display: none; animation: regSlideIn 0.3s ease-out; }
    @keyframes regSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'reg-modal-overlay';
    overlay.innerHTML = `
    <div class="reg-modal-content">
      <h2 id="reg-event-title">Register for Event</h2>
      <p>Please provide your details to participate.</p>
      <div class="reg-error" id="reg-error"></div>
      <form class="reg-form" id="reg-form">
        <div class="reg-form-group">
          <label class="reg-label">Full Name</label>
          <input type="text" class="reg-input" id="reg-name" required placeholder="Your Name">
        </div>
        <div style="display: flex; gap: 12px;">
          <div style="flex: 1;">
            <label class="reg-label">Email</label>
            <input type="email" class="reg-input" id="reg-email" required placeholder="email@srm.edu">
          </div>
          <div style="flex: 1;">
            <label class="reg-label">Phone</label>
            <input type="tel" class="reg-input" id="reg-phone" required placeholder="Phone Number">
          </div>
        </div>
        <div class="reg-form-group">
          <label class="reg-label">Registration Number (11 Digits)</label>
          <div class="reg-reg-input-wrap">
            <span class="reg-reg-prefix">AP</span>
            <input type="text" class="reg-reg-input" id="reg-number" required maxLength="11" placeholder="XXXXXXXXXXX">
          </div>
        </div>
        <div class="reg-btn-row">
          <button type="button" class="reg-btn-cancel" id="reg-cancel">Cancel</button>
          <button type="submit" class="reg-btn-submit" id="reg-submit">Complete Registration</button>
        </div>
      </form>
    </div>
  `;
    document.body.appendChild(overlay);

    const toast = document.createElement('div');
    toast.className = 'reg-success-toast';
    document.body.appendChild(toast);

    let currentEvent = '';

    window.openRegistration = (eventName: string) => {
        currentEvent = eventName;
        (document.getElementById('reg-event-title') as HTMLElement).textContent = `Register for ${eventName}`;
        overlay.style.display = 'flex';
    };

    const close = () => {
        overlay.style.display = 'none';
        (document.getElementById('reg-form') as HTMLFormElement).reset();
        (document.getElementById('reg-error') as HTMLElement).style.display = 'none';
    };

    document.getElementById('reg-cancel')?.addEventListener('click', close);

    document.getElementById('reg-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('reg-submit') as HTMLButtonElement;
        const errorEl = document.getElementById('reg-error') as HTMLElement;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';
        errorEl.style.display = 'none';

        const name = (document.getElementById('reg-name') as HTMLInputElement).value;
        const email = (document.getElementById('reg-email') as HTMLInputElement).value;
        const phone = (document.getElementById('reg-phone') as HTMLInputElement).value;
        const regNumRaw = (document.getElementById('reg-number') as HTMLInputElement).value;

        const digitsOnly = regNumRaw.replace(/\D/g, '');
        if (digitsOnly.length !== 11) {
            errorEl.textContent = 'Registration number must be exactly 11 digits.';
            errorEl.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Complete Registration';
            return;
        }

        const fullRegNumber = `AP${digitsOnly}`;

        try {
            const { error } = await supabase
                .from('registrations')
                .insert([{
                    name, email, phone,
                    registration_number: fullRegNumber,
                    event_name: currentEvent
                }]);

            if (error) throw error;

            close();
            toast.textContent = `Successfully registered for ${currentEvent}!`;
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 5000);
        } catch (err: any) {
            errorEl.textContent = err.message || 'An error occurred.';
            errorEl.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Complete Registration';
        }
    });
}

// Auto-init if not in a module environment or if we want it global
if (typeof window !== 'undefined') {
    initRegistration();
}
