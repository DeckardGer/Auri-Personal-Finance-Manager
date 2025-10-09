'use client';

import { use, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
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
import type { BalanceChartData } from '@/types/charts';
import { Calendar } from 'lucide-react';

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function BalanceChart({ chartData }: { chartData: Promise<BalanceChartData> }) {
  const data = use(chartData);

  const [isWeekly, setIsWeekly] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription>
          {isWeekly ? data.weekly.description : data.weekly.description}
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setIsWeekly(!isWeekly)}>
                <Calendar />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isWeekly ? 'View Monthly Balance' : 'View Weekly Balance'}</p>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={isWeekly ? data.weekly.chartData : data.monthly.chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  valueFormatter={(value) => `${currencyFormatterMinimal.format(value as number)}`}
                />
              }
            />
            <Line
              dataKey="balance"
              type="natural"
              stroke="var(--color-balance)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
