import { create } from 'zustand';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';

type TransactionsFilterState = {
  columnFilters: ColumnFiltersState;
  sorting: SortingState;

  setColumnFilters: (filters: ColumnFiltersState) => void;
  setSorting: (sorting: SortingState) => void;
  getParams: () => URLSearchParams;
};

export const useExportTransactionsStore = create<TransactionsFilterState>((set, get) => ({
  columnFilters: [],
  sorting: [{ id: 'date', desc: true }],

  setColumnFilters: (filters) =>
    set({
      columnFilters: filters,
    }),

  setSorting: (sorting) =>
    set({
      sorting: sorting,
    }),

  getParams: () => {
    const state = get();
    const sortBy = state.sorting[0]?.id ?? 'date';
    const sortOrder = state.sorting[0]?.desc ? 'desc' : 'asc';

    const merchantFilter = state.columnFilters.find((f) => f.id === 'merchant')?.value as string[];
    const categoryFilter = state.columnFilters.find((f) => f.id === 'category')?.value as string[];

    const params = new URLSearchParams({
      sortBy,
      sortOrder,
      pageSize: 'all',
    });

    if (merchantFilter && merchantFilter.length > 0) {
      params.append('merchantId', merchantFilter.join(','));
    }

    if (categoryFilter && categoryFilter.length > 0) {
      params.append('categoryId', categoryFilter.join(','));
    }

    return params;
  },
}));
