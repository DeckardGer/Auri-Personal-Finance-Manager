'use client';

import * as React from 'react';
import Image from 'next/image';
import auriLogo from '@/public/Auri Logo.svg';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function SidebarAppHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-transparent!"
        onClick={() => router.push('/dashboard')}
      >
        <Image src={auriLogo} alt="Auri Logo" width={32} height={32} unoptimized priority />
      </Button>
      <h1 className="truncate text-lg font-semibold">Auri</h1>
    </div>
  );
}
