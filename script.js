/* =========================================================
   Configuración — edita estos valores
   ========================================================= */
const CONFIG = {
  // Fecha y hora de la boda (formato ISO local)
  weddingDate: '2026-10-17T17:00:00',

  // Códigos de invitación válidos (en minúsculas). Añade los que quieras.
  // NOTA: esto es solo una barrera ligera en el navegador, no seguridad real.
  validCodes: ['boda2026', 'invitado'],

  // Endpoint para recibir el formulario de RSVP.
  // Opciones recomendadas:
  //   - Formspree:  https://formspree.io/f/XXXXXXXX
  //   - Getform:    https://getform.io/f/XXXXXXXX
  //   - Basin:      https://usebasin.com/f/XXXXXXXX
  // Si lo dejas vacío, el formulario solo mostrará un mensaje de éxito local.
  rsvpEndpoint: 'https://formspree.io/f/mzdwrzkr'
};

/* =========================================================
   Gate — código de invitación
   ========================================================= */
const gateEl   = document.getElementById('gate');
const siteEl   = document.getElementById('site');
const gateForm = document.getElementById('gate-form');
const gateErr  = document.getElementById('gate-error');

function showScreen(screen) {
  // screen: 'gate', 'info', 'rsvp'
  const gate = document.getElementById('gate');
  const info = document.getElementById('info-view');
  const rsvp = document.getElementById('rsvp-view');
  if (gate) gate.hidden = screen !== 'gate';
  if (info) info.hidden = screen !== 'info';
  if (rsvp) rsvp.hidden = screen !== 'rsvp';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function unlockSite() {
  showScreen('info');
  startCountdown();
}

// Si ya validó el código antes, abrimos directamente
if (sessionStorage.getItem('weddingAccess') === 'ok') {
  unlockSite();
}

gateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const code = document.getElementById('code').value.trim().toLowerCase();
  if (CONFIG.validCodes.includes(code)) {
    sessionStorage.setItem('weddingAccess', 'ok');
    gateErr.hidden = true;
    unlockSite();
  } else {
    gateErr.hidden = false;
  }
});

/* =========================================================
   Cuenta atrás
   ========================================================= */
let countdownTimer = null;

function startCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const $d = document.getElementById('cd-days');
  const $h = document.getElementById('cd-hours');
  const $m = document.getElementById('cd-mins');
  const $s = document.getElementById('cd-secs');

  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      $d.textContent = $h.textContent = $m.textContent = $s.textContent = '0';
      clearInterval(countdownTimer);
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    $d.textContent = days;
    $h.textContent = String(hours).padStart(2, '0');
    $m.textContent = String(mins).padStart(2, '0');
    $s.textContent = String(secs).padStart(2, '0');
  };
  tick();
  countdownTimer = setInterval(tick, 1000);
}




// Mostrar formulario RSVP al pulsar el botón Confirmar
document.addEventListener('DOMContentLoaded', () => {
  const confirmarBtn = document.getElementById('confirmar-btn');
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpStatus = document.getElementById('rsvp-status');

  if (confirmarBtn) {
    confirmarBtn.addEventListener('click', () => {
      showScreen('rsvp');
    });
  }

  if (rsvpForm && rsvpStatus) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(rsvpForm).entries());
      rsvpStatus.hidden = false;
      rsvpStatus.textContent = 'Enviando…';
      try {
        if (CONFIG.rsvpEndpoint) {
          const res = await fetch(CONFIG.rsvpEndpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error('Error al enviar');
        } else {
          // Sin endpoint configurado: simulamos envío
          await new Promise(r => setTimeout(r, 600));
          console.log('RSVP (sin endpoint configurado):', data);
        }
        // Popup modal con resumen
        let resumen = '<ul style="text-align:left;max-width:350px;margin:1.2em auto 0 auto;padding:0 1em;">';
        for (const [k, v] of Object.entries(data)) {
          if (v && v.trim() !== '') {
            resumen += `<li><strong>${k.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> ${v}</li>`;
          }
        }
        resumen += '</ul>';
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
          <div class="modal">
            <button class="modal-close" aria-label="Cerrar">&times;</button>
            <span style="font-size:1.25em;color:#357a38;font-weight:600;">¡Confirmación enviada correctamente!</span><br>
            <div style="margin-top:.7em;">Hemos recibido estos datos:</div>
            ${resumen}
          </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.onclick = e => { if (e.target === modal) modal.remove(); };
        rsvpStatus.hidden = true;
        rsvpForm.reset();
      } catch (err) {
        rsvpStatus.textContent = 'Hubo un problema al enviar. Inténtalo de nuevo.';
      }
    });
  }
});

// Ayuda para endpoint RSVP (Formspree)
// 1. Ve a https://formspree.io/ y crea un formulario nuevo con tu email de Gmail.
// 2. Copia la URL que te da (ejemplo: https://formspree.io/f/xxxxxxx)
// 3. Pega esa URL en script.js en: CONFIG.rsvpEndpoint = 'https://formspree.io/f/xxxxxxx';
// 4. ¡Listo! Las confirmaciones llegarán a tu correo.
