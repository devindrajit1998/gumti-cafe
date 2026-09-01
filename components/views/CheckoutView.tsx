'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { formatOrderForWhatsApp } from '@/lib/whatsapp';
import confetti from 'canvas-confetti';
import {
  Send,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  Check,
  Clock,
  User,
  Copy,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Store,
} from 'lucide-react';
import { OrderType } from '@/lib/types';

const DELIVERY_SLOTS = [
  { id: 'now', label: '⚡ Deliver / Prepare ASAP (15-30 mins)' },
  { id: 'Today 7:30 PM - 8:00 PM', label: '🌙 Today Evening 7:30 PM' },
  { id: 'Today 8:30 PM - 9:00 PM', label: '🌙 Today Evening 8:30 PM' },
  { id: 'Today 9:30 PM - 10:00 PM', label: '🌙 Today Dinner 9:30 PM' },
  { id: 'Tomorrow 1:00 PM - 1:30 PM', label: '☀️ Tomorrow Lunch 1:00 PM' },
];

export const CheckoutView: React.FC = () => {
  const {
    cart,
    restaurantProfile,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    itemTotal,
    taxes,
    deliveryFee,
    platformFee,
    discountAmount,
    deliveryTip,
    grandTotal,
    deliveryInstructions,
    cutleryNeeded,
    appliedCoupon,
    guestCustomer,
    updateGuestCustomer,
    placeOrder,
    navigateTo,
    showToast,
    scheduledDelivery,
    setScheduledDelivery,
    groupOrder,
  } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState(guestCustomer.name || '');
  const [customerPhone, setCustomerPhone] = useState(guestCustomer.phone || '');
  const [customerStreet, setCustomerStreet] = useState(guestCustomer.street || '');
  const [customerArea, setCustomerArea] = useState(guestCustomer.area || restaurantProfile.locality);
  const [specialNotes, setSpecialNotes] = useState(guestCustomer.specialNotes || '');
  const [showPreview, setShowPreview] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Generate real-time preview of the WhatsApp message
  const whatsappPreviewText = useMemo(() => {
    if (cart.length === 0) return '';

    return formatOrderForWhatsApp({
      id: 'ZK-ORDER',
      orderNumber: 'ZK-XXXXX',
      restaurantName: restaurantProfile.name,
      restaurantAddress: `${restaurantProfile.address}, ${restaurantProfile.city}`,
      items: cart,
      itemTotal,
      taxes,
      deliveryFee,
      platformFee,
      discount: discountAmount,
      tip: orderType === 'delivery' ? deliveryTip : 0,
      grandTotal,
      orderType,
      tableNumber,
      deliveryAddress: {
        id: 'addr-preview',
        type: 'Home',
        street: customerStreet || 'Delivery Address',
        area: customerArea,
        city: restaurantProfile.city,
        pincode: restaurantProfile.pincode,
        phone: customerPhone,
      },
      customerName,
      customerPhone,
      deliveryInstructions,
      specialNotes,
      cutleryNeeded,
      appliedCouponCode: appliedCoupon?.code,
      scheduledDelivery: scheduledDelivery !== 'now' ? scheduledDelivery : undefined,
      isGroupOrder: groupOrder.isGroup,
      groupCode: groupOrder.code,
    });
  }, [
    cart,
    restaurantProfile,
    orderType,
    tableNumber,
    itemTotal,
    taxes,
    deliveryFee,
    platformFee,
    discountAmount,
    deliveryTip,
    grandTotal,
    customerStreet,
    customerArea,
    customerPhone,
    customerName,
    deliveryInstructions,
    specialNotes,
    cutleryNeeded,
    appliedCoupon,
    scheduledDelivery,
    groupOrder,
  ]);

  const handleCopyPreview = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(whatsappPreviewText);
      setIsCopied(true);
      showToast('Order text copied! 📋', 'You can paste it directly into WhatsApp', 'success');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleCompleteWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    // Normalize phone: keep digits only for length/format checks
    const phoneDigits = trimmedPhone.replace(/\D/g, '');

    if (!trimmedName || trimmedName.length < 2) {
      showToast('Please enter your full name', 'The cafe uses it to confirm your order', 'error');
      return;
    }
    if (!trimmedPhone) {
      showToast('Please enter your WhatsApp number', 'The cafe will send order updates here', 'error');
      return;
    }
    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      showToast('Invalid phone number', 'Enter 10 digits, e.g. 98765 43210', 'error');
      return;
    }

    if (orderType === 'delivery' && !customerStreet.trim()) {
      showToast('Please provide your delivery address', undefined, 'error');
      return;
    }

    setIsProcessing(true);

    // Save customer details in browser state & storage
    updateGuestCustomer({
      name: customerName.trim(),
      phone: customerPhone.trim(),
      street: customerStreet.trim(),
      area: customerArea.trim(),
      specialNotes: specialNotes.trim(),
    });

    // Trigger confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) { }

    // Dispatch order to WhatsApp
    setTimeout(() => {
      placeOrder({
        specialNotes: specialNotes.trim(),
        overrideOrderType: orderType,
        overrideTableNumber: tableNumber,
      });
      setIsProcessing(false);
    }, 400);
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-xl font-bold text-[#1A1816]">Your cart is empty</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-5 py-2.5 bg-[#D94814] text-white rounded-lg text-xs font-bold cursor-pointer"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 w-full space-y-6">
      {/* Back to Cart & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('cart')}
          className="p-2 rounded-lg bg-white border border-[#E8E5DD] hover:bg-[#F4F2EC] text-[#1A1816] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D94814]">
            Final Step • Direct Kitchen Dispatch
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1816]">
            Confirm &amp; Send to WhatsApp
          </h1>
        </div>
      </div>

      <form onSubmit={handleCompleteWhatsAppOrder} className="space-y-6">
        {/* 1. Dining Mode & Customer Info */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EDE5] pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#D94814]" />
              <h3 className="font-serif text-base font-bold text-[#1A1816]">
                1. Dining Option &amp; Contact
              </h3>
            </div>
            <span className="text-[11px] bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] px-2 py-0.5 rounded font-semibold">
              Instant Direct Order
            </span>
          </div>

          {/* Mode Switcher */}
          <div>
            <label className="text-xs font-bold text-[#1A1816] block mb-2">
              Dining Option:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${orderType === 'delivery'
                    ? 'bg-[#FDF2EB] border-[#D94814] text-[#D94814] font-bold'
                    : 'bg-[#FAF9F5] border-[#E8E5DD] text-[#47433F] hover:bg-[#F4F2EC]'
                  }`}
              >
                <span className="text-base">🛵</span>
                <span>Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${orderType === 'pickup'
                    ? 'bg-[#FDF2EB] border-[#D94814] text-[#D94814] font-bold'
                    : 'bg-[#FAF9F5] border-[#E8E5DD] text-[#47433F] hover:bg-[#F4F2EC]'
                  }`}
              >
                <span className="text-base">🛍️</span>
                <span>Self Pickup</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${orderType === 'dine_in'
                    ? 'bg-[#FDF2EB] border-[#D94814] text-[#D94814] font-bold'
                    : 'bg-[#FAF9F5] border-[#E8E5DD] text-[#47433F] hover:bg-[#F4F2EC]'
                  }`}
              >
                <span className="text-base">🍽️</span>
                <span>Dine-In Table</span>
              </button>
            </div>
          </div>

          {/* Dine In Table */}
          {orderType === 'dine_in' && (
            <div className="bg-[#FCF7EC] p-3 rounded-lg border border-[#F2E5C8] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#8A6A1E] block">
                  Table Number at {restaurantProfile.name}
                </span>
                <span className="text-[11px] text-[#9E7D2E]">
                  Direct delivery to your seat
                </span>
              </div>
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="bg-white border border-[#D8C7A3] rounded-md px-3 py-1.5 font-bold text-xs text-[#1A1816]"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    Table #{n}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#1A1816] block mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                placeholder="e.g. Indrajit Ghosh"
                className="w-full px-3 py-2 rounded-lg border border-[#E8E5DD] text-xs font-medium focus:outline-none focus:border-[#D94814]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1A1816] block mb-1">
                WhatsApp Phone Number *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3 py-2 rounded-lg border border-[#E8E5DD] text-xs font-medium focus:outline-none focus:border-[#D94814]"
              />
            </div>
          </div>

          {/* Address if delivery */}
          {orderType === 'delivery' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-[#1A1816] block mb-1">
                  Delivery Street Address &amp; Flat No. *
                </label>
                <input
                  type="text"
                  value={customerStreet}
                  onChange={(e) => setCustomerStreet(e.target.value)}
                  required
                  placeholder="e.g. Flat 402, Green Glen Towers, 100ft Road"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E5DD] text-xs font-medium focus:outline-none focus:border-[#D94814]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1A1816] block mb-1">
                    Locality / Landmark
                  </label>
                  <input
                    type="text"
                    value={customerArea}
                    onChange={(e) => setCustomerArea(e.target.value)}
                    placeholder="e.g. Indiranagar"
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E5DD] text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A1816] block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${restaurantProfile.city} - ${restaurantProfile.pincode}`}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E5DD] bg-[#FAF9F5] text-xs text-[#7D7872]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Timing */}
          <div>
            <label className="text-xs font-bold text-[#1A1816] flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-[#C59A3F]" />
              <span>Preferred Preparation Time:</span>
            </label>
            <select
              value={scheduledDelivery}
              onChange={(e) => setScheduledDelivery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E8E5DD] text-xs font-semibold text-[#1A1816] focus:outline-none focus:border-[#D94814]"
            >
              {DELIVERY_SLOTS.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-[#1A1816] block mb-1">
              Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Less spicy, send extra mint chutney & onion rings"
              className="w-full px-3 py-2 rounded-lg border border-[#E8E5DD] text-xs"
            />
          </div>
        </div>

        {/* 2. Order Summary & WhatsApp Trigger */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EDE5] pb-3">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#D94814]" />
              <h3 className="font-serif text-base font-bold text-[#1A1816]">
                2. Bill Summary
              </h3>
            </div>
            <span className="text-xs font-bold text-[#7D7872]">
              {cart.length} items • ₹{grandTotal}
            </span>
          </div>

          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-xs py-1 text-[#47433F]">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-bold text-[#1A1816]">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* WhatsApp Primary Dispatch CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>
                {isProcessing ? 'Preparing WhatsApp Dispatch...' : `Send Order to WhatsApp (₹${grandTotal})`}
              </span>
            </button>
            <p className="text-[11px] text-[#7D7872] text-center mt-2">
              Opens WhatsApp with pre-formatted kitchen order ticket. Pay via UPI or Cash upon delivery/serving.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
