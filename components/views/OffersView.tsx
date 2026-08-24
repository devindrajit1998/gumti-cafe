'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { COUPONS } from '@/lib/data';
import { Percent, Copy, Check, Sparkles, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { applyCoupon, appliedCoupon, adminCoupons, navigateTo, showToast } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleApply = (coupon: (typeof adminCoupons)[0]) => {
    const success = applyCoupon(coupon);
    if (success) {
      setCopiedCode(coupon.code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleCopy = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      showToast('Promo Code Copied!', code, 'success');
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <div className="pb-28 w-full space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Special Treats & Deals
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Offers & Promo Codes
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 font-medium mt-2 leading-relaxed">
            Apply verified discount vouchers, get order waivers, and save on your food feast today.
          </p>
        </div>
      </div>

      {/* Available Coupons Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
          <Tag className="w-4 h-4 text-orange-600" />
          <span>Available Promo Vouchers</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            const isCopied = copiedCode === coupon.code;

            return (
              <div
                key={coupon.code}
                className={`p-5 rounded-2xl bg-white border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isApplied
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 shadow-md'
                    : 'border-zinc-200/90 hover:border-zinc-300 hover:shadow-md'
                }`}
              >
                {/* Left decorative punch holes for ticket look */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black shrink-0">
                      <Percent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-zinc-900 border-dashed border-2 border-orange-500 bg-orange-50 px-2 py-0.5 rounded-md tracking-wider">
                          {coupon.code}
                        </span>
                        {isApplied && (
                          <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            APPLIED
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-extrabold text-zinc-900 mt-1">{coupon.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-4">{coupon.description}</p>

                <div className="pt-3 border-t border-dashed border-zinc-200 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-600">
                    Valid till {coupon.validUntil}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="text-xs font-bold text-zinc-600 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                      title="Copy code"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleApply(coupon)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs ${
                        isApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      {isApplied ? 'Applied' : 'Apply Code'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Partner Bank Discounts */}
      <div className="mt-10 p-5 rounded-2xl bg-zinc-900 text-white">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Payment Partner & Bank Offers</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700">
            <span className="text-xs font-bold text-orange-400 block">HDFC Bank Cards</span>
            <span className="text-xs text-zinc-300 mt-0.5 block">Flat 15% OFF up to ₹150 on min. ₹599</span>
          </div>
          <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700">
            <span className="text-xs font-bold text-emerald-400 block">Cred Pay UPI</span>
            <span className="text-xs text-zinc-300 mt-0.5 block">Cashback up to ₹100 on every 2nd order</span>
          </div>
          <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700">
            <span className="text-xs font-bold text-amber-400 block">ICICI NetBanking</span>
            <span className="text-xs text-zinc-300 mt-0.5 block">Flat ₹75 instant discount on orders &gt; ₹399</span>
          </div>
        </div>
      </div>
    </div>
  );
};
