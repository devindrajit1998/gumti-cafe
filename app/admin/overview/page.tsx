'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Star,
  ArrowRight,
  Utensils,
  QrCode,
  Tag,
  Megaphone,
  Sliders,
} from 'lucide-react';
import { VegBadge } from '@/components/ui/VegBadge';
import Link from 'next/link';
import { VegType, OrderStatus } from '@/lib/types';

export default function AdminOverviewPage() {
  const { restaurantProfile, pastOrders, restaurantMenu, adminCategories, adminCustomers } = useApp();

  const analytics = useMemo(() => {
    const totalSales = pastOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const totalOrdersCount = pastOrders.length;
    const aov = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;
    const activeOrdersCount = pastOrders.filter((o) =>
      ['placed', 'confirmed', 'preparing', 'on_the_way'].includes(o.status)
    ).length;
    const dineInCount = pastOrders.filter((o) => o.orderType === 'dine_in').length;
    const deliveryCount = pastOrders.filter((o) => o.orderType === 'delivery').length;
    const pickupCount = pastOrders.filter((o) => o.orderType === 'pickup').length;
    const cancelledCount = pastOrders.filter((o) => o.status === 'cancelled').length;

    const itemSalesMap: Record<string, { name: string; count: number; revenue: number; vegType: VegType }> = {};
    pastOrders.forEach((order) => {
      if (order.status === 'cancelled') return;
      order.items.forEach((item) => {
        if (!itemSalesMap[item.name]) {
          itemSalesMap[item.name] = { name: item.name, count: 0, revenue: 0, vegType: item.vegType };
        }
        itemSalesMap[item.name].count += item.quantity;
        itemSalesMap[item.name].revenue += item.price * item.quantity;
      });
    });
    const topDishes = Object.values(itemSalesMap).sort((a, b) => b.count - a.count).slice(0, 6);

    return { totalSales, totalOrdersCount, aov, activeOrdersCount, dineInCount, deliveryCount, pickupCount, cancelledCount, topDishes };
  }, [pastOrders]);

  const metrics = [
    {
      label: 'Total Revenue',
      value: `₹${analytics.totalSales.toLocaleString('en-IN')}`,
      sub: `Across ${analytics.totalOrdersCount} orders`,
      icon: DollarSign,
      color: 'emerald',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      label: 'Active Orders',
      value: analytics.activeOrdersCount,
      sub: 'Placed, cooking, on the way',
      icon: ShoppingBag,
      color: 'orange',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
    },
    {
      label: 'Avg. Order Value',
      value: `₹${analytics.aov}`,
      sub: 'Average bill size',
      icon: TrendingUp,
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: 'Customers',
      value: adminCustomers.length,
      sub: 'In your CRM directory',
      icon: Users,
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900">Dashboard Overview</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {restaurantProfile.name} — {restaurantProfile.locality}, {restaurantProfile.city}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{m.label}</p>
                <div className={`w-9 h-9 rounded-xl ${m.bg} ${m.text} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className={`text-2xl lg:text-3xl font-black ${m.text}`}>{m.value}</p>
              <p className="text-[11px] text-zinc-400 font-medium mt-1">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Channel Breakdown */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-zinc-900">Order Channels</h2>
            <span className="text-xs font-semibold text-zinc-400">Total: {analytics.totalOrdersCount}</span>
          </div>
          <div className="space-y-4">
            {[
              { label: '🛵 Home Delivery', count: analytics.deliveryCount, color: 'bg-orange-500' },
              { label: '🪑 Dine-In', count: analytics.dineInCount, color: 'bg-emerald-500' },
              { label: '🛍️ Pickup', count: analytics.pickupCount, color: 'bg-blue-500' },
              { label: '❌ Cancelled', count: analytics.cancelledCount, color: 'bg-zinc-300' },
            ].map((ch) => (
              <div key={ch.label}>
                <div className="flex justify-between text-xs font-bold text-zinc-600 mb-1.5">
                  <span>{ch.label}</span>
                  <span>{ch.count}</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${ch.color} rounded-full transition-all`}
                    style={{ width: `${analytics.totalOrdersCount ? (ch.count / analytics.totalOrdersCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-zinc-100">
            <div className="flex justify-between text-xs font-medium text-zinc-500">
              <span>Menu Catalog</span>
              <span className="font-black text-zinc-900">{restaurantMenu.length} dishes · {adminCategories.length} categories</span>
            </div>
          </div>
        </div>

        {/* Top Dishes */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-zinc-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Top Ordered Dishes
            </h2>
            <Link href="/admin/menu" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              Manage Menu <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {analytics.topDishes.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="w-10 h-10 text-zinc-200 mx-auto mb-2" />
              <p className="text-xs text-zinc-400">No order history yet. Orders will appear here once placed.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {analytics.topDishes.map((dish, i) => (
                <div key={dish.name} className="py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-50 text-orange-700 text-[10px] font-black flex items-center justify-center shrink-0">
                    #{i + 1}
                  </span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <VegBadge type={dish.vegType} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-zinc-800 truncate">{dish.name}</p>
                      <p className="text-[10px] text-zinc-400">{dish.count} portions sold</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-zinc-900">₹{dish.revenue.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-600/20">
        <h2 className="text-base font-black mb-1">Quick Actions</h2>
        <p className="text-xs text-orange-100 mb-5">Jump to any section to manage your restaurant instantly.</p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/admin/menu',          icon: Utensils,  label: 'Add New Dish',          white: true },
            { href: '/admin/qr-tables',     icon: QrCode,    label: 'Print Table QRs',        white: false },
            { href: '/admin/coupons',        icon: Tag,       label: 'Create Discount Code',   white: false },
            { href: '/admin/announcements', icon: Megaphone, label: 'Update Announcement',    white: false },
            { href: '/admin/settings',      icon: Sliders,   label: 'Store Settings',         white: false },
          ].map(({ href, icon: Icon, label, white }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                white
                  ? 'bg-white text-orange-700 hover:bg-orange-50'
                  : 'bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
