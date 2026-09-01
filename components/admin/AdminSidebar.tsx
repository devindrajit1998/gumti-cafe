'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { RestaurantProfile } from '@/lib/types';
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  Layers,
  Tag,
  Users,
  Megaphone,
  QrCode,
  Settings,
  Calendar,
  ExternalLink,
  ChefHat,
  Menu,
  X,
  Circle,
} from 'lucide-react';

const navItems = [
  { href: '/admin/overview', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Live Orders', icon: ShoppingBag },
  { href: '/admin/bookings', label: 'Table Bookings', icon: Calendar },
  { href: '/admin/menu', label: 'Menu & Dishes', icon: Utensils },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/coupons', label: 'Coupons & Offers', icon: Tag },
  { href: '/admin/customers', label: 'Customer CRM', icon: Users },
  { href: '/admin/banners', label: 'Banner Manager', icon: Megaphone },
  { href: '/admin/qr-tables', label: 'Table QR Codes', icon: QrCode },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface SidebarContentProps {
  pathname: string;
  restaurantProfile: RestaurantProfile;
  updateRestaurantProfile: (updated: Partial<RestaurantProfile>) => void;
  activeOrdersCount: number;
  onNavigate: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  pathname,
  restaurantProfile,
  updateRestaurantProfile,
  activeOrdersCount,
  onNavigate,
}) => (
  <div className="flex flex-col h-full">
    {/* Brand Image Logo */}
    <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
      <div className="h-12 w-44 relative">
        <Image
          src={restaurantProfile.logoImage || '/logo-gumti.png'}
          alt={restaurantProfile.name}
          fill
          className="object-contain object-left"
          priority
        />
      </div>
      <span className="px-2 py-0.5 rounded-md bg-[#7C203A] text-white text-[10px] font-black uppercase tracking-wider">
        Admin
      </span>
    </div>

    {/* Store Status */}
    <div className="px-4 py-3 border-b border-white/10">
      <button
        onClick={() => updateRestaurantProfile({ isOpen: !restaurantProfile.isOpen })}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${restaurantProfile.isOpen
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
          }`}
      >
        <Circle
          className={`w-2 h-2 fill-current ${restaurantProfile.isOpen ? 'animate-pulse text-emerald-400' : 'text-rose-400'
            }`}
        />
        <span>{restaurantProfile.isOpen ? 'STORE OPEN' : 'STORE CLOSED'}</span>
        <span className="ml-auto text-[10px] opacity-60">tap to toggle</span>
      </button>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
        const isOrders = href === '/admin/orders';
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group relative ${isActive
              ? 'bg-[#F8D6B2]/15 text-[#F8D6B2] border border-[#F8D6B2]/20'
              : 'text-white/50 hover:text-white/90 hover:bg-white/5'
              }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C64B3C] rounded-r-full" />
            )}
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F8D6B2]' : 'text-white/30 group-hover:text-white/60'}`} />
            <span className="truncate">{label}</span>
            {isOrders && activeOrdersCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-black bg-[#C64B3C] text-white animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>

    {/* Footer */}
    <div className="px-4 py-4 border-t border-white/10">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/5 text-sm font-semibold transition-all"
      >
        <ExternalLink className="w-4 h-4 shrink-0" />
        <span>View Storefront</span>
      </a>
      <p className="text-center text-white/20 text-[10px] mt-3 font-medium">
        {restaurantProfile.locality}, {restaurantProfile.city}
      </p>
    </div>
  </div>
);

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { restaurantProfile, updateRestaurantProfile, pastOrders } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeOrdersCount = pastOrders.filter((o) =>
    ['placed', 'confirmed', 'preparing', 'on_the_way'].includes(o.status)
  ).length;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#7C203A] rounded-xl flex items-center justify-center text-white shadow-lg border border-[#E9B88F]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-[#3D1020] transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent
          pathname={pathname}
          restaurantProfile={restaurantProfile}
          updateRestaurantProfile={updateRestaurantProfile}
          activeOrdersCount={activeOrdersCount}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#3D1020] border-r border-[#6A2940] min-h-screen sticky top-0 h-screen">
        <SidebarContent
          pathname={pathname}
          restaurantProfile={restaurantProfile}
          updateRestaurantProfile={updateRestaurantProfile}
          activeOrdersCount={activeOrdersCount}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
};
