# Requisitos — Cati Forms

Legenda: `[ok]` atendido · `[~]` atendido parcialmente · `[ ]` não atendido / não verificado

## Requisitos Funcionais

### Gestão de usuários

| ID   | Requisito | Status |
| ---- | --------- | :----: |
| RF01 | O sistema deve permitir o cadastro de usuários com username único e senha. | [ok] |
| RF02 | O sistema deve permitir que o usuário cadastrado faça login e logout. | [ok] |

### Criação de formulários

| ID   | Requisito | Status |
| ---- | --------- | :----: |
| RF03 | O sistema deve permitir que qualquer usuário cadastrado crie um formulário com título e descrição. | [ok] |
| RF04 | O sistema deve permitir a inclusão de perguntas do tipo discursiva. | [ok] |
| RF05 | O sistema deve permitir a inclusão de perguntas do tipo múltipla escolha, com quantidade ilimitada de opções marcáveis. | [ok] |
| RF06 | O sistema deve permitir a inclusão de perguntas do tipo escolha única com justificativa. | [ok] |
| RF07 | O sistema deve permitir que o criador defina se o formulário solicitará o e-mail de contato do respondente. | [ok] |

### Compartilhamento

| ID   | Requisito | Status |
| ---- | --------- | :----: |
| RF08 | O sistema deve gerar um link de acesso para cada formulário criado. | [ok] |
| RF09 | O sistema deve permitir que qualquer pessoa com o link acesse e responda ao formulário sem necessidade de cadastro. | [ok] |

### Respostas e consulta

| ID   | Requisito | Status |
| ---- | --------- | :----: |
| RF10 | O sistema deve exigir o preenchimento de todas as perguntas antes do envio da resposta. | [ok] |
| RF11 | O sistema deve exigir a justificativa nas perguntas de escolha única com justificativa. | [ok] |
| RF12 | O sistema deve armazenar cada formulário, com suas perguntas, de forma independente. | [ok] |
| RF13 | O sistema deve armazenar as respostas vinculadas ao respectivo formulário. | [ok] |
| RF14 | O sistema deve permitir que qualquer usuário cadastrado visualize a lista de formulários e todos os seus detalhes, incluindo as respostas. | [ok] |

### Exportação de respostas

| ID   | Requisito | Status |
| ---- | --------- | :----: |
| RF15 | O sistema deve permitir a exportação das respostas de um formulário em arquivo CSV. | [ok] |
| RF16 | O sistema deve permitir a exportação das respostas de um formulário em arquivo PDF. | [ok] |

## Requisitos Não Funcionais

| ID    | Requisito | Status |
| ----- | --------- | :----: |
| RNF01 | A interface deve ser simples e intuitiva, permitindo a criação de um formulário sem treinamento prévio. | [ok] |
| RNF02 | A página de resposta deve ser responsiva, funcionando em celulares e computadores. | [ok] |
| RNF03 | O carregamento de um formulário para resposta deve ocorrer em tempo adequado para uso comum (meta: até 3 segundos). | [ok] |
| RNF04 | O sistema deve ser acessível via navegador, sem necessidade de instalação. | [ok] |
| RNF05 | As senhas dos usuários devem ser armazenadas de forma criptografada (hash). | [ok] |
| RNF06 | Níveis de acesso e controles avançados de segurança não são prioridade nesta versão. | [ok] |
| RNF07 | O sistema deve ser construído de forma modular, com API bem definida, para facilitar a integração futura ao módulo de Controle de Pessoas. | [ok] |
| RNF08 | O banco de dados deve ser modelado de modo que formulários, perguntas e respostas sejam entidades independentes e relacionadas. | [ok] |

## Regras de Negócio

| ID   | Regra | Status |
| ---- | ----- | :----: |
| RN01 | O username deve ser único em toda a plataforma. | [ok] |
| RN02 | Existe um único tipo de usuário, com acesso total a qualquer formulário. | [ok] |
| RN03 | Qualquer pessoa pode criar um formulário, desde que cadastrada e autenticada. | [ok] |
| RN04 | Todas as perguntas são obrigatórias nesta versão. | [ok] |
| RN05 | Na escolha única com justificativa, a justificativa é obrigatória. | [ok] |
| RN06 | Na múltipla escolha, não há limite de opções marcadas. | [ok] |
| RN07 | Formulários não podem ser editados nem excluídos após a criação. | [~] |
| RN08 | A solicitação de e-mail de contato é opcional e definida pelo criador de cada formulário. | [ok] |
| RN09 | Respondentes externos não precisam de cadastro e acessam apenas por meio do link. | [ok] |
| RN10 | Usuários cadastrados podem visualizar todos os detalhes de qualquer formulário, inclusive as respostas. | [ok] |
| RN11 | As respostas devem poder ser organizadas e exportadas em PDF e CSV. | [ok] |

## Observações

- **RN07 — parcial.** Pela interface, o formulário é criado e publicado de uma vez, e depois disso o middleware `verifyPublished` bloqueia edição e exclusão. Pela API, porém, um formulário ainda não publicado (rascunho) pode ser editado (`PUT /forms/:id`, rotas de perguntas) e excluído (`DELETE /forms/:id`).
- **RF16:** o PDF é gerado pela impressão do navegador (`window.print()` → "Salvar como PDF"), com um CSS de impressão próprio. Isso atende ao requisito, mas o usuário precisa escolher "Salvar como PDF" na janela de impressão.
