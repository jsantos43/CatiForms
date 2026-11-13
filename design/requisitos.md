DOCUMENTO DE REQUISITOS
Banco de Talentos - Software

Plataforma de coleta e gerenciamento de formulários e respostas

São Carlos
2026

1)  RESUMO

Este documento especifica os requisitos funcionais e não funcionais do sistema
de gerenciamento de formulários e respostas, desenvolvido com a finalidade de avaliar
os  candidatos  durante  o  processo  do  Banco  de  Talentos  para  ingresso  na  Cati  Jr. no
período do segundo semestre de 2026.

O  produto  final  visa  integrar  o  ambiente  de  sistemas  internos  da  empresa
através  de  uma  ferramenta  válida  de  coleta  de  respostas,  dados  e  feedbacks,
permitindo o uso prático em casos do dia a dia, como criação dinâmica de formulários,
exportação  para  coleta  de  informações  e  análise  de  respostas,  além  de  outras
funcionalidades que irão integrar o sistema por consequência.

2)  OBJETIVO E JUSTIFICATIVA

2.1) Objetivo geral

Desenvolver  o Cati Forms, uma plataforma web de criação, compartilhamento
e  armazenamento  de  formulários,  semelhante  ao  Google  Forms,  a  ser  proposta  no
Banco de Talentos 2026 da CATI Jr.

2.2) Objetivos específicos

●  Permitir  a  criação  de  formulários  com  perguntas  discursivas,  de  múltipla

escolha e de escolha única com justificativa.

●  Gerar um link de acesso para que qualquer pessoa, cadastrada ou não, responda

a um formulário.

●  Armazenar,  de  forma  independente,  cada  formulário,  suas  perguntas  e  suas

respostas.

●  Permitir a organização e a exportação das respostas em arquivos PDF e CSV.
●  Servir como base para o módulo de Controle de Pessoas da CATI Jr., por meio

do aproveitamento das melhores ideias enviadas no Banco de Talentos.

2.3) Justificativa

O  Banco  de  Talentos  demanda  uma  forma  estruturada  de  coletar  e  organizar
informações  dos  participantes.  Uma  plataforma  própria  de  formulários  atende a essa
necessidade  e  permite  que  a  CATI Jr. mantenha o controle sobre os dados coletados.
Além  disso,  o  projeto,  por  ser  simples  e  modular,  poderá  ser  evoluído  e  integrado
futuramente ao módulo de Controle de Pessoas.

3)   ESCOPO

3.1) Dentro do escopo

●  Cadastro e login de usuários com username único e senha.
●  Criação de formulários com os três tipos de pergunta definidos.
●  Geração de link de acesso para resposta.
●  Resposta de formulários por usuários externos, sem cadastro.
●  Armazenamento de formulários e respostas em banco de dados.
●  Consulta dos formulários e das respostas por qualquer usuário cadastrado.
●  Exportação das respostas em PDF e CSV.

3.2) Fora do escopo

●  Edição e exclusão de formulários após a criação.
●  Níveis ou perfis de acesso diferenciados entre usuários.
●  Perguntas opcionais e limite de opções na múltipla escolha.
●  Outros tipos de pergunta além dos três definidos

.

4)  REQUISITOS FUNCIONAIS

4.1) Gestão de usuários

●  RF01: O sistema deve permitir o cadastro de usuários com username único e

senha.

●  RF02: O sistema deve permitir que o usuário cadastrado faça login e logout.

4.2) Criação de formulários

●  RF03: O sistema deve permitir que qualquer usuário cadastrado crie um

formulário com título e descrição.

●  RF04: O sistema deve permitir a inclusão de perguntas do tipo discursiva.
●  RF05: O sistema deve permitir a inclusão de perguntas do tipo múltipla

escolha, com quantidade ilimitada de opções marcáveis.

●  RF06: O sistema deve permitir a inclusão de perguntas do tipo escolha única

com justificativa.

●  RF07: O sistema deve permitir que o criador defina se o formulário solicitará o

e-mail de contato do respondente.

4.3) Compartilhamento

●  RF08: O sistema deve gerar um link de acesso para cada formulário criado.
●  RF09: O sistema deve permitir que qualquer pessoa com o link acesse e

responda ao formulário sem necessidade de cadastro.

4.4) Respostas e consulta

●  RF10: O sistema deve exigir o preenchimento de todas as perguntas antes do

envio da resposta.

●  RF11: O sistema deve exigir a justificativa nas perguntas de escolha única com

justificativa.

●  RF12: O sistema deve armazenar cada formulário, com suas perguntas, de

forma independente.

●  RF13: O sistema deve armazenar as respostas vinculadas ao respectivo

formulário.

●  RF14: O sistema deve permitir que qualquer usuário cadastrado visualize a

lista de formulários e todos os seus detalhes, incluindo as respostas.

4.5) Exportação de respostas

●  RF15: O sistema deve permitir a exportação das respostas de um formulário

em arquivo CSV.

●  RF16: O sistema deve permitir a exportação das respostas de um formulário

em arquivo PDF.

5)   REQUISITOS NÃO FUNCIONAIS

5.1) Usabilidade

●  RNF01: A interface deve ser simples e intuitiva, permitindo a criação de um

formulário sem treinamento prévio.

●  RNF02: A página de resposta deve ser responsiva, funcionando em celulares e

computadores.

5.2) Desempenho e disponibilidade

●  RNF03: O carregamento de um formulário para resposta deve ocorrer em
tempo adequado para uso comum (meta preliminar: até 3 segundos).
●  RNF04: O sistema deve ser acessível via navegador, sem necessidade de

instalação.

5.3) Segurança

●  RNF05: As senhas dos usuários devem ser armazenadas de forma

criptografada (hash).

●  RNF06: Os níveis de acesso e demais controles avançados de segurança não

são prioridade nesta versão.

5.4) Manutenibilidade e integração

●  RNF07: O sistema deve ser construído de forma modular, com API bem

definida, para facilitar a integração futura ao módulo de Controle de Pessoas.

●  RNF08: O banco de dados deve ser modelado de modo que formulários,
perguntas e respostas sejam entidades independentes e relacionadas.

6)  REGRAS DE NEGÓCIO

6.1) Usuários

●  RN01: O username deve ser único em toda a plataforma.
●  RN02: Existe um único tipo de usuário, com acesso total a qualquer

formulário.

●  RN03: Qualquer pessoa pode criar um formulário, desde que cadastrada e

autenticada.

6.2) Formulários e perguntas

●  RN04: Todas as perguntas são obrigatórias nesta versão.
●  RN05: Na escolha única com justificativa, a justificativa é obrigatória.
●  RN06: Na múltipla escolha, não há limite de opções marcadas.
●  RN07: Formulários não podem ser editados nem excluídos após a criação.
●  RN08: A solicitação de e-mail de contato é opcional e definida pelo criador de

cada formulário.

6.3) Respostas e acesso

●  RN09: Respondentes externos não precisam de cadastro e acessam apenas por

meio do link.

●  RN10: Usuários cadastrados podem visualizar todos os detalhes de qualquer

formulário, inclusive as respostas.

●  RN11: As respostas devem poder ser organizadas e exportadas em PDF e CSV.

7) EVOLUÇÕES FUTURAS

●  Integração com o módulo de Controle de Pessoas da CATI Jr., aproveitando as

melhores ideias do Banco de Talentos.

●  Edição e exclusão de formulários, com tratamento das respostas já existentes.
●  Perfis e níveis de acesso, com controle de quem pode visualizar ou editar cada

formulário.

●  Perguntas opcionais e configurações avançadas por pergunta (limite de opções,

por exemplo).

●  Novos tipos de pergunta (escala, data, upload de arquivo etc.).
●  Reforço de segurança e privacidade dos dados coletados, como recuperação de

senha e controle de acesso às respostas.

