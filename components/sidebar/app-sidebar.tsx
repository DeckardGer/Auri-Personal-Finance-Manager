'use client';

import * as React from 'react';
import { Home, ChartColumn, Receipt, Store, Tags } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { SidebarAppHeader } from '@/components/sidebar/SidebarAppHeader';
import { SidebarMainNav } from '@/components/sidebar/SidebarMainNav';
import { SidebarFooterNav } from '@/components/sidebar/SidebarFooterNav';

const mainNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: ChartColumn,
  },
  {
    title: 'Transactions',
    url: '/transactions',
    icon: Receipt,
  },
  {
    title: 'Merchants',
    url: '/merchants',
    icon: Store,
  },
  {
    title: 'Categories',
    url: '/categories',
    icon: Tags,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarAppHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainNav items={mainNavItems} />
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarFooterNav />
      </SidebarFooter>
      {state === 'collapsed' && <SidebarRail />}
    </Sidebar>
  );
}
