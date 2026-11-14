import { request } from './client';
import type { Form, FormDetail, FormSummary } from './types';

// GET /forms devolve todos os formulários da plataforma (RF14 / RN10).
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

// Depois de publicado, o formulário passa a aceitar respostas e não pode mais ser alterado (RN07).
export const publishForm = async (id: string) => {
  const res = await request<{ form: Form }>(`/forms/${id}`, {
    method: 'PUT',
    body: { published: true },
  });
  return res.form;
};

// Usado só para desfazer uma publicação que falhou no meio (ver CriarFormulario).
export const deleteForm = (id: string) => request(`/forms/${id}`, { method: 'DELETE' });
