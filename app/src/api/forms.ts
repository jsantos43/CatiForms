import { request } from './client';
import type { Form, FormDetail, FormSummary } from './types';

// Hoje a API devolve só os formulários do usuário logado (GET /forms).
// Quando houver uma rota com todos os formulários (RF14/RN10), basta trocar o caminho aqui.
export const listForms = async () => {
  const res = await request<{ forms: FormSummary[] }>('/forms');
  return res.forms;
};

export const getForm = async (id: string) => {
  const res = await request<{ form: FormDetail }>(`/forms/${id}`);
  return res.form;
};

export type CreateFormData = {
  title: string;
  description: string | null;
  collectEmail: boolean;
};

export const createForm = async (data: CreateFormData) => {
  const res = await request<{ form: Form }>('/forms', { method: 'POST', body: data });
  return res.form;
};

// Usado só para desfazer uma publicação que falhou no meio (ver CriarFormulario).
export const deleteForm = (id: string) => request(`/forms/${id}`, { method: 'DELETE' });
