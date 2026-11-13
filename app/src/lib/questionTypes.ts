import type { QuestionType } from '../api/types';

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  TEXT: 'Discursiva',
  MULTIPLE_CHOICE: 'Múltipla escolha',
  SINGLE_CHOICE_JUSTIFIED: 'Escolha única com justificativa',
};

// Rótulo curto usado nos selos da tela de respostas.
export const QUESTION_TYPE_SHORT: Record<QuestionType, string> = {
  TEXT: 'Discursiva',
  MULTIPLE_CHOICE: 'Múltipla escolha',
  SINGLE_CHOICE_JUSTIFIED: 'Escolha única + justificativa',
};

export const QUESTION_TYPES = Object.keys(QUESTION_TYPE_LABEL) as QuestionType[];

export const isChoice = (type: QuestionType) => type !== 'TEXT';

// Mínimo de opções exigido pela API (api/src/schemas/Option.ts).
export const MIN_OPTIONS = 2;
