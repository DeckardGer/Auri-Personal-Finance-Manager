import React from 'react';
import { AuriChat } from '@/components/ai-chat/AuriChat';
import { Notifications } from '@/components/header/Notifications';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getUser } from '@/lib/data';
import type { LucideIcon } from 'lucide-react';

type HeaderProps = {
  breadcrumbs: { href: string; label: string; icon?: LucideIcon }[];
};

// TODO: If converted to a client component in the future, add SidebarTrigger state shown when sidebar is collapsed
export async function Header({ breadcrumbs }: HeaderProps) {
  const user = await getUser();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="flex md:hidden" />
        <Breadcrumb>
          <BreadcrumbList className="hidden min-[512px]:flex">
            {breadcrumbs.flatMap((breadcrumb, index) => {
              const items = [
                <BreadcrumbItem key={`${breadcrumb.href}-item`}>
                  <BreadcrumbLink asChild>
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
          <BreadcrumbList className="flex min-[512px]:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <span>{breadcrumbs[breadcrumbs.length - 1].label}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {breadcrumbs.map((breadcrumb) => (
                  <DropdownMenuItem key={`${breadcrumb.href}-item`} asChild>
                    <HoverPrefetchLink href={breadcrumb.href}>{breadcrumb.label}</HoverPrefetchLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <AuriChat name={user?.name?.split(' ')[0] ?? 'User'} />
        <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />
        <Notifications />
        <ThemeToggle />
      </div>
    </header>
  );
}
