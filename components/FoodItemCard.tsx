'use client';

import React from 'react';
import { MenuItem } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { VegBadge } from '@/components/ui/VegBadge';
import { Star, Plus, Minus, Flame, Sparkles, Clock } from 'lucide-react';
import Image from 'next/image';

interface FoodItemCardProps {
  item: MenuItem;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item }) => {
  const { cart, addToCart, updateCartQuantity, setCustomizingItem } = useApp();

  const cartInstances = cart.filter((c) => c.menuItemId === item.id);
  const totalQuantity = cartInstances.reduce((sum, c) => sum + c.quantity, 0);

  const handleAddClick = () => {
    if (item.customizationGroups && item.customizationGroups.length > 0) {
      setCustomizingItem(item);
    } else {
      addToCart(item, 1);
    }
  };

  const handleIncrement = () => {
    if (item.customizationGroups && item.customizationGroups.length > 0) {
      setCustomizingItem(item);
    } else if (cartInstances.length > 0) {
      updateCartQuantity(cartInstances[0].id, cartInstances[0].quantity + 1);
    } else {
      addToCart(item, 1);
    }
  };

  const handleDecrement = () => {
    if (cartInstances.length > 0) {
      const target = cartInstances[cartInstances.length - 1];
      updateCartQuantity(target.id, target.quantity - 1);
    }
  };

  return (
    <div
      id={`food-item-${item.id}`}
      className="p-4 sm:p-5 rounded-xl bg-white border border-[#E8E5DD] hover:border-[#D8D4CA] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all flex items-start justify-between gap-4"
    >
      {/* Left Details */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <VegBadge type={item.vegType} showLabel />

          {item.isBestseller && (
            <span className="inline-flex items-center gap-1 bg-[#FCF7EC] text-[#8A6A1E] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#F2E5C8] uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 text-[#C59A3F]" /> Chef Special
            </span>
          )}

          {item.isSpicy && (
            <span className="inline-flex items-center gap-1 bg-[#FFF7ED] text-[#C2410C] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#FFEDD5]">
              <Flame className="w-2.5 h-2.5 text-[#C2410C]" /> Spicy
            </span>
          )}
        </div>

        <h4 className="font-serif text-base font-bold text-[#1A1816] leading-snug">
          {item.name}
        </h4>

        <div className="flex items-center gap-2.5 my-1">
          <span className="text-base font-bold text-[#1A1816]">
            ₹{item.price}
          </span>
          {item.originalPrice && (
            <span className="text-xs text-[#9E988F] line-through font-normal">
              ₹{item.originalPrice}
            </span>
          )}
          {item.rating > 0 && (
            <span className="text-[10px] font-bold text-[#8A6A1E] bg-[#FCF7EC] px-1.5 py-0.2 rounded border border-[#F2E5C8] flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-current text-[#C59A3F]" /> {item.rating}
            </span>
          )}
        </div>

        <p className="text-xs text-[#47433F] font-normal leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {item.customizationGroups && item.customizationGroups.length > 0 && (
          <span className="inline-block text-[10px] font-bold text-[#E05315] mt-1.5">
            Customisable
          </span>
        )}
      </div>

      {/* Right Image & Floating Stepper */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="relative w-28 sm:w-32 h-24 sm:h-28 rounded-xl overflow-hidden bg-[#F4F2EC] border border-[#E8E5DD] shadow-xs">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 140px"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Floating Stepper */}
        <div className="relative -mt-3.5 w-24 sm:w-28 shadow-md rounded-lg bg-white border border-[#E8E5DD] overflow-hidden">
          {totalQuantity === 0 ? (
            <button
              onClick={handleAddClick}
              className="w-full py-1.5 px-2 text-xs font-bold text-[#E05315] hover:bg-[#FDF2EB] active:scale-95 transition-all uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#E05315] text-white px-1.5 py-1">
              <button
                onClick={handleDecrement}
                className="w-5 h-5 rounded hover:bg-[#C8450D] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3 stroke-[2.5]" />
              </button>
              <span className="text-xs font-bold">{totalQuantity}</span>
              <button
                onClick={handleIncrement}
                className="w-5 h-5 rounded hover:bg-[#C8450D] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
