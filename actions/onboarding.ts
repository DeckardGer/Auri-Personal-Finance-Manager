'use server';

import { createDefaultCategories } from '@/actions/categories';
import { OnboardingSchema } from '@/types/onboarding-schemas';
import { prisma } from '@/lib/prisma';

export const completeOnboarding = async (userDetails: OnboardingSchema) => {
  try {
    await prisma.user.create({
      data: {
        name: userDetails.name,
        job: userDetails.job,
        countryName: userDetails.country?.name,
        countrySymbol: userDetails.country?.alpha3,
        currency: userDetails.country?.currencies[0],
        apiKey: userDetails.apiKey,
        settings: {
          create: {},
        },
      },
    });

    await createDefaultCategories();
  } catch (error) {
    console.error('Error setting up system:', error);
    throw error;
  }
};
