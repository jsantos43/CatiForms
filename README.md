# CatiForms

**Crie formulários, compartilhe um link e analise as respostas**

Plataforma web de criação, compartilhamento e análise de formulários, desenvolvida para o
**Banco de Talentos 2026 da CATI Jr.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js_24-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_18-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/licença-MIT-green?style=flat)

---

## 💡 Sobre o projeto

O **CatiForms** é um sistema para criar formulários, compartilhá-los por link e reunir as
respostas em um só lugar.

O projeto foi desenvolvido para uma demanda do **Banco de Talentos da CATI Jr.** e segue os
requisitos definidos no [documento do processo](BANCO_DE_TALENTO-REQUISITIOS.pdf). A proposta é
oferecer à CATI Jr. uma **plataforma de formulários própria**, para usar no dia a dia em processos
seletivos, pesquisas internas e coleta de feedbacks, mantendo todos os dados sob controle da empresa.

> O atendimento a cada requisito pode ser conferido em [`Requisitos.md`](Requisitos.md).

---

## ✨ Features

### Para quem cria
- 🔐 **Cadastro e login** com username único e senha protegida por hash (bcrypt).
- 📝 **Editor de formulários** com título, descrição e três tipos de pergunta:
  - **Discursiva**: resposta em texto livre;
  - **Múltipla escolha**: quantas opções quiser, sem limite de marcação;
  - **Escolha única com justificativa**: o respondente escolhe uma opção e explica o porquê.
- 📧 **Coleta de e-mail opcional**, ativada por formulário com um clique.
- 🛟 **Proteção contra perda de trabalho**: o navegador avisa antes de sair com um formulário não publicado.
- 🔗 **Link público gerado automaticamente** na publicação, com botão de copiar.
- 🔒 **Formulários imutáveis após a publicação**: as respostas coletadas nunca ficam inconsistentes.

### Para quem responde
- 🌍 **Sem cadastro**: basta abrir o link.
- 📱 **Página responsiva**, funciona no celular e no computador.
- ✅ **Validação clara e acessível**: todas as perguntas são obrigatórias, e os erros aparecem
  junto de cada campo, com foco automático no primeiro problema.

### Para quem analisa
- 📊 **Painel com todos os formulários** da plataforma, com busca por título ou criador e contagem
  de perguntas e respostas.
- 🔍 **Duas visualizações de respostas**: **individual** (uma resposta completa por vez) e **por
  pergunta** (todas as respostas de uma pergunta lado a lado).
- 📥 **Exportação em CSV**, pronta para o Excel em português (separador `;` e acentuação correta).
- 📄 **Exportação em PDF**, com layout de impressão dedicado que mostra só o formulário e as respostas.

---

## 🔑 Autenticação com JWT

A autenticação foi construída do zero, com foco em segurança:

| Mecanismo | Como funciona |
| --- | --- |
| **Access token (JWT)** | Assinado com `HS256`, vale **15 minutos** e é enviado em um cookie `httpOnly`, inacessível ao JavaScript da página (proteção contra XSS). |
| **Refresh token** | Token aleatório de 512 bits com validade de **7 dias**. No banco fica guardado apenas o **hash SHA-256**, nunca o token em si. |
| **Rotação de tokens** | A cada renovação, um novo refresh token é emitido e o anterior deixa de valer. |
| **Renovação transparente** | Quando o access token expira, o front-end renova a sessão sozinho e repete a requisição. O usuário não percebe nada. |
| **Logout de verdade** | Cada usuário tem uma `sessionVersion`. No logout ela é incrementada, invalidando na hora qualquer token já emitido. |
| **Senhas** | Armazenadas com **bcrypt**. O login leva o mesmo tempo para usuários existentes e inexistentes, o que dificulta descobrir usernames cadastrados. |

---

## 🛠️ Tecnologias

### Back-end (`api/`)
| Ferramenta | Uso |
| --- | --- |
| **Node.js 24** + **TypeScript** | Runtime e tipagem estática em todo o código |
| **Express 5** | Servidor HTTP e roteamento da API REST |
| **Prisma ORM** | Modelagem do banco, contrato tipado e queries |
| **PostgreSQL 18** | Banco de dados relacional |
| **Zod** | Validação dos dados de entrada de cada rota |
| **jsonwebtoken** | Emissão e verificação dos tokens JWT |
| **bcrypt** | Hash das senhas |
| **cookie-parser** | Leitura dos cookies de sessão |
| **tsx** / **Prettier** | Hot reload em desenvolvimento e formatação do código |

### Front-end (`app/`)
| Ferramenta | Uso |
| --- | --- |
| **React 19** + **TypeScript** | Interface |
| **React Router 7** | Rotas públicas, de visitante e protegidas |
| **Vite** | Build e servidor de desenvolvimento, com proxy para a API |
| **CSS Modules** | Estilos isolados por componente, com tokens de design |
| **ESLint** | Padronização do código |

### Infraestrutura
- **Docker Compose**: sobe banco, API e front-end com um único comando.

---

## 🏗️ Arquitetura

```
CatiForms/
├── api/                    # API REST
│   └── src/
│       ├── routes/         # Definição das rotas
│       ├── middlewares/    # Autenticação, validação, bloqueio de forms publicados, erros
│       ├── controllers/    # Camada HTTP (request → response)
│       ├── services/       # Regras de negócio e acesso ao banco
│       ├── schemas/        # Schemas Zod de validação
│       ├── errors/         # Erros padronizados da API
│       └── prisma/         # Contrato do banco de dados
├── app/                    # Front-end React
│   └── src/
│       ├── api/            # Cliente HTTP e chamadas à API
│       ├── auth/           # Contexto de sessão e guardas de rota
│       ├── pages/          # Telas da aplicação
│       ├── components/     # Componentes reutilizáveis
│       └── layouts/        # Layouts (autenticado, público, login)
└── compose.yaml            # Ambiente de desenvolvimento
```

O back-end segue uma arquitetura em camadas (**routes → middlewares → controllers → services**),
o que deixa a API modular e fácil de integrar a outros sistemas internos da empresa. No banco,
**formulários, perguntas, respostas e respostas por pergunta são entidades independentes e
relacionadas**.

### Principais rotas da API

| Método | Rota | Descrição | Auth |
| --- | --- | --- | :---: |
| `POST` | `/user` | Cadastro de usuário | |
| `POST` | `/auth/login` | Login | |
| `POST` | `/auth/refresh` | Renova a sessão | |
| `POST` | `/auth/logout` | Logout | ✅ |
| `GET` | `/forms` | Lista todos os formulários | ✅ |
| `POST` | `/forms` | Cria um formulário | ✅ |
| `GET` | `/forms/:id` | Detalhes de um formulário | ✅ |
| `POST` | `/forms/:id/questions` | Adiciona uma pergunta | ✅ |
| `GET` | `/forms/:id/responses` | Respostas de um formulário | ✅ |
| `GET` | `/f/:slug` | Formulário público para resposta | |
| `POST` | `/f/:slug/responses` | Envia uma resposta | |

---

## 🚀 Como executar

### Pré-requisitos
- [Docker](https://www.docker.com/) com Docker Compose.

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/jsantos43/CatiForms.git
cd CatiForms

# 2. Crie o arquivo de ambiente da API e defina um JWT_SECRET seu
cp api/.env.example api/.env

# 3. Suba banco, API e front-end
docker compose up

# 4. Em outro terminal, crie as tabelas no banco (só na primeira execução)
docker compose exec api npm run db:update
```

Pronto! Acesse **http://localhost:5173**.

| Serviço | Endereço |
| --- | --- |
| Front-end | http://localhost:5173 |
| API | http://localhost:3000 |
| PostgreSQL | `localhost:5432` (usuário, senha e banco: `catiforms`) |

### Variáveis de ambiente (`api/.env`)

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | String de conexão do PostgreSQL (no Docker, o `compose.yaml` já define esse valor) |
| `PORT` | Porta da API (padrão `3000`, a mesma que o proxy do front-end usa) |
| `NODE_ENV` | `development` ou `production` (em produção os cookies passam a exigir HTTPS) |
| `JWT_SECRET` | Segredo usado para assinar os tokens. Use um valor longo e aleatório. |

---

## 🔭 Próximos passos

Em linha com as *Evoluções Futuras* do documento de requisitos:

- **Perfis e níveis de acesso.** Uma implementação inicial, com perfil de administrador e permissões
  por formulário, está na branch
  [`feature/perfis-de-acesso`](https://github.com/jsantos43/CatiForms/tree/feature/perfis-de-acesso).
  Ela ficou fora da `main` porque o escopo desta versão define um único tipo de usuário (RN02).
- Integração com outros sistemas internos da CATI Jr.
- Edição e exclusão de formulários com tratamento das respostas existentes.
- Perguntas opcionais e novos tipos de pergunta (escala, data, upload de arquivo).
- Recuperação de senha.

---

## 👤 Autor

**João Pedro Tomaz dos Santos**, [@jsantos43](https://github.com/jsantos43)

Projeto desenvolvido para o **Banco de Talentos 2026 da CATI Jr.**

---

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo [`LICENSE`](LICENSE) para mais detalhes.
