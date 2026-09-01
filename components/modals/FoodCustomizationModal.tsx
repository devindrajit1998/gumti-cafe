'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import { VegBadge } from '@/components/ui/VegBadge';
import { MenuItem, FoodCustomizationOption, CartItemCustomization } from '@/lib/types';
import { X, Plus, Minus, Check } from 'lucide-react';
import Image from 'next/image';

interface InnerProps {
  item: MenuItem;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement | null>;
}

const FoodCustomizationModalInner: React.FC<InnerProps> = ({ item, onClose, modalRef }) => {
  const { addToCart } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  // Initialize default options for radio groups
  const [selectedOptionsByGroup, setSelectedOptionsByGroup] = useState<Record<string, FoodCustomizationOption[]>>(() => {
    const initial: Record<string, FoodCustomizationOption[]> = {};
    item.customizationGroups?.forEach((group) => {
      if (group.type === 'radio' && group.options.length > 0) {
        initial[group.id] = [group.options[0]];
      } else {
        initial[group.id] = [];
      }
    });
    return initial;
  });

  const handleRadioChange = (groupId: string, option: FoodCustomizationOption) => {
    setSelectedOptionsByGroup((prev) => ({
      ...prev,
      [groupId]: [option],
    }));
  };

  const handleCheckboxToggle = (groupId: string, option: FoodCustomizationOption) => {
    setSelectedOptionsByGroup((prev) => {
      const current = prev[groupId] || [];
      const exists = current.some((o) => o.id === option.id);
      return {
        ...prev,
        [groupId]: exists ? current.filter((o) => o.id !== option.id) : [...current, option],
      };
    });
  };

  // Calculate total price
  const addOnsTotal = Object.values(selectedOptionsByGroup).reduce((acc, options) => {
    return acc + options.reduce((subAcc, opt) => subAcc + opt.price, 0);
  }, 0);

  const unitPrice = item.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const formattedCustomizations: CartItemCustomization[] = Object.entries(selectedOptionsByGroup)
      .filter(([_, opts]) => opts.length > 0)
      .map(([groupId, opts]) => {
        const group = item.customizationGroups?.find((g) => g.id === groupId);
        return {
          groupId,
          groupTitle: group?.title || groupId,
          selectedOptions: opts,
        };
      });

    addToCart(item, quantity, formattedCustomizations, instructions);
    onClose();
  };

  return (
    <div
      id="customization-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="customization-modal-content"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${item.name}`}
        tabIndex={-1}
        className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/70">
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-1">
              <VegBadge type={item.vegType} showLabel />
              {item.isBestseller && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  BESTSELLER
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-zinc-900 leading-snug">{item.name}</h3>
            <p className="text-sm font-semibold text-zinc-800 mt-1">₹{item.price}</p>
          </div>
          <button
            id="close-customization-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-200/80 hover:bg-zinc-300 text-zinc-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Item Preview Image */}
          <div className="relative h-44 w-full rounded-xl overflow-hidden bg-zinc-100 shadow-inner">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              referrerPolicy="no-referrer"
            />
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>

          {/* Groups */}
          {item.customizationGroups && item.customizationGroups.length > 0 ? (
            item.customizationGroups.map((group) => {
              const currentSelected = selectedOptionsByGroup[group.id] || [];

              return (
                <div key={group.id} className="border-t border-zinc-100 pt-4 first:border-0 first:pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-zinc-900">{group.title}</h4>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                      {group.type === 'radio' ? 'Select 1' : 'Optional'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isSelected = currentSelected.some((o) => o.id === option.id);

                      return (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected
                            ? 'border-orange-500 bg-orange-50/40'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (group.type === 'radio') {
                              handleRadioChange(group.id, option);
                            } else {
                              handleCheckboxToggle(group.id, option);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-${group.type === 'radio' ? 'full' : 'md'} border flex items-center justify-center transition-colors ${isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-zinc-300 bg-white'
                                }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                            </div>
                            <span className={`text-sm ${isSelected ? 'font-semibold text-zinc-900' : 'text-zinc-700'}`}>
                              {option.name}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-zinc-800">
                            {option.price === 0 ? 'Free' : `+ ₹${option.price}`}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-3 text-xs text-zinc-500 bg-zinc-50 rounded-xl">
              Standard chef preparation with secret Zaika spices
            </div>
          )}

          {/* Cooking Instructions */}
          <div className="border-t border-zinc-100 pt-4">
            <label className="block text-xs font-bold text-zinc-800 mb-1.5">
              Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Less spicy, send extra napkins, no onions..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 bg-zinc-50"
            />
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="p-4 border-t border-zinc-200 bg-white flex items-center gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-zinc-700 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-zinc-900">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-zinc-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            id="modal-add-to-cart-cta"
            onClick={handleAddToCart}
            className="flex-1 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-between transition-all"
          >
            <span className="text-sm">Add item to cart</span>
            <span className="text-sm font-extrabold bg-orange-700/60 px-2.5 py-0.5 rounded-md">
              ₹{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const FoodCustomizationModal: React.FC = () => {
  const { customizingItem, setCustomizingItem } = useApp();
  const { modalRef } = useModalAccessibility(Boolean(customizingItem), () => setCustomizingItem(null));

  if (!customizingItem) return null;

  return (
    <FoodCustomizationModalInner
      key={customizingItem.id}
      item={customizingItem}
      onClose={() => setCustomizingItem(null)}
      modalRef={modalRef}
    />
  );
};
