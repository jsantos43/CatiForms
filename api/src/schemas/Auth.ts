import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Email is not valid'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginData = z.infer<typeof loginSchema>;

// Conteúdo do access token (JWT). Validado no verify, mesmo sendo assinado
// pela própria API, para garantir o formato e gerar o tipo.
export const accessTokenPayloadSchema = z.object({
  sub: z.uuid(),
  sv: z.number().int().nonnegative(),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
