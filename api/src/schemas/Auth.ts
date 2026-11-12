import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginData = z.infer<typeof loginSchema>;

export const accessTokenPayloadSchema = z.object({
  sub: z.uuid(),
  sv: z.number().int().nonnegative(),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
