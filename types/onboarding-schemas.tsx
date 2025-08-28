import { z } from 'zod';

const CountrySchema = z.object({
  name: z.string(),
  alpha3: z.string(),
  currencies: z.array(z.string()),
});

export const onboardingStep1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  job: z.string().min(1, 'Job title is required'),
  country: CountrySchema.optional(),
});

export type OnboardingStep1Schema = z.infer<typeof onboardingStep1Schema>;

export const onboardingStep2Schema = z.object({
  apiKey: z.string().min(1, 'OpenAI API Key is required'),
});

export type OnboardingStep2Schema = z.infer<typeof onboardingStep2Schema>;

export type OnboardingSchema = OnboardingStep1Schema & OnboardingStep2Schema;
