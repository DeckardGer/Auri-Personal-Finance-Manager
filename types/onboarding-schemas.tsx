import { z } from 'zod';
import { Country } from '@/components/ui/country-dropdown';

export const onboardingStep1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  job: z.string().min(1, 'Job title is required'),
  country: z
    .any()
    .refine(
      (val): val is Country | undefined =>
        !val || (typeof val === 'object' && 'name' in val && 'alpha2' in val && 'alpha3' in val),
      { message: 'Please select a valid country' }
    )
    .optional(),
});

export type OnboardingStep1Schema = z.infer<typeof onboardingStep1Schema>;

export const onboardingStep2Schema = z.object({
  apiKey: z.string().min(1, 'OpenAI API Key is required'),
});

export type OnboardingStep2Schema = z.infer<typeof onboardingStep2Schema>;
