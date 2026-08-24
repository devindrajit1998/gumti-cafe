'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Sparkles, Heart, Coffee, ShieldCheck, Clock, MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/whatsapp';

export const AboutView: React.FC = () => {
  const { restaurantProfile, navigateTo } = useApp();

  const handleOpenWhatsApp = () => {
    const message = `Hello ${restaurantProfile.name}! 👋 I would like to know more about your cafe.`;
    const url = generateWhatsAppUrl(message, restaurantProfile.whatsappPhone);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-10 py-4 max-w-[1200px] mx-auto animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#3D1020] via-[#5D162C] to-[#3D1020] text-[#FFFDF9] rounded-3xl p-8 sm:p-12 md:p-14 border border-[#6A2940] shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBE4CB]/20 border border-[#FBE4CB]/30 text-[#F8D6B2] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Story &amp; Passion</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            About {restaurantProfile.name}
          </h1>
          <p className="text-sm sm:text-base text-[#F8D6B2] leading-relaxed">
            {restaurantProfile.tagline || 'Good food. Good adda. Handcrafted coffee and comfort bites.'}
          </p>
        </div>
      </div>

      {/* Philosophy & Craft */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9C5A7] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FBE4CB] flex items-center justify-center text-[#7C203A]">
            <Coffee className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-black text-[#3D1020]">Artisan Roasts &amp; Teas</h3>
          <p className="text-xs text-[#684332] leading-relaxed">
            Every cup is brewed with precision using select beans, premium dairy, and aromatic spices to deliver memorable sips.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9C5A7] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FBE4CB] flex items-center justify-center text-[#7C203A]">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-black text-[#3D1020]">Fresh Daily Kitchen</h3>
          <p className="text-xs text-[#684332] leading-relaxed">
            From our steamy momos and crispy burgers to stone-baked pizzas, everything is prepared fresh upon order with zero shortcuts.
          </p>
        </div>

        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9C5A7] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FBE4CB] flex items-center justify-center text-[#7C203A]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-black text-[#3D1020]">Hygiene &amp; Quality</h3>
          <p className="text-xs text-[#684332] leading-relaxed">
            FSSAI License #{restaurantProfile.fssaiNumber || 'Active'}. We maintain the highest standards of culinary sanitation and food safety.
          </p>
        </div>
      </div>

      {/* Location and Info */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#E9C5A7] shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-black text-[#7C203A] uppercase tracking-wider">VISIT OUR CAFE</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#3D1020]">
            Experience the Warmth in Person
          </h2>
          <div className="space-y-3 text-xs text-[#684332]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#7C203A] shrink-0 mt-0.5" />
              <span>
                {restaurantProfile.address}, {restaurantProfile.locality}, {restaurantProfile.city} - {restaurantProfile.pincode}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#7C203A] shrink-0" />
              <span>{restaurantProfile.openingHours} (Monday – Sunday)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="px-5 py-2.5 bg-[#7C203A] hover:bg-[#5D162C] text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#E9C5A7] h-64 relative bg-[#FBE4CB]/40 flex items-center justify-center">
          <div className="w-32 h-32 relative">
            <Image
              src={restaurantProfile.logoImage || '/logo-gumti.png'}
              alt={restaurantProfile.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
