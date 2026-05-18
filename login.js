//  LOGIN.JS — Hotel Management System


function togglePw(btn) {
  const inp    = document.getElementById('senha');
  const isText = inp.type === 'text';
  inp.type = isText ? 'password' : 'text';

  btn.querySelector('svg').innerHTML = isText
    ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
    : '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
}

function doLogin() {
  const u      = document.getElementById('usuario').value.trim();
  const s      = document.getElementById('senha').value;
  const btn    = document.getElementById('btnLogin');
  const err    = document.getElementById('errMsg');
  const uInput = document.getElementById('usuario');
  const sInput = document.getElementById('senha');

  // Limpar erros
  err.classList.remove('show');
  uInput.classList.remove('error');
  sInput.classList.remove('error');

  // Validar campos vazios
  if (!u || !s) {
    if (!u) uInput.classList.add('error');
    if (!s) sInput.classList.add('error');
    return;
  }

  // Simular loading (equivalente ao processamento do Login.java)
  btn.classList.add('loading');

  setTimeout(() => {
    btn.classList.remove('loading');

    // Credenciais do Login.java: admin / 2026
    if (u === 'admin' && s === '2026') {
      document.body.style.opacity    = '0';
      document.body.style.transition = 'opacity .4s';
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 400);
    } else {
      err.classList.add('show');
      uInput.classList.add('error');
      sInput.classList.add('error');
      sInput.classList.add('shake');
      sInput.addEventListener('animationend', () => sInput.classList.remove('shake'), { once: true });
      sInput.value = '';
      sInput.focus();
    }
  }, 900);
}

// Permitir login com Enter
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});
