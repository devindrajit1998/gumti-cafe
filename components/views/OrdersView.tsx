'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VegBadge } from '@/components/ui/VegBadge';
import { Clock, RotateCcw, ChevronRight, CheckCircle2, ShoppingBag, ArrowRight, FileText, Receipt } from 'lucide-react';
import Image from 'next/image';

export const OrdersView: React.FC = () => {
  const {
    pastOrders,
    activeOrder,
    reorder,
    navigateTo,
    setIsInvoiceModalOpen,
    setIsKOTModalOpen,
    setViewingInvoiceOrder,
  } = useApp();

  return (
    <div className="pb-28 w-full space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
          Your Food Orders
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          Track live delivery, review past meals, or re-order in 1 click
        </p>
      </div>

      {/* Active Order Card Banner if any */}
      {activeOrder && (
        <div className="mb-8 p-5 rounded-3xl bg-linear-to-r from-orange-600 to-amber-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ACTIVE ORDER IN PROGRESS</span>
            </div>
            <h3 className="text-lg font-black">{activeOrder.restaurantName}</h3>
            <p className="text-xs text-orange-100 mt-0.5 font-medium">
              Order #{activeOrder.id} • {activeOrder.items.length} items • ₹{activeOrder.grandTotal}
            </p>
          </div>

          <button
            onClick={() => navigateTo('order-tracking', { orderId: activeOrder.id })}
            className="px-5 py-3 bg-white text-zinc-900 font-black text-xs rounded-2xl shadow-md hover:bg-zinc-100 flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <span>Track Live Delivery</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Past Orders List */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-600" />
          <span>Past Orders</span>
        </h2>

        {pastOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-6">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800">No past orders yet</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              When you place orders, they will appear here for easy 1-click reordering.
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl"
            >
              Order Food Now
            </button>
          </div>
        ) : (
          pastOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              {/* Top Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-zinc-900">
                      {order.restaurantName}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Delivered
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                    Order #{order.id} • {order.createdAt}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-zinc-500 block">Paid Amount</span>
                  <span className="text-sm font-black text-zinc-900">₹{order.grandTotal}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-1.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-zinc-700">
                    <div className="flex items-center gap-2">
                      <VegBadge type={item.vegType} />
                      <span className="font-medium">
                        {item.quantity}x {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-zinc-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      navigateTo('restaurant-detail', { restaurantId: order.restaurantId })
                    }
                    className="text-xs font-bold text-zinc-600 hover:text-zinc-900"
                  >
                    View Menu →
                  </button>

                  <button
                    onClick={() => {
                      setViewingInvoiceOrder(order);
                      setIsInvoiceModalOpen(true);
                    }}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Receipt className="w-3 h-3" />
                    <span>Tax Invoice</span>
                  </button>

                  <button
                    onClick={() => {
                      setViewingInvoiceOrder(order);
                      setIsKOTModalOpen(true);
                    }}
                    className="text-xs font-bold text-zinc-600 hover:text-zinc-800 bg-zinc-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>KOT</span>
                  </button>
                </div>

                <button
                  onClick={() => reorder(order)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl shadow-xs transition-colors ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
