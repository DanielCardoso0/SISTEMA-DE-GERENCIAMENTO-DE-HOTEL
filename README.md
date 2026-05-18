# Hotel Management System

Sistema de gestão hoteleira com front-end web e back-end Java (CMD).

---

## Estrutura do Projecto

```
frontend/
│
├── index.html          → Página de Login
├── dashboard.html      → Dashboard principal (todas as páginas SPA)
│
├── css/
│   ├── login.css       → Estilos da página de login
│   └── dashboard.css   → Estilos do dashboard, sidebar, tabelas, modal, cards
│
├── js/
│   ├── login.js        → Lógica de autenticação (equivalente a Login.java)
│   └── dashboard.js    → CRUD completo (equivalente a SistemaHotel.java)
│
└── java/
    ├── Main.java        → Ponto de entrada do sistema CMD
    ├── Login.java       → Autenticação: admin / 2026
    ├── Funcionario.java → Modelo do funcionário (id, nome, bi, cargo, salário, telefone, turno)
    ├── Presenca.java    → Modelo de presença (idFuncionario, nome, estado)
    └── SistemaHotel.java → CRUD: cadastrar, listar, editar, remover, relatório
```

---

## Credenciais

| Campo      | Valor   |
|------------|---------|
| Utilizador | `admin` |
| Senha      | `2026`  |

---

## Funcionalidades Web

| Página          | Descrição                                              |
|-----------------|--------------------------------------------------------|
| Login           | Autenticação com validação e animação de erro          |
| Dashboard       | Cards de resumo + tabela dos 5 funcionários recentes   |
| Funcionários    | Tabela completa, pesquisa, cadastrar, editar, remover  |
| Presenças       | Registar por ID, histórico em cards com estado         |
| Relatório       | Totais, folha salarial, média, cargos e turnos         |

---

## Equivalência Java ↔ Web

| Java                        | Web                        |
|-----------------------------|----------------------------|
| `Login.java`                | `js/login.js`              |
| `SistemaHotel.java`         | `js/dashboard.js`          |
| `Funcionario.java`          | Objecto JS `{ id, nome… }` |
| `Presenca.java`             | Objecto JS `{ id, estado…}`|
| `funcionarios.txt`          | `localStorage`             |
| `cadastrarFuncionario()`    | `salvarFuncionario()`      |
| `listarFuncionarios()`      | `renderTable()`            |
| `editarFuncionario()`       | `openModal('edit', id)`    |
| `removerFuncionario()`      | `removerFuncionario(id)`   |
| `registrarPresenca()`       | `registrarPresenca()`      |
| `relatorio()`               | `renderRelatorio()`        |

---

## Como usar

### Front-end (Web)
1. Abrir `index.html` no browser
2. Entrar com `admin` / `2026`
3. Navegar pelo menu lateral

### Back-end (Java CMD)
```bash
cd java/
javac *.java
java Main
```

---

## Próximos Passos

1. **Spring Boot** — converter `SistemaHotel.java` em REST API
2. **MySQL** — substituir `localStorage` por base de dados real
3. **Fetch API** — ligar o front-end à API Java via `fetch()`
4. **Níveis de acesso** — admin, RH, gerente, supervisor
5. **Datas reais** — `LocalDate` no Java, `Date` no JS
