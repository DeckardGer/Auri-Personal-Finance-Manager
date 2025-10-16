'use client';

import { use, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { currencyFormatterMinimal } from '@/lib/currency';
import type { CashflowChartData } from '@/types/charts';
import { Calendar } from 'lucide-react';

const chartConfig = {
  income: {
    label: 'Income',
    color: 'var(--chart-1)',
  },
  expenses: {
    label: 'Expenses',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function CashflowChart({ chartData }: { chartData: Promise<CashflowChartData> }) {
  const data = use(chartData);

  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>
          {isMonthly ? data.monthly.description : data.yearly.description}
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setIsMonthly(!isMonthly)}>
                <Calendar />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMonthly ? 'View Yearly Cashflow' : 'View Monthly Cashflow'}</p>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
          <BarChart
            accessibilityLayer
            data={isMonthly ? data.monthly.chartData : data.yearly.chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={isMonthly ? 'month' : 'year'}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={isMonthly ? (value) => value.slice(0, 3) : undefined}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  valueFormatter={(value) => `${currencyFormatterMinimal.format(value as number)}`}
                />
              }
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
