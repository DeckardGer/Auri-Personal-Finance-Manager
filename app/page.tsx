import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await prisma.user.findFirst();

  if (user) redirect('/dashboard');

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute -top-1/3 -left-1/6 w-[calc(2/3*100vw)] rounded-full bg-[#B297FF] blur-3xl dark:bg-[#460077]"
          style={{ width: '67%', height: '100%' }}
        />
        <div
          className="absolute -top-7/12 left-1/12 w-[calc(2/3*100vw)] rounded-full bg-background blur-3xl"
          style={{ width: '67%', height: '100%' }}
        />
        <div
          className="absolute -right-1/6 -bottom-1/3 rounded-full bg-[#96DFFF] blur-3xl dark:bg-[#044581]"
          style={{ width: '67%', height: '100%' }}
        />
        <div
          className="absolute right-1/12 -bottom-7/12 w-[calc(2/3*100vw)] rounded-full bg-background blur-3xl"
          style={{ width: '67%', height: '100%' }}
        />
      </div>

      <OnboardingCard />
    </div>
  );
}
