import { z } from 'zod';
import { MIN_OPTIONS, optionSchema, optionsSchema } from './Option.js';

export const questionTypeSchema = z.enum(['TEXT', 'MULTIPLE_CHOICE', 'SINGLE_CHOICE_JUSTIFIED']);

export type QuestionType = z.infer<typeof questionTypeSchema>;

// Rotas aninhadas: /forms/:id/questions/:questionId (id = form, questionId = question).
export const questionIdSchema = z.object({
  id: z.uuid('Form id must be a valid UUID'),
  questionId: z.uuid('Question id must be a valid UUID'),
});

export type QuestionIdParams = z.infer<typeof questionIdSchema>;

const title = z.string().trim().min(1, 'Title is required');
const position = z.number().int().nonnegative('Position must be a non-negative integer');

export const createQuestionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('TEXT'),
    title,
    position,
    // Sem o campo "options" aqui: o Zod descarta qualquer options enviada numa question TEXT.
  }),
  z.object({
    type: z.enum(['MULTIPLE_CHOICE', 'SINGLE_CHOICE_JUSTIFIED']),
    title,
    position,
    options: optionsSchema,
  }),
]);

export type CreateQuestionData = z.infer<typeof createQuestionSchema>;

export const updateQuestionSchema = z
  .object({
    type: questionTypeSchema.exactOptional(),
    title: title.exactOptional(),
    position: position.exactOptional(),
    options: z.array(optionSchema).exactOptional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'Send at least one field to update')
  .superRefine((data, ctx) => {
    if (data.type === 'TEXT') return; // options serão cortadas no transform abaixo

    const isChoice = data.type !== undefined;

    if (isChoice && !data.options) {
      ctx.addIssue({
        code: 'custom',
        path: ['options'],
        message: 'Send the options when changing to a choice question',
      });
      return;
    }

    // Sem "type", options vazias podem ser válidas (question já é TEXT): o service decide.
    if (data.options && (isChoice || data.options.length > 0) && data.options.length < MIN_OPTIONS) {
      ctx.addIssue({
        code: 'custom',
        path: ['options'],
        message: `Choice questions need at least ${MIN_OPTIONS} options`,
      });
    }
  })
  .transform((data) => {
    if (data.type !== 'TEXT') return data;

    const { options: _options, ...rest } = data;
    return rest;
  });

export type UpdateQuestionData = z.infer<typeof updateQuestionSchema>;
