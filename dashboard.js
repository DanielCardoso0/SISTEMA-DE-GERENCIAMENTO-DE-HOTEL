// ═══════════════════════════════════════
//  DASHBOARD.JS — Hotel Management System
//  Ligado à API Spring Boot com JWT
// ═══════════════════════════════════════

const API = 'http://localhost:8080/api';

let funcionarios = [];
let presencas    = [];
let editingId    = null;

// ══════════════════════════════════
//  JWT — AUTENTICAÇÃO
// ══════════════════════════════════

function headers() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

function verificarAuth() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
  }
}

function handleUnauthorized(res) {
  if (res.status === 401 || res.status === 403) {
    sessionStorage.clear();
    window.location.href = 'index.html';
    return true;
  }
  return false;
}

// ══════════════════════════════════
//  CARREGAR DADOS DA API
// ══════════════════════════════════

async function carregarFuncionarios() {
  try {
    const res = await fetch(`${API}/funcionarios`, { headers: headers() });
    if (handleUnauthorized(res)) return;
    funcionarios = await res.json();
  } catch (e) {
    toast('Erro ao carregar funcionários.', 'danger');
  }
}

async function carregarPresencas() {
  try {
    const res = await fetch(`${API}/presencas`, { headers: headers() });
    if (handleUnauthorized(res)) return;
    presencas = await res.json();
  } catch (e) {
    toast('Erro ao carregar presenças.', 'danger');
  }
}

// ══════════════════════════════════
//  NAVEGAÇÃO ENTRE PÁGINAS
// ══════════════════════════════════

const pageLabels = {
  dashboard:    'Dashboard',
  funcionarios: 'Funcionários',
  presencas:    'Presenças',
  relatorio:    'Relatório'
};

const pageCrumbs = {
  dashboard:    'Visão geral do sistema',
  funcionarios: 'Gerir funcionários',
  presencas:    'Registar e listar presenças',
  relatorio:    'Análise de dados'
};

async function showPage(id, link) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');

  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  if (link) link.classList.add('active');

  document.getElementById('pageTitle').textContent = pageLabels[id];
  document.getElementById('pageCrumb').textContent = pageCrumbs[id];

  const btn = document.getElementById('topActionBtn');
  btn.style.display = (id === 'funcionarios') ? '' : 'none';

  if (id === 'dashboard')    { await carregarFuncionarios(); await carregarPresencas(); renderDash(); }
  if (id === 'funcionarios') { await carregarFuncionarios(); renderTable(); }
  if (id === 'presencas')    { await carregarFuncionarios(); await carregarPresencas(); renderPresencas(); }
  if (id === 'relatorio')    { await carregarFuncionarios(); await carregarPresencas(); renderRelatorio(); }
}

// ══════════════════════════════════
//  TOAST
// ══════════════════════════════════

let toastTimer;
function toast(msg, type = 'success') {
  clearTimeout(toastTimer);
  const el  = document.getElementById('toast');
  const dot = document.getElementById('toast-dot');
  const txt = document.getElementById('toast-msg');

  dot.style.background = type === 'success'
    ? 'var(--success)'
    : type === 'danger'
      ? 'var(--danger)'
      : 'var(--gold)';

  txt.textContent = msg;
  el.classList.add('show');
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

// ══════════════════════════════════
//  MODAL
// ══════════════════════════════════

function openModal(mode, id = null) {
  editingId = id;
  clearErrors();

  document.getElementById('modalTitle').textContent     = id ? 'Editar Funcionário' : 'Cadastrar Funcionário';
  document.getElementById('btnSalvarLabel').textContent = id ? 'Actualizar' : 'Cadastrar';

  if (id) {
    const f = funcionarios.find(x => x.id === id);
    document.getElementById('f-nome').value     = f.nome;
    document.getElementById('f-bi').value       = f.bi;
    document.getElementById('f-cargo').value    = f.cargo;
    document.getElementById('f-salario').value  = f.salario;
    document.getElementById('f-telefone').value = f.telefone;
    document.getElementById('f-turno').value    = f.turno;
    document.getElementById('f-bi').disabled    = true;
  } else {
    ['f-nome','f-bi','f-cargo','f-salario','f-telefone'].forEach(fid => {
      document.getElementById(fid).value = '';
    });
    document.getElementById('f-turno').value = 'Manhã';
    document.getElementById('f-bi').disabled = false;
  }

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function closeModalOut(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function clearErrors() {
  ['nome','bi','cargo','salario','telefone'].forEach(f => {
    document.getElementById('e-' + f).classList.remove('show');
    document.getElementById('f-' + f).classList.remove('err');
  });
}

function showError(field, msg) {
  const e = document.getElementById('e-' + field);
  if (msg) e.textContent = msg;
  e.classList.add('show');
  document.getElementById('f-' + field).classList.add('err');
}

// ══════════════════════════════════
//  CRUD — via API REST com JWT
// ══════════════════════════════════

async function salvarFuncionario() {
  clearErrors();
  let ok = true;

  const nome     = document.getElementById('f-nome').value.trim();
  const bi       = document.getElementById('f-bi').value.trim().toUpperCase();
  const cargo    = document.getElementById('f-cargo').value.trim();
  const salario  = parseFloat(document.getElementById('f-salario').value);
  const telefone = document.getElementById('f-telefone').value.trim();
  const turno    = document.getElementById('f-turno').value;

  if (!nome)                    { showError('nome', 'Campo obrigatório'); ok = false; }
  if (!cargo)                   { showError('cargo', 'Campo obrigatório'); ok = false; }
  if (!salario || salario <= 0) { showError('salario', 'Salário deve ser maior que 0'); ok = false; }
  if (!/^[29][0-9]{8}$/.test(telefone)) { showError('telefone', 'Número inválido (9 dígitos, inicia com 2 ou 9)'); ok = false; }
  if (!editingId && !/^[0-9]{9}[A-Z]{2}[0-9]{3}$/.test(bi)) { showError('bi', 'BI inválido. Ex: 003456789LA042'); ok = false; }

  if (!ok) return;

  const dados = { nome, bi, cargo, salario, telefone, turno };

  try {
    let response;
    if (editingId) {
      response = await fetch(`${API}/funcionarios/${editingId}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(dados)
      });
    } else {
      response = await fetch(`${API}/funcionarios`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(dados)
      });
    }

    if (handleUnauthorized(response)) return;

    if (!response.ok) {
      const erro = await response.text();
      toast(erro, 'danger');
      return;
    }

    toast(editingId ? 'Funcionário actualizado!' : 'Funcionário cadastrado!');
    closeModal();
    await carregarFuncionarios();
    renderTable();
    renderDash();

  } catch (e) {
    toast('Erro ao conectar à API.', 'danger');
  }
}

async function removerFuncionario(id) {
  if (!confirm('Remover este funcionário?')) return;

  try {
    const response = await fetch(`${API}/funcionarios/${id}`, {
      method: 'DELETE',
      headers: headers()
    });

    if (handleUnauthorized(response)) return;

    if (!response.ok) {
      toast('Erro ao remover funcionário.', 'danger');
      return;
    }

    toast('Funcionário removido.', 'danger');
    await carregarFuncionarios();
    renderTable();
    renderDash();

  } catch (e) {
    toast('Erro ao conectar à API.', 'danger');
  }
}

// ══════════════════════════════════
//  RENDER TABLE
// ══════════════════════════════════

function renderTable() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();

  const list = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(q) ||
    f.cargo.toLowerCase().includes(q) ||
    String(f.id).includes(q)
  );

  const tbody = document.getElementById('func-tbody');

  if (!list.length) {
    tbody.innerHTML = `
      <tr><td colspan="8">
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <p>Nenhum funcionário encontrado</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(f => `
    <tr>
      <td><span class="badge badge-gold">#${f.id}</span></td>
      <td><strong>${f.nome}</strong></td>
      <td style="color:var(--muted);font-family:monospace;font-size:12px">${f.bi}</td>
      <td>${f.cargo}</td>
      <td><span class="badge badge-green">${f.turno}</span></td>
      <td>${Number(f.salario).toLocaleString('pt-AO')} Kz</td>
      <td style="color:var(--muted)">${f.telefone}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn edit" title="Editar" onclick="openModal('edit', ${f.id})">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="icon-btn del" title="Remover" onclick="removerFuncionario(${f.id})">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ══════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════

function renderDash() {
  const total    = funcionarios.length;
  const presente = presencas.filter(p => p.estado === 'Presente').length;
  const faltosos = presencas.filter(p => p.estado === 'Faltou').length;
  const salTotal = funcionarios.reduce((s, f) => s + f.salario, 0);

  document.getElementById('sc-total').textContent     = total;
  document.getElementById('sc-presentes').textContent = presente;
  document.getElementById('sc-faltosos').textContent  = faltosos;
  document.getElementById('sc-salario').textContent   = (salTotal / 1000).toFixed(0) + 'K';

  const tbody = document.getElementById('dash-tbody');
  const list  = funcionarios.slice(-5).reverse();

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--muted)">Nenhum funcionário cadastrado</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(f => `
    <tr>
      <td><span class="badge badge-gold">#${f.id}</span></td>
      <td><strong>${f.nome}</strong></td>
      <td>${f.cargo}</td>
      <td><span class="badge badge-green">${f.turno}</span></td>
      <td>${Number(f.salario).toLocaleString('pt-AO')} Kz</td>
    </tr>
  `).join('');
}

// ══════════════════════════════════
//  PRESENÇAS — via API REST com JWT
// ══════════════════════════════════

async function registrarPresenca() {
  const id     = parseInt(document.getElementById('pres-id').value);
  const estado = document.getElementById('pres-estado').value;
  const f      = funcionarios.find(x => x.id === id);

  if (!f) {
    toast('Funcionário não encontrado!', 'danger');
    return;
  }

  try {
    const response = await fetch(`${API}/presencas`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        idFuncionario:   f.id,
        nomeFuncionario: f.nome,
        estado
      })
    });

    if (handleUnauthorized(response)) return;

    if (!response.ok) {
      const erro = await response.text();
      toast(erro, 'danger');
      return;
    }

    toast('Presença registada: ' + f.nome + ' — ' + estado);
    document.getElementById('pres-id').value = '';
    await carregarPresencas();
    renderPresencas();
    renderDash();

  } catch (e) {
    toast('Erro ao conectar à API.', 'danger');
  }
}

function renderPresencas() {
  const grid = document.getElementById('pres-grid');

  if (!presencas.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">Nenhuma presença registada</div>`;
    return;
  }

  grid.innerHTML = [...presencas].reverse().map(p => {
    const color    = p.estado === 'Presente' ? 'var(--success)' : 'var(--danger)';
    const initials = p.nomeFuncionario.split(' ').map(w => w[0]).slice(0,2).join('');

    return `
      <div class="presence-card">
        <div class="p-avatar" style="background:${color}">${initials}</div>
        <div class="p-info">
          <strong>${p.nomeFuncionario}</strong>
          <span>ID #${p.idFuncionario}</span><br/>
          <span style="font-size:11px;color:var(--muted)">${p.dataHora ? new Date(p.dataHora).toLocaleString('pt-PT') : ''}</span><br/>
          <span class="badge ${p.estado === 'Presente' ? 'badge-green' : 'badge-red'}" style="margin-top:4px">${p.estado}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ══════════════════════════════════
//  RELATÓRIO
// ══════════════════════════════════

function renderRelatorio() {
  const total    = funcionarios.length;
  const salTotal = funcionarios.reduce((s, f) => s + f.salario, 0);
  const presente = presencas.filter(p => p.estado === 'Presente').length;
  const faltosos = presencas.filter(p => p.estado === 'Faltou').length;

  const cargos = {};
  funcionarios.forEach(f => { cargos[f.cargo] = (cargos[f.cargo] || 0) + 1; });
  const cargoRows = Object.entries(cargos).map(([c, n]) =>
    `<tr><td>${c}</td><td><span class="badge badge-gold">${n}</span></td></tr>`
  ).join('') || `<tr><td colspan="2" style="color:var(--muted);text-align:center;padding:20px">Sem dados</td></tr>`;

  const turnos = {};
  funcionarios.forEach(f => { turnos[f.turno] = (turnos[f.turno] || 0) + 1; });
  const turnoRows = Object.entries(turnos).map(([t, n]) =>
    `<tr><td>${t}</td><td><span class="badge badge-green">${n}</span></td></tr>`
  ).join('') || `<tr><td colspan="2" style="color:var(--muted);text-align:center;padding:20px">Sem dados</td></tr>`;

  document.getElementById('rel-grid').innerHTML = `
    <div class="panel">
      <div class="panel-head"><h2>Resumo Geral</h2></div>
      <div style="padding:24px;display:flex;flex-direction:column;gap:16px">
        ${relItem('Total de Funcionários',  total,                                                       'var(--gold)')}
        ${relItem('Total Salarial',         Number(salTotal).toLocaleString('pt-AO') + ' Kz',           'var(--warn)')}
        ${relItem('Presenças Registadas',   presente + faltosos,                                         'var(--text)')}
        ${relItem('Presentes',              presente,                                                    'var(--success)')}
        ${relItem('Faltosos',               faltosos,                                                    'var(--danger)')}
        ${relItem('Média Salarial',         total ? Math.round(salTotal/total).toLocaleString('pt-AO') + ' Kz' : '0 Kz', 'var(--muted)')}
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:24px">
      <div class="panel">
        <div class="panel-head"><h2>Funcionários por Cargo</h2></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Cargo</th><th>Total</th></tr></thead>
            <tbody>${cargoRows}</tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Distribuição por Turno</h2></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Turno</th><th>Total</th></tr></thead>
            <tbody>${turnoRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function relItem(label, value, color) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid var(--border)">
      <span style="font-size:13px;color:var(--muted)">${label}</span>
      <strong style="color:${color};font-size:15px">${value}</strong>
    </div>
  `;
}

// ══════════════════════════════════
//  EXPORTAR PDF
// ══════════════════════════════════

async function exportarPDF() {
  try {
    toast('A gerar PDF...', 'gold');
    const response = await fetch(`${API}/relatorio/pdf`, {
      headers: headers()
    });

    if (handleUnauthorized(response)) return;

    if (!response.ok) {
      toast('Erro ao gerar PDF.', 'danger');
      return;
    }

    const blob = await response.blob();
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'relatorio_hotel.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
    toast('PDF exportado com sucesso!');

  } catch (e) {
    toast('Erro ao conectar à API.', 'danger');
  }
}

// ══════════════════════════════════
//  LOGOUT
// ══════════════════════════════════

function logout() {
  sessionStorage.clear();
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity .3s';
  setTimeout(() => { window.location.href = 'index.html'; }, 300);
}

// ══════════════════════════════════
//  INIT
// ══════════════════════════════════

async function init() {
  verificarAuth();
  await carregarFuncionarios();
  await carregarPresencas();
  renderDash();
}

init();

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});