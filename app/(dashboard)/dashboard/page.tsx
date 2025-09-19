// import { UploadTransactionsDialog } from '@/components/dashboard/UploadTransactionsDialog';

import { getUser } from '@/lib/data';

export default async function Dashboard() {
  const user = await getUser();

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-secondary-foreground">
            Check out your latest financial insights and track your progress.
          </p>
        </div>
      </div>
    </div>
  );
}
