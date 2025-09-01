'use client';

import * as React from 'react';
import { Home, Receipt, Settings, Store, Tags, MessageCircle } from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent } from '@/components/ui/sidebar';
import { SidebarAppHeader } from '@/components/sidebar/SidebarAppHeader';
import { SidebarMainNav } from '@/components/sidebar/SidebarMainNav';
import { SidebarFooterNav } from '@/components/sidebar/SidebarFooterNav';

// This is sample data.
const data = {
  mainNav: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
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
  ],
  footerNav: [
    {
      title: 'Feedback',
      url: '/feedback',
      icon: MessageCircle,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarAppHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainNav items={data.mainNav} />
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarFooterNav items={data.footerNav} />
      </SidebarFooter>
    </Sidebar>
  );
}
