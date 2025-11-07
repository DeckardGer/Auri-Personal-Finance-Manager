'use client';

import { Table } from '@tanstack/react-table';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableDateRangeFilter } from '@/components/data-table/data-table-date-range-filter';
import { Button } from '@/components/ui/button';
import { Merchant } from '@/types/merchants';
import { Category } from '@/types/categories';
import { X } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  merchants: Merchant[];
  categories: Category[];
}

export function DataTableToolbar<TData>({
  table,
  merchants,
  categories,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between border-b p-2">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn('merchant') && (
          <DataTableFacetedFilter
            column={table.getColumn('merchant')}
            title="Merchant"
            options={merchants.map((m) => ({ value: m.id.toString(), label: m.name }))}
          />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title="Category"
            options={categories.map((c) => ({ value: c.id.toString(), label: c.name }))}
          />
        )}
        {table.getColumn('date') && (
          <DataTableDateRangeFilter column={table.getColumn('date')} title="Date" />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
