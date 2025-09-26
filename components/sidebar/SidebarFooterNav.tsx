'use client';

import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';

export function SidebarFooterNav({
  items,
}: {
  items: { title: string; url: string; icon: LucideIcon }[];
}) {
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <HoverPrefetchLink href={item.url} onClick={handleLinkClick}>
                  <item.icon />
                  {item.title}
                </HoverPrefetchLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
