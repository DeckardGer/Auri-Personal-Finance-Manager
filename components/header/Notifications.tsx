import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Bell, CheckCheck } from 'lucide-react';

// TODO: Add notifications

export function Notifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            <Button size="sm" variant="ghost" className="text-primary hover:text-primary">
              <CheckCheck />
              Mark all as read
            </Button>
          </div>
          <Separator />
          <Empty className="p-0 md:p-0">
            <EmptyHeader className="gap-1">
              <EmptyMedia variant="icon" className="size-8">
                <Bell className="size-4" />
              </EmptyMedia>
              <EmptyTitle className="text-md">You&apos;re all caught up</EmptyTitle>
              <EmptyDescription className="text-sm">
                We&apos;ll notify you of all the latest updates.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </PopoverContent>
    </Popover>
  );
}
