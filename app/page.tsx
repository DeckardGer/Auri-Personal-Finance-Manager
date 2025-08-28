import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await prisma.user.findFirst();

  if (user) redirect('/dashboard');

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="onboarding-background absolute inset-0 -z-10" />
      <OnboardingCard />
    </div>
  );
}
