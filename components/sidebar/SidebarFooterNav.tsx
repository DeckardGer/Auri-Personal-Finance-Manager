'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MessageCircle, Settings, Github, Mail } from 'lucide-react';

export function SidebarFooterNav() {
  const { state, setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <MessageCircle />
                  Feedback
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={state === 'collapsed' ? 'right' : 'top'}
                align={state === 'collapsed' ? 'end' : 'center'}
                className={cn(
                  'w-[var(--radix-popper-anchor-width)]',
                  state === 'collapsed' && 'w-36'
                )}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="https://github.com/DeckardGer/Auri-Personal-Finance-Manager/issues/new"
                    onClick={handleLinkClick}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-4" />
                    Github Issue
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="mailto:deckardgerritsen@gmail.com" onClick={handleLinkClick}>
                    <Mail className="size-4" />
                    Email Me
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" asChild>
              <HoverPrefetchLink href="/settings" onClick={handleLinkClick}>
                <Settings />
                Settings
              </HoverPrefetchLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
