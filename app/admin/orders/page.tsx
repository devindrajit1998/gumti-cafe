'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  MessageCircle,
  Phone,
  Printer,
  FileText,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { VegBadge } from '@/components/ui/VegBadge';
import { OrderStatus } from '@/lib/types';

export default function AdminOrdersPage() {
  const {
    restaurantProfile,
    pastOrders,
    updateOrderStatus,
    deleteOrder,
    setIsKOTModalOpen,
    setIsInvoiceModalOpen,
    setViewingInvoiceOrder,
    showToast,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return pastOrders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesType = typeFilter === 'all' || order.orderType === typeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        (order.customerName && order.customerName.toLowerCase().includes(q)) ||
        (order.customerPhone && order.customerPhone.includes(q)) ||
        (order.tableNumber && order.tableNumber.includes(q));
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [pastOrders, statusFilter, typeFilter, searchQuery]);

  const activeCount = pastOrders.filter((o) =>
    ['placed', 'confirmed', 'preparing', 'on_the_way'].includes(o.status)
  ).length;

  const sendWhatsApp = (order: (typeof pastOrders)[0], message: string) => {
    const phone = (order.customerPhone || '').replace(/\D/g, '');
    if (!phone) { showToast('No customer phone available', undefined, 'error'); return; }
    const fullPhone = phone.startsWith('91') ? phone : `91${phone}`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const statusColors: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    placed: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Placed / Received' },
    confirmed: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Confirmed' },
    preparing: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', label: 'Cooking' },
    on_the_way: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', label: 'On the Way' },
    delivered: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Delivered' },
    cancelled: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Cancelled' },
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
            Live Orders
            {activeCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-black animate-pulse">
                {activeCount} active
              </span>
            )}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Manage incoming orders, update kitchen status, and dispatch WhatsApp notifications.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Order #, customer, phone..."
            className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 w-56"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Statuses</option>
          <option value="placed">Placed / New</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Cooking</option>
          <option value="on_the_way">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Order Types</option>
          <option value="delivery">🛵 Delivery</option>
          <option value="dine_in">🪑 Dine-In</option>
          <option value="pickup">🛍️ Pickup</option>
        </select>
        <span className="ml-auto text-xs font-bold text-zinc-400">
          {filteredOrders.length} of {pastOrders.length} orders
        </span>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-16 text-center shadow-sm">
          <ShoppingBag className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-700">No orders found</h3>
          <p className="text-xs text-zinc-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredOrders.map((order) => {
            const cs = statusColors[order.status] || statusColors.confirmed;
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm flex flex-col gap-4">
                {/* Top row: order number, type badge, time, status select */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-zinc-900">{order.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        order.orderType === 'dine_in'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : order.orderType === 'pickup'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-orange-50 text-orange-800 border-orange-200'
                      }`}>
                        {order.orderType === 'dine_in' ? `Table #${order.tableNumber}` : order.orderType === 'pickup' ? 'Takeaway' : 'Delivery'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{order.createdAt}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className={`text-xs font-black px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${cs.bg} ${cs.text}`}
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Cooking</option>
                    <option value="on_the_way">{order.orderType === 'dine_in' ? 'Table Served' : 'Out for Delivery'}</option>
                    <option value="delivered">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Customer */}
                <div className="bg-zinc-50 rounded-xl px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-zinc-900">{order.customerName || 'Guest'}</p>
                    <p className="text-[11px] text-zinc-500">{order.customerPhone || '—'}</p>
                  </div>
                  {order.customerPhone && (
                    <a href={`tel:${order.customerPhone}`} className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-600 hover:text-emerald-700">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-1.5">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <VegBadge type={it.vegType} size="sm" />
                        <span className="font-bold text-zinc-800">{it.quantity}x {it.name}</span>
                      </div>
                      <span className="font-black text-zinc-900">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-dashed border-zinc-200 flex justify-between text-xs">
                    <span className="text-zinc-500">{order.paymentMethod}</span>
                    <span className="font-black text-zinc-900">₹{order.grandTotal}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => sendWhatsApp(order, `Hello ${order.customerName || 'Customer'}! 👋 Your order ${order.orderNumber} from ${restaurantProfile.name} is confirmed and our chef is preparing it now! 🍳\n\nTotal: ₹${order.grandTotal}\nETA: ${order.estimatedDeliveryTime}`)}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-black flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Cooking
                    </button>
                    <button
                      onClick={() => sendWhatsApp(order, `Hello ${order.customerName || 'Customer'}! 🍽️ Your order ${order.orderNumber} is ready! Thank you for choosing ${restaurantProfile.name}!`)}
                      className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-[11px] font-black flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Ready
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => { setViewingInvoiceOrder(order); setIsKOTModalOpen(true); }}
                      title="Print KOT"
                      className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setViewingInvoiceOrder(order); setIsInvoiceModalOpen(true); }}
                      title="View Invoice"
                      className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      title="Delete Order"
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
