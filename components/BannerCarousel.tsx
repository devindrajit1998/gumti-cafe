'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { BannerRecord, BannerTheme } from '@/lib/types';

const THEME_GRADIENTS: Record<BannerTheme, string> = {
    orange: 'from-amber-600 via-orange-600 to-rose-600',
    rose: 'from-rose-600 via-pink-700 to-purple-800',
    emerald: 'from-emerald-600 via-teal-700 to-cyan-800',
    violet: 'from-violet-600 via-purple-700 to-indigo-800',
    zinc: 'from-zinc-800 via-neutral-800 to-zinc-900',
};

interface BannerCarouselProps {
    banners: BannerRecord[];
    /** Slide height class, e.g. 'h-44 sm:h-52' */
    heightClass?: string;
    /** Autoplay interval in ms (0 disables autoplay) */
    interval?: number;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
    banners,
    heightClass = 'h-44 sm:h-56',
    interval = 5000,
}) => {
    const { navigateTo } = useApp();
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const count = banners.length;
    // Derived safe index — stays valid when the banner list shrinks, no effect needed
    const index = count > 0 ? current % count : 0;

    const goTo = useCallback(
        (idx: number) => {
            if (count === 0) return;
            setCurrent(((idx % count) + count) % count);
        },
        [count],
    );

    // Autoplay
    useEffect(() => {
        if (interval <= 0 || count <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % count);
        }, interval);
        return () => clearInterval(timer);
    }, [interval, count]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) {
            goTo(delta < 0 ? current + 1 : current - 1);
        }
        touchStartX.current = null;
    };

    if (count === 0) return null;

    const handleCtaClick = (banner: BannerRecord) => {
        if (!banner.ctaLink) return;
        if (banner.ctaLink.startsWith('http')) {
            window.open(banner.ctaLink, '_blank', 'noopener,noreferrer');
        } else {
            navigateTo(banner.ctaLink as Parameters<typeof navigateTo>[0]);
        }
    };

    return (
        <div
            className={`relative ${heightClass} rounded-3xl overflow-hidden shadow-lg select-none`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Promotional banners"
        >
            {banners.map((banner, idx) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${idx === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    aria-hidden={idx !== index}
                >
                    {/* Background image */}
                    {banner.image ? (
                        <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-cover"
                            priority={idx === 0}
                        />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-r ${THEME_GRADIENTS[banner.theme ?? 'orange']}`} />
                    )}

                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-4 sm:p-6">
                        {banner.badge && (
                            <span className="self-start px-2.5 py-0.5 mb-2 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs border border-white/25 text-white">
                                {banner.badge}
                            </span>
                        )}
                        <h3 className="text-base sm:text-xl font-black text-white leading-tight drop-shadow-sm">
                            {banner.title}
                        </h3>
                        {banner.subtitle && (
                            <p className="text-xs sm:text-sm text-white/85 font-medium mt-1 line-clamp-2">
                                {banner.subtitle}
                            </p>
                        )}
                        {banner.ctaText && banner.ctaLink && (
                            <button
                                onClick={() => handleCtaClick(banner)}
                                className="self-start mt-3 flex items-center gap-1.5 px-4 py-2 bg-white text-zinc-900 rounded-xl text-xs font-black hover:bg-orange-50 transition-colors shadow-md"
                            >
                                {banner.ctaText}
                                <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {/* Navigation arrows (desktop) */}
            {count > 1 && (
                <>
                    <button
                        onClick={() => goTo(index - 1)}
                        aria-label="Previous banner"
                        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs hover:bg-white/35 border border-white/25 text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => goTo(index + 1)}
                        aria-label="Next banner"
                        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs hover:bg-white/35 border border-white/25 text-white transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots */}
            {count > 1 && (
                <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
                    {banners.map((banner, idx) => (
                        <button
                            key={banner.id}
                            onClick={() => goTo(idx)}
                            aria-label={`Go to banner ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all ${idx === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
