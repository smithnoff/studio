import StoreSidebar from '@/components/layout/store-sidebar';
import { PageHeader } from '@/components/ui/page-header';

export default function StoreDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  return (
    <div className="flex min-h-screen">
      <StoreSidebar storeId={params.storeId} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
