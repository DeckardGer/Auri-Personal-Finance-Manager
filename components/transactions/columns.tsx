'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnSortHeader } from '@/components/data-table/data-table-column-sort-header';
import { DataTableColumnViewHeader } from '@/components/data-table/data-table-column-view-header';
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions';
import { type Transaction } from '@/types/transactions';
import { currencyFormatter } from '@/lib/currency';

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnSortHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = currencyFormatter.format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'merchant',
    header: ({ column }) => (
      <DataTableColumnViewHeader column={column} title="Merchant" href="/merchants" />
    ),
    cell: ({ row }) => {
      const merchant = row.getValue('merchant') as { name?: string } | null;
      return merchant?.name || '';
    },
  },
  {
    id: 'category',
    header: ({ column }) => (
      <DataTableColumnViewHeader column={column} title="Category" href="/categories" />
    ),
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
    header: ({ column }) => <DataTableColumnSortHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      return new Date(date).toDateString();
    },
  },
  {
    id: 'actions',
    cell: () => <DataTableRowActions />,
    enableSorting: false,
    enableHiding: false,
  },
];
