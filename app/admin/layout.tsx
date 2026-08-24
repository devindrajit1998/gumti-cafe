import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { InvoiceModal } from '@/components/modals/InvoiceModal';
import { KitchenKOTModal } from '@/components/modals/KitchenKOTModal';
import { Toast } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'Admin Portal | Gumti Cafe',
  description: 'Restaurant owner and manager admin dashboard — manage menu, orders, customers, and settings.',
  icons: {
    icon: '/logo-gumti.png',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AdminAuthGuard>
        <div className="flex min-h-screen bg-[#F4F5F7] text-[#1A1816]">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Content Area */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
        {/* Admin-specific modals */}
        <Toast />
        <InvoiceModal />
        <KitchenKOTModal />
      </AdminAuthGuard>
    </AppProvider>
  );
}
