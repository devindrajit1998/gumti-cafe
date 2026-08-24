'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Heart, Plus, ArrowRight, UtensilsCrossed, Sparkles } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { restaurantMenu, restaurantProfile, addToCart, cart, updateCartQuantity, navigateTo } = useApp();

  // Bestsellers and chef specials
  const recommendedDishes = restaurantMenu.filter((item) => item.isBestseller || (item.rating && item.rating >= 4.8));

  return (
    <div className="pb-28 w-full space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>Chef Highlights &amp; Customer Favorites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
            Top Rated Delicacies
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            The most loved and frequently ordered dishes from {restaurantProfile.name}.
          </p>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          View Full Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedDishes.map((item) => {
          const inCart = cart.find((c) => c.id === item.id);
          const isAvailable = item.isAvailable !== false;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-2xs hover:shadow-md transition-all flex gap-3.5 justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.vegType === 'veg'
                        ? 'bg-emerald-500'
                        : item.vegType === 'egg'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-[11px] font-bold text-zinc-500">{item.category}</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-1.5 py-0.5 rounded">
                    ⭐ {item.rating || 4.9}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-zinc-900 leading-snug">{item.name}</h4>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-black text-zinc-900">₹{item.price}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-zinc-400 line-through">₹{item.originalPrice}</span>
                  )}
                  <span className="text-[10px] text-zinc-500">• {item.portionSize || 'Serves 1-2'}</span>
                </div>
              </div>

              <div className="w-24 shrink-0 flex flex-col items-center justify-between">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-zinc-100"
                />

                {isAvailable ? (
                  inCart ? (
                    <div className="flex items-center bg-orange-600 text-white rounded-xl px-2 py-1 text-xs font-bold mt-2 shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(inCart.id, inCart.quantity - 1)}
                        className="px-1 hover:text-orange-200"
                      >
                        -
                      </button>
                      <span className="px-2">{inCart.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(inCart.id, inCart.quantity + 1)}
                        className="px-1 hover:text-orange-200"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="mt-2 w-full py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD</span>
                    </button>
                  )
                ) : (
                  <span className="text-[10px] font-bold text-zinc-400 mt-2">Sold Out</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
