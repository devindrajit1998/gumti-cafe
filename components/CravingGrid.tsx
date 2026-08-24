'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CRAVINGS } from '@/lib/data';
import Image from 'next/image';

export const CravingGrid: React.FC = () => {
  const { navigateTo, setFilterOptions } = useApp();

  const handleCravingClick = (craving: typeof CRAVINGS[0]) => {
    setFilterOptions((prev) => ({
      ...prev,
      cuisines: [craving.cuisine],
    }));
    navigateTo('restaurants', { category: craving.cuisine, query: craving.name });
  };

  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
          What are you craving today?
        </h2>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          Hand-picked delicacies trending in your neighborhood right now
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {CRAVINGS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleCravingClick(item)}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-zinc-200/80 bg-zinc-900 text-white h-36 sm:h-44 text-left transition-all duration-300 transform hover:-translate-y-1 focus:outline-hidden"
          >
            {/* Background food image */}
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
              sizes="(max-width: 768px) 50vw, 25vw"
              referrerPolicy="no-referrer"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight drop-shadow-xs group-hover:text-orange-300 transition-colors">
                {item.name}
              </h3>
              <p className="text-[11px] text-zinc-300 font-medium mt-0.5">
                {item.count}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
