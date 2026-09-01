'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { ActiveView } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Toast } from '@/components/Toast';

// Modals
import { FoodCustomizationModal } from '@/components/modals/FoodCustomizationModal';
import { LocationModal } from '@/components/modals/LocationModal';
import { AuthModal } from '@/components/modals/AuthModal';
import { FilterModal } from '@/components/modals/FilterModal';
import { CartWarningModal } from '@/components/modals/CartWarningModal';
import { HelpSupportModal } from '@/components/modals/HelpSupportModal';
import { InvoiceModal } from '@/components/modals/InvoiceModal';
import { KitchenKOTModal } from '@/components/modals/KitchenKOTModal';
import { ZaikaAiAssistantModal } from '@/components/modals/ZaikaAiAssistantModal';
import { GroupOrderModal } from '@/components/modals/GroupOrderModal';

// Views
import { HomeView } from '@/components/views/HomeView';
import { FoodSearchView } from '@/components/views/FoodSearchView';
import { OffersView } from '@/components/views/OffersView';
import { CartView } from '@/components/views/CartView';
import { CheckoutView } from '@/components/views/CheckoutView';
import { OrderTrackingView } from '@/components/views/OrderTrackingView';
import { OrdersView } from '@/components/views/OrdersView';
import { FavoritesView } from '@/components/views/FavoritesView';
import { ProfileView } from '@/components/views/ProfileView';
import { AdminMenuView } from '@/components/views/AdminMenuView';
import { QRCodeView } from '@/components/views/QRCodeView';
import { ItemDetailView } from '@/components/views/ItemDetailView';
import { AboutView } from '@/components/views/AboutView';
import { ContactView } from '@/components/views/ContactView';
import { LegalView } from '@/components/views/LegalView';
import { CategoryDetailView } from '@/components/views/CategoryDetailView';
import { BookTableView } from '@/components/views/BookTableView';

const StorefrontContent: React.FC = () => {
  const { activeView } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'book-table':
        return <BookTableView />;
      case 'category-detail':
        return <CategoryDetailView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'privacy':
        return <LegalView type="privacy" />;
      case 'terms':
        return <LegalView type="terms" />;
      case 'item-detail':
        return <ItemDetailView />;
      case 'search':
        return <FoodSearchView />;
      case 'offers':
        return <OffersView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-tracking':
        return <OrderTrackingView />;
      case 'orders':
        return <OrdersView />;
      case 'favorites':
        return <FavoritesView />;
      case 'profile':
        return <ProfileView />;
      case 'admin-menu':
        return <AdminMenuView />;
      case 'qr-code':
        return <QRCodeView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF4E8] text-[#3D1020] selection:bg-[#7C203A] selection:text-white font-sans antialiased">
      {/* Toast Notification Container */}
      <Toast />

      {/* Primary Sticky Header */}
      <Navbar />

      {/* Main Container - 1440px Centered Layout */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {renderCurrentView()}
      </main>

      {/* Full-Width Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <FoodCustomizationModal />
      <LocationModal />
      <AuthModal />
      <FilterModal />
      <CartWarningModal />
      <HelpSupportModal />
      <InvoiceModal />
      <KitchenKOTModal />
      <ZaikaAiAssistantModal />
      <GroupOrderModal />

      {/* Mobile Floating Cart & Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
};

export interface StorefrontShellProps {
  initialView?: ActiveView;
  initialCategory?: string | null;
}

export const StorefrontShell: React.FC<StorefrontShellProps> = ({
  initialView = 'home',
  initialCategory = null,
}) => {
  return (
    <AppProvider initialView={initialView} initialCategory={initialCategory}>
      <StorefrontContent />
    </AppProvider>
  );
};
