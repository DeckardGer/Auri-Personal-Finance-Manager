import { InfoCard } from '@/components/transactions/info-card';
import { Button } from '@/components/ui/button';
import { columns } from '@/components/transactions/columns';
import { DataTable } from '@/components/transactions/data-table';
import { ListChecks, Wallet, CalendarRange, Calculator, FileDown, Upload } from 'lucide-react';

export default async function Transactions() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Your Transactions</h1>
          <p className="text-sm text-secondary-foreground">
            Browse your transaction history and keep track of your spending
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <FileDown />
            Export
          </Button>
          <Button className="w-full sm:w-auto">
            <Upload />
            Upload Transactions
          </Button>
        </div>
      </div>

      <div className="grid flex-shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          label="Total Transactions"
          value="10"
          tooltip="Total number of transactions"
          icon={ListChecks}
        />
        <InfoCard
          label="Current Balance"
          value="$100"
          tooltip="Current balance of your account"
          icon={Wallet}
        />
        <InfoCard
          label="Monthly Expenses"
          value="$250"
          tooltip="Total expenses in the last 30 days"
          icon={CalendarRange}
        />
        <InfoCard
          label="Average Transaction"
          value="$5"
          tooltip="Average transaction amount in the last 30 days"
          icon={Calculator}
        />
      </div>

      <DataTable columns={columns} />
    </div>
  );
}
