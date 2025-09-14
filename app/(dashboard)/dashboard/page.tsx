// import { UploadTransactionsDialog } from '@/components/dashboard/UploadTransactionsDialog';

import { prisma } from '@/lib/prisma';

const getGreeting = () => {
  const date = new Date();
  const hours = date.getHours();

  let greeting = 'Good morning';
  if (hours >= 12 && hours < 18) greeting = 'Good afternoon';
  if (hours >= 18) greeting = 'Good evening';

  return greeting;
};

export default async function Dashboard() {
  const user = await prisma.user.findFirst();
  const greeting = getGreeting();

  return (
    <div>
      <h1>
        👋 {greeting}, {user?.name?.split(' ')[0]}
      </h1>

      <h2>Overview</h2>
    </div>
  );
}
