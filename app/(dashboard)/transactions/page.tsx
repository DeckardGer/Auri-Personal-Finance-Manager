import { columns } from '@/components/transactions/columns';
import { DataTable } from '@/components/transactions/data-table';
import InfoCardsSection from '@/components/transactions/InfoCardsSection';
import { UploadTransactionsDialog } from '@/components/transactions/UploadTransactionsDialog';
import { ExportButton } from '@/components/transactions/ExportButton';

export default function Transactions() {
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
          <ExportButton />
          <UploadTransactionsDialog />
        </div>
      </div>

      <InfoCardsSection />

      <DataTable columns={columns} />
    </div>
  );
}
