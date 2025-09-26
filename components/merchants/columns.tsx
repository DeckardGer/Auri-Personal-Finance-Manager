'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions';
import { type MerchantWithDetails } from '@/types/merchants';

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
    accessorKey: 'numberOfTransactions',
    header: 'Number of transactions',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total amount',
  },
  {
    id: 'actions',
    cell: () => <DataTableRowActions />,
    enableSorting: false,
    enableHiding: false,
  },
];
