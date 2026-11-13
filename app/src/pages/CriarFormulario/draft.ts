import type { CreateQuestionData } from '../../api/questions';
import type { QuestionType } from '../../api/types';
import { isChoice, MIN_OPTIONS } from '../../lib/questionTypes';
import { normalize } from '../../lib/format';

// Rascunho do formulário enquanto é montado na tela (nada vai para a API antes de publicar).

export type DraftOption = { key: string; label: string };

export type DraftQuestion = {
  key: string;
  type: QuestionType;
  title: string;
  // Guardadas mesmo quando a pergunta vira discursiva, para não perder o que foi digitado.
  options: DraftOption[];
};

let seq = 0;
export const newKey = () => `k${++seq}`;

export const newOption = (label = ''): DraftOption => ({ key: newKey(), label });

export const newQuestion = (type: QuestionType): DraftQuestion => ({
  key: newKey(),
  type,
  title: '',
  options: isChoice(type) ? Array.from({ length: MIN_OPTIONS }, () => newOption()) : [],
});

// Ao trocar para um tipo de escolha, garante o mínimo de opções.
export const changeType = (q: DraftQuestion, type: QuestionType): DraftQuestion => {
  const missing = isChoice(type) ? Math.max(0, MIN_OPTIONS - q.options.length) : 0;
  return {
    ...q,
    type,
    options: [...q.options, ...Array.from({ length: missing }, () => newOption())],
  };
};

// Ids dos campos no DOM. Os erros usam o mesmo id como chave, para focar o primeiro inválido.
export const fieldId = {
  title: 'f-title',
  addQuestion: 'add-question-TEXT',
  question: (q: DraftQuestion) => `q-${q.key}-text`,
  option: (q: DraftQuestion, o: DraftOption) => `q-${q.key}-opt-${o.key}`,
};

export type DraftErrors = Record<string, string>;

// Erros na ordem em que aparecem na tela.
export const validateDraft = (title: string, questions: DraftQuestion[]): DraftErrors => {
  const errors: DraftErrors = {};

  if (!title.trim()) errors[fieldId.title] = 'Dê um título ao formulário.';

  if (questions.length === 0) {
    errors[fieldId.addQuestion] = 'Adicione pelo menos uma pergunta.';
  }

  for (const q of questions) {
    if (!q.title.trim()) errors[fieldId.question(q)] = 'Escreva o enunciado da pergunta.';
    if (!isChoice(q.type)) continue;

    const seen = new Set<string>();
    for (const o of q.options) {
      const label = normalize(o.label.trim());
      if (!label) errors[fieldId.option(q, o)] = 'Preencha a opção ou remova-a.';
      else if (seen.has(label)) errors[fieldId.option(q, o)] = 'Esta opção está repetida.';
      seen.add(label);
    }
  }

  return errors;
};

// Corpo do POST /forms/:id/questions.
export const toQuestionPayload = (q: DraftQuestion, position: number): CreateQuestionData => {
  const title = q.title.trim();

  if (q.type === 'TEXT') return { type: 'TEXT', title, position };

  return {
    type: q.type,
    title,
    position,
    options: q.options.map((o) => ({ label: o.label.trim() })),
  };
};
