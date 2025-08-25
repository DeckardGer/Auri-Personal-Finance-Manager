import { z } from 'zod';

export const onboardingStep1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  job: z.string().min(1, 'Job title is required'),
});

export type OnboardingStep1Schema = z.infer<typeof onboardingStep1Schema>;

export const onboardingStep2Schema = z.object({
  apiKey: z.string().min(1, 'OpenAI API Key is required'),
});

export type OnboardingStep2Schema = z.infer<typeof onboardingStep2Schema>;

export const onboardingStep3Schema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
});

export type OnboardingStep3Schema = z.infer<typeof onboardingStep3Schema>;
