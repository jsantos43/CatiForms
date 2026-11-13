import { request } from './client';
import type { Answer, FormResponse, PublicForm } from './types';

// Corpo do POST /f/:slug/responses. Mesmo formato das respostas devolvidas pela API.
export type AnswerInput = Answer;

export type ResponseInput = {
  email: string | null;
  answers: AnswerInput[];
};

// Rotas públicas (sem login, RF09): o formulário é identificado pelo slug do link.
export const getPublicForm = async (slug: string) => {
  const res = await request<{ form: PublicForm }>(`/f/${slug}`, { skipRefresh: true });
  return res.form;
};

export const submitResponse = async (slug: string, data: ResponseInput) => {
  const res = await request<{ response: FormResponse }>(`/f/${slug}/responses`, {
    method: 'POST',
    body: data,
    skipRefresh: true,
  });
  return res.response;
};

// Rota logada (RF14).
export const listResponses = async (formId: string) => {
  const res = await request<{ responses: FormResponse[] }>(`/forms/${formId}/responses`);
  return res.responses;
};
