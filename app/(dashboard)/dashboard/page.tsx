import { Suspense } from 'react';
import { CashflowChart } from '@/components/charts/CashflowChart';
import { BalanceChart } from '@/components/charts/BalanceChart';
import { RecentTransactions } from '@/components/charts/RecentTransactions';
import { CategoryPercentageChart } from '@/components/charts/CategoryPercentageChart';
import { InfoCard } from '@/components/charts/InfoCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getUser } from '@/lib/data';
import type {
  CashflowChartData,
  BalanceChartData,
  RecentTransactionsData,
  CategoryAmountChartData,
  CardData,
} from '@/types/charts';
import { Wallet, BanknoteArrowUp, BanknoteArrowDown } from 'lucide-react';

const getCashflowData = (): Promise<CashflowChartData> => {
  const cashflowData = fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cashflow-chart`
  ).then((res) => res.json());

  return cashflowData;
};

const getBalanceData = (): Promise<BalanceChartData> => {
  const balanceData = fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/balance-chart`
  ).then((res) => res.json());

  return balanceData;
};

const getRecentTransactions = (): Promise<RecentTransactionsData> => {
  const recentTransactions = fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/recent-transactions`
  ).then((res) => res.json());

  return recentTransactions;
};

const getCategoryAmounts = (): Promise<CategoryAmountChartData> => {
  const categoryAmounts = fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/category-amounts`
  ).then((res) => res.json());

  return categoryAmounts;
};

const getCurrentBalance = (): Promise<CardData> => {
  return new Promise((resolve) => {
    resolve({
      value: 500000000000,
      percentage: 20,
    });
  });
  const currentBalance = fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/current-balance-card`
  ).then((res) => res.json());

  return currentBalance;
};

const getMonthlyIncome = (): Promise<CardData> => {
  return new Promise((resolve) => {
    resolve({
      value: 500,
      percentage: 20,
    });
  });
  const monthlyIncome = fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/monthly-income-card`
  ).then((res) => res.json());

  return monthlyIncome;
};

const getMonthlyExpenses = (): Promise<CardData> => {
  return new Promise((resolve) => {
    resolve({
      value: 500,
      percentage: -20,
    });
  });
  const monthlyExpenses = fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/monthly-expenses-card`
  ).then((res) => res.json());

  return monthlyExpenses;
};

export default async function Dashboard() {
  const user = await getUser();

  const cashflowData = getCashflowData();
  const balanceData = getBalanceData();
  const recentTransactionsData = getRecentTransactions();
  const categoryAmountsData = getCategoryAmounts();
  const currentBalance = getCurrentBalance();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();

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

      <div className="flex flex-col gap-4">
        <div className="grid flex-shrink-0 grid-cols-1 gap-4 md:grid-cols-3">
          <Suspense fallback={<Skeleton className="h-[92px]" />}>
            <InfoCard
              label="Current Balance"
              data={currentBalance}
              tooltip="Your current bank balance"
              icon={Wallet}
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[92px]" />}>
            <InfoCard
              label="Monthly Income"
              data={monthlyIncome}
              tooltip="Total income in the last month"
              icon={BanknoteArrowUp}
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[92px]" />}>
            <InfoCard
              label="Monthly Expenses"
              data={monthlyExpenses}
              tooltip="Total expenses in the last month"
              icon={BanknoteArrowDown}
            />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <Suspense fallback={<Skeleton className="h-[365px]" />}>
              <CashflowChart chartData={cashflowData} />
            </Suspense>
          </div>
          <div className="col-span-1">
            <Suspense fallback={<Skeleton className="h-[365px]" />}>
              <CategoryPercentageChart chartData={categoryAmountsData} />
            </Suspense>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-9">
          <div className="col-span-1 md:col-span-4">
            <Suspense fallback={<Skeleton className="h-[407px]" />}>
              <RecentTransactions recentTransactionsData={recentTransactionsData} />
            </Suspense>
          </div>
          <div className="col-span-1 md:col-span-5">
            <Suspense fallback={<Skeleton className="h-[407px]" />}>
              <BalanceChart chartData={balanceData} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* <div className="max-w-1/2">
        <Suspense fallback={<div>Loading...</div>}>
          <CategoryPercentageChart chartData={categoryAmountsData} />
        </Suspense>
      </div>
      <div className="max-w-1/2">
        <Suspense fallback={<div>Loading...</div>}>
          <CashflowChart chartData={cashflowData} />
        </Suspense>
      </div>
      <div className="max-w-1/2">
        <Suspense fallback={<div>Loading...</div>}>
          <BalanceChart chartData={balanceData} />
        </Suspense>
      </div>
      <div className="max-w-1/3">
        <Suspense fallback={<div>Loading...</div>}>
          <RecentTransactions recentTransactionsData={recentTransactionsData} />
        </Suspense>
      </div> */}
    </div>
  );
}
