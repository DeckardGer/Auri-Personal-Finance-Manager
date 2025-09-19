'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type Transaction } from '@/types/transactions';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'merchant',
    header: 'Merchant',
    cell: ({ row }) => {
      const merchant = row.getValue('merchant') as { name?: string } | null;
      return merchant?.name || '';
    },
  },
  {
    id: 'category',
    header: 'Category',
    accessorFn: (row) => ({
      category: row.category,
      subcategory: row.subcategory,
    }),
    cell: ({ getValue }) => {
      const { category, subcategory } = getValue<{
        category?: { name?: string } | null;
        subcategory?: { name?: string } | null;
      }>();

      if (category?.name && subcategory?.name) {
        return (
          <div>
            <div className="font-medium">{category.name}</div>
            <div className="text-sm text-secondary-foreground">{subcategory.name}</div>
          </div>
        );
      }

      return category?.name || subcategory?.name || '';
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;
      return date.toDateString();
    },
  },
];
