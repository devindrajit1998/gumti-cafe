'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { SlidersHorizontal, ChevronDown, Check, Sparkles, Clock, Leaf, Percent, X } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filterOptions, setFilterOptions, setIsFilterModalOpen, resetFilters } = useApp();

  // Active filter count
  const activeCount =
    (filterOptions.sortBy !== 'relevance' ? 1 : 0) +
    (filterOptions.pureVegOnly ? 1 : 0) +
    (filterOptions.fastDelivery ? 1 : 0) +
    (filterOptions.ratingAbove4 ? 1 : 0) +
    (filterOptions.offersOnly ? 1 : 0) +
    filterOptions.cuisines.length;

  return (
    <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 py-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 transition-all shadow-2xs">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        
        {/* Main Filter & Sort Button (Opens Modal) */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
            activeCount > 0
              ? 'border-orange-600 bg-orange-50 text-orange-700 shadow-xs'
              : 'border-zinc-300 hover:border-zinc-400 text-zinc-700 bg-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-extrabold">
              {activeCount}
            </span>
          )}
        </button>

        {/* Pure Veg Pill Toggle */}
        <button
          onClick={() =>
            setFilterOptions((prev) => ({ ...prev, pureVegOnly: !prev.pureVegOnly }))
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
            filterOptions.pureVegOnly
              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
              : 'border-zinc-300 hover:border-zinc-400 text-zinc-700 bg-white'
          }`}
        >
          <div className="w-3 h-3 border border-emerald-600 rounded-[2px] flex items-center justify-center bg-white">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </div>
          <span>Pure Veg</span>
          {filterOptions.pureVegOnly && <Check className="w-3 h-3" />}
        </button>

        {/* Fast Delivery (< 30 min) */}
        <button
          onClick={() =>
            setFilterOptions((prev) => ({ ...prev, fastDelivery: !prev.fastDelivery }))
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
            filterOptions.fastDelivery
              ? 'border-orange-600 bg-orange-50 text-orange-800 ring-1 ring-orange-600'
              : 'border-zinc-300 hover:border-zinc-400 text-zinc-700 bg-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <span>Fast Delivery (&lt;30 min)</span>
          {filterOptions.fastDelivery && <Check className="w-3 h-3" />}
        </button>

        {/* Ratings 4.0+ */}
        <button
          onClick={() =>
            setFilterOptions((prev) => ({ ...prev, ratingAbove4: !prev.ratingAbove4 }))
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
            filterOptions.ratingAbove4
              ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
              : 'border-zinc-300 hover:border-zinc-400 text-zinc-700 bg-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Rating 4.5+</span>
          {filterOptions.ratingAbove4 && <Check className="w-3 h-3" />}
        </button>

        {/* Offers & Discounts */}
        <button
          onClick={() =>
            setFilterOptions((prev) => ({ ...prev, offersOnly: !prev.offersOnly }))
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
            filterOptions.offersOnly
              ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600'
              : 'border-zinc-300 hover:border-zinc-400 text-zinc-700 bg-white'
          }`}
        >
          <Percent className="w-3.5 h-3.5 text-blue-600" />
          <span>Great Offers</span>
          {filterOptions.offersOnly && <Check className="w-3 h-3" />}
        </button>

        {/* Clear filters pill */}
        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors shrink-0"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
