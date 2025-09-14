'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import auriLogo from '@/public/Auri Logo.svg';
import { useSidebar } from '@/components/ui/sidebar';

export function SidebarAppHeader() {
  const { state } = useSidebar();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex max-w-full items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-transparent!"
          onClick={() => router.push('/dashboard')}
        >
          <Image src={auriLogo} alt="Auri Logo" width={32} height={32} priority unoptimized />
        </Button>
        <h1 className="ml-2.5 truncate text-base font-semibold">Auri</h1>
      </div>
      <SidebarTrigger className={state === 'collapsed' ? 'hidden' : ''} />
    </div>
  );
}
