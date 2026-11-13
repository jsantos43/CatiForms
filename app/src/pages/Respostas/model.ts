import type { Answer, FormDetail, FormResponse, Question } from '../../api/types';
import { formatDateTime } from '../../lib/format';

// Resposta com o número sequencial (#1 = a mais antiga), como aparece na tela e nas exportações.
export type NumberedResponse = FormResponse & { number: number };

// Mais recentes primeiro; o número segue a ordem de chegada.
export const numberResponses = (responses: FormResponse[]): NumberedResponse[] =>
  [...responses]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((r, i) => ({ ...r, number: i + 1 }))
    .reverse();

export const answerFor = (response: FormResponse, question: Question): Answer | undefined =>
  response.answers.find((a) => a.questionId === question.id);

export const optionLabels = (question: Question, answer?: Answer) =>
  question.options.filter((o) => answer?.optionIds.includes(o.id)).map((o) => o.label);

// ---------- CSV (RF15) ----------

// Separador ";" e BOM: o Excel em pt-BR abre com colunas e acentos corretos.
const SEP = ';';

const cell = (value: string | number | null | undefined) => {
  const text = value == null ? '' : String(value);
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const buildCsv = (form: FormDetail, responses: NumberedResponse[]) => {
  const header = ['Resposta', 'Enviada em'];
  if (form.collectEmail) header.push('E-mail');
  for (const q of form.questions) {
    header.push(q.title);
    if (q.type === 'SINGLE_CHOICE_JUSTIFIED') header.push(`${q.title} — Justificativa`);
  }

  // Na planilha, ordem de chegada (#1 primeiro).
  const rows = [...responses].reverse().map((r) => {
    const row: (string | number | null)[] = [r.number, formatDateTime(r.createdAt)];
    if (form.collectEmail) row.push(r.email);
    for (const q of form.questions) {
      const a = answerFor(r, q);
      if (q.type === 'TEXT') row.push(a?.text ?? '');
      else row.push(optionLabels(q, a).join(', '));
      if (q.type === 'SINGLE_CHOICE_JUSTIFIED') row.push(a?.justification ?? '');
    }
    return row;
  });

  return '﻿' + [header, ...rows].map((row) => row.map(cell).join(SEP)).join('\r\n');
};

export const downloadFile = (content: string, filename: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// "Banco de Talentos 2026 — Etapa 1" -> "banco-de-talentos-2026-etapa-1"
export const slug = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'formulario';
