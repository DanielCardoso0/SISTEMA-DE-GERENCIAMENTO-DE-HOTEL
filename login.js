// Alternar Visibilidade da Senha
function togglePw(btn) {
    const inp = document.getElementById('senha');
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    
    // Altera a classe para trocar os ícones (olho aberto / fechado)
    if (isText) {
        btn.classList.remove('toggle-active');
    } else {
        btn.classList.add('toggle-active');
    }
}

// Lógica Principal de Login
function doLogin() {
    const u = document.getElementById('usuario').value.trim();
    const s = document.getElementById('senha').value;
    const btn = document.getElementById('btnLogin');
    
    const contUsuario = document.getElementById('containerUsuario');
    const contSenha   = document.getElementById('containerSenha');
    const errU = document.getElementById('uError');
    const errS = document.getElementById('sError');

    // 1. Limpar erros antigos
    contUsuario.classList.remove('error');
    contSenha.classList.remove('error');
    errU.classList.remove('show');
    errS.classList.remove('show');
    errU.innerText = '';
    errS.innerText = '';

    // 2. Validar campos vazios
    if (!u || !s) {
        if (!u) {
            contUsuario.classList.add('error');
            errU.innerText = 'Por favor, insira o utilizador.';
            errU.classList.add('show');
        }
        if (!s) {
            contSenha.classList.add('error');
            errS.innerText = 'Por favor, insira a senha.';
            errS.classList.add('show');
        }
        return;
    }

    // 3. Simular loading (Integração com o design de Soft Minimalism)
    btn.classList.add('loading');

    setTimeout(() => {
        btn.classList.remove('loading');

        // Credenciais: admin / 2026
        if (u === 'admin' && s === '2026') {
            // Mostrar ecrã de sucesso orgânico
            document.getElementById('successMessage').classList.add('active');
            
            // Simular redirecionamento
            setTimeout(() => { 
                window.location.href = 'dashboard.html'; 
            }, 1200);
        } else {
            // Animar erro (shake)
            contSenha.classList.add('error');
            contUsuario.classList.add('error');
            
            errS.innerText = 'Utilizador ou senha incorrectos.';
            errS.classList.add('show');
            
            contSenha.classList.add('shake');
            contSenha.addEventListener('animationend', () => contSenha.classList.remove('shake'), { once: true });
            
            document.getElementById('senha').value = '';
            document.getElementById('senha').focus();
        }
    }, 900);
}