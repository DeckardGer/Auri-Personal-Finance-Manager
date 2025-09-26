import { Header } from '@/components/header/header';
import { Separator } from '@/components/ui/separator';
import { type LucideIcon } from 'lucide-react';

export function PageWrapper({
  children,
  breadcrumbs,
}: Readonly<{
  children: React.ReactNode;
  breadcrumbs: { href: string; label: string; icon?: LucideIcon }[];
}>) {
  return (
    <div className="flex h-full flex-col">
      <Header breadcrumbs={breadcrumbs} />
      <Separator className="-mx-4 mt-1.5 mb-4 w-[calc(100%+2rem)]!" />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
