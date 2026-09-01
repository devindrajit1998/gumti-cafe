'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import { X, Check } from 'lucide-react';

const CUISINE_LIST = [
  'Biryani',
  'North Indian',
  'South Indian',
  'Pizza',
  'Burgers',
  'Chinese',
  'Mughlai',
  'Momos',
  'Rolls',
  'Desserts',
  'Bakery',
  'Street Food',
  'Fast Food',
];

export const FilterModal: React.FC = () => {
  const { isFilterModalOpen, setIsFilterModalOpen, filterOptions, setFilterOptions, resetFilters } = useApp();
  const { modalRef } = useModalAccessibility(isFilterModalOpen, () => setIsFilterModalOpen(false));

  if (!isFilterModalOpen) return null;

  const handleCuisineToggle = (cuisine: string) => {
    setFilterOptions((prev) => {
      const exists = prev.cuisines.includes(cuisine);
      return {
        ...prev,
        cuisines: exists ? prev.cuisines.filter((c) => c !== cuisine) : [...prev.cuisines, cuisine],
      };
    });
  };

  return (
    <div
      id="filter-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
      onClick={() => setIsFilterModalOpen(false)}
    >
      <div
        id="filter-modal-content"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter menu"
        tabIndex={-1}
        className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <h3 className="text-base font-bold text-zinc-900">Filter & Sort</h3>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-200/70 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Sort By */}
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Sort By</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'relevance', label: 'Relevance' },
                { id: 'rating', label: 'Rating (High to Low)' },
                { id: 'deliveryTime', label: 'Delivery Time (Fastest)' },
                { id: 'costLowToHigh', label: 'Cost: Low to High' },
                { id: 'costHighToLow', label: 'Cost: High to Low' },
              ].map((item) => {
                const isSelected = filterOptions.sortBy === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        sortBy: item.id as any,
                      }))
                    }
                    className={`p-2.5 text-xs rounded-xl border text-left font-medium transition-all ${isSelected
                        ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white'
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Filter Toggles */}
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Quick Filters</h4>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${filterOptions.pureVegOnly ? 'border-emerald-500 bg-emerald-50/30' : 'border-zinc-200'
                  }`}
                onClick={() =>
                  setFilterOptions((prev) => ({ ...prev, pureVegOnly: !prev.pureVegOnly }))
                }
              >
                <span className="text-xs font-semibold text-zinc-800">Pure Veg Only (Green Dot)</span>
                <input
                  type="checkbox"
                  checked={filterOptions.pureVegOnly}
                  onChange={() => { }}
                  className="accent-emerald-600 w-4 h-4 rounded"
                />
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${filterOptions.fastDelivery ? 'border-orange-500 bg-orange-50/30' : 'border-zinc-200'
                  }`}
                onClick={() =>
                  setFilterOptions((prev) => ({ ...prev, fastDelivery: !prev.fastDelivery }))
                }
              >
                <span className="text-xs font-semibold text-zinc-800">Fast Delivery (Under 30 Mins)</span>
                <input
                  type="checkbox"
                  checked={filterOptions.fastDelivery}
                  onChange={() => { }}
                  className="accent-orange-600 w-4 h-4 rounded"
                />
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${filterOptions.ratingAbove4 ? 'border-amber-500 bg-amber-50/30' : 'border-zinc-200'
                  }`}
                onClick={() =>
                  setFilterOptions((prev) => ({ ...prev, ratingAbove4: !prev.ratingAbove4 }))
                }
              >
                <span className="text-xs font-semibold text-zinc-800">Top Rated (4.5+ Stars)</span>
                <input
                  type="checkbox"
                  checked={filterOptions.ratingAbove4}
                  onChange={() => { }}
                  className="accent-amber-600 w-4 h-4 rounded"
                />
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${filterOptions.offersOnly ? 'border-blue-500 bg-blue-50/30' : 'border-zinc-200'
                  }`}
                onClick={() =>
                  setFilterOptions((prev) => ({ ...prev, offersOnly: !prev.offersOnly }))
                }
              >
                <span className="text-xs font-semibold text-zinc-800">Offers & Discounts Only</span>
                <input
                  type="checkbox"
                  checked={filterOptions.offersOnly}
                  onChange={() => { }}
                  className="accent-blue-600 w-4 h-4 rounded"
                />
              </label>
            </div>
          </div>

          {/* Cuisines */}
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Cuisines</h4>
            <div className="flex flex-wrap gap-2">
              {CUISINE_LIST.map((cuisine) => {
                const isSelected = filterOptions.cuisines.includes(cuisine);
                return (
                  <button
                    key={cuisine}
                    onClick={() => handleCuisineToggle(cuisine)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${isSelected
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                      }`}
                  >
                    {cuisine}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-white flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-xl transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
