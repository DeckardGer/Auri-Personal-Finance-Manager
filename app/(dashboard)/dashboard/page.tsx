import { Suspense } from 'react';
import { CashflowChart } from '@/components/charts/CashflowChart';
import { getUser } from '@/lib/data';
import type { CashflowChartData } from '@/types/charts';

const getCashflowData = (): Promise<CashflowChartData> => {
  const cashflowData = fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cashflow-chart`
  ).then((res) => res.json());

  return cashflowData;
};

export default async function Dashboard() {
  const user = await getUser();

  const cashflowData = getCashflowData();

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

      <div className="max-w-1/2">
        <Suspense fallback={<div>Loading...</div>}>
          <CashflowChart chartData={cashflowData} />
        </Suspense>
      </div>
    </div>
  );
}
