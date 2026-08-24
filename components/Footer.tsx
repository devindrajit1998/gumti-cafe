'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { generateWhatsAppUrl } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  const { restaurantProfile, setSelectedCategory, navigateTo } = useApp();

  const handleOpenWhatsApp = () => {
    const message = `Hello ${restaurantProfile.name}! 👋 I am viewing your online menu and would like to order food.`;
    const url = generateWhatsAppUrl(message, restaurantProfile.whatsappPhone);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <footer className="w-full bg-[#3D1020] text-[#F8D6B2] border-t border-[#6A2940] mt-16 pt-12 pb-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="h-12 w-40 relative">
              <Image
                src={restaurantProfile.logoImage || '/logo-gumti.png'}
                alt={restaurantProfile.name}
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs text-[#F8D6B2]/80 leading-relaxed">
              {restaurantProfile.tagline}
            </p>
            <div className="text-xs text-[#E9B88F] pt-0.5">
              🛡️ FSSAI License: #{restaurantProfile.fssaiNumber}
            </div>
          </div>

          {/* Col 2: Dining Location */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs">
              DINING LOCATION
            </h4>
            <p className="text-[#F8D6B2]/80 leading-relaxed">
              {restaurantProfile.address},<br />
              {restaurantProfile.locality},<br />
              {restaurantProfile.city} - {restaurantProfile.pincode}
            </p>
            <div className="space-y-1.5 text-white pt-0.5 font-semibold">
              <a href={`tel:${restaurantProfile.phone}`} className="flex items-center gap-1.5 hover:underline">
                <span>📞</span>
                <span>{restaurantProfile.phone}</span>
              </a>
              <a
                href={generateWhatsAppUrl(`Hello ${restaurantProfile.name}! 👋`, restaurantProfile.whatsappPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#4ADE80] hover:underline"
              >
                <span>💬</span>
                <span>{restaurantProfile.whatsappPhone}</span>
              </a>
            </div>
          </div>

          {/* Col 3: Kitchen Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs">
              CAFE HOURS
            </h4>
            <p className="text-[#F8D6B2]/80 leading-relaxed">
              {restaurantProfile.openingHours}<br />
              (Monday – Sunday)
            </p>
            <div className="pt-1 space-y-0.5">
              <span className="text-white font-bold block">Direct Cafe Guarantee</span>
              <span className="text-[#F8D6B2]/70 text-[11px] block">
                Zero aggregator commission • 100% freshly made.
              </span>
            </div>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-[#F8D6B2]/85">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    navigateTo('home');
                  }}
                  className="hover:text-white cursor-pointer transition-colors text-left block"
                >
                  Browse Full Menu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('about')}
                  className="hover:text-white cursor-pointer transition-colors text-left block"
                >
                  About {restaurantProfile.name}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('book-table')}
                  className="hover:text-white cursor-pointer transition-colors font-bold text-white text-left block"
                >
                  🍽️ Book a Table
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white cursor-pointer transition-colors text-left block"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('qr-code')}
                  className="hover:text-white cursor-pointer transition-colors text-left block"
                >
                  Table QR Standee
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('offers')}
                  className="hover:text-white cursor-pointer transition-colors text-left block"
                >
                  Promo Offers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="hover:text-white cursor-pointer transition-colors text-left block"
                >
                  Direct WhatsApp Help
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#6A2940] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F8D6B2]/70">
          <p>© {new Date().getFullYear()} {restaurantProfile.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => navigateTo('privacy')}
              className="cursor-pointer hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('terms')}
              className="cursor-pointer hover:text-white transition-colors"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
