// Respostas de formulários.
//
// ATENÇÃO: estas rotas ainda NÃO existem na API. O contrato abaixo é uma proposta;
// quando a API implementar, ajuste só este arquivo (os tipos em ./types.ts e as chamadas).
//
//   GET  /public/forms/:id     → { form: PublicForm }            (sem login, RF09)
//   POST /forms/:id/responses  ← ResponseInput → { response }    (sem login, RF10/RF11/RF13)
//   GET  /forms/:id/responses  → { responses: FormResponse[] }   (logado, RF14)

import { getForm } from './forms';
import { isMissingRoute, request } from './client';
import type { FormResponse, PublicForm } from './types';

export type AnswerInput =
  | { questionId: string; text: string }
  | { questionId: string; optionIds: string[] }
  | { questionId: string; optionId: string; justification: string };

export type ResponseInput = {
  email: string | null;
  answers: AnswerInput[];
};

export const getPublicForm = async (id: string): Promise<PublicForm> => {
  try {
    const res = await request<{ form: PublicForm }>(`/public/forms/${id}`);
    return res.form;
  } catch (err) {
    // TEMPORÁRIO: sem a rota pública, usa a rota logada (funciona para o dono do formulário),
    // para a página de resposta já poder ser usada e testada.
    if (isMissingRoute(err)) return getForm(id);
    throw err;
  }
};

export const submitResponse = async (formId: string, data: ResponseInput) => {
  const res = await request<{ response: FormResponse }>(`/forms/${formId}/responses`, {
    method: 'POST',
    body: data,
  });
  return res.response;
};

export const listResponses = async (formId: string) => {
  const res = await request<{ responses: FormResponse[] }>(`/forms/${formId}/responses`);
  return res.responses;
};
