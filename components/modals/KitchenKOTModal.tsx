'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Printer,
  X,
  CheckSquare,
  Square,
  Clock,
  MapPin,
  Utensils,
  Receipt,
  User,
  Phone,
  ChefHat,
} from 'lucide-react';

export const KitchenKOTModal: React.FC = () => {
  const { isKOTModalOpen, setIsKOTModalOpen, activeOrder, viewingInvoiceOrder } = useApp();
  const order = viewingInvoiceOrder || activeOrder;

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!isKOTModalOpen || !order) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-400" />
            <span className="text-xs font-black tracking-wider uppercase">Kitchen Order Ticket (KOT)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Print KOT"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsKOTModalOpen(false)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thermal KOT Ticket Body */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-zinc-800 space-y-4 bg-[#fbfbfb]">
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-zinc-300 pb-3 flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E9C5A7] relative overflow-hidden shrink-0 mb-1.5 p-0.5">
              <Image
                src={order.restaurantImage || '/logo-gumti.png'}
                alt={order.restaurantName}
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-base font-black tracking-tight uppercase text-zinc-950">
              {order.restaurantName}
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">KITCHEN DISPATCH TICKET</p>
            <div className="mt-2 text-xs font-bold text-zinc-700 flex justify-center gap-3">
              <span>ORDER: <strong className="text-zinc-950">#{order.orderNumber || order.id}</strong></span>
              <span>•</span>
              <span>{order.createdAt}</span>
            </div>
            {order.scheduledDelivery && (
              <div className="mt-1.5 bg-orange-100 text-orange-950 px-2 py-0.5 rounded font-bold text-[11px] inline-block">
                ⏰ PRE-ORDER TIME: {order.scheduledDelivery}
              </div>
            )}
            {order.isGroupOrder && (
              <div className="mt-1 bg-blue-100 text-blue-950 px-2 py-0.5 rounded font-bold text-[11px] inline-block">
                👥 GROUP ORDER #{order.groupCode}
              </div>
            )}
          </div>

          {/* Customer & Address Details */}
          <div className="space-y-1 text-[11px] border-b-2 border-dashed border-zinc-300 pb-3">
            <div className="flex justify-between">
              <span className="text-zinc-500">Customer:</span>
              <span className="font-bold">{order.deliveryAddress.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Deliver To:</span>
              <span className="font-medium text-right max-w-[220px]">
                {order.deliveryAddress.street}, {order.deliveryAddress.area}
              </span>
            </div>
          </div>

          {/* Dish Checklist for Chefs */}
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase border-b border-zinc-200 pb-1">
              <span>Qty &amp; Item</span>
              <span>Status</span>
            </div>

            {order.items.map((it, idx) => {
              const isChecked = !!checkedItems[it.id || idx.toString()];
              return (
                <div
                  key={it.id || idx}
                  onClick={() => toggleCheck(it.id || idx.toString())}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300 line-through text-zinc-400'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="font-black text-sm text-zinc-950 bg-zinc-100 px-1.5 py-0.5 rounded">
                        {it.quantity}x
                      </span>
                      <div>
                        <span className="font-bold text-xs">{it.name}</span>
                        {it.customizations && it.customizations.length > 0 && (
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            {it.customizations
                              .map((c) => `${c.groupTitle}: ${c.selectedOptions.map((o) => o.name).join(', ')}`)
                              .join(' | ')}
                          </p>
                        )}
                        {it.specialInstructions && (
                          <p className="text-[10px] font-bold text-orange-600 mt-0.5">
                            NOTE: &quot;{it.specialInstructions}&quot;
                          </p>
                        )}
                        {it.orderedBy && (
                          <p className="text-[10px] text-blue-600 font-bold mt-0.5">
                            FOR: {it.orderedBy}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Notes */}
          <div className="border-t-2 border-dashed border-zinc-300 pt-3 text-[11px] text-zinc-500 space-y-1">
            <div className="flex justify-between font-bold text-zinc-900 text-xs">
              <span>Total Items:</span>
              <span>{order.items.reduce((acc, i) => acc + i.quantity, 0)} units</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span>{order.paymentMethod}</span>
            </div>
            <p className="text-center text-[10px] text-zinc-400 pt-2 italic">
              -- Zaika Restaurant Cloud POS --
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
