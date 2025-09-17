// import { UploadTransactionsDialog } from '@/components/dashboard/UploadTransactionsDialog';

import { getUser } from '@/lib/data';

const getGreeting = () => {
  const date = new Date();
  const hours = date.getHours();

  let greeting = 'Good morning';
  if (hours >= 12 && hours < 18) greeting = 'Good afternoon';
  if (hours >= 18) greeting = 'Good evening';

  return greeting;
};

export default async function Dashboard() {
  const user = await getUser();
  const greeting = getGreeting();

  return (
    <div>
      <h1 className="text-xl font-bold">
        👋 {greeting}, {user?.name?.split(' ')[0]}
      </h1>

      <h2 className="text-xl font-semibold">Overview</h2>
    </div>
  );
}
