import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email('E-mail is not valid!'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().trim().min(1).nullable().default(null),
  username: z.string().trim().min(1).nullable().default(null),
});

export type CreateUserData = z.infer<typeof createUserSchema>;

export const userIdSchema = z.object({
  id: z.uuid('Id must be a valid UUID'),
});

export type UserIdParams = z.infer<typeof userIdSchema>;
