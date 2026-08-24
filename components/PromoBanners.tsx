'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Percent, ArrowRight, Sparkles, Copy, Check, Megaphone } from 'lucide-react';
import Image from 'next/image';

export const PromoBanners: React.FC = () => {
  const { applyCoupon, navigateTo, adminCoupons, bannerAnnouncement, showToast } = useApp();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleApply = (code: string) => {
    const coupon = adminCoupons.find((c) => c.code === code);
    if (coupon) {
      applyCoupon(coupon);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <section className="mb-10 space-y-5">
      {/* Live Announcement Marquee Banner from Admin */}
      {bannerAnnouncement && bannerAnnouncement.enabled && bannerAnnouncement.text && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-3 sm:p-4 text-white shadow-md flex items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4 text-white" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white text-orange-700 shadow-xs shrink-0">
                  {bannerAnnouncement.badge || 'TODAY\'S SPECIAL'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug truncate mt-0.5">
                {bannerAnnouncement.text}
              </p>
            </div>
          </div>

          {bannerAnnouncement.couponCode && (
            <button
              onClick={() => handleApply(bannerAnnouncement.couponCode!)}
              className="px-3.5 py-1.5 bg-white text-orange-700 hover:bg-orange-50 rounded-xl text-xs font-black shrink-0 shadow-xs transition-colors"
            >
              {copiedCode === bannerAnnouncement.couponCode ? 'Applied! ✓' : `Apply ${bannerAnnouncement.couponCode}`}
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            Exclusive Deals & Offers
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">Save more on every bite with active promo codes</p>
        </div>

        <button
          onClick={() => navigateTo('offers')}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          View all offers <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adminCoupons.slice(0, 3).map((coupon, idx) => {
          const isCopied = copiedCode === coupon.code;
          const bgGradients = [
            'from-amber-600 to-orange-700',
            'from-rose-600 to-purple-800',
            'from-emerald-600 to-teal-800',
          ];
          const bgGrad = bgGradients[idx % bgGradients.length];

          return (
            <div
              key={coupon.code}
              className={`relative rounded-3xl overflow-hidden shadow-md group bg-gradient-to-r ${bgGrad} text-white min-h-[150px] flex flex-col justify-between p-5 border border-white/10`}
            >
              {/* Top Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/25 text-white">
                  PROMO
                </span>
                <span className="text-xs font-black bg-white/25 backdrop-blur-xs px-2.5 py-0.5 rounded-xl border border-white/20 font-mono">
                  {coupon.code}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="relative z-10 my-2">
                <h3 className="text-base sm:text-lg font-black leading-snug">{coupon.title}</h3>
                <p className="text-xs text-white/85 font-medium mt-0.5">{coupon.description}</p>
              </div>

              {/* Actions */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/20">
                <button
                  onClick={() => handleApply(coupon.code)}
                  className="text-xs font-extrabold bg-white text-zinc-900 hover:bg-zinc-100 py-1.5 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <>
                      <Percent className="w-3.5 h-3.5 text-orange-600" />
                      <span>Apply Code</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] text-white/80 font-bold">
                  Min ₹{coupon.minOrderValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

