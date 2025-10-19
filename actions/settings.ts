'use server';

import { prisma } from '@/lib/prisma';
import { SettingsSchema } from '@/types/settings';

export const updateSettings = async (settings: SettingsSchema) => {
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: settings.userId },
        data: {
          name: settings.name,
          job: settings.job,
          countryName: settings.country?.name,
          countrySymbol: settings.country?.alpha3,
          currency: settings.country?.currencies[0],
          apiKey: settings.apiKey,
        },
      }),
      prisma.userSettings.update({
        where: { userId: settings.userId },
        data: {
          pendingDaysBuffer: settings.pendingTransactionsBuffer,
          dateColumnIndex:
            Number(settings.dateColumnOverride) === 0
              ? null
              : Number(settings.dateColumnOverride) - 1,
          amountColumnIndex:
            Number(settings.amountColumnOverride) === 0
              ? null
              : Number(settings.amountColumnOverride) - 1,
          descriptionColumnIndex:
            Number(settings.descriptionColumnOverride) === 0
              ? null
              : Number(settings.descriptionColumnOverride) - 1,
        },
      }),
    ]);
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};
