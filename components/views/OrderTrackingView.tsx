'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { OrderStatus } from '@/lib/types';
import {
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  Bike,
  UtensilsCrossed,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Download,
  AlertCircle,
  Send,
  ExternalLink,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    activeOrder,
    cancelActiveOrder,
    navigateTo,
    setIsHelpModalOpen,
    setIsInvoiceModalOpen,
    setIsKOTModalOpen,
    setViewingInvoiceOrder,
    showToast,
  } = useApp();

  const order = activeOrder;

  if (!order) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">No Active Order</h2>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          You don&apos;t have any ongoing orders at the moment.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-orange-700 transition-colors"
        >
          Discover Food
        </button>
      </div>
    );
  }

  const steps: Array<{ status: OrderStatus; label: string; sub: string }> = [
    { status: 'placed', label: 'Order Placed', sub: 'We have received your order' },
    { status: 'confirmed', label: 'Restaurant Confirmed', sub: 'Kitchen accepted the order' },
    { status: 'preparing', label: 'Food is Being Cooked', sub: 'Chef is preparing your meal fresh' },
    {
      status: 'on_the_way',
      label: order.orderType === 'dine_in' ? 'Served at Table' : order.orderType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery',
      sub: order.orderType === 'dine_in' ? `Your meal is being brought to Table #${order.tableNumber}` : order.orderType === 'pickup' ? 'Your order is ready at the counter' : 'Your order is on the way to your address'
    },
    {
      status: 'delivered',
      label: order.orderType === 'dine_in' ? 'Completed' : order.orderType === 'pickup' ? 'Picked Up' : 'Delivered',
      sub: 'Enjoy your delicious feast!'
    },
  ];

  const statusIndexMap: Record<OrderStatus, number> = {
    placed: 0,
    confirmed: 1,
    preparing: 2,
    on_the_way: 3,
    delivered: 4,
    cancelled: -1,
  };

  const currentStepIdx = statusIndexMap[order.status];

  const handleDownloadInvoice = () => {
    showToast('Invoice Downloaded 📄', `Tax Invoice for Order ${order.id} saved to your device.`, 'success');
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto">
      {/* WhatsApp Order Dispatch Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                Order Dispatched to Admin WhatsApp
              </h4>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                Confirmed
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
              Admin &amp; Kitchen have received your order details • Pay via Cash or UPI upon arrival.
            </p>
          </div>
        </div>

        {order.whatsappOrderUrl && (
          <button
            onClick={() => window.open(order.whatsappOrderUrl, '_blank')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </button>
        )}
      </div>

      {/* Header card with Live Status */}
      <div className="bg-linear-to-r from-zinc-900 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE DELIVERY STATUS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight capitalize">
              {order.status.replace(/_/g, ' ')}
            </h1>
            <p className="text-xs text-zinc-300 font-medium mt-1">
              Order ID: <span className="text-orange-400 font-bold">{order.id}</span> • {order.restaurantName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white border border-zinc-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-orange-400" />
              <span>Help &amp; Support</span>
            </button>
          </div>
        </div>
      </div>




      {/* Order Items & Bill Recap Card */}
      <div className="p-6 bg-white rounded-3xl border border-zinc-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Order Receipt ({order.items.length} items)
          </h3>

        </div>

        <div className="space-y-2">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between text-xs text-zinc-700">
              <span className="font-medium">
                {it.quantity}x {it.name}
              </span>
              <span className="font-bold text-zinc-900">₹{it.price * it.quantity}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-500 block">Payment Mode</span>
            <span className="text-xs font-extrabold text-zinc-900">{order.paymentMethod}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-zinc-500 block">Total Paid</span>
            <span className="text-base font-black text-emerald-600">₹{order.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
