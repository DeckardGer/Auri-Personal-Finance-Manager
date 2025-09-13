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
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;
      return date.toDateString();
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
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as { name?: string } | null;
      return category?.name || '';
    },
  },
  {
    accessorKey: 'subcategory',
    header: 'Subcategory',
    cell: ({ row }) => {
      const subcategory = row.getValue('subcategory') as { name?: string } | null;
      return subcategory?.name || '';
    },
  },
];
