import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/header/header';
import { Home } from 'lucide-react';

const breadcrumbs = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: Home,
  },
];

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <Separator className="-mx-4 mt-2 mb-4 w-[calc(100%+2rem)]!" />
      <main>{children}</main>
    </>
  );
}
