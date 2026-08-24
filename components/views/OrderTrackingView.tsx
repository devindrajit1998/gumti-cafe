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

  const [simulatedEta, setSimulatedEta] = useState(24);
  const [isCalling, setIsCalling] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'driver', text: 'Namaste! I have picked up your hot food package and am on my way with a tamper-proof bag.' },
  ]);

  // Fallback if no active order
  const order = activeOrder;
  const partner = order?.deliveryPartner || {
    name: 'Ramesh Kumar',
    phone: '+91 98451 23456',
    rating: 4.9,
    vehicleNumber: 'KA-01-EF-2490',
    avatar: '',
  };

  // Decrease ETA slightly over time
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedEta((prev) => (prev > 5 ? prev - 1 : 4));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

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
    { status: 'on_the_way', label: 'Delivery Hero On The Way', sub: 'Ramesh is speeding to your address' },
    { status: 'delivered', label: 'Delivered', sub: 'Enjoy your delicious feast!' },
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

  // Scooter position along the route (percentage from 10% to 85%)
  const scooterProgress = Math.min(
    90,
    Math.max(15, (currentStepIdx + 1) * 20)
  );

  const handleCallDriver = () => {
    setIsCalling(true);
    showToast('Connecting Call...', `Calling ${partner.name} via masked number`, 'info');
    setTimeout(() => setIsCalling(false), 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage.trim();
    setChatLog((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatMessage('');

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'driver',
          text: 'Got it, Sir! Reaching in a few minutes. Ringing the bell once I reach.',
        },
      ]);
    }, 1500);
  };

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
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {order.status === 'delivered'
                ? 'Order Delivered!'
                : `Arriving in ${simulatedEta} mins`}
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

            {order.status === 'placed' && (
              <button
                onClick={() => cancelActiveOrder()}
                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-bold text-rose-300 border border-rose-500/30 transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stylized Interactive Map Simulation Visual */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-md overflow-hidden mb-6">
        <div className="relative h-64 sm:h-72 w-full bg-slate-100 overflow-hidden select-none">
          {/* Stylized Map Grid & Roads Background (SVG) */}
          <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#f8fafc" />
            <rect width="100%" height="100%" fill="url(#map-grid)" />
            
            {/* Green park zones */}
            <path d="M 40 30 Q 90 20 120 70 T 80 130 Z" fill="#dcfce7" opacity="0.7" />
            <path d="M 450 140 Q 520 100 580 160 T 510 220 Z" fill="#dcfce7" opacity="0.7" />
            
            {/* Road Paths */}
            <path
              d="M 60 180 L 180 180 L 260 100 L 420 100 L 520 170 L 680 170"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Active Highlighted Route */}
            <path
              d="M 60 180 L 180 180 L 260 100 L 420 100 L 520 170 L 680 170"
              fill="none"
              stroke="#f97316"
              strokeWidth="5"
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            />
          </svg>

          {/* Restaurant Marker (Origin) */}
          <div className="absolute left-[8%] top-[55%] transform -translate-y-1/2 flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-[#FFFDF9] border border-[#E9C5A7] shadow-lg flex items-center justify-center relative overflow-hidden p-1">
              <Image
                src={order.restaurantImage || '/logo-gumti.png'}
                alt={order.restaurantName}
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-[10px] font-black bg-white text-zinc-900 px-2 py-0.5 rounded-md shadow-xs border border-zinc-200 mt-1 whitespace-nowrap">
              {order.restaurantName}
            </span>
          </div>

          {/* Animated Scooter Marker along the route */}
          <div
            className="absolute top-[32%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000"
            style={{ left: `${scooterProgress}%` }}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center border-3 border-white ring-4 ring-emerald-500/30 animate-bounce">
                <Bike className="w-6 h-6" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white animate-ping" />
            </div>
            <span className="text-[10px] font-black bg-emerald-900 text-white px-2 py-0.5 rounded-full shadow-md mt-1 whitespace-nowrap">
              {partner.name} (Live)
            </span>
          </div>

          {/* Customer Home Marker (Destination) */}
          <div className="absolute right-[8%] top-[52%] transform -translate-y-1/2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white shadow-lg flex items-center justify-center border-2 border-white ring-4 ring-zinc-500/20">
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-[10px] font-black bg-white text-zinc-900 px-2 py-0.5 rounded-md shadow-xs border border-zinc-200 mt-1 whitespace-nowrap">
              Your Location
            </span>
          </div>
        </div>

        {/* Delivery Partner Profile Strip */}
        <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {partner.name.charAt(0)}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-extrabold text-zinc-900">
                  {partner.name}
                </h4>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  ★ {partner.rating}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                {partner.vehicleNumber} • Super Fast Hero
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCallDriver}
              disabled={isCalling}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{isCalling ? 'Dialing...' : 'Call Driver'}</span>
            </button>

            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* Live Chat Drawer snippet */}
        {chatOpen && (
          <div className="p-4 bg-white border-t border-zinc-200">
            <div className="space-y-2 max-h-48 overflow-y-auto mb-3 p-2 bg-zinc-50 rounded-xl">
              {chatLog.map((c, i) => (
                <div
                  key={i}
                  className={`flex ${c.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-2.5 rounded-xl text-xs font-medium ${
                      c.sender === 'user'
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-zinc-800 border border-zinc-200 shadow-2xs'
                    }`}
                  >
                    {c.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                placeholder="Message your delivery partner..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-hidden focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Progress Timeline Stepper */}
      <div className="p-6 bg-white rounded-3xl border border-zinc-200/90 shadow-2xs mb-6">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-5">
          Live Order Timeline
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
          {steps.map((st, idx) => {
            const isDone = currentStepIdx >= idx;
            const isCurrent = currentStepIdx === idx;

            return (
              <div key={st.status} className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 sm:-left-8 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-xs'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div>
                  <h4
                    className={`text-xs sm:text-sm leading-tight ${
                      isCurrent
                        ? 'font-black text-orange-600'
                        : isDone
                        ? 'font-bold text-zinc-900'
                        : 'font-medium text-zinc-400'
                    }`}
                  >
                    {st.label}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{st.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items & Bill Recap Card */}
      <div className="p-6 bg-white rounded-3xl border border-zinc-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Order Receipt ({order.items.length} items)
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewingInvoiceOrder(order);
                setIsKOTModalOpen(true);
              }}
              className="text-xs font-bold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Kitchen KOT</span>
            </button>
            <button
              onClick={() => {
                setViewingInvoiceOrder(order);
                setIsInvoiceModalOpen(true);
              }}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
          </div>
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
