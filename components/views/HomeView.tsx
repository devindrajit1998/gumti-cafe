'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  Phone,
  MessageCircle,
  Flame,
  Star,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  ChevronLeft,
  ChevronDown,
  X,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { generateWhatsAppUrl } from '@/lib/whatsapp';

const CATEGORY_IMAGES: Record<string, string> = {
  Coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=300&auto=format&fit=crop',
  Tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=300&auto=format&fit=crop',
  Burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop',
  Sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=300&auto=format&fit=crop',
  Pizzas: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop',
  Momo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=300&auto=format&fit=crop',
  'Noodles / Combos': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=300&auto=format&fit=crop',
  'Small Bites': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=300&auto=format&fit=crop',
  'Mutton Magic on Your Plate': 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300&auto=format&fit=crop',
  Soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=300&auto=format&fit=crop',
  'Shake / Coolers': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=300&auto=format&fit=crop',
};
const CATEGORY_ICONS: Record<string, string> = { Coffee: '☕', Tea: '🍵', Burger: '🍔', Sandwich: '🥪', Pizzas: '🍕', Momo: '🥟', 'Noodles / Combos': '🍜', 'Small Bites': '🍢', 'Mutton Magic on Your Plate': '🍖', Soup: '🥣', 'Shake / Coolers': '🍹' };


export const HomeView: React.FC = () => {
  const {
    restaurantProfile,
    restaurantMenu,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    cartItemCount,
    itemTotal,
    deliveryFee,
    taxes,
    discountAmount,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setCustomizingItem,
    showToast,
  } = useApp();

  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg' | 'spicy' | 'rating'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const categorySliderRef = useRef<HTMLDivElement>(null);
  const seededDefaultsRef = useRef(false);

  // Collapse all menu categories by default except the first one (seeded once menu data loads).
  // Keeps the page short; users can still expand individual categories or use Collapse/Expand All.
  useEffect(() => {
    if (restaurantMenu.length === 0 || seededDefaultsRef.current) return;
    seededDefaultsRef.current = true;
    const cats = Array.from(new Set(restaurantMenu.map((item) => item.category)));
    const defaults: Record<string, boolean> = {};
    cats.forEach((cat, idx) => {
      defaults[cat] = idx !== 0; // collapse every category except the first
    });
    setCollapsedCategories(defaults);
  }, [restaurantMenu]);

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    groupedSections.forEach((s) => {
      allCollapsed[s.category] = true;
    });
    setCollapsedCategories(allCollapsed);
  };

  const expandAll = () => {
    setCollapsedCategories({});
  };

  // Data-driven hero slides: real brand info + actual menu categories (never advertises dishes that don't exist)
  const heroSlides = useMemo(() => {
    const avgRating = restaurantMenu.length
      ? (restaurantMenu.reduce((sum, i) => sum + (i.rating || 0), 0) / restaurantMenu.length).toFixed(1)
      : '4.7';
    const avgPrice = restaurantMenu.length
      ? restaurantMenu.reduce((sum, i) => sum + i.price, 0) / restaurantMenu.length
      : 150;
    const costForTwo = `₹${Math.max(200, Math.round((avgPrice * 2) / 10) * 10)} for two`;

    const brandSlide = {
      id: 'brand',
      tag: `★★★★★ ${avgRating} · ${restaurantMenu.length || '50'}+ ITEMS`,
      cuisineTag: 'Coffee, chai & comfort food',
      title: restaurantProfile.name,
      subtitle: restaurantProfile.tagline || 'Good food. Good adda.',
      description: `Fresh coffee, chai, momos, burgers and more — ordered direct via WhatsApp in ${restaurantProfile.estimatedDeliveryTime}.`,
      image: restaurantProfile.bannerImage || CATEGORY_IMAGES['Coffee'],
      rating: avgRating,
      prepTime: restaurantProfile.estimatedDeliveryTime,
      cost: costForTwo,
    };

    const categorySlides = Object.keys(CATEGORY_IMAGES)
      .map((category) => {
        const items = restaurantMenu.filter((i) => i.category === category && i.isAvailable);
        if (items.length === 0) return null;
        const star = items.find((i) => i.isBestseller) || items[0];
        return {
          id: `cat-${category}`,
          tag: `${CATEGORY_ICONS[category] || '🍽️'} ${category.toUpperCase()}`,
          cuisineTag: `${items.length} items on the menu`,
          title: star.name,
          subtitle: category,
          description: star.description,
          image: CATEGORY_IMAGES[category],
          rating: String(star.rating || 4.7),
          prepTime: star.preparationTime || '15-25 mins',
          cost: `from ₹${Math.min(...items.map((i) => i.price))}`,
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null)
      .slice(0, 3);

    return [brandSlide, ...categorySlides];
  }, [restaurantMenu, restaurantProfile]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categorySliderRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      categorySliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'All') {
      setSelectedCategory(null);
      // Smooth scroll down to all dishes
      const el = document.getElementById('menu-catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setSelectedCategory(categoryId);
      navigateTo('category-detail', { category: categoryId });
    }
  };

  // Auto rotate banner slides every 5 seconds
  React.useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Guard against out-of-bounds index when menu data loads asynchronously
  const slide = heroSlides[Math.min(currentSlide, heroSlides.length - 1)];

  // Merged featured picks: Bestsellers prioritized first, then remaining popular items,
  // deduplicated by id and capped at 6 so the preview row stays compact.
  const featuredPicks = useMemo(() => {
    const bestsellers = restaurantMenu.filter((i) => i.isBestseller);
    const seen = new Set<string>();
    const merged: MenuItem[] = [];
    for (const item of [...bestsellers, ...restaurantMenu]) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
      if (merged.length >= 6) break;
    }
    return merged;
  }, [restaurantMenu]);

  // Grouped Menu List
  const groupedSections = useMemo(() => {
    const sectionCategories = Array.from(new Set(restaurantMenu.map((item) => item.category)));

    return sectionCategories
      .map((cat) => {
        let items = restaurantMenu.filter((item) => {
          if (cat === 'Chef Specials ⭐') return item.isBestseller;
          return item.category === cat;
        });

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          items = items.filter(
            (item) =>
              item.name.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              item.category.toLowerCase().includes(q)
          );
        }

        if (dietFilter === 'veg') items = items.filter((i) => i.vegType === 'veg');
        if (dietFilter === 'non-veg') items = items.filter((i) => i.vegType === 'non-veg');
        if (dietFilter === 'spicy') items = items.filter((i) => (i.spiceLevel || 0) >= 2 || i.isSpicy);
        if (dietFilter === 'rating') items = items.filter((i) => (i.rating || 0) >= 4.8);

        return { category: cat, items };
      })
      .filter((g) => {
        if (selectedCategory && selectedCategory !== 'All Items' && selectedCategory !== 'All') {
          return g.category === selectedCategory;
        }
        return g.items.length > 0;
      });
  }, [restaurantMenu, selectedCategory, searchQuery, dietFilter]);

  const handleOpenWhatsApp = () => {
    const message = `Hello ${restaurantProfile.name}! 👋 I am viewing your online menu and would like to order food.`;
    const url = generateWhatsAppUrl(message, restaurantProfile.whatsappPhone);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
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
    <div className="space-y-6 pb-0 w-full">

      {/* 1. CINEMATIC RESTAURANT HERO SLIDER */}
      <section className="relative rounded-3xl overflow-hidden bg-[#1E1B18] text-white border border-[#3A3530] shadow-md group">
        {/* Background Slide Imagery */}
        <div className="absolute inset-0 z-0">
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-right opacity-85 filter brightness-105 contrast-105 transition-all duration-700 ease-in-out"
          />
          {/* Subtle gradient for optimal text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#141210]/95 via-[#141210]/75 md:via-[#141210]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/60 via-transparent to-black/20" />
        </div>

        {/* Content Container with Increased Fixed Height */}
        <div className="relative z-10 p-6 sm:p-9 md:p-10 flex flex-col justify-between h-[310px] sm:h-[340px] md:h-[380px]">
          {/* Top Row: Rating Badge & Direct Action Buttons */}
          <div className="flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="bg-[#141210]/85 backdrop-blur-md border border-white/20 text-[#FAF9F5] px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 text-xs shadow-xs">
                <span>{slide.tag}</span>
              </span>
              <span className="text-white hidden md:inline text-xs font-semibold bg-[#141210]/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                {slide.cuisineTag}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-extrabold transition-all cursor-pointer shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <a
                href={`tel:${restaurantProfile.phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141210]/80 hover:bg-[#141210] backdrop-blur-md border border-white/25 text-[#FAF9F5] text-xs font-bold transition-all active:scale-95 shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#F8D6B2]" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* Restaurant Editorial Title (Spacious with room for subtitle and description) */}
          <div className="my-auto max-w-2xl drop-shadow-sm transition-all duration-300 space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {slide.title} — <span className="text-[#F8D6B2]">{slide.subtitle}</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-medium leading-relaxed drop-shadow-xs max-w-xl line-clamp-2 h-[3rem]">
              {slide.description}
            </p>
          </div>

          {/* Bottom Row: Info Pills + Slide Indicator Dots */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-white/20 shrink-0">
            {/* Info Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white font-medium">
              <div className="flex items-center gap-1.5 bg-[#141210]/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <Star className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
                <span className="font-bold text-white">{slide.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#141210]/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#F8D6B2]" />
                <span className="font-bold text-white">{slide.prepTime}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#141210]/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <span className="font-bold text-white">{slide.cost}</span>
              </div>
            </div>

            {/* Slider Navigation Controls (Dots & Arrows) */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="w-8 h-8 rounded-full bg-[#141210]/70 hover:bg-[#141210] border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === idx ? 'w-6 bg-[#F8D6B2]' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                className="w-8 h-8 rounded-full bg-[#141210]/70 hover:bg-[#141210] border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ORDER TYPE & PROMO VOUCHER (Unified & Clean) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Visual 3-Option Dining Selector */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-[#E8E5DD] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm text-[#1A1816]">
                How would you like your food?
              </h3>
              <p className="text-xs text-[#7D7872]">Instant kitchen preparation &amp; dispatch</p>
            </div>
            <span className="text-[11px] font-bold text-[#7C203A] bg-[#FBE4CB] px-2.5 py-1 rounded-full">
              ⚡ LIVE KITCHEN
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Home Delivery */}
            <button
              onClick={() => setOrderType('delivery')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${orderType === 'delivery'
                ? 'border-[#7C203A] bg-[#FBE4CB] ring-2 ring-[#7C203A]/20 shadow-xs'
                : 'border-[#E8E5DD] bg-[#FAF9F5] hover:bg-white'
                }`}
            >
              <span className="text-2xl block mb-1">🚴</span>
              <span className="text-xs font-bold text-[#1A1816] block">Home Delivery</span>
              <span className={`text-[11px] font-semibold block mt-0.5 ${orderType === 'delivery' ? 'text-[#7C203A]' : 'text-[#7D7872]'}`}>
                25–40 mins
              </span>
            </button>

            {/* Self Pickup */}
            <button
              onClick={() => setOrderType('pickup')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${orderType === 'pickup'
                ? 'border-[#7C203A] bg-[#FBE4CB] ring-2 ring-[#7C203A]/20 shadow-xs'
                : 'border-[#E8E5DD] bg-[#FAF9F5] hover:bg-white'
                }`}
            >
              <span className="text-2xl block mb-1">🛍️</span>
              <span className="text-xs font-bold text-[#1A1816] block">Self Pickup</span>
              <span className={`text-[11px] font-semibold block mt-0.5 ${orderType === 'pickup' ? 'text-[#7C203A]' : 'text-[#7D7872]'}`}>
                15–20 mins
              </span>
            </button>

            {/* Dine-In Table */}
            <button
              onClick={() => setOrderType('dine_in')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${orderType === 'dine_in'
                ? 'border-[#7C203A] bg-[#FBE4CB] ring-2 ring-[#7C203A]/20 shadow-xs'
                : 'border-[#E8E5DD] bg-[#FAF9F5] hover:bg-white'
                }`}
            >
              <span className="text-2xl block mb-1">🍽️</span>
              <span className="text-xs font-bold text-[#1A1816] block">Dine-In Table</span>
              <span className={`text-[11px] font-semibold block mt-0.5 ${orderType === 'dine_in' ? 'text-[#7C203A]' : 'text-[#7D7872]'}`}>
                Order at table
              </span>
            </button>
          </div>
        </div>

        {/* Right 4 Cols: Premium Special Offer Box */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#1C1A18] to-[#141210] text-white rounded-3xl p-5 border border-[#2E2B27] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#FBBF24] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SPECIAL OFFER</span>
            </div>
            <h3 className="text-base font-bold leading-snug">
              Get <span className="text-[#F8D6B2] font-black">₹100 OFF</span> on orders above ₹699
            </h3>
            <p className="text-xs text-[#A8A296] mt-1">
              Use voucher <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">WELCOME50</strong>
            </p>
          </div>

          <button
            onClick={() => {
              applyCoupon({
                code: 'WELCOME50',
                title: '50% OFF up to ₹100',
                description: 'Special discount voucher',
                discountType: 'percentage',
                discountValue: 50,
                maxDiscount: 100,
                minOrderValue: 199,
                validUntil: 'Active',
              });
              showToast('Special Offer Applied! 🎉', '₹100 discount added to cart', 'success');
            }}
            className="mt-3 w-full py-2.5 bg-[#7C203A] hover:bg-[#5D162C] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Apply Offer
          </button>
        </div>
      </section>

      {/* 3. STICKY CATEGORY DISCOVERY SLIDER */}
      <section className="sticky top-14 sm:top-18 z-30 bg-[#FFFDF9]/95 backdrop-blur-md py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-y border-[#E9C5A7]">
        <div className="max-w-[1440px] mx-auto relative flex items-center group/cat">
          {/* Left Scroll Arrow */}
          <button
            onClick={() => scrollCategories('left')}
            className="absolute -left-2 sm:-left-3 z-10 w-8 h-8 rounded-full bg-[#3D1020] text-[#F8D6B2] hover:bg-[#5D162C] shadow-md border border-[#E9C5A7] flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100 transition-all active:scale-95"
            title="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slider Container */}
          <div
            ref={categorySliderRef}
            className="w-full flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-8 sm:px-10 py-1"
          >
            {[
              { id: 'All', name: 'All Dishes', icon: '🍽️', image: CATEGORY_IMAGES.Coffee },
              ...Array.from(new Set(restaurantMenu.map((item) => item.category))).map((category) => ({
                id: category,
                name: category,
                icon: CATEGORY_ICONS[category] || '🍽️',
                image: CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Coffee,
              })),
            ].map((cat, idx) => {
              const isSelected = (!selectedCategory && cat.id === 'All') || selectedCategory === cat.id;
              return (
                <button
                  key={`${cat.name}-${idx}`}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer select-none focus:outline-none"
                >
                  <div
                    className={`w-15 h-15 sm:w-17 sm:h-17 rounded-full overflow-hidden p-0.5 border-2 transition-all duration-200 ${isSelected
                      ? 'border-[#7C203A] ring-2 ring-[#7C203A]/20 scale-105 shadow-sm'
                      : 'border-[#E9C5A7] bg-[#FFFDF9] group-hover:border-[#7C203A]'
                      }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full rounded-full object-cover pointer-events-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{cat.icon}</span>
                    <span
                      className={`text-xs font-bold tracking-tight text-center whitespace-nowrap ${isSelected
                        ? 'text-[#7C203A] font-black'
                        : 'text-[#684332] group-hover:text-[#3D1020]'
                        }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Arrow */}
          <button
            onClick={() => scrollCategories('right')}
            className="absolute -right-2 sm:-right-3 z-10 w-8 h-8 rounded-full bg-[#3D1020] text-[#F8D6B2] hover:bg-[#5D162C] shadow-md border border-[#E9C5A7] flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100 transition-all active:scale-95"
            title="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. POPULAR AT gumti cafe (Visual Horizontal Cards) */}
      <section className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-black text-[#3D1020] flex items-center gap-2">
              <span>⭐ Popular & Bestsellers</span>
            </h2>
            <p className="text-xs text-[#947362] mt-0.5">Most loved dishes ordered today</p>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-bold text-[#7C203A] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {featuredPicks.map((item) => {
            const qty = getCartItemQty(item.id);
            const cartItemId = getCartItemId(item.id);

            return (
              <div
                key={item.id}
                className="bg-[#FFFDF9] rounded-2xl border border-[#E9C5A7] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div
                  onClick={() => navigateTo('item-detail', { itemId: item.id })}
                  className="relative h-32 sm:h-36 w-full bg-[#FFF4E8] cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#3D1020]/90 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-[#FBBF24] text-[#FBBF24]" />
                    <span>{item.rating || '4.8'}</span>
                  </div>
                  {item.isBestseller && (
                    <div className="absolute top-2 right-2 bg-[#7C203A]/90 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      Bestseller ⭐
                    </div>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h4
                      onClick={() => navigateTo('item-detail', { itemId: item.id })}
                      className="font-bold text-xs sm:text-sm text-[#1A1816] truncate cursor-pointer hover:text-[#7C203A] transition-colors"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#7D7872] line-clamp-1 mt-0.5">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <span className="text-sm font-extrabold text-[#1A1816]">₹{item.price}</span>
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="py-1 px-3 bg-white hover:bg-[#FBE4CB] text-[#7C203A] border border-[#7C203A] rounded-lg font-extrabold text-[11px] uppercase transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        ADD +
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-[#7C203A] text-white rounded-lg font-bold text-xs py-1 px-2">
                        <button
                          onClick={() => cartItemId && updateCartQuantity(cartItemId, qty - 1)}
                          className="hover:text-black p-0.5"
                        >
                          -
                        </button>
                        <span className="px-1.5 font-bold text-xs">{qty}</span>
                        <button
                          onClick={() => cartItemId && updateCartQuantity(cartItemId, qty + 1)}
                          className="hover:text-black p-0.5"
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
      </section>


      {/* 6. FILTER TOOLBAR & EXPAND/COLLAPSE CONTROLS */}
      <section className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDietFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${dietFilter === 'all'
              ? 'bg-[#141210] text-white border-[#141210]'
              : 'bg-white border-[#E8E5DD] text-[#47433F] hover:bg-[#FAF9F5]'
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Dishes</span>
          </button>

          <button
            onClick={() => setDietFilter(dietFilter === 'veg' ? 'all' : 'veg')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${dietFilter === 'veg'
              ? 'bg-[#15803D] text-white border-[#15803D]'
              : 'bg-white border-[#E8E5DD] text-[#15803D] hover:bg-[#F0FDF4]'
              }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Pure Veg</span>
          </button>

          <button
            onClick={() => setDietFilter(dietFilter === 'non-veg' ? 'all' : 'non-veg')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${dietFilter === 'non-veg'
              ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
              : 'bg-white border-[#E8E5DD] text-[#B91C1C] hover:bg-[#FEF2F2]'
              }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />
            <span>Non-Veg</span>
          </button>

          <button
            onClick={() => setDietFilter(dietFilter === 'spicy' ? 'all' : 'spicy')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${dietFilter === 'spicy'
              ? 'bg-[#C2410C] text-white border-[#C2410C]'
              : 'bg-white border-[#E8E5DD] text-[#C2410C] hover:bg-[#FFF7ED]'
              }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Spicy</span>
          </button>

          <button
            onClick={() => setDietFilter(dietFilter === 'rating' ? 'all' : 'rating')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${dietFilter === 'rating'
              ? 'bg-[#8A6A1E] text-white border-[#8A6A1E]'
              : 'bg-white border-[#E8E5DD] text-[#8A6A1E] hover:bg-[#FCF7EC]'
              }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Rating 4.8+</span>
          </button>
        </div>

        {/* Quick Collapse / Expand All toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={collapseAll}
            className="text-[11px] font-bold text-[#7C203A] bg-white border border-[#E9C5A7] hover:bg-[#FBE4CB] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Collapse All
          </button>
          <button
            type="button"
            onClick={expandAll}
            className="text-[11px] font-bold text-[#7C203A] bg-white border border-[#E9C5A7] hover:bg-[#FBE4CB] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Expand All
          </button>
        </div>
      </section>

      {/* 7. MAIN 2-COLUMN COMMERCE SECTION (70% Left Menu + 30% Right Sticky Cart) */}
      <div id="menu-catalog" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-28">

        {/* LEFT COLUMN (70% — 8 cols): Compact Modern 2-Column Food Grid */}
        <div className="lg:col-span-8 space-y-4">
          {groupedSections.map((sec) => {
            const isCollapsed = !!collapsedCategories[sec.category];

            return (
              <div
                key={sec.category}
                id={`cat-sec-${sec.category.replace(/[^a-zA-Z0-9]/g, '-')}`}
                className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#E9C5A7] shadow-xs space-y-4 scroll-mt-32 transition-all duration-300"
              >
                <div
                  onClick={() => toggleCategoryCollapse(sec.category)}
                  className={`flex items-center justify-between cursor-pointer select-none group/hdr ${isCollapsed ? 'pb-0 border-b-0' : 'border-b border-[#F3DCC5] pb-3'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{CATEGORY_ICONS[sec.category] || '🍽️'}</span>
                    <h3 className="font-serif text-lg sm:text-xl font-black text-[#3D1020] group-hover/hdr:text-[#7C203A] transition-colors">
                      {sec.category}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#947362] bg-[#FFF4E8] px-2.5 py-1 rounded-full border border-[#E9C5A7]">
                      {sec.items.length} {sec.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <button
                      type="button"
                      aria-label={isCollapsed ? 'Expand category' : 'Collapse category'}
                      className="w-7 h-7 rounded-full bg-[#FFF4E8] border border-[#E9C5A7] flex items-center justify-center text-[#7C203A] group-hover/hdr:bg-[#FBE4CB] transition-all"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Collapsible Food Cards Container */}
                {!isCollapsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 animate-in fade-in duration-200">
                    {sec.items.map((item) => {
                      const qty = getCartItemQty(item.id);
                      const cartItemId = getCartItemId(item.id);

                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl bg-[#FFF4E8]/60 hover:bg-[#FFF4E8] border border-[#E9C5A7]/80 hover:border-[#7C203A]/50 transition-all flex items-start justify-between gap-3 group shadow-2xs"
                        >
                          {/* Left: Food Info */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center p-[2px] ${item.vegType === 'veg' ? 'border-[#15803D]' : 'border-[#B91C1C]'
                                  }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${item.vegType === 'veg' ? 'bg-[#15803D]' : 'bg-[#B91C1C]'
                                    }`}
                                />
                              </span>

                              {item.isBestseller && (
                                <span className="text-[9px] font-black text-[#7C203A] bg-[#FBE4CB] px-1.5 py-0.2 rounded border border-[#E9B88F]">
                                  Bestseller ⭐
                                </span>
                              )}

                              {item.isSpicy && (
                                <span className="text-[9px] text-[#C2410C] font-semibold flex items-center gap-0.5">
                                  <Flame className="w-2.5 h-2.5 fill-current" />
                                </span>
                              )}
                            </div>

                            <h4
                              onClick={() => navigateTo('item-detail', { itemId: item.id })}
                              className="font-bold text-xs sm:text-sm text-[#3D1020] leading-snug cursor-pointer hover:text-[#7C203A] transition-colors line-clamp-1"
                              title={item.name}
                            >
                              {item.name}
                            </h4>

                            <div className="flex items-center gap-2 my-1">
                              <span className="text-sm font-black text-[#3D1020]">₹{item.price}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-[11px] text-[#947362] line-through font-normal">
                                  ₹{item.originalPrice}
                                </span>
                              )}
                              {item.rating && (
                                <span className="text-[10px] text-[#7C203A] font-bold flex items-center gap-0.5 bg-[#FBE4CB] px-1 py-0.2 rounded">
                                  ★ {item.rating}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#684332] line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Right: Food Image (72px) + Quick Add Pill */}
                          <div className="relative shrink-0 flex flex-col items-center">
                            <div
                              onClick={() => navigateTo('item-detail', { itemId: item.id })}
                              className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-[#FFFDF9] border border-[#E9C5A7] cursor-pointer shadow-xs"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            <div className="absolute -bottom-2 w-18 shadow-sm rounded-lg overflow-hidden bg-white border border-[#7C203A]">
                              {qty === 0 ? (
                                <button
                                  onClick={() => addToCart(item, 1)}
                                  className="w-full py-1 bg-[#FFFDF9] hover:bg-[#FBE4CB] text-[#7C203A] font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  ADD +
                                </button>
                              ) : (
                                <div className="flex items-center justify-between bg-[#7C203A] text-white font-bold text-xs py-0.5 px-1.5">
                                  <button
                                    onClick={() => cartItemId && updateCartQuantity(cartItemId, qty - 1)}
                                    className="px-1 hover:text-black cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-black">{qty}</span>
                                  <button
                                    onClick={() => cartItemId && updateCartQuantity(cartItemId, qty + 1)}
                                    className="px-1 hover:text-black cursor-pointer"
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
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN (30% — 4 cols): Sticky Commerce Cart Panel */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">

          {/* Your Cart Component */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8E5DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EDE5] pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1A1816]">Your Cart</h3>
                <span className="text-xs text-[#7D7872]">
                  {orderType === 'dine_in' ? `Dine-In • Table #${tableNumber}` : 'Direct Kitchen Order'}
                </span>
              </div>
              {cartItemCount > 0 && (
                <span className="bg-[#FBE4CB] text-[#7C203A] text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#E9B88F]">
                  {cartItemCount} Items
                </span>
              )}
            </div>

            {cart.length > 0 ? (
              <>
                {/* Cart Items List */}
                <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-[#F0EDE5] pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-[#1A1816] truncate block">{item.name}</span>
                          <span className="text-[#7C203A] font-bold">₹{item.price * item.quantity}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center border border-[#E8E5DD] rounded-lg px-2 py-1 bg-[#FAF9F5] text-xs font-bold">
                          <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="text-[#888] px-1 hover:text-black cursor-pointer">-</button>
                          <span className="px-1.5">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="text-[#888] px-1 hover:text-black cursor-pointer">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-[#999] hover:text-[#B91C1C] p-1 cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div className="border-t border-[#F0EDE5] pt-3 space-y-1.5 text-xs text-[#47433F]">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span>₹{itemTotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#15803D] font-bold">
                      <span>Voucher Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? <span className="text-[#15803D] font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes &amp; Restaurant Charges (5%)</span>
                    <span>₹{taxes}</span>
                  </div>

                  <div className="flex justify-between font-extrabold text-base text-[#1A1816] pt-2 border-t border-[#F0EDE5]">
                    <span>To Pay</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                {/* Coupon Pill Trigger */}
                <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-dashed border-[#E8E5DD] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#7C203A]" />
                    <span className="font-bold text-[#1A1816]">
                      {appliedCoupon ? `${appliedCoupon.code} Applied` : 'Apply Promo Coupon'}
                    </span>
                  </div>
                  {appliedCoupon ? (
                    <button onClick={removeCoupon} className="text-rose-600 font-bold text-[11px] cursor-pointer">
                      Remove
                    </button>
                  ) : (
                    <button onClick={() => navigateTo('offers')} className="text-[#7C203A] font-bold text-[11px] hover:underline cursor-pointer">
                      View Offers →
                    </button>
                  )}
                </div>

                {/* High Conversion Proceed to Checkout Button */}
                <button
                  onClick={() => navigateTo('checkout')}
                  className="w-full py-3.5 bg-[#7C203A] hover:bg-[#5D162C] text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-between px-4 cursor-pointer active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <span className="flex items-center gap-1 font-black">
                    <span>₹{grandTotal}</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </>
            ) : (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#FBE4CB] text-[#7C203A] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1A1816]">Your cart is empty</h4>
                <p className="text-xs text-[#7D7872] max-w-[200px] mx-auto">
                  Add dishes from the menu and they will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Why Order From Us Trust Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8E5DD] shadow-xs space-y-2.5 text-xs">
            <h4 className="font-serif font-bold text-[#1A1816] text-sm">Why order from gumti cafe?</h4>
            <div className="space-y-2 text-[#47433F]">
              <div className="flex items-center gap-2.5">
                <span className="text-[#15803D] font-black">✓</span>
                <span>Freshly prepared in our charcoal kitchen</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#15803D] font-black">✓</span>
                <span>Direct kitchen ordering • Zero aggregator markup</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#15803D] font-black">✓</span>
                <span>Premium authentic ingredients &amp; spices</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#15803D] font-black">✓</span>
                <span>100% hygienic clay handi cooking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#15803D] font-black">✓</span>
                <span>Instant WhatsApp order confirmation</span>
              </div>
            </div>
          </div>

          {/* Dine-In Standee QR Box */}
          <div className="bg-white rounded-3xl p-4 border border-[#E8E5DD] shadow-xs flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-[#1A1816] text-xs">Dine-In Table QR</h4>
              <p className="text-[11px] text-[#7D7872] mt-0.5">
                Ordering from restaurant table?
              </p>
              <button
                onClick={() => navigateTo('qr-code')}
                className="mt-2 text-xs font-bold text-[#7C203A] hover:underline cursor-pointer"
              >
                View Table QR Code →
              </button>
            </div>

            <div className="w-12 h-12 bg-white p-1 border border-[#E8E5DD] rounded-xl shrink-0">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ghuticafe.com"
                alt="QR"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
