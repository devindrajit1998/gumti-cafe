'use client';

import React from 'react';
import { Restaurant } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { Star, Clock, MapPin, Heart, Percent, Sparkles, Leaf } from 'lucide-react';
import Image from 'next/image';

interface RestaurantCardProps {
  restaurant: Restaurant;
  layout?: 'grid' | 'horizontal';
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, layout = 'grid' }) => {
  const { navigateTo, toggleFavoriteRestaurant, isRestaurantFavorite } = useApp();
  const isFavorite = isRestaurantFavorite(restaurant.id);

  const handleCardClick = () => {
    navigateTo('restaurant-detail', { restaurantId: restaurant.id });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteRestaurant(restaurant.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between transform hover:-translate-y-1 ${
        layout === 'horizontal' ? 'w-72 sm:w-80 shrink-0' : 'w-full'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative h-44 sm:h-48 w-full bg-zinc-100 overflow-hidden">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          referrerPolicy="no-referrer"
        />

        {/* Gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Offer Overlay (Bottom of image) */}
        {restaurant.offer && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-white text-xs font-extrabold drop-shadow-md">
            <Percent className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span className="truncate">{restaurant.offer}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {restaurant.isPureVeg && (
            <span className="inline-flex items-center gap-1 bg-emerald-600/95 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
              <Leaf className="w-3 h-3" /> PURE VEG
            </span>
          )}
          {restaurant.isTopRated && (
            <span className="inline-flex items-center gap-1 bg-amber-500/95 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
              <Sparkles className="w-3 h-3" /> TOP RATED
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-md ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-black/30 text-white hover:bg-black/50 hover:text-rose-400'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Card Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Rating */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-extrabold text-zinc-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>

            {/* Rating pill */}
            <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-black px-2 py-0.5 rounded-md shrink-0 shadow-xs">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-white stroke-none" />
            </div>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-zinc-500 font-medium truncate mb-2">
            {restaurant.cuisines.join(', ')}
          </p>
        </div>

        {/* Meta Info: Time, Distance, Cost */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600 font-semibold">
          <div className="flex items-center gap-1 text-zinc-800">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>{restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} mins</span>
          </div>

          <span className="text-zinc-300">•</span>

          <div className="flex items-center gap-1">
            <span>{restaurant.distanceKm} km</span>
          </div>

          <span className="text-zinc-300">•</span>

          <div>
            <span>₹{restaurant.priceForTwo} for two</span>
          </div>
        </div>
      </div>
    </div>
  );
};
