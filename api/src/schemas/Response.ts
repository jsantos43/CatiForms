import { z } from 'zod';

export const responseIdSchema = z.object({
  id: z.uuid('Form id must be a valid UUID'),
  responseId: z.uuid('Response id must be a valid UUID'),
});

export type ResponseIdParams = z.infer<typeof responseIdSchema>;

export const answerSchema = z.object({
  questionId: z.uuid('Question id must be a valid UUID'),
  text: z.string().trim().min(1, 'Text cannot be empty').nullable().default(null),
  choices: z.array(z.string().trim().min(1, 'Choice cannot be empty')).default([]),
});

export type AnswerData = z.infer<typeof answerSchema>;

export const createResponseSchema = z.object({
  email: z.email('Email is not valid').nullable().default(null),
  answers: z
    .array(answerSchema)
    .refine(
      (answers) => new Set(answers.map((a) => a.questionId)).size === answers.length,
      'Each question can only be answered once',
    ),
});

export type CreateResponseData = z.infer<typeof createResponseSchema>;
