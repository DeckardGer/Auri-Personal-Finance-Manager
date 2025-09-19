import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';

type InfoCardProps = {
  label: string;
  value: string;
  tooltip: string;
  icon: LucideIcon;
};

export function InfoCard(info: InfoCardProps) {
  return (
    <Card className="flex-1 gap-1 bg-gradient-to-tr from-background to-muted/30 py-4">
      <CardHeader className="gap-0 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">{info.label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-end justify-between">
          <CardDescription className="text-2xl font-semibold text-foreground">
            {info.value}
          </CardDescription>
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
