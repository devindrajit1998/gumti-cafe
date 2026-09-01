'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Percent, ArrowRight, Check, Megaphone } from 'lucide-react';
import { BannerCarousel } from '@/components/BannerCarousel';
import type { BannerRecord, BannerTheme } from '@/lib/types';

const ANNOUNCEMENT_THEMES: Record<BannerTheme, string> = {
  orange: 'from-amber-500 via-orange-500 to-rose-500',
  rose: 'from-rose-500 via-pink-600 to-purple-600',
  emerald: 'from-emerald-500 via-teal-600 to-cyan-600',
  violet: 'from-violet-500 via-purple-600 to-indigo-600',
  zinc: 'from-zinc-700 via-neutral-700 to-zinc-800',
};

const AnnouncementStrip: React.FC<{ banner: BannerRecord }> = ({ banner }) => {
  const { applyCoupon, adminCoupons } = useApp();
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
    <div className={`bg-gradient-to-r ${ANNOUNCEMENT_THEMES[banner.theme ?? 'orange']} rounded-2xl p-3 sm:p-4 text-white shadow-md flex items-center justify-between gap-3 animate-in fade-in duration-300`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
          <Megaphone className="w-4 h-4 text-white" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white text-orange-700 shadow-xs shrink-0">
              {banner.badge || "TODAY'S SPECIAL"}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white leading-snug truncate mt-0.5">
            {banner.title}
          </p>
        </div>
      </div>

      {banner.couponCode && (
        <button
          onClick={() => handleApply(banner.couponCode!)}
          className="px-3.5 py-1.5 bg-white text-orange-700 hover:bg-orange-50 rounded-xl text-xs font-black shrink-0 shadow-xs transition-colors"
        >
          {copiedCode === banner.couponCode ? 'Applied! ✓' : `Apply ${banner.couponCode}`}
        </button>
      )}
    </div>
  );
};

export const PromoBanners: React.FC = () => {
  const { navigateTo, adminCoupons, activeAnnouncementBanners, activePromoBanners } = useApp();

  return (
    <section className="mb-10 space-y-5">
      {/* Announcement marquee banners from the Banner Management System */}
      {activeAnnouncementBanners.map((banner) => (
        <AnnouncementStrip key={banner.id} banner={banner} />
      ))}

      {/* Promo image carousel from the Banner Management System */}
      {activePromoBanners.length > 0 && (
        <BannerCarousel banners={activePromoBanners} heightClass="h-44 sm:h-56" interval={5000} />
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
              <CouponActions code={coupon.code} minOrderValue={coupon.minOrderValue} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

const CouponActions: React.FC<{ code: string; minOrderValue: number }> = ({ code, minOrderValue }) => {
  const { applyCoupon, adminCoupons } = useApp();
  const [isCopied, setIsCopied] = React.useState(false);

  const handleApply = () => {
    const coupon = adminCoupons.find((c) => c.code === code);
    if (coupon) {
      applyCoupon(coupon);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/20">
      <button
        onClick={handleApply}
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
        Min ₹{minOrderValue}
      </span>
    </div>
  );
};
