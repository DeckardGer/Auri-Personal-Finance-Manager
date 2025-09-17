import { redirect } from 'next/navigation';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { GridBeams } from '@/components/onboarding/grid-beams';
import { getUser } from '@/lib/data';

export default async function Home() {
  const user = await getUser();

  if (user) redirect('/dashboard');

  return (
    <GridBeams
      gridSize={0}
      gridColor="rgba(255, 255, 255, 0.2)"
      rayCount={20}
      rayOpacity={0.55}
      raySpeed={1.5}
      rayLength="40vh"
      gridFadeStart={5}
      gridFadeEnd={90}
      className="flex min-h-screen w-full items-center justify-center"
    >
      <OnboardingCard />
    </GridBeams>
  );
}
