'use client';

import { use, useState } from 'react';
import { Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { currencyFormatterMinimal } from '@/lib/currency';
import { CategoryAmountChartData } from '@/types/charts';
import { Calendar } from 'lucide-react';

const generateChartColors = (total: number, index: number): string => {
  const baseHue = 220;
  const baseSaturation = 75;

  const lightnessRange = 50;
  const lightness = 25 + (index / Math.max(1, total - 1)) * lightnessRange;

  return `hsl(${baseHue}, ${baseSaturation}%, ${Math.max(20, Math.min(80, lightness))}%)`;
};

export function CategoryPercentageChart({
  chartData,
}: {
  chartData: Promise<CategoryAmountChartData>;
}) {
  const data = use(chartData);

  const [isYearly, setIsYearly] = useState(true);

  const dataWithFill = {
    year: {
      chartData: data.year.chartData.map((item, index) => ({
        ...item,
        fill: generateChartColors(data.year.chartData.length, index),
      })),
    },
    decade: {
      chartData: data.decade.chartData.map((item, index) => ({
        ...item,
        fill: generateChartColors(data.decade.chartData.length, index),
      })),
    },
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Expenses</CardTitle>
        <CardDescription>
          {isYearly ? data.year.description : data.decade.description}
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setIsYearly(!isYearly)}>
                <Calendar />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isYearly ? 'View Decade Category Expenses' : 'View Yearly Category Expenses'}</p>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  valueFormatter={(value) => `${currencyFormatterMinimal.format(value as number)}`}
                />
              }
            />
            <Pie
              data={isYearly ? dataWithFill.year.chartData : dataWithFill.decade.chartData}
              dataKey="amount"
              nameKey="category"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
