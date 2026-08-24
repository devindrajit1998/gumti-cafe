'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Trash2, X, Tag } from 'lucide-react';
import { Coupon } from '@/lib/types';

export default function AdminCouponsPage() {
  const { adminCoupons, addAdminCoupon, deleteAdminCoupon } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');
  const [value, setValue] = useState(20);
  const [minOrder, setMinOrder] = useState(299);
  const [maxDiscount, setMaxDiscount] = useState(100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const coupon: Coupon = {
      code: code.trim().toUpperCase(),
      title: title.trim() || `${value}% OFF`,
      description: desc.trim() || `Min order ₹${minOrder}`,
      discountType: type,
      discountValue: value,
      minOrderValue: minOrder,
      maxDiscount: type === 'percentage' ? maxDiscount : undefined,
      validUntil: '31 Dec 2026',
    };
    addAdminCoupon(coupon);
    setIsModalOpen(false);
    setCode(''); setTitle(''); setDesc('');
  };

  const typeColor = (dt: 'percentage' | 'flat') =>
    dt === 'percentage' ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200';

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">Coupons & Offers</h1>
          <p className="text-sm text-zinc-500 mt-1">Create discount codes customers can apply at checkout.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-md shadow-orange-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {adminCoupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-16 text-center shadow-sm">
          <Tag className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-700">No coupons yet</h3>
          <p className="text-xs text-zinc-400 mt-1">Create your first discount code to boost orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {adminCoupons.map((coupon) => (
            <div key={coupon.code} className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-1.5">
                  <span className="px-3 py-1 bg-amber-50 text-amber-900 font-black text-sm rounded-xl border border-amber-200 tracking-wider inline-block">
                    {coupon.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border inline-block w-fit ${typeColor(coupon.discountType)}`}>
                    {coupon.discountType === 'percentage' ? 'PERCENTAGE' : 'FLAT DISCOUNT'}
                  </span>
                </div>
                <button onClick={() => { if (confirm(`Delete coupon "${coupon.code}"?`)) deleteAdminCoupon(coupon.code); }} className="p-1.5 text-zinc-300 hover:text-rose-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-black text-zinc-900">{coupon.title}</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{coupon.description}</p>

              <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Discount</span>
                  <strong className="text-zinc-900">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `Flat ₹${coupon.discountValue} OFF`}
                  </strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Min Order</span>
                  <strong className="text-zinc-900">₹{coupon.minOrderValue}</strong>
                </div>
                {coupon.maxDiscount && (
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Max Discount</span>
                    <strong className="text-zinc-900">₹{coupon.maxDiscount}</strong>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Valid Until</span>
                  <strong className="text-zinc-900">{coupon.validUntil}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-black text-zinc-900">Create Promo Code</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Coupon Code *</label>
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="e.g. ZAIKA20" className="w-full text-sm font-mono font-bold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Discount Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="percentage">Percentage %</option>
                    <option value="flat">Flat ₹</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Discount Value</label>
                  <input type="number" value={value} onChange={(e) => setValue(+e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Min Order (₹)</label>
                  <input type="number" value={minOrder} onChange={(e) => setMinOrder(+e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                {type === 'percentage' && (
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Max Discount (₹)</label>
                    <input type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(+e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Display Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Weekend Special 20% OFF" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Description</label>
                <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Get 20% off on orders above ₹299" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-sm">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
