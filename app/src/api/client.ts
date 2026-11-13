import type { ApiErrorBody } from './types';

// Em dev o Vite repassa /api para a API (vite.config.ts). Pode ser trocado por env.
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  status: number;
  code: string;
  details: string[];

  constructor(status: number, body: Partial<ApiErrorBody> | null) {
    super(body?.message ?? 'Erro de comunicação com o servidor');
    this.name = 'ApiError';
    this.status = status;
    this.code = body?.error ?? 'NETWORK_ERROR';
    this.details = body?.details ?? [];
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  // Rotas de autenticação não devem disparar o refresh automático.
  skipRefresh?: boolean;
};

let refreshing: Promise<boolean> | null = null;

// Renova o access token usando o cookie de refresh. Requisições concorrentes compartilham a mesma tentativa.
const refreshSession = () => {
  refreshing ??= fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
};

const send = (path: string, { method = 'GET', body }: RequestOptions) =>
  fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let res: Response;

  try {
    res = await send(path, options);

    if (res.status === 401 && !options.skipRefresh && (await refreshSession())) {
      res = await send(path, options);
    }
  } catch {
    throw new ApiError(0, null);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) throw new ApiError(res.status, data);

  return data as T;
}

// A API responde 404 "Route <MÉTODO> <caminho> not found" quando a rota ainda não existe
// (api/src/middlewares/handleNotFound.ts). Diferente de 404 de item inexistente.
export const isMissingRoute = (err: unknown) =>
  err instanceof ApiError && err.status === 404 && err.details.some((d) => d.startsWith('Route '));
