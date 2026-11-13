import { request } from './client';
import type { Question, QuestionType } from './types';

export type CreateQuestionData =
  | { type: 'TEXT'; title: string; position: number }
  | {
      type: Exclude<QuestionType, 'TEXT'>;
      title: string;
      position: number;
      options: { label: string }[];
    };

export const createQuestion = async (formId: string, data: CreateQuestionData) => {
  const res = await request<{ question: Question }>(`/forms/${formId}/questions`, {
    method: 'POST',
    body: data,
  });
  return res.question;
};
