'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, X, Plus, Minus, Check, Sparkles, Clock, Flame } from 'lucide-react';
import { RESTAURANT_MENU_CATEGORIES } from '@/lib/data';

export const FoodSearchView: React.FC = () => {
  const {
    restaurantMenu,
    restaurantProfile,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    cart,
    addToCart,
    updateCartQuantity,
    setCustomizingItem,
    navigateTo,
  } = useApp();

  const [vegOnly, setVegOnly] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const query = searchQuery.trim().toLowerCase();

  const matchingDishes = useMemo(() => {
    return restaurantMenu.filter((item) => {
      if (vegOnly && item.vegType !== 'veg') return false;
      if (selectedCat !== 'All' && item.category !== selectedCat) return false;
      if (!query) return true;

      const matchName = item.name.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchCat = item.category.toLowerCase().includes(query);
      return matchName || matchDesc || matchCat;
    });
  }, [restaurantMenu, query, vegOnly, selectedCat]);

  const handleSearchTerm = (term: string) => {
    setSearchQuery(term);
    addRecentSearch(term);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const getCartItemQty = (itemId: string) => {
    const itemInCart = cart.find((c) => c.menuItemId === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  const getCartItemId = (itemId: string) => {
    const itemInCart = cart.find((c) => c.menuItemId === itemId);
    return itemInCart ? itemInCart.id : null;
  };

  return (
    <div className="pb-28 w-full space-y-6">
      {/* Search Input Bar */}
      <div className="sticky top-16 md:top-18 z-20 bg-[#FAF9F5]/95 backdrop-blur-md pt-2 pb-4 border-b border-[#E8E5DD]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#7D7872] absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${restaurantProfile.name} menu (e.g. Biryani, Paneer, Naan)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full text-xs font-medium py-3 pl-10 pr-10 rounded-lg border border-[#E8E5DD] focus:border-[#D94814] bg-white focus:outline-none shadow-xs text-[#1A1816] placeholder:text-[#9E988F]"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="w-6 h-6 rounded text-[#7D7872] hover:text-[#1A1816] absolute right-3 top-2.5 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-1 rounded-md text-xs font-medium border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              vegOnly
                ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D] font-bold'
                : 'border-[#E8E5DD] text-[#47433F] bg-white'
            }`}
          >
            <div className="w-3 h-3 border border-[#15803D] rounded-[2px] flex items-center justify-center bg-white">
              <div className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            </div>
            <span>Pure Veg</span>
          </button>

          {['All', ...RESTAURANT_MENU_CATEGORIES.filter((c) => c !== 'All Items')].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(selectedCat === c ? 'All' : c)}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition-all shrink-0 cursor-pointer ${
                selectedCat === c
                  ? 'bg-[#1A1816] border-[#1A1816] text-white font-bold'
                  : 'bg-white border-[#E8E5DD] text-[#47433F] hover:bg-[#F4F2EC]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested keywords when no search active */}
      {!searchQuery && (
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7D7872]">
            Popular Dishes
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleSearchTerm(term)}
                className="px-3 py-1.5 bg-white border border-[#E8E5DD] text-[#47433F] hover:text-[#D94814] hover:border-[#F7D0BC] rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-[#7D7872]">
          Found <span className="text-[#1A1816] font-bold">{matchingDishes.length}</span> dishes
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchingDishes.map((item) => {
            const qtyInCart = getCartItemQty(item.id);
            const cartItemId = getCartItemId(item.id);
            const isItemAvailable = item.isAvailable !== false;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 sm:p-5 border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between ${
                  !isItemAvailable ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center p-[2px] ${
                          item.vegType === 'veg'
                            ? 'border-[#15803D]'
                            : item.vegType === 'egg'
                            ? 'border-[#D97706]'
                            : 'border-[#B91C1C]'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.vegType === 'veg'
                              ? 'bg-[#15803D]'
                              : item.vegType === 'egg'
                              ? 'bg-[#D97706]'
                              : 'bg-[#B91C1C]'
                          }`}
                        />
                      </div>
                      {item.isBestseller && (
                        <span className="text-[9px] font-bold bg-[#FCF7EC] text-[#8A6A1E] px-1.5 py-0.5 rounded border border-[#F2E5C8]">
                          Chef Special ⭐
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => navigateTo('item-detail', { itemId: item.id })}
                      className="font-serif text-base font-bold text-[#1A1816] leading-snug cursor-pointer hover:text-[#D94814]"
                    >
                      {item.name}
                    </h3>
                    <div className="text-sm font-bold text-[#1A1816] mt-1">₹{item.price}</div>
                    <p className="text-xs text-[#47433F] mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#F4F2EC] border border-[#E8E5DD]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="mt-2 w-full">
                      {!isItemAvailable ? (
                        <button
                          disabled
                          className="w-full py-1.5 px-2 rounded-md bg-[#F4F2EC] text-[#9E988F] font-bold text-xs cursor-not-allowed text-center"
                        >
                          Sold Out
                        </button>
                      ) : qtyInCart === 0 ? (
                        <button
                          onClick={() => {
                            if (item.customizationGroups && item.customizationGroups.length > 0) {
                              setCustomizingItem(item);
                            } else {
                              addToCart(item, 1);
                            }
                          }}
                          className="w-full py-1.5 px-3 rounded-md bg-white hover:bg-[#FDF2EB] text-[#D94814] border border-[#D94814]/40 font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>ADD</span>
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      ) : (
                        <div className="flex items-center justify-between w-full bg-[#D94814] text-white rounded-md font-bold text-xs px-2 py-1">
                          <button
                            onClick={() => {
                              if (cartItemId) updateCartQuantity(cartItemId, qtyInCart - 1);
                            }}
                            className="p-0.5 hover:bg-[#C03E0F] rounded cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-1 text-xs font-bold">{qtyInCart}</span>
                          <button
                            onClick={() => {
                              if (cartItemId) updateCartQuantity(cartItemId, qtyInCart + 1);
                            }}
                            className="p-0.5 hover:bg-[#C03E0F] rounded cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
