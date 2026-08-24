'use client';

import React, { useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export const CategoryCarousel: React.FC = () => {
  const { navigateTo, selectedCategory, setSelectedCategory, filterOptions, setFilterOptions } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (category: typeof CATEGORIES[0]) => {
    setSelectedCategory(category.name);
    // Add to filter cuisines
    setFilterOptions((prev) => ({
      ...prev,
      cuisines: [category.cuisineMatch],
    }));
    navigateTo('restaurants', { category: category.name });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            Inspiration for your first order
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">Explore authentic regional & global cuisines</p>
        </div>

        {/* Scroll Buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center shadow-xs transition-colors"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center shadow-xs transition-colors"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center shrink-0 group focus:outline-hidden"
            >
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-0.5 transition-all duration-300 ${
                  isSelected
                    ? 'ring-3 ring-orange-600 scale-105 shadow-md'
                    : 'ring-1 ring-zinc-200 group-hover:ring-2 group-hover:ring-orange-400 group-hover:scale-105 shadow-xs'
                }`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover rounded-full"
                  sizes="100px"
                  referrerPolicy="no-referrer"
                />
                {cat.badge && (
                  <span className="absolute bottom-0 inset-x-0 bg-orange-600/90 text-white text-[9px] font-black uppercase text-center py-0.5">
                    {cat.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-xs mt-2 transition-colors text-center whitespace-nowrap ${
                  isSelected
                    ? 'font-extrabold text-orange-600'
                    : 'font-semibold text-zinc-700 group-hover:text-orange-600'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
