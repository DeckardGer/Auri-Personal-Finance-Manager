import { use } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { CardData } from '@/types/charts';
import { cn } from '@/lib/utils';
import { currencyFormatter } from '@/lib/currency';
import { ArrowUp, ArrowDown, type LucideIcon } from 'lucide-react';

type InfoCardProps = {
  label: string;
  data: Promise<CardData>;
  tooltip: string;
  icon: LucideIcon;
};

export function InfoCard(info: InfoCardProps) {
  const data = use(info.data);

  const positive = data.percentage !== undefined && data.percentage >= 0;

  return (
    <Card className="flex-1 gap-1 overflow-hidden bg-gradient-to-tr from-background to-muted/30 py-4">
      <CardHeader className="gap-0 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">{info.label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-end justify-between gap-2">
          <div className="flex gap-2 truncate">
            <CardDescription className="truncate text-2xl font-semibold text-foreground">
              {currencyFormatter.format(data.value)}
            </CardDescription>
            {data.percentage !== undefined && (
              <div
                className={cn(
                  'font-sm inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-2 py-0.5 text-xs whitespace-nowrap',
                  positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                )}
              >
                {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(data.percentage).toFixed(1)}%
              </div>
            )}
          </div>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <div className="rounded-md border bg-card p-2">
                <info.icon className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{info.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
