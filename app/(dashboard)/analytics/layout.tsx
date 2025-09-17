import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/header/header';
import { Home } from 'lucide-react';

const breadcrumbs = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/analytics',
    label: 'Analytics',
  },
];

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col">
      <Header breadcrumbs={breadcrumbs} />
      <Separator className="-mx-4 mt-1.5 mb-4 w-[calc(100%+2rem)]!" />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
