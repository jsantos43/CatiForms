// Estado e validação da página de resposta (RF10 e RF11).
// Funções puras: recebem o formulário e as respostas e devolvem erros/payload.

import type { ResponseInput } from '../../api/responses';
import type { PublicForm, Question } from '../../api/types';

// Mesmo formato para os três tipos; cada tipo usa só os campos que precisa.
export type AnswerDraft = {
  text: string; // discursiva
  selected: string[]; // rótulos das opções marcadas (escolha única usa só o primeiro)
  justification: string; // escolha única com justificativa
};

export type ResponseDraft = {
  email: string;
  answers: Record<string, AnswerDraft>;
};

export const emptyAnswer = (): AnswerDraft => ({ text: '', selected: [], justification: '' });

export const emptyDraft = (form: PublicForm): ResponseDraft => ({
  email: '',
  answers: Object.fromEntries(form.questions.map((q) => [q.id, emptyAnswer()])),
});

export const hasContent = (draft: ResponseDraft) =>
  draft.email.trim() !== '' ||
  Object.values(draft.answers).some(
    (a) => a.text.trim() || a.selected.length > 0 || a.justification.trim(),
  );

// Chaves de erro. Também são a base dos ids no DOM (ver ids abaixo).
export const errorKey = {
  email: 'email',
  answer: (q: Question) => q.id,
  justification: (q: Question) => `${q.id}:justification`,
};

// Id do elemento que recebe o foco quando o erro correspondente é o primeiro.
export const ids = {
  email: 'r-email',
  text: (q: Question) => `r-${q.id}`,
  // As opções não têm id na API: o índice identifica a opção no DOM.
  option: (q: Question, index: number) => `r-${q.id}-opt-${index}`,
  justification: (q: Question) => `r-${q.id}-justification`,
  error: (key: string) => `err-${key.replace(':', '-')}`,
};

export const focusTarget = (form: PublicForm, key: string) => {
  if (key === errorKey.email) return ids.email;
  const [questionId, part] = key.split(':');
  const q = form.questions.find((item) => item.id === questionId);
  if (!q) return null;
  if (part === 'justification') return ids.justification(q);
  if (q.type === 'TEXT') return ids.text(q);
  return q.options.length > 0 ? ids.option(q, 0) : null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ResponseErrors = Record<string, string>;

// Erros na ordem da tela: e-mail primeiro, depois cada pergunta.
export const validateResponse = (form: PublicForm, draft: ResponseDraft): ResponseErrors => {
  const errors: ResponseErrors = {};

  if (form.collectEmail) {
    const email = draft.email.trim();
    if (!email) errors[errorKey.email] = 'Informe seu e-mail de contato.';
    else if (!EMAIL_RE.test(email)) errors[errorKey.email] = 'Informe um e-mail válido.';
  }

  for (const q of form.questions) {
    const a = draft.answers[q.id] ?? emptyAnswer();

    // RF10 / RN04: todas as perguntas são obrigatórias.
    switch (q.type) {
      case 'TEXT':
        if (!a.text.trim()) errors[errorKey.answer(q)] = 'Responda esta pergunta.';
        break;
      case 'MULTIPLE_CHOICE':
        if (a.selected.length === 0) errors[errorKey.answer(q)] = 'Marque pelo menos uma opção.';
        break;
      case 'SINGLE_CHOICE_JUSTIFIED':
        if (a.selected.length === 0) errors[errorKey.answer(q)] = 'Escolha uma opção.';
        // RF11 / RN05: a justificativa é obrigatória, independentemente da opção.
        if (!a.justification.trim()) errors[errorKey.justification(q)] = 'A justificativa é obrigatória.';
        break;
    }
  }

  return errors;
};

// Corpo do POST /f/:slug/responses (formato em api/src/schemas/Response.ts).
export const toResponseInput = (form: PublicForm, draft: ResponseDraft): ResponseInput => ({
  email: form.collectEmail ? draft.email.trim() : null,
  answers: form.questions.map((q) => {
    const a = draft.answers[q.id] ?? emptyAnswer();
    switch (q.type) {
      case 'TEXT':
        return { questionId: q.id, text: a.text.trim(), choices: [] };
      case 'MULTIPLE_CHOICE':
        // Mantém a ordem das opções no formulário, não a ordem dos cliques.
        return {
          questionId: q.id,
          text: null,
          choices: q.options.filter((o) => a.selected.includes(o.label)).map((o) => o.label),
        };
      case 'SINGLE_CHOICE_JUSTIFIED':
        return { questionId: q.id, text: a.justification.trim(), choices: a.selected.slice(0, 1) };
    }
  }),
});
