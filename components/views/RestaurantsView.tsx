'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { RESTAURANTS } from '@/lib/data';
import { RestaurantCard } from '@/components/RestaurantCard';
import { FilterBar } from '@/components/FilterBar';
import { SlidersHorizontal, ArrowUpDown, Search, RotateCcw } from 'lucide-react';

export const RestaurantsView: React.FC = () => {
  const { filterOptions, setFilterOptions, resetFilters, selectedCategory, setSelectedCategory } = useApp();

  // Apply filters and sorting
  let list = [...RESTAURANTS];

  if (filterOptions.pureVegOnly) {
    list = list.filter((r) => r.isPureVeg);
  }
  if (filterOptions.fastDelivery) {
    list = list.filter((r) => r.deliveryTimeMin <= 25);
  }
  if (filterOptions.ratingAbove4) {
    list = list.filter((r) => r.rating >= 4.6);
  }
  if (filterOptions.offersOnly) {
    list = list.filter((r) => !!r.offer);
  }
  if (filterOptions.cuisines.length > 0) {
    list = list.filter((r) => r.cuisines.some((c) => filterOptions.cuisines.includes(c)));
  }

  // Sort
  if (filterOptions.sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (filterOptions.sortBy === 'deliveryTime') {
    list.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
  } else if (filterOptions.sortBy === 'costLowToHigh') {
    list.sort((a, b) => a.priceForTwo - b.priceForTwo);
  } else if (filterOptions.sortBy === 'costHighToLow') {
    list.sort((a, b) => b.priceForTwo - a.priceForTwo);
  }

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              {selectedCategory ? `${selectedCategory} Restaurants` : 'All Restaurants Near You'}
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Showing {list.length} food places delivering to your current location
            </p>
          </div>

          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setFilterOptions((prev) => ({ ...prev, cuisines: [] }));
              }}
              className="self-start sm:self-auto text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors"
            >
              Clear Category ({selectedCategory}) ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Grid or Empty state */}
      {list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((rest) => (
            <RestaurantCard key={rest.id} restaurant={rest} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-zinc-200 shadow-xs max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-zinc-900 mb-1">No restaurants found</h3>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto mb-5">
            We couldn&apos;t find any restaurant matching your selected filters. Try changing your filters or location.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
