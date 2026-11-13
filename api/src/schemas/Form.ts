import { z } from 'zod';

export const formIdSchema = z.object({
  id: z.uuid('Id must be a valid UUID'),
});

export type FormIdParams = z.infer<typeof formIdSchema>;

// Slug gerado pelo nanoid(12) no contract: 12 caracteres do alfabeto A-Z a-z 0-9 _ -.
export const formSlugSchema = z.object({
  slug: z.string().regex(/^[\w-]{12}$/, 'Invalid form code'),
});

export type FormSlugParams = z.infer<typeof formSlugSchema>;

export const createFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1).nullable().default(null),
  collectEmail: z.boolean().default(false),
});

export type CreateFormData = z.infer<typeof createFormSchema>;

export const updateFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').exactOptional(),
    description: z.string().trim().min(1).nullable().exactOptional(),
    collectEmail: z.boolean().exactOptional(),
    published: z.literal(true, 'A form can only be published, not unpublished').exactOptional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'Send at least one field to update');

export type UpdateFormData = z.infer<typeof updateFormSchema>;
