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
});

export type SettingsSchema = z.infer<typeof settingsSchema>;
