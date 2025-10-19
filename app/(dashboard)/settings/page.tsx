import { SettingsForm } from '@/components/settings/SettingsForm';
import { prisma } from '@/lib/prisma';

export default async function Settings() {
  const userSettings = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      job: true,
      countryName: true,
      countrySymbol: true,
      currency: true,
      apiKey: true,
      settings: {
        select: {
          pendingDaysBuffer: true,
          dateColumnIndex: true,
          amountColumnIndex: true,
          descriptionColumnIndex: true,
          ignoredMerchants: {
            select: {
              merchantId: true,
            },
          },
        },
      },
    },
  });

  const merchants = await prisma.merchant.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="mx-auto h-full max-w-2xl">
      {userSettings && <SettingsForm user={userSettings} merchants={merchants} />}
    </div>
  );
}
