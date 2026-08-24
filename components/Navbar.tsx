'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Search,
  ShoppingBag,
  QrCode,
  User,
  MessageCircle,
  Share2,
  ChevronDown,
  X,
  UtensilsCrossed,
} from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const {
    activeView,
    navigateTo,
    restaurantProfile,
    orderType,
    setOrderType,
    tableNumber,
    cartItemCount,
    grandTotal,
    searchQuery,
    setSearchQuery,
    showToast,
  } = useApp();

  const [isOrderModeOpen, setIsOrderModeOpen] = useState(false);
  const orderModeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (orderModeRef.current && !orderModeRef.current.contains(event.target as Node)) {
        setIsOrderModeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('home', { query: searchQuery.trim() });
    }
  };

  const handleDirectWhatsAppChat = () => {
    const message = `Hello ${restaurantProfile.name}! 👋 I would like to inquire about the menu and place an order.`;
    const url = generateWhatsAppUrl(message, restaurantProfile.whatsappPhone);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const handleShareMenu = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: restaurantProfile.name,
          text: `Order fresh food directly from ${restaurantProfile.name}!`,
          url: window.location.origin,
        })
        .catch(() => { });
    } else {
      showToast('Menu Link Copied! 📋', undefined, 'success');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF9] border-b border-[#E9C5A7] shadow-xs">
      {/* 1. Thin Top Utility Banner */}
      <div className="bg-[#3D1020] text-[#F8D6B2] text-xs font-medium py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#6A2940]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#C64B3C] text-white px-2 py-0.5 rounded font-extrabold text-[10px] uppercase tracking-wider">
              DIRECT CAFE
            </span>
            <span className="text-xs text-[#A6A095] hidden sm:inline">
              Freshly made • direct WhatsApp ordering • 8:00 AM – 11:00 PM
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <button
              onClick={handleDirectWhatsAppChat}
              className="flex items-center gap-1.5 text-[#D8D4CA] hover:text-white transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>WhatsApp Help</span>
            </button>
            <button
              onClick={handleShareMenu}
              className="flex items-center gap-1.5 text-[#D8D4CA] hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (1440px Max Width Centered) */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">

          {/* Brand Logo & Elegant Wordmark */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3.5 text-left shrink-0 cursor-pointer focus:outline-none py-1 group"
            title={restaurantProfile.name}
          >
            {/* Logo in a clean circular card with warm shadow matching header */}
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#FBE4CB] p-1 border-2 border-[#E9C5A7] shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
              <Image
                src={restaurantProfile.logoImage || '/logo-gumti.png'}
                alt={restaurantProfile.name}
                fill
                className="object-contain p-0.5 rounded-full"
                priority
              />
            </div>

            {/* Premium Typography to complete the header branding */}
            <div className="hidden min-[400px]:block">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-lg sm:text-xl text-[#3D1020] tracking-tight leading-none">
                  {restaurantProfile.name}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#7C203A] tracking-wider block mt-1 uppercase">
                Artisan Cafe &amp; Kitchen
              </span>
            </div>
          </button>

          {/* Large Center Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-sm md:max-w-lg hidden md:block"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, momos, pizza..."
              className="w-full h-11 pl-11 pr-9 bg-[#FFF4E8] hover:bg-white focus:bg-white text-xs sm:text-sm font-medium text-[#3D1020] placeholder:text-[#947362] rounded-xl border border-[#E9C5A7] focus:border-[#7C203A] focus:outline-none transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#7D7872] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D7872] hover:text-[#1A1816] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Delivery Mode Pill Selector */}
            <div className="relative hidden md:block" ref={orderModeRef}>
              <button
                onClick={() => setIsOrderModeOpen(!isOrderModeOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8] hover:bg-white text-left text-xs transition-colors cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-[#7C203A] block uppercase leading-none">
                    {orderType === 'delivery' ? 'Home Delivery' : orderType === 'pickup' ? 'Self Pickup' : 'Dine-In Table'}
                  </span>
                  <span className="text-xs text-[#1A1816] font-bold">
                    {orderType === 'delivery' ? '25–40 mins' : orderType === 'pickup' ? '15–20 mins' : `Table #${tableNumber}`}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#7D7872]" />
              </button>

              {isOrderModeOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E9C5A7] p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setOrderType('delivery');
                      setIsOrderModeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl cursor-pointer ${orderType === 'delivery' ? 'bg-[#F8D6B2] text-[#7C203A] font-bold' : 'hover:bg-[#FFF4E8]'
                      }`}
                  >
                    🚴 Home Delivery (25–40m)
                  </button>
                  <button
                    onClick={() => {
                      setOrderType('pickup');
                      setIsOrderModeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl cursor-pointer ${orderType === 'pickup' ? 'bg-[#F8D6B2] text-[#7C203A] font-bold' : 'hover:bg-[#FFF4E8]'
                      }`}
                  >
                    🛍️ Self Pickup (15–20m)
                  </button>
                  <button
                    onClick={() => {
                      setOrderType('dine_in');
                      setIsOrderModeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl cursor-pointer ${orderType === 'dine_in' ? 'bg-[#F8D6B2] text-[#7C203A] font-bold' : 'hover:bg-[#FFF4E8]'
                      }`}
                  >
                    🍽️ Dine-In Table
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Links (About, Contact, Book Table) */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#684332]">
              <button
                onClick={() => navigateTo('about')}
                className="px-2.5 py-1.5 rounded-lg hover:text-[#7C203A] hover:bg-[#FFF4E8] transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className="px-2.5 py-1.5 rounded-lg hover:text-[#7C203A] hover:bg-[#FFF4E8] transition-colors cursor-pointer"
              >
                Contact
              </button>
              <button
                onClick={() => navigateTo('book-table')}
                className="px-3 py-1.5 rounded-xl bg-[#FBE4CB] hover:bg-[#F8D6B2] text-[#7C203A] border border-[#E9C5A7] font-black transition-all cursor-pointer shadow-2xs"
              >
                🍽️ Book Table
              </button>
            </div>

            {/* Table QR Icon Button */}
            <button
              onClick={() => navigateTo('qr-code')}
              className="hidden sm:flex flex-col items-center justify-center p-2 text-center text-[#684332] hover:text-[#7C203A] transition-colors cursor-pointer"
            >
              <QrCode className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-tight mt-0.5">Table QR</span>
            </button>

            {/* Prominent gumti cafe cart button */}
            <button
              onClick={() => navigateTo('cart')}
              className="bg-[#7C203A] hover:bg-[#5D162C] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="text-left">
                <span className="block font-black leading-none text-xs sm:text-sm">Cart</span>
                <span className="text-[11px] font-medium text-white/90">
                  {cartItemCount > 0 ? `${cartItemCount} items · ₹${grandTotal}` : '0 items'}
                </span>
              </div>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
