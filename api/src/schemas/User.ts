import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email('Email is not valid'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().trim().min(1).nullable().default(null),
  username: z.string().trim().min(1).nullable().default(null),
});

export type CreateUserData = z.infer<typeof createUserSchema>;

export const userIdSchema = z.object({
  id: z.uuid('Id must be a valid UUID'),
});

export type UserIdParams = z.infer<typeof userIdSchema>;

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).nullable().exactOptional(),
    username: z.string().trim().min(1).nullable().exactOptional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'Send at least one field to update');

export type UpdateUserData = z.infer<typeof updateUserSchema>;
