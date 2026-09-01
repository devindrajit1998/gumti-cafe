'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { COUPONS } from '@/lib/data';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Percent,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Check,
  X,
  MessageSquare,
  MessageCircle,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    restaurantProfile,
    orderType,
    tableNumber,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    itemTotal,
    deliveryFee,
    taxes,
    discountAmount,
    deliveryTip,
    setDeliveryTip,
    deliveryInstructions,
    toggleDeliveryInstruction,
    cutleryNeeded,
    setCutleryNeeded,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
    showToast,
  } = useApp();

  const [inputCouponCode, setInputCouponCode] = useState('');

  const handleApplyInputCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCouponCode.trim()) return;
    const found = COUPONS.find(
      (c) => c.code.toUpperCase() === inputCouponCode.trim().toUpperCase()
    );
    if (found) {
      applyCoupon(found);
      setInputCouponCode('');
    } else {
      showToast('Invalid Coupon Code', 'Try WELCOME50, FEAST150, or FREEDEL', 'error');
    }
  };

  // Empty cart screen
  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FDF2EB] text-[#D94814] flex items-center justify-center mx-auto mb-4 border border-[#F7D0BC]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1816] tracking-tight">
          Your order plate is empty
        </h2>
        <p className="text-xs sm:text-sm text-[#7D7872] font-normal mt-1.5 mb-6 leading-relaxed">
          Fresh coffee, chai, momos, burgers, sandwiches and more — all ordered direct from the cafe kitchen.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D94814] hover:bg-[#C03E0F] active:scale-95 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
        >
          <span>Explore {restaurantProfile.name} Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-xl border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <div className="text-[10px] font-bold text-[#D94814] uppercase tracking-wider">
            Review Your Order
          </div>
          <h1 className="font-serif text-lg sm:text-xl font-bold text-[#1A1816]">
            {restaurantProfile.name}
          </h1>
          <div className="text-xs text-[#7D7872] mt-0.5">
            {orderType === 'dine_in'
              ? `Dine-In • Table #${tableNumber}`
              : orderType === 'pickup'
                ? 'Self Pickup / Counter Collection'
                : 'Direct Kitchen Home Delivery'}
          </div>
        </div>

        <button
          onClick={() => clearCart()}
          className="text-xs font-semibold text-[#7D7872] hover:text-[#B91C1C] transition-colors cursor-pointer flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Plate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7D7872]">
              Order Items ({cart.length})
            </h2>

            <div className="divide-y divide-[#F0EDE5]">
              {cart.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-[2px] border flex items-center justify-center p-[2px] shrink-0 ${item.vegType === 'veg' ? 'border-[#15803D]' : 'border-[#B91C1C]'
                          }`}
                      >
                        <div
                          className={`w-1 h-1 rounded-full ${item.vegType === 'veg' ? 'bg-[#15803D]' : 'bg-[#B91C1C]'
                            }`}
                        />
                      </div>
                      <span className="font-serif text-sm font-bold text-[#1A1816] leading-tight">
                        {item.name}
                      </span>
                    </div>

                    {/* Customizations */}
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="text-[11px] text-[#7D7872] mt-1 space-y-0.5 pl-5">
                        {item.customizations.map((c, i) => (
                          <div key={i}>
                            <span className="font-medium text-[#47433F]">{c.groupTitle}: </span>
                            <span>{c.selectedOptions.map((o) => o.name).join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-xs font-bold text-[#1A1816] mt-1.5 pl-5">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between bg-[#1A1816] text-white rounded-md font-bold text-xs shadow-xs px-2 py-1 shrink-0">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-0.5 hover:bg-[#2E2B27] rounded transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-0.5 hover:bg-[#2E2B27] rounded transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Instructions & Cutlery */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D7872]">
              Dining Preferences
            </h3>

            <div className="flex items-center justify-between text-xs py-1">
              <div>
                <span className="font-semibold text-[#1A1816] block">Include Cutlery &amp; Napkins</span>
                <span className="text-[#7D7872] text-[11px]">Eco-friendly wooden spoons &amp; tissues</span>
              </div>
              <input
                type="checkbox"
                checked={cutleryNeeded}
                onChange={(e) => setCutleryNeeded(e.target.checked)}
                className="w-4 h-4 accent-[#D94814] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Bill Summary & Checkout */}
        <div className="space-y-4">
          {/* Coupon Box */}
          <div className="bg-white rounded-xl p-4 border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A1816] flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-[#D94814]" />
                <span>Offers &amp; Coupons</span>
              </span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-xs">
                <div>
                  <span className="font-bold text-[#15803D] block">{appliedCoupon.code} Applied</span>
                  <span className="text-[10px] text-[#166534]">You save ₹{discountAmount} on this order</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-[#B91C1C] hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyInputCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Code (e.g. WELCOME50)"
                  value={inputCouponCode}
                  onChange={(e) => setInputCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 text-xs px-3 py-2 border border-[#E8E5DD] rounded-lg focus:outline-none focus:border-[#D94814]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#1A1816] hover:bg-[#2E2B27] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D7872]">
              Bill Details
            </h3>

            <div className="space-y-2 text-xs divide-y divide-[#F0EDE5]">
              <div className="flex justify-between text-[#47433F] pt-1">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#15803D] pt-1.5 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              {orderType === 'delivery' && (
                <div className="flex justify-between text-[#47433F] pt-1.5">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-[#15803D] font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
              )}

              <div className="flex justify-between text-[#47433F] pt-1.5">
                <span>GST / Taxes (5%)</span>
                <span>₹{taxes}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#1A1816] pt-2">
                <span>To Pay</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-3 bg-[#D94814] hover:bg-[#C03E0F] text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 mt-4"
            >
              <span>Proceed to Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
