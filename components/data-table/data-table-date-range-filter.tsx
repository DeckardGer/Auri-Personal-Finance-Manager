'use client';

import * as React from 'react';
import { Column } from '@tanstack/react-table';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';

interface DataTableDateRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DataTableDateRangeFilter<TData, TValue>({
  column,
  title = 'Date Range',
}: DataTableDateRangeFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as DateRange | undefined;

  // const handleClear = () => {
  //   setDate(undefined);
  //   column?.setFilterValue(undefined);
  // };

  const hasDateRange = filterValue?.from || filterValue?.to;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CalendarIcon className="h-4 w-4" />
          {title}
          {hasDateRange && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {filterValue?.from &&
                  filterValue?.to &&
                  `${Math.round((filterValue.to.getTime() - filterValue.from.getTime()) / (24 * 60 * 60 * 1000))} ${
                    Math.round(
                      (filterValue.to.getTime() - filterValue.from.getTime()) /
                        (24 * 60 * 60 * 1000)
                    ) === 1
                      ? 'day'
                      : 'days'
                  }`}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {filterValue?.from && filterValue?.from.toLocaleDateString()}
                  {filterValue?.from && filterValue?.to && ' - '}
                  {filterValue?.to && filterValue?.to.toLocaleDateString()}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          selected={filterValue}
          captionLayout="dropdown"
          onSelect={column?.setFilterValue}
        />
        {hasDateRange && (
          <>
            <Separator />
            <div className="m-1">
              <Button
                variant="ghost"
                className="h-8 w-full"
                onClick={() => column?.setFilterValue(undefined)}
              >
                Clear filters
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
