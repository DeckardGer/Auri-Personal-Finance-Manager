import { columns } from '@/components/transactions/columns';
import { DataTable } from '@/components/transactions/data-table';
import { type Transaction } from '@/types/transactions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getData(): Promise<Transaction[]> {
  const transactions = await prisma.transaction.findMany({
    select: {
      id: true,
      amount: true,
      description: true,
      date: true,
      merchant: true,
      category: true,
      subcategory: true,
    },
    take: 50,
  });

  return transactions;
}

// TODO:
// - Total transactions
// - Current balance

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
