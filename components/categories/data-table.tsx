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
import { DataTableToolbar } from '@/components/categories/data-table-toolbar';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { Category } from '@/types/categories';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({ columns }: DataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  // Server state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Client state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const prevFiltersRef = useRef<string>('');

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const categoriesRes = await fetch('/api/categories', {
          cache: 'force-cache',
          next: {
            tags: ['categories'],
          },
        });

        const categoriesData: Category[] = await categoriesRes.json();

        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
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

    console.log(currentFilters);

    const fetchData = async () => {
      const sortBy = sorting[0]?.id ?? 'id';
      const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';

      const nameFilter = columnFilters.find((f) => f.id === 'subcategory')?.value as string;
      const categoryFilter = columnFilters.find((f) => f.id === 'category')?.value as string[];

      const params = new URLSearchParams({
        pageIndex: pagination.pageIndex.toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy,
        sortOrder,
      });

      if (nameFilter && nameFilter.length > 0) {
        params.append('name', nameFilter);
      }

      if (categoryFilter && categoryFilter.length > 0) {
        params.append('categoryId', categoryFilter.join(','));
      }

      const res = await fetch(`/api/categories-with-details?${params}`);
      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
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
      <DataTableToolbar table={table} categories={categories} />
      <div className="flex h-full flex-col overflow-hidden">
        <Table>
          <TableHeader className="sticky top-0 z-1 bg-background after:absolute after:right-0 after:bottom-0 after:left-0 after:border-b after:border-border">
            {table.getHeaderGroups().map((headerGroup) => (
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
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
