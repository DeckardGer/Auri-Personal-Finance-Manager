'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ColumnDef,
  VisibilityState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableToolbar } from '@/components/transactions/data-table-toolbar';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { Merchant } from '@/types/merchants';
import { Category } from '@/types/categories';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({ columns }: DataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>([]);
  const [total, setTotal] = useState(0);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // server state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [sorting, setSorting] = useState([{ id: 'date', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // client state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const prevFiltersRef = useRef<string>('');

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [merchantsRes, categoriesRes] = await Promise.all([
          fetch('/api/merchants', {
            cache: 'force-cache',
            next: {
              tags: ['merchants'],
            },
          }),
          fetch('/api/categories', {
            cache: 'force-cache',
            next: {
              tags: ['categories'],
            },
          }),
        ]);

        const merchantsData: Merchant[] = await merchantsRes.json();
        const categoriesData: Category[] = await categoriesRes.json();

        setMerchants(merchantsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const currentFilters = JSON.stringify(columnFilters);
    const isFilterChange = currentFilters !== prevFiltersRef.current;
    if (isFilterChange && pagination.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      return;
    }
    prevFiltersRef.current = currentFilters;

    const fetchData = async () => {
      try {
        const sortBy = sorting[0]?.id ?? 'date';
        const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';

        const merchantFilter = columnFilters.find((f) => f.id === 'merchant')?.value as string[];
        const categoryFilter = columnFilters.find((f) => f.id === 'category')?.value as string[];

        const params = new URLSearchParams({
          pageIndex: pagination.pageIndex.toString(),
          pageSize: pagination.pageSize.toString(),
          sortBy,
          sortOrder,
        });

        if (merchantFilter && merchantFilter.length > 0) {
          params.append('merchantId', merchantFilter.join(','));
        }

        if (categoryFilter && categoryFilter.length > 0) {
          params.append('categoryId', categoryFilter.join(','));
        }

        const res = await fetch(`/api/transactions?${params}`);
        const json = await res.json();
        setData(json.data);
        setTotal(json.total);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, [pagination, sorting, columnFilters]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    pageCount: Math.ceil(total / pagination.pageSize),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="flex min-h-[400px] flex-1 flex-col rounded-xl border">
      <DataTableToolbar table={table} merchants={merchants} categories={categories} />
      <div className="flex h-full flex-col overflow-hidden">
        <Table>
          <TableHeader className="sticky top-0 z-1 bg-background after:absolute after:right-0 after:bottom-0 after:left-0 after:border-b after:border-border">
            {!isLoaded ? (
              <TableRow>
                {columns.map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton className="h-3" />
                  </TableCell>
                ))}
              </TableRow>
            ) : (
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableHeader>
          <TableBody>
            {!isLoaded ? (
              [...Array(20)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton className="h-5" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
