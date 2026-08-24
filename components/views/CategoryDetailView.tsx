'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Flame,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { MenuItem, VegType } from '@/lib/types';

const CATEGORY_ICONS: Record<string, string> = {
  Coffee: '☕',
  Tea: '🍵',
  Burger: '🍔',
  Sandwich: '🥪',
  Pizzas: '🍕',
  Momo: '🥟',
  'Noodles / Combos': '🍜',
  'Small Bites': '🍢',
  'Mutton Magic on Your Plate': '🍖',
  Soup: '🥣',
  'Shake / Coolers': '🍹',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Coffee: 'Rich freshly brewed hot espressos, velvety lattes & refreshing chilled cold coffees.',
  Tea: 'Artisan handcrafted milk teas, herbal infusions and comforting ginger elachi chai.',
  Burger: 'Gourmet handcrafted burgers with crisp patties, melted cheese and toasted brioche buns.',
  Sandwich: 'Layered toasted deli sandwiches with fresh toppings, melted cheese & house sauces.',
  Pizzas: 'Stone-crust oven-baked pizzas loaded with melted mozzarella and fresh toppings.',
  Momo: 'Steamed, fried & pan-tossed Himalayan dumplings served with spicy garlic dip.',
  'Noodles / Combos': 'Wok-tossed Hakka noodles, fried rice bowls & hearty meal combos.',
  'Small Bites': 'Crispy snacks, quick bites, fries and finger foods made for everyday adda.',
  'Mutton Magic on Your Plate': 'Tender slow-simmered rich mutton specialties and royal delicacies.',
  Soup: 'Hot, soothing broths and hearty comforting bowls freshly prepared.',
  'Shake / Coolers': 'Thick artisanal milkshakes, fruit smoothies and iced thirst-quenching coolers.',
};

export const CategoryDetailView: React.FC = () => {
  const {
    restaurantProfile,
    restaurantMenu,
    selectedCategory,
    setSelectedCategory,
    navigateTo,
    cart,
    addToCart,
    updateCartQuantity,
    cartItemCount,
    grandTotal,
  } = useApp();

  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg' | 'spicy' | 'rating'>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  const currentCategory = selectedCategory || 'Coffee';
  const categoryIcon = CATEGORY_ICONS[currentCategory] || '🍽️';
  const categoryDesc =
    CATEGORY_DESCRIPTIONS[currentCategory] ||
    `Explore our delicious collection of handcrafted ${currentCategory.toLowerCase()} prepared fresh upon order.`;

  // Filter and sort items
  const items = useMemo(() => {
    let list = restaurantMenu.filter((item) => item.category === currentCategory);

    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }

    if (dietFilter === 'veg') list = list.filter((i) => i.vegType === 'veg');
    if (dietFilter === 'non-veg') list = list.filter((i) => i.vegType === 'non-veg');
    if (dietFilter === 'spicy') list = list.filter((i) => (i.spiceLevel || 0) >= 2 || i.isSpicy);
    if (dietFilter === 'rating') list = list.filter((i) => (i.rating || 0) >= 4.8);

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [restaurantMenu, currentCategory, localSearch, dietFilter, sortBy]);

  const allCategories = useMemo(() => {
    return Array.from(new Set(restaurantMenu.map((i) => i.category)));
  }, [restaurantMenu]);

  const getCartItemQty = (itemId: string) => {
    const itemInCart = cart.find((c) => c.menuItemId === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  const getCartItemId = (itemId: string) => {
    const itemInCart = cart.find((c) => c.menuItemId === itemId);
    return itemInCart ? itemInCart.id : null;
  };

  return (
    <div className="space-y-6 py-2 max-w-[1440px] mx-auto animate-fade-in pb-12">
      {/* Back to Home Breadcrumb & Quick Jump Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFFDF9] hover:bg-[#FBE4CB] border border-[#E9C5A7] text-xs font-black text-[#3D1020] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[#7C203A]" />
          <span>Back to All Categories</span>
        </button>

        {/* Floating Quick Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer border ${
                cat === currentCategory
                  ? 'bg-[#7C203A] text-white border-[#7C203A] shadow-xs'
                  : 'bg-[#FFFDF9] text-[#684332] border-[#E9C5A7] hover:bg-[#FFF4E8]'
              }`}
            >
              <span>{CATEGORY_ICONS[cat] || '🍽️'}</span> {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Category Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#3D1020] via-[#5D162C] to-[#3D1020] text-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#6A2940] shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBE4CB]/20 border border-[#FBE4CB]/30 text-[#F8D6B2] text-xs font-black uppercase tracking-wider">
            <span>{categoryIcon}</span>
            <span>Category Collection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            {currentCategory}
          </h1>
          <p className="text-xs sm:text-sm text-[#F8D6B2] leading-relaxed max-w-xl">
            {categoryDesc}
          </p>
          <div className="pt-2 text-xs font-bold text-white/80">
            Showing <strong className="text-white font-black">{items.length} dishes</strong> available for order
          </div>
        </div>

        {/* Prominent Cart Quick View */}
        {cartItemCount > 0 && (
          <button
            onClick={() => navigateTo('cart')}
            className="bg-[#FFFDF9] hover:bg-[#FBE4CB] text-[#3D1020] px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-3 shadow-lg border border-[#E9C5A7] transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-5 h-5 text-[#7C203A]" />
            <div className="text-left">
              <span className="block text-xs font-extrabold text-[#7C203A]">View Cart</span>
              <span className="text-sm font-black text-[#3D1020]">
                {cartItemCount} items · ₹{grandTotal}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#FFFDF9] rounded-2xl p-3.5 sm:p-4 border border-[#E9C5A7] shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search inside category */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-[#947362] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={`Search within ${currentCategory}...`}
            className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A]"
          />
        </div>

        {/* Diet pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDietFilter('all')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
              dietFilter === 'all'
                ? 'bg-[#3D1020] text-white border-[#3D1020]'
                : 'bg-white border-[#E9C5A7] text-[#684332] hover:bg-[#FFF4E8]'
            }`}
          >
            All ({restaurantMenu.filter((i) => i.category === currentCategory).length})
          </button>

          <button
            onClick={() => setDietFilter(dietFilter === 'veg' ? 'all' : 'veg')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              dietFilter === 'veg'
                ? 'bg-[#15803D] text-white border-[#15803D]'
                : 'bg-white border-[#E9C5A7] text-[#15803D] hover:bg-[#F0FDF4]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Pure Veg</span>
          </button>

          <button
            onClick={() => setDietFilter(dietFilter === 'non-veg' ? 'all' : 'non-veg')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              dietFilter === 'non-veg'
                ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
                : 'bg-white border-[#E9C5A7] text-[#B91C1C] hover:bg-[#FEF2F2]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />
            <span>Non-Veg</span>
          </button>

          <button
            onClick={() => setDietFilter(dietFilter === 'spicy' ? 'all' : 'spicy')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              dietFilter === 'spicy'
                ? 'bg-[#C2410C] text-white border-[#C2410C]'
                : 'bg-white border-[#E9C5A7] text-[#C2410C] hover:bg-[#FFF7ED]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Spicy</span>
          </button>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-[#E9C5A7] bg-white text-xs font-bold text-[#3D1020] focus:outline-none cursor-pointer"
          >
            <option value="popular">⭐ Sort by: Popular</option>
            <option value="price-low">💵 Price: Low to High</option>
            <option value="price-high">💎 Price: High to Low</option>
            <option value="rating">★ Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Dishes Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => {
            const qty = getCartItemQty(item.id);
            const cartItemId = getCartItemId(item.id);

            return (
              <div
                key={item.id}
                className="bg-[#FFFDF9] rounded-2xl border border-[#E9C5A7] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Food Image */}
                  <div
                    onClick={() => navigateTo('item-detail', { itemId: item.id })}
                    className="relative h-44 sm:h-48 w-full bg-[#FFF4E8] cursor-pointer overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span
                        className={`w-4 h-4 rounded-[3px] border bg-white flex items-center justify-center p-[2px] shadow-xs ${
                          item.vegType === 'veg' ? 'border-[#15803D]' : 'border-[#B91C1C]'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.vegType === 'veg' ? 'bg-[#15803D]' : 'bg-[#B91C1C]'
                          }`}
                        />
                      </span>

                      {item.isBestseller && (
                        <span className="bg-[#3D1020]/90 backdrop-blur-xs text-[#F8D6B2] text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#FBBF24]" />
                          <span>Bestseller</span>
                        </span>
                      )}
                    </div>

                    {item.rating && (
                      <div className="absolute top-2.5 right-2.5 bg-[#3D1020]/90 backdrop-blur-xs text-white text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-[#FBBF24] text-[#FBBF24]" />
                        <span>{item.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Food Information */}
                  <div className="p-4 space-y-2">
                    <h3
                      onClick={() => navigateTo('item-detail', { itemId: item.id })}
                      className="font-serif text-base font-black text-[#3D1020] leading-snug cursor-pointer hover:text-[#7C203A] transition-colors line-clamp-1"
                      title={item.name}
                    >
                      {item.name}
                    </h3>

                    <p className="text-xs text-[#684332] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-[11px] text-[#947362] flex items-center gap-2 pt-1">
                      <Clock className="w-3.5 h-3.5 text-[#7C203A]" />
                      <span>{item.preparationTime || '15–20 mins'}</span>
                      <span>•</span>
                      <span>{item.portionSize || 'Serves 1'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Pricing & ADD CTA */}
                <div className="p-4 pt-3 border-t border-[#F3DCC5] mt-auto flex items-center justify-between gap-3 bg-[#FFFDF9]">
                  <div className="flex items-baseline gap-1.5 flex-1 min-w-0">
                    <span className="text-base font-black text-[#3D1020]">₹{item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-[#947362] line-through font-normal">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="w-24 shrink-0">
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="w-full py-2 bg-white hover:bg-[#FBE4CB] text-[#7C203A] border-2 border-[#7C203A] rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95 text-center flex items-center justify-center"
                      >
                        ADD +
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-[#7C203A] text-white font-black text-xs py-1.5 px-2.5 rounded-xl shadow-xs">
                        <button
                          onClick={() => cartItemId && updateCartQuantity(cartItemId, qty - 1)}
                          className="px-1 hover:text-[#F8D6B2] cursor-pointer"
                        >
                          -
                        </button>
                        <span>{qty}</span>
                        <button
                          onClick={() => cartItemId && updateCartQuantity(cartItemId, qty + 1)}
                          className="px-1 hover:text-[#F8D6B2] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FFFDF9] rounded-3xl p-12 text-center border border-[#E9C5A7] space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FBE4CB] text-[#7C203A] flex items-center justify-center mx-auto text-2xl">
            {categoryIcon}
          </div>
          <h3 className="font-serif text-lg font-black text-[#3D1020]">No dishes match your filter</h3>
          <p className="text-xs text-[#947362] max-w-sm mx-auto">
            Try resetting your dietary filter or search query to view all items in {currentCategory}.
          </p>
          <button
            onClick={() => {
              setDietFilter('all');
              setLocalSearch('');
            }}
            className="px-5 py-2 bg-[#7C203A] text-white rounded-xl text-xs font-black cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
