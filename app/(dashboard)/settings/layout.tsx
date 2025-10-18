import { PageWrapper } from '@/components/header/PageWrapper';
import { Home } from 'lucide-react';

const breadcrumbs = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/settings',
    label: 'Settings',
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageWrapper breadcrumbs={breadcrumbs}>{children}</PageWrapper>;
}
