'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Search, Sparkles, ArrowRight, ShieldCheck, Flame, MessageCircle, QrCode } from 'lucide-react';
import type { BannerRecord } from '@/lib/types';

const HERO_THEME_GRADIENTS: Record<string, string> = {
  orange: 'from-zinc-900 via-neutral-900 to-zinc-900',
  rose: 'from-zinc-900 via-neutral-900 to-zinc-900',
  emerald: 'from-zinc-900 via-neutral-900 to-zinc-900',
  violet: 'from-zinc-900 via-neutral-900 to-zinc-900',
  zinc: 'from-zinc-900 via-neutral-900 to-zinc-900',
};

/** Admin-managed hero banner — full-bleed image with overlay content. */
const ManagedHeroBanner: React.FC<{ banner: BannerRecord }> = ({ banner }) => {
  const { navigateTo } = useApp();

  const handleCtaClick = () => {
    if (!banner.ctaLink) return;
    if (banner.ctaLink.startsWith('http')) {
      window.open(banner.ctaLink, '_blank', 'noopener,noreferrer');
    } else {
      navigateTo(banner.ctaLink as Parameters<typeof navigateTo>[0]);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl text-white shadow-xl mb-8 min-h-[320px] sm:min-h-[380px] flex items-center">
      {banner.image ? (
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-r ${HERO_THEME_GRADIENTS[banner.theme ?? 'orange']}`} />
      )}

      {/* Ambient lighting + readability overlay */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

      <div className="relative max-w-7xl mx-auto w-full p-6 sm:p-8 md:p-10">
        <div className="max-w-xl">
          {banner.badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold mb-4 backdrop-blur-xs">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>{banner.badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {banner.title}
          </h1>

          {banner.subtitle && (
            <p className="text-sm sm:text-base text-zinc-200 mt-3 font-normal leading-relaxed">
              {banner.subtitle}
            </p>
          )}

          {banner.ctaText && banner.ctaLink && (
            <button
              onClick={handleCtaClick}
              className="mt-6 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-lg transition-colors"
            >
              {banner.ctaText}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export const HeroDiscovery: React.FC = () => {
  const { navigateTo, restaurantProfile, setOrderType, activeHeroBanner } = useApp();

  // Admin-managed hero banner takes priority; falls back to the default discovery hero.
  if (activeHeroBanner) {
    return <ManagedHeroBanner banner={activeHeroBanner} />;
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-zinc-900 via-neutral-900 to-zinc-900 text-white shadow-xl mb-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left text & CTA */}
        <div className="flex-1 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold mb-4 backdrop-blur-xs">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>Direct WhatsApp Ordering • Zero Login Needed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {restaurantProfile.name} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Kitchen & Dining
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 mt-3 font-normal leading-relaxed">
            {restaurantProfile.tagline}. Authentic dishes prepared fresh and dispatched directly to your table or doorstep via WhatsApp.
          </p>

          {/* Quick actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 flex items-center justify-between bg-white text-zinc-800 px-4 py-3.5 rounded-2xl shadow-lg hover:bg-zinc-50 transition-all text-xs font-semibold group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-orange-600" />
                <span className="text-zinc-700 font-bold">Explore Full Menu ({restaurantProfile.locality})</span>
              </div>
              <span className="bg-orange-600 text-white p-1.5 rounded-xl group-hover:scale-105 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => navigateTo('qr-code')}
              className="flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 text-white px-4 py-3.5 rounded-2xl text-xs font-bold transition-colors"
            >
              <QrCode className="w-4 h-4 text-orange-400" />
              <span>Table QR Standee</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-[11px] font-medium text-zinc-300">
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct WhatsApp Confirmations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Fresh Kitchen Quality</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>No App Login Required</span>
            </div>
          </div>
        </div>

        {/* Right featured image card */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 relative">
          <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 group">
            <Image
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
              alt="Delicious Dum Biryani"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3 bg-orange-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider">
              Dine-In • Takeaway • Delivery
            </div>

            <div className="absolute bottom-3 left-3 right-3 p-3 bg-zinc-900/90 backdrop-blur-md rounded-xl border border-zinc-800 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">{restaurantProfile.name}</h4>
                  <p className="text-[10px] text-zinc-400">{restaurantProfile.locality} • ⭐ 4.9</p>
                </div>
                <button
                  onClick={() => navigateTo('home')}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs"
                >
                  Order Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
