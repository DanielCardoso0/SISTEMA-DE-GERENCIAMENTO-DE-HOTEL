// ═══════════════════════════════════════
//  LOGIN.JS — Autenticação via API JWT
// ═══════════════════════════════════════

const API = 'http://localhost:8080/api';

function togglePw(btn) {
  const inp    = document.getElementById('senha');
  const isText = inp.type === 'text';
  inp.type = isText ? 'password' : 'text';

  if (isText) {
    btn.classList.remove('toggle-active');
  } else {
    btn.classList.add('toggle-active');
  }
}

async function doLogin() {
  const u   = document.getElementById('usuario').value.trim();
  const s   = document.getElementById('senha').value;
  const btn = document.getElementById('btnLogin');

  const contUsuario = document.getElementById('containerUsuario');
  const contSenha   = document.getElementById('containerSenha');
  const errU = document.getElementById('uError');
  const errS = document.getElementById('sError');

  // Limpar erros
  contUsuario.classList.remove('error');
  contSenha.classList.remove('error');
  errU.classList.remove('show');
  errS.classList.remove('show');
  errU.innerText = '';
  errS.innerText = '';

  // Validar campos vazios
  if (!u || !s) {
    if (!u) { contUsuario.classList.add('error'); errU.innerText = 'Por favor, insira o utilizador.'; errU.classList.add('show'); }
    if (!s) { contSenha.classList.add('error');   errS.innerText = 'Por favor, insira a senha.';     errS.classList.add('show'); }
    return;
  }

  // Loading
  btn.classList.add('loading');

  try {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: u, senha: s })
    });

    const data = await response.json();

    if (response.ok) {
      // Guardar token no sessionStorage
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('usuario', data.usuario);

      // Mostrar ecrã de sucesso
      document.getElementById('successMessage').classList.add('active');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);

    } else {
      btn.classList.remove('loading');
      contSenha.classList.add('error');
      contUsuario.classList.add('error');
      errS.innerText = data.mensagem || 'Utilizador ou senha incorrectos.';
      errS.classList.add('show');
      contSenha.classList.add('shake');
      contSenha.addEventListener('animationend', () => contSenha.classList.remove('shake'), { once: true });
      document.getElementById('senha').value = '';
      document.getElementById('senha').focus();
    }

  } catch (e) {
    btn.classList.remove('loading');
    errS.innerText = 'Erro ao conectar ao servidor.';
    errS.classList.add('show');
  }
}