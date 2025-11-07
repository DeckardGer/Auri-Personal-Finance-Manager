"use client"

import * as React from "react"
import { Column } from "@tanstack/react-table"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface DataTableDateRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

export function DataTableDateRangeFilter<TData, TValue>({
  column,
  title = "Date Range",
}: DataTableDateRangeFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as DateRange | undefined
  const [date, setDate] = React.useState<DateRange | undefined>(filterValue)

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    column?.setFilterValue(newDate)
  }

  const handleClear = () => {
    setDate(undefined)
    column?.setFilterValue(undefined)
  }

  const hasDateRange = date?.from || date?.to

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
                {date?.from && date?.to ? 2 : 1}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {date?.from && format(date.from, "MMM d, yyyy")}
                  {date?.from && date?.to && " - "}
                  {date?.to && format(date.to, "MMM d, yyyy")}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            initialFocus
          />
          {hasDateRange && (
            <div className="border-t pt-3">
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={handleClear}
              >
                Clear filter
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
