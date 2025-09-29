'use client';

import { useState, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const [localValue, setLocalValue] = useState(
    (table.getColumn('name')?.getFilterValue() as string) ?? ''
  );

  useEffect(() => {
    const currentFilterValue = table.getColumn('name')?.getFilterValue() as string;

    const normalizedLocalValue = localValue || '';
    const normalizedCurrentValue = currentFilterValue || '';

    if (normalizedLocalValue !== normalizedCurrentValue) {
      const handler = setTimeout(() => {
        table.getColumn('name')?.setFilterValue(localValue);
      }, 300);

      return () => clearTimeout(handler);
    }
  }, [localValue, table]);

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between border-b p-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter merchants..."
          value={localValue}
          onChange={(event) => setLocalValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setLocalValue('');
            }}
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
