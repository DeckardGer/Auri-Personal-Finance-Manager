'use server';

import { prisma } from '@/lib/prisma';
import { SettingsSchema } from '@/types/settings';

export const updateSettings = async (settings: SettingsSchema) => {
  try {
    await prisma.user.update({
      where: {
        id: settings.userId,
      },
      data: {
        name: settings.name,
        job: settings.job,
        countryName: settings.country?.name,
        countrySymbol: settings.country?.alpha3,
        currency: settings.country?.currencies[0],
        apiKey: settings.apiKey,
      },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};
