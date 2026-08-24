'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  Star,
  Clock,
  Flame,
  Plus,
  Minus,
  Check,
  Share2,
  Heart,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Info,
  UtensilsCrossed,
} from 'lucide-react';
import { CartItemCustomization, FoodCustomizationOption } from '@/lib/types';

export const ItemDetailView: React.FC = () => {
  const {
    selectedItem,
    restaurantProfile,
    restaurantMenu,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    cartItemCount,
    grandTotal,
    navigateTo,
    showToast,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, FoodCustomizationOption[]>>({});
  const [isFavorite, setIsFavorite] = useState(false);

  // If no item is selected, fallback to home or first item
  const item = selectedItem || restaurantMenu[0];

  if (!item) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-[#E3DFD5] p-6 max-w-lg mx-auto">
        <h2 className="text-base font-bold text-[#1A1816]">Item Not Found</h2>
        <p className="text-xs text-[#7D7872] mt-1 mb-4">The dish you requested could not be found.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-[#E05315] text-white rounded-lg text-xs font-bold"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const inCart = cart.find((c) => c.menuItemId === item.id);
  const cartQty = inCart ? inCart.quantity : 0;

  // Pairing recommendations (other items in menu)
  const pairedItems = restaurantMenu
    .filter((i) => i.id !== item.id && (i.category === 'Dum Biryani & Rice 🍚' || i.category === 'Beverages & Shakes 🥤' || i.category === 'Starters & Kebabs 🍢'))
    .slice(0, 3);

  const handleCustomizationChange = (
    groupId: string,
    groupTitle: string,
    option: FoodCustomizationOption,
    type: 'radio' | 'checkbox'
  ) => {
    setSelectedCustomizations((prev) => {
      const current = prev[groupId] || [];
      if (type === 'radio') {
        return { ...prev, [groupId]: [option] };
      } else {
        const exists = current.some((o) => o.id === option.id);
        if (exists) {
          return { ...prev, [groupId]: current.filter((o) => o.id !== option.id) };
        } else {
          return { ...prev, [groupId]: [...current, option] };
        }
      }
    });
  };

  const handleAddToCart = () => {
    const customizations: CartItemCustomization[] = Object.entries(selectedCustomizations)
      .filter(([_, options]) => options.length > 0)
      .map(([groupId, options]) => {
        const group = item.customizationGroups?.find((g) => g.id === groupId);
        return {
          groupId,
          groupTitle: group?.title || '',
          selectedOptions: options,
        };
      });

    addToCart(item, quantity, customizations, specialInstructions);
    showToast(`Added ${quantity}x ${item.name} to Cart! 🛒`, undefined, 'success');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: item.name,
          text: `Check out ${item.name} at ${restaurantProfile.name}!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      showToast('Item Link Copied! 📋', undefined, 'success');
    }
  };

  // Calculate customized total price
  const extraPrice = Object.values(selectedCustomizations)
    .flat()
    .reduce((sum, opt) => sum + (opt.price || 0), 0);
  const finalUnitPrice = item.price + extraPrice;
  const totalPrice = finalUnitPrice * quantity;

  return (
    <div className="pb-28 w-full space-y-6">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A1816] hover:text-[#E05315] bg-white px-3 py-1.5 rounded-lg border border-[#E3DFD5] shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFavorite(!isFavorite);
              showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites ❤️', undefined, 'info');
            }}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-[#E3DFD5] text-[#47433F] hover:bg-[#FAF9F5]'
            }`}
            title="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white border border-[#E3DFD5] text-[#47433F] hover:bg-[#FAF9F5] transition-all cursor-pointer"
            title="Share Dish"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Large Photo & Details, Right Customizations & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 cols): Dish Imagery & Story */}
        <div className="lg:col-span-7 space-y-5">
          {/* Big Photography Card */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#E3DFD5] shadow-xs relative">
            <div className="relative h-72 sm:h-96 w-full bg-[#F4F2EC]">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <div
                  className={`w-5 h-5 rounded-[3px] border flex items-center justify-center p-[2px] bg-white shadow-xs ${
                    item.vegType === 'veg' ? 'border-[#15803D]' : 'border-[#B91C1C]'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.vegType === 'veg' ? 'bg-[#15803D]' : 'bg-[#B91C1C]'
                    }`}
                  />
                </div>

                {item.isBestseller && (
                  <span className="bg-[#111110] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FBBF24]" />
                    <span>CHEF SPECIAL</span>
                  </span>
                )}

                {item.isSpicy && (
                  <span className="bg-[#C2410C] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>SPICY</span>
                  </span>
                )}
              </div>

              {/* Bottom Image Overlay Details */}
              <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#FBBF24] block">
                    {item.category}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                    {item.name}
                  </h1>
                </div>

                <div className="bg-white/90 backdrop-blur-xs text-[#1A1816] px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  <span>{item.rating || '4.9'}</span>
                  <span className="text-[10px] text-[#7D7872]">({item.ratingCount || '350+'})</span>
                </div>
              </div>
            </div>

            {/* Dish Description & Quick Specs */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-[#7D7872] uppercase tracking-wider mb-1">
                  About this dish
                </h3>
                <p className="text-xs sm:text-sm text-[#47433F] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Highlights Pill Row */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#F0EDE5] text-center">
                <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E3DFD5]">
                  <Clock className="w-4 h-4 text-[#E05315] mx-auto mb-1" />
                  <span className="text-[10px] text-[#7D7872] block">Prep Time</span>
                  <span className="text-xs font-bold text-[#1A1816]">
                    {item.preparationTime || '20–25 min'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E3DFD5]">
                  <UtensilsCrossed className="w-4 h-4 text-[#8A6A1E] mx-auto mb-1" />
                  <span className="text-[10px] text-[#7D7872] block">Portion Size</span>
                  <span className="text-xs font-bold text-[#1A1816]">
                    {item.portionSize || 'Serves 1–2'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E3DFD5]">
                  <ShieldCheck className="w-4 h-4 text-[#15803D] mx-auto mb-1" />
                  <span className="text-[10px] text-[#7D7872] block">Kitchen Prep</span>
                  <span className="text-xs font-bold text-[#1A1816]">100% Charcoal Fresh</span>
                </div>
              </div>

            </div>
          </div>

          {/* Perfect Pairings Section */}
          {pairedItems.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#E3DFD5] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#1A1816] flex items-center gap-1.5">
                  <span>🍽️ Pairs Well With</span>
                </h3>
                <span className="text-[11px] text-[#7D7872]">Customer recommendations</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pairedItems.map((pair) => (
                  <div
                    key={pair.id}
                    className="p-2.5 rounded-xl border border-[#E3DFD5] bg-[#FAF9F5] hover:bg-white transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img src={pair.image} alt={pair.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#1A1816] truncate">{pair.name}</h4>
                        <span className="text-xs font-black text-[#E05315]">₹{pair.price}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(pair, 1);
                        showToast(`Added ${pair.name} to Cart! 🛒`, undefined, 'success');
                      }}
                      className="w-full py-1 bg-white hover:bg-[#FDF2EB] text-[#E05315] border border-[#E05315] rounded-md font-bold text-[10px] uppercase transition-colors cursor-pointer"
                    >
                      + Add Pair
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (5 cols): Customizations & Order Checkout Box */}
        <div className="lg:col-span-5 space-y-5 sticky top-20">
          
          <div className="bg-white rounded-2xl p-5 border border-[#E3DFD5] shadow-xs space-y-4">
            
            {/* Price & Quantity Selection */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE5]">
              <div>
                <span className="text-[10px] text-[#7D7872] uppercase font-bold tracking-wider block">
                  Price per portion
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#1A1816]">₹{finalUnitPrice}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-[#9E988F] line-through">₹{item.originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#E3DFD5] rounded-lg bg-[#FAF9F5] p-1 font-bold text-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center hover:bg-white rounded cursor-pointer text-[#47433F]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm text-[#1A1816]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-white rounded cursor-pointer text-[#47433F]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Customization Options (if any) */}
            {item.customizationGroups && item.customizationGroups.length > 0 && (
              <div className="space-y-4 pt-1">
                <h4 className="text-xs font-bold text-[#1A1816] uppercase tracking-wider">
                  Customise your preparation
                </h4>

                {item.customizationGroups.map((group) => (
                  <div key={group.id} className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E3DFD5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A1816]">{group.title}</span>
                      <span className="text-[10px] text-[#7D7872]">
                        {group.type === 'radio' ? 'Select 1 option' : 'Optional'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {group.options.map((option) => {
                        const isSelected = (selectedCustomizations[group.id] || []).some(
                          (o) => o.id === option.id
                        );

                        return (
                          <label
                            key={option.id}
                            className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#FDF2EB] border-[#E05315] font-bold text-[#1A1816]'
                                : 'bg-white border-[#E3DFD5] text-[#47433F] hover:border-[#CCC]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type={group.type}
                                name={group.id}
                                checked={isSelected}
                                onChange={() =>
                                  handleCustomizationChange(group.id, group.title, option, group.type)
                                }
                                className="accent-[#E05315]"
                              />
                              <span>{option.name}</span>
                            </div>
                            {option.price > 0 && (
                              <span className="text-xs font-semibold text-[#E05315]">+₹{option.price}</span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cooking Notes Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A1816] block">
                Special Kitchen Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Less spicy, extra onions, packing instructions..."
                rows={2}
                className="w-full p-2.5 bg-[#FAF9F5] border border-[#E3DFD5] rounded-xl text-xs text-[#1A1816] placeholder:text-[#9E988F] focus:outline-none focus:border-[#E05315]"
              />
            </div>

            {/* Total Price & Add to Cart Button */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-[#E05315] hover:bg-[#C8450D] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-between px-4 cursor-pointer active:scale-98"
              >
                <span>Add to Plate ({quantity} item{quantity > 1 ? 's' : ''})</span>
                <span className="font-extrabold text-sm">₹{totalPrice}</span>
              </button>

              {cartItemCount > 0 && (
                <button
                  onClick={() => navigateTo('cart')}
                  className="w-full py-2.5 bg-[#111110] hover:bg-[#222] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>View Cart ({cartItemCount} items • ₹{grandTotal})</span>
                </button>
              )}
            </div>

          </div>

          {/* Guarantee Box */}
          <div className="bg-[#FAF9F5] rounded-xl p-3.5 border border-[#E3DFD5] flex items-start gap-2.5 text-xs text-[#7D7872]">
            <Info className="w-4 h-4 text-[#8A6A1E] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Every dish at <strong className="text-[#1A1816]">{restaurantProfile.name}</strong> is freshly made to order. Cooked in traditional clay handis with pure spices.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
