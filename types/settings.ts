import { z } from 'zod';

export const countrySchema = z.object({
  name: z.string(),
  alpha3: z.string(),
  currencies: z.array(z.string()),
});

export const settingsSchema = z.object({
  userId: z.number().min(1, 'User ID is required'),
  name: z.string().min(1, 'Name is required'),
  job: z.string().min(1, 'Job title is required'),
  country: countrySchema.optional(),
  apiKey: z.string().min(1, 'OpenAI API Key is required'),
  pendingTransactionsBuffer: z.coerce
    .number<number>()
    .int()
    .min(1, 'Pending Transactions Buffer is required'),
  dateColumnOverride: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || isNaN(Number(value))) {
          return true;
        }
        const parsedValue = parseInt(value, 10);
        return Number.isInteger(parsedValue) && parsedValue >= 1;
      },
      {
        message: 'Date column override should be a number greater than or equal to 1',
      }
    ),
  amountColumnOverride: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || isNaN(Number(value))) {
          return true;
        }
        const parsedValue = parseInt(value, 10);
        return Number.isInteger(parsedValue) && parsedValue >= 1;
      },
      {
        message: 'Amount column override should be a number greater than or equal to 1',
      }
    ),
  descriptionColumnOverride: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || isNaN(Number(value))) {
          return true;
        }
        const parsedValue = parseInt(value, 10);
        return Number.isInteger(parsedValue) && parsedValue >= 1;
      },
      {
        message: 'Description column override should be a number greater than or equal to 1',
      }
    ),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;
