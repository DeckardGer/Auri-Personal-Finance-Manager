import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUser } from '@/lib/data';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  const user = await getUser();

  if (!user) redirect('/');

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="h-[calc(100vh-16px)] overflow-hidden">
        <div className="p-4 pt-1.5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
