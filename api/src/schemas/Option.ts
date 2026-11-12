import { z } from 'zod';

export const optionSchema = z.object({
  label: z.string().trim().min(1, 'Option label is required'),
});

export type OptionData = z.infer<typeof optionSchema>;

export const MIN_OPTIONS = 2;

export const optionsSchema = z
  .array(optionSchema)
  .min(MIN_OPTIONS, `Choice questions need at least ${MIN_OPTIONS} options`);
