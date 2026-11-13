# Cati Forms — referência de design do frontend

Esta pasta é o modelo visual da SPA. **Não é código de produção**: cada `.dc.html` é uma tela desenhada no Claude Design (HTML com estilos inline e um bloco `<script type="text/x-dc">` com dados de exemplo). Use-os como especificação de layout, cores, textos e estados.

Requisitos do sistema: `requisitos.md` (RF01–RF16, RNF01–RNF08, RN01–RN11).

## Tokens (ver `Guia.dc.html`)

| Token | Hex | Uso |
|---|---|---|
| `--color-navy` | `#0A1F44` | barra superior, títulos, painel do login |
| `--color-primary` | `#1D5FD6` | botões primários, links, foco |
| `--color-primary-hover` | `#164BB0` | hover dos primários e links |
| `--color-primary-soft` | `#EBF2FF` | botões suaves, item selecionado, avisos |
| `--color-surface` | `#F5F8FD` | cabeçalho de tabela, áreas de leitura |
| `--color-bg` | `#FFFFFF` | fundo de todas as páginas |
| `--color-text` | `#0F1B33` | texto |
| `--color-muted` | `#4B5870` | texto secundário |
| `--color-border` | `#C5D0E3` | borda de campos |
| `--color-border-soft` | `#E3E9F3` | borda de cartões |
| `--color-error` | `#B42318` | erros de validação |
| `--color-success` | `#11603A` | confirmações |

Fontes (Google Fonts): Space Grotesk (títulos), Inter (interface), JetBrains Mono (links/códigos).
Raio 8 px (campos/botões), 12 px (cartões). Alvos de toque ≥ 44 px. Conteúdo: 1120 px na área logada, 720 px na resposta pública.

## Telas → rotas

| Arquivo | Rota | Acesso | Requisitos |
|---|---|---|---|
| `Main.dc.html` | `/login` | pública | RF02 |
| `Cadastro.dc.html` | `/cadastro` (mostra erro de username em uso) | pública | RF01, RN01 |
| `Formularios.dc.html` | `/formularios` | logado | RF14, RN10 |
| `Criar.dc.html` | `/formularios/novo` | logado | RF03–RF07, RN04, RN07, RN08 |
| `Link.dc.html` | `/formularios/:id/publicado` | logado | RF08 |
| `Respostas.dc.html` | `/formularios/:id` | logado | RF14–RF16, RN11 |
| `Responder.dc.html` | `/f/:codigo` (desktop) | pública | RF09–RF11 |
| `ResponderMobile.dc.html` | `/f/:codigo` (celular, estado com erros) | pública | RF10, RF11, RNF02 |
| `Enviado.dc.html` | `/f/:codigo/enviado` | pública | — |

Rotas "logado" redirecionam para `/login` sem sessão. A barra superior azul-marinho é igual em todas as telas logadas e vira um componente compartilhado.

## Observações

- Usernames, contagens, e-mails e textos entre colchetes são dados de exemplo; os reais vêm da API.
- `[seu-domínio]` no link compartilhado deve vir da configuração (ex.: `window.location.origin`).
- Formulários não têm edição nem exclusão (RN07): não criar esses botões.
