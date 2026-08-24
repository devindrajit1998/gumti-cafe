'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ActiveView } from '@/lib/types';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  QrCode,
  Store,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    navigateTo,
    cartItemCount,
    grandTotal,
    activeOrder,
    restaurantProfile,
    setIsAiAssistantOpen,
  } = useApp();

  const navItems = [
    { id: 'home', label: 'Menu', icon: UtensilsCrossed },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartItemCount > 0 ? `${cartItemCount}` : undefined },
    { id: 'orders', label: 'Orders', icon: Clock, badge: activeOrder ? '1' : undefined },
    { id: 'qr-code', label: 'Table QR', icon: QrCode },
  ];

  const showFloatingCart = cartItemCount > 0 && activeView !== 'cart' && activeView !== 'checkout';

  return (
    <>
      {/* Floating AI Sommelier Quick Trigger on Mobile */}
      {!showFloatingCart && activeView !== 'cart' && activeView !== 'checkout' && (
        <div className="md:hidden fixed bottom-18 right-4 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1816] text-[#FAF9F5] rounded-full shadow-lg border border-[#2E2B27] active:scale-95 transition-all text-xs font-bold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C59A3F]" />
            <span>AI Sommelier</span>
          </button>
        </div>
      )}

      {/* Floating Cart CTA bar on mobile */}
      {showFloatingCart && (
        <div
          id="mobile-floating-cart"
          className="md:hidden fixed bottom-18 left-3 right-3 z-40 animate-in slide-in-from-bottom duration-200"
        >
          <button
            onClick={() => navigateTo('cart')}
            className="w-full bg-[#1A1816] text-white p-3 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] flex items-center justify-between border border-[#2E2B27] cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-7 h-7 rounded-lg bg-[#E05315] flex items-center justify-center font-bold text-xs text-white">
                {cartItemCount}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight truncate max-w-[170px] text-[#FAF9F5]">
                  {restaurantProfile.name}
                </p>
                <p className="text-[11px] text-[#C8C4BC] font-medium">₹{grandTotal} • View Cart</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold bg-[#E05315] py-1.5 px-3 rounded-lg text-white">
              <span>Checkout</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* App-like Fixed Bottom Navigation */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E8E5DD] shadow-[0_-2px_10px_rgba(0,0,0,0.03)] px-2 py-1.5"
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id as ActiveView)}
                className={`flex flex-col items-center justify-center py-1 px-3 relative rounded-lg transition-all cursor-pointer ${
                  isActive ? 'text-[#E05315] font-bold' : 'text-[#7D7872] hover:text-[#1A1816] font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.6]'}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 bg-[#E05315] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-1 ${
                    isActive ? 'font-bold text-[#E05315]' : 'text-[#7D7872]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
