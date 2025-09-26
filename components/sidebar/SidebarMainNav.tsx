'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
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

export function SidebarMainNav({
  items,
}: {
  items: { title: string; url: string; icon: LucideIcon }[];
}) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url} asChild>
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
