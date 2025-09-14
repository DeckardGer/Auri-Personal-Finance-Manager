import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';
import { Separator } from '@/components/ui/separator';
import { type LucideIcon, Bell, Sparkles } from 'lucide-react';

type HeaderProps = {
  breadcrumbs: { href: string; label: string; icon?: LucideIcon }[];
};

export function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.flatMap((breadcrumb, index) => {
            const items = [
              <BreadcrumbItem key={`${breadcrumb.href}-item`}>
                <BreadcrumbLink href={breadcrumb.href} asChild>
                  <HoverPrefetchLink href={breadcrumb.href}>
                    {breadcrumb.icon && <breadcrumb.icon className="size-4" />}
                    {breadcrumb.label}
                  </HoverPrefetchLink>
                </BreadcrumbLink>
              </BreadcrumbItem>,
            ];

            if (index < breadcrumbs.length - 1) {
              items.push(<BreadcrumbSeparator key={`${breadcrumb.href}-separator`} />);
            }

            return items;
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        <Button variant="ghost">
          <Sparkles />
          Ask AI
        </Button>
        <Separator orientation="vertical" className="data-[orientation=vertical]:h-9" />
        <Button variant="outline" size="icon">
          <Bell />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
