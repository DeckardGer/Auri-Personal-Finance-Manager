import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { prisma } from '@/lib/prisma';
import { currencyFormatter } from '@/lib/currency';
import { ListChecks, Wallet, CalendarRange, Calculator, type LucideIcon } from 'lucide-react';

async function TransactionCount() {
  const count = await prisma.transaction.count();
  return <>{count}</>;
}

async function CurrentBalance() {
  // TODO: Calculate current balance
  const balance = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
  });
  return <>{currencyFormatter.format(balance._sum.amount ? balance._sum.amount : 0)}</>;
}

async function MonthlyExpenses() {
  const expenses = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  });
  return <>{currencyFormatter.format(expenses._sum.amount ? expenses._sum.amount : 0)}</>;
}

async function AverageTransaction() {
  const average = await prisma.transaction.aggregate({
    _avg: {
      amount: true,
    },
    where: {
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  });
  return <>{currencyFormatter.format(average._avg.amount ? average._avg.amount : 0)}</>;
}

export default async function InfoCardsSection() {
  return (
    <div className="grid flex-shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <InfoCard
        label="Total Transactions"
        value={
          <Suspense fallback={<Skeleton className="size-8" />}>
            <TransactionCount />
          </Suspense>
        }
        tooltip="Total number of transactions"
        icon={ListChecks}
      />
      <InfoCard
        label="Current Balance"
        value={
          <Suspense fallback={<Skeleton className="size-8" />}>
            <CurrentBalance />
          </Suspense>
        }
        tooltip="Current balance of your account"
        icon={Wallet}
      />
      <InfoCard
        label="Monthly Expenses"
        value={
          <Suspense fallback={<Skeleton className="size-8" />}>
            <MonthlyExpenses />
          </Suspense>
        }
        tooltip="Total expenses in the last 30 days"
        icon={CalendarRange}
      />
      <InfoCard
        label="Average Transaction"
        value={
          <Suspense fallback={<Skeleton className="size-8" />}>
            <AverageTransaction />
          </Suspense>
        }
        tooltip="Average transaction amount in the last 30 days"
        icon={Calculator}
      />
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: React.ReactNode;
  tooltip: string;
  icon: LucideIcon;
};

function InfoCard(info: InfoCardProps) {
  return (
    <Card className="flex-1 gap-1 overflow-hidden bg-gradient-to-tr from-background to-muted/30 py-4">
      <CardHeader className="gap-0 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">{info.label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-end justify-between">
          <CardDescription className="truncate text-2xl font-semibold text-foreground">
            {info.value}
          </CardDescription>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <div className="rounded-md border bg-card p-2">
                <info.icon className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{info.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
