'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck } from 'lucide-react';

export const LegalView: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const { restaurantProfile } = useApp();

  return (
    <div className="max-w-[900px] mx-auto py-8 space-y-8 animate-fade-in">
      <div className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-12 border border-[#E9C5A7] shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F3DCC5] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FBE4CB] flex items-center justify-center text-[#7C203A]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#3D1020]">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </h1>
            <p className="text-xs text-[#947362] mt-0.5">Last updated: {new Date().getFullYear()}</p>
          </div>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-4 text-xs text-[#684332] leading-relaxed">
            <h2 className="text-sm font-black text-[#3D1020]">1. Information We Collect</h2>
            <p>
              When you place an order at <strong>{restaurantProfile.name}</strong>, we collect your name, phone number, and delivery address to fulfill your kitchen order and provide live order updates via WhatsApp.
            </p>

            <h2 className="text-sm font-black text-[#3D1020]">2. How We Use Your Data</h2>
            <p>
              Your contact details are strictly used for preparing, packing, and dispatching your food orders. We do not sell, rent, or distribute your personal information to third-party advertisers.
            </p>

            <h2 className="text-sm font-black text-[#3D1020]">3. WhatsApp &amp; Direct Communications</h2>
            <p>
              Order confirmations, receipts, and delivery updates are sent directly to your WhatsApp number registered with us. You can opt out at any time by messaging our helpline.
            </p>

            <h2 className="text-sm font-black text-[#3D1020]">4. Contact</h2>
            <p>
              For privacy queries, reach out to us at <strong>{restaurantProfile.phone}</strong> or visit {restaurantProfile.address}, {restaurantProfile.city}.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-[#684332] leading-relaxed">
            <h2 className="text-sm font-black text-[#3D1020]">1. Orders &amp; Fulfillment</h2>
            <p>
              All orders placed at <strong>{restaurantProfile.name}</strong> are freshly prepared. Preparation times are estimates based on live kitchen load (typically {restaurantProfile.estimatedDeliveryTime || '20–30 mins'}).
            </p>

            <h2 className="text-sm font-black text-[#3D1020]">2. Pricing &amp; Taxes</h2>
            <p>
              All dish prices are listed in Indian Rupees (INR). Applicable GST and delivery fees are calculated transparently at checkout.
            </p>

            <h2 className="text-sm font-black text-[#3D1020]">3. Cancellations &amp; Refunds</h2>
            <p>
              Once a food order has begun active preparation in our kitchen, cancellations may not be eligible for a refund. In the rare event of quality issues, please contact us immediately via WhatsApp (+91 {restaurantProfile.whatsappPhone}) for instant resolution.
            </p>

            <h2 className="text-sm font-black text-[#3D1020]">4. Food Safety &amp; Allergens</h2>
            <p>
              Operating under FSSAI License #{restaurantProfile.fssaiNumber}. If you have specific food allergies or dietary restrictions, please note them in the item customization or special instructions box.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
