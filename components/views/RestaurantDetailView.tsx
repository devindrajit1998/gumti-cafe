'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RESTAURANTS } from '@/lib/data';
import { FoodItemCard } from '@/components/FoodItemCard';
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  Percent,
  Search,
  Check,
  ChevronLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import Image from 'next/image';

export const RestaurantDetailView: React.FC = () => {
  const {
    selectedRestaurantId,
    navigateTo,
    toggleFavoriteRestaurant,
    isRestaurantFavorite,
    showToast,
  } = useApp();

  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('All');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Fallback to first restaurant if none selected
  const restaurant =
    RESTAURANTS.find((r) => r.id === selectedRestaurantId) || RESTAURANTS[0];

  const isFavorite = isRestaurantFavorite(restaurant.id);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard! 📋', restaurant.name, 'success');
    } else {
      showToast('Share link ready', restaurant.name, 'info');
    }
  };

  // Group menu by categories
  const categoriesInMenu = Array.from(
    new Set(restaurant.menu.map((item) => item.category))
  );

  // Filter items
  const filterMenuItem = (item: typeof restaurant.menu[0]) => {
    if (vegOnlyFilter && item.vegType !== 'veg') return false;
    if (activeCategoryTab !== 'All' && item.category !== activeCategoryTab) return false;
    if (
      menuSearchQuery.trim() &&
      !item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(menuSearchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  };

  const filteredMenu = restaurant.menu.filter(filterMenuItem);

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigateTo('home')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 mb-4 px-3 py-1.5 rounded-lg bg-zinc-100/80 hover:bg-zinc-200/80 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Discovery</span>
      </button>

      {/* Restaurant Header Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-md overflow-hidden mb-6">
        {/* Cover Photo */}
        <div className="relative h-56 sm:h-72 w-full bg-zinc-900">
          <Image
            src={restaurant.coverImage || restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteRestaurant(restaurant.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 shadow-md'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Title overlay on cover */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold bg-orange-600 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                FSSAI Certified
              </span>
              {restaurant.isPureVeg && (
                <span className="text-xs font-bold bg-emerald-600 px-2.5 py-0.5 rounded-md">
                  100% Pure Veg
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-200 font-medium line-clamp-1 mt-0.5">
              {restaurant.tagline}
            </p>
          </div>
        </div>

        {/* Restaurant Stats Bar */}
        <div className="p-5 sm:p-6 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <p className="text-xs font-semibold text-zinc-500">
                {restaurant.cuisines.join(' • ')}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-zinc-600 mt-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate max-w-xs">{restaurant.address}</span>
              </div>
            </div>

            {/* Rating box */}
            <div className="flex items-center gap-4 bg-zinc-50 p-2.5 px-4 rounded-2xl border border-zinc-200/80">
              <div className="text-center pr-3 border-r border-zinc-200">
                <div className="inline-flex items-center gap-1 text-emerald-700 font-black text-sm">
                  <span>{restaurant.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-emerald-600" />
                </div>
                <span className="text-[10px] text-zinc-400 block font-medium">
                  {restaurant.ratingCount}
                </span>
              </div>

              <div className="text-center pr-3 border-r border-zinc-200">
                <div className="flex items-center gap-1 text-zinc-900 font-extrabold text-sm">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>{restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax}m</span>
                </div>
                <span className="text-[10px] text-zinc-400 block font-medium">
                  {restaurant.distanceKm} km away
                </span>
              </div>

              <div className="text-center">
                <span className="text-sm font-extrabold text-zinc-900 block">
                  ₹{restaurant.priceForTwo}
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">For two</span>
              </div>
            </div>
          </div>

          {/* Offer Banner */}
          {restaurant.offer && (
            <div className="mt-4 p-3 bg-linear-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                  <Percent className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-orange-950 block">{restaurant.offer}</span>
                  {restaurant.offerCode && (
                    <span className="text-[10px] text-orange-700 font-semibold">
                      Use code {restaurant.offerCode} at checkout
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-bold text-orange-800 bg-orange-200/80 px-2.5 py-1 rounded-lg">
                Applied in Cart
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Controls: Search & Veg-only Filter */}
      <div className="sticky top-16 md:top-20 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-zinc-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-center gap-3">
        {/* Search inside menu */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search within this menu..."
            value={menuSearchQuery}
            onChange={(e) => setMenuSearchQuery(e.target.value)}
            className="w-full text-xs p-2.5 pl-9 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-hidden focus:border-orange-500 focus:bg-white"
          />
        </div>

        {/* Veg Only Toggle */}
        <button
          onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 w-full sm:w-auto justify-center ${
            vegOnlyFilter
              ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
              : 'border-zinc-300 text-zinc-700 bg-zinc-50 hover:bg-zinc-100'
          }`}
        >
          <div className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-[2px] flex items-center justify-center bg-white">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </div>
          <span>Veg Only</span>
          {vegOnlyFilter && <Check className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Menu Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        <button
          onClick={() => setActiveCategoryTab('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
            activeCategoryTab === 'All'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          All Items ({restaurant.menu.length})
        </button>

        {categoriesInMenu.map((cat) => {
          const count = restaurant.menu.filter((m) => m.category === cat).length;
          const isSelected = activeCategoryTab === cat;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategoryTab(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
                isSelected
                  ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Food Items List */}
      <div className="space-y-4">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => <FoodItemCard key={item.id} item={item} />)
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200 p-6">
            <p className="text-sm font-bold text-zinc-700">No dishes match your filter</p>
            <p className="text-xs text-zinc-500 mt-1">
              Try searching for something else or turn off &quot;Veg Only&quot; toggle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
