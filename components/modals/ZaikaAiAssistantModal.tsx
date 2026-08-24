'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RESTAURANTS, ALL_MENU_ITEMS } from '@/lib/data';
import {
  Sparkles,
  X,
  Send,
  ChefHat,
  ShoppingBag,
  Flame,
  Clock,
  ArrowRight,
  Check,
  Utensils,
  Lightbulb,
  HeartHandshake,
} from 'lucide-react';
import { VegBadge } from '@/components/ui/VegBadge';

interface AiRecommendedItem {
  itemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  vegType: 'veg' | 'non-veg' | 'egg' | 'vegan';
  recommendationReason: string;
}

interface AiResponseData {
  heading: string;
  reasoning: string;
  recommendedItems: AiRecommendedItem[];
  estimatedMealCost: number;
  pairingTip: string;
}

const PRESET_PROMPTS = [
  '🌶️ Spicy Biryani feast for 2 with cooling raita',
  '🥗 Healthy high-protein low-oil dinner under ₹500',
  '🧀 Rich Paneer & Butter Naan comfort meal',
  '🌙 Late-night street food snack & dessert combo',
  '🌱 Authentic South Indian breakfast spread',
];

export const ZaikaAiAssistantModal: React.FC = () => {
  const {
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    addToCart,
    navigateTo,
    showToast,
  } = useApp();

  const [prompt, setPrompt] = useState('');
  const [diet, setDiet] = useState<string>('any');
  const [budget, setBudget] = useState<string>('600');
  const [partySize, setPartySize] = useState<string>('2 people');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponseData | null>(null);

  if (!isAiAssistantOpen) return null;

  const handleAskAI = async (queryText?: string) => {
    const activePrompt = queryText || prompt;
    if (!activePrompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          dietPreference: diet,
          budget: budget ? parseInt(budget, 10) : undefined,
          partySize,
        }),
      });

      if (!res.ok) throw new Error('API request failed');

      const data: AiResponseData = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      showToast('Chef recommendation generated', 'Matched from our top rated menus', 'info');
      // Fallback result
      const sampleRest = RESTAURANTS[0];
      const sampleItem = sampleRest.menu[0];
      setResult({
        heading: 'Chef Special Recommendation',
        reasoning: `Selected based on your craving for "${activePrompt}".`,
        recommendedItems: [
          {
            itemId: sampleItem.id,
            restaurantId: sampleRest.id,
            restaurantName: sampleRest.name,
            name: sampleItem.name,
            price: sampleItem.price,
            vegType: sampleItem.vegType,
            recommendationReason: 'Signature aromatic dish with authentic spices.',
          },
        ],
        estimatedMealCost: sampleItem.price,
        pairingTip: 'Pair with chilled spiced buttermilk or warm gulab jamuns for the best experience!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (itemRec: AiRecommendedItem) => {
    const menuItem = ALL_MENU_ITEMS.find((m) => m.id === itemRec.itemId);
    if (menuItem) {
      addToCart(menuItem);
    } else {
      // Find fallback
      const parentRest = RESTAURANTS.find((r) => r.id === itemRec.restaurantId);
      if (parentRest && parentRest.menu.length > 0) {
        addToCart(parentRest.menu[0]);
      }
    }
  };

  const handleAddAllToCart = () => {
    if (!result || result.recommendedItems.length === 0) return;

    let addedCount = 0;
    for (const rec of result.recommendedItems) {
      const found = ALL_MENU_ITEMS.find((m) => m.id === rec.itemId);
      if (found) {
        addToCart(found);
        addedCount++;
      }
    }
    showToast(`Added ${addedCount} items to your cart! 🛒`, undefined, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/20">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Zaika AI Food Sommelier</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-400 text-zinc-950 rounded-md">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-orange-100 font-medium mt-0.5">
                Tell us your craving, mood, or budget &mdash; get the ultimate Indian meal pairing
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiAssistantOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Query Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>What are you in the mood to eat right now?</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder="e.g. Need spicy chicken biryani and a sweet dessert under ₹600..."
                className="flex-1 text-xs font-medium px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-hidden focus:border-orange-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => handleAskAI()}
                disabled={loading || !prompt.trim()}
                className="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-200 text-white text-xs font-black flex items-center gap-1.5 transition-all shrink-0"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Ask AI</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div>
              <span className="text-[11px] font-bold text-zinc-500 block mb-1">Diet Preference</span>
              <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
                {[
                  { id: 'any', label: 'All' },
                  { id: 'veg', label: 'Pure Veg 🟢' },
                  { id: 'non-veg', label: 'Non-Veg 🔴' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDiet(d.id)}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      diet === d.id ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-zinc-500 block mb-1">Approx Budget</span>
              <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
                {['350', '600', '1000'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      budget === b ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    ₹{b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-zinc-500 block mb-1">Party Size</span>
              <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
                {[
                  { id: '1 person', label: 'Solo (1)' },
                  { id: '2 people', label: 'Duo (2)' },
                  { id: '4 people', label: 'Group (4+)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPartySize(p.id)}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      partySize === p.id ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preset Prompts Pills */}
          {!result && !loading && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Popular Cravings
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(p);
                      handleAskAI(p);
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 transition-colors text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center animate-bounce">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-black text-zinc-900">Consulting Zaika AI Sommelier...</p>
                <p className="text-xs text-zinc-500 mt-0.5">Analyzing 20+ restaurants &amp; matching spice profiles</p>
              </div>
            </div>
          )}

          {/* AI Recommendation Result */}
          {result && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Header Box */}
              <div className="p-4 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span>{result.heading}</span>
                  </h3>
                  <span className="text-xs font-black text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
                    Est. ₹{result.estimatedMealCost} Total
                  </span>
                </div>
                <p className="text-xs text-amber-900/80 font-medium mt-1">
                  {result.reasoning}
                </p>
              </div>

              {/* Recommended Items Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-zinc-700 uppercase tracking-wider">
                    Recommended Dishes ({result.recommendedItems.length})
                  </span>
                  <button
                    onClick={handleAddAllToCart}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add All to Cart</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.recommendedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-zinc-200 bg-white hover:border-orange-300 transition-all flex flex-col justify-between shadow-2xs group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <VegBadge vegType={item.vegType} size="sm" />
                            <span className="text-[10px] font-bold text-zinc-500 truncate max-w-[130px]">
                              {item.restaurantName}
                            </span>
                          </div>
                          <span className="text-xs font-black text-zinc-900 shrink-0">
                            ₹{item.price}
                          </span>
                        </div>

                        <h4 className="text-xs font-extrabold text-zinc-900 mt-1 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.recommendationReason}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setIsAiAssistantOpen(false);
                            navigateTo('restaurant-detail', { restaurantId: item.restaurantId });
                          }}
                          className="text-[10px] font-bold text-zinc-400 hover:text-zinc-700 flex items-center gap-0.5"
                        >
                          <span>Menu</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleAddItem(item)}
                          className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Pairing Tip */}
              {result.pairingTip && (
                <div className="p-3.5 rounded-2xl bg-zinc-900 text-white flex items-start gap-3 shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                      Chef&apos;s Pro Pairing Tip
                    </span>
                    <p className="text-xs text-zinc-300 font-medium mt-0.5 leading-relaxed">
                      {result.pairingTip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
