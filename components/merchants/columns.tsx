'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions';
import { DataTableColumnSortHeader } from '@/components/data-table/data-table-column-sort-header';
import { type MerchantWithDetails } from '@/types/merchants';

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

export const columns: ColumnDef<MerchantWithDetails>[] = [
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
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'total amount',
    accessorKey: 'totalAmount',
    header: ({ column }) => <DataTableColumnSortHeader column={column} title="Total Amount" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total amount'));
      const formatted = currencyFormatter.format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'transactions',
    header: ({ column }) => <DataTableColumnSortHeader column={column} title="Transactions" />,
  },
  {
    id: 'actions',
    cell: () => <DataTableRowActions />,
    enableSorting: false,
    enableHiding: false,
  },
];
