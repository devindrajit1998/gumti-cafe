'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Plus, Trash2, MessageCircle, Phone, Download, MapPin, X, Users } from 'lucide-react';
import { CustomerRecord } from '@/lib/types';

export default function AdminCustomersPage() {
  const { adminCustomers, restaurantProfile, addAdminCustomer, deleteAdminCustomer, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', area: '', address: '', notes: '', isVip: false });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return adminCustomers.filter((c) =>
      c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.area && c.area.toLowerCase().includes(q))
    );
  }, [adminCustomers, search]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { showToast('Name & Phone required', undefined, 'error'); return; }
    const record: CustomerRecord = {
      id: `cust-${Date.now()}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      area: form.area.trim(),
      address: form.address.trim(),
      totalOrders: 1,
      totalSpent: 0,
      lastOrderDate: 'Just added',
      isVip: form.isVip,
      notes: form.notes.trim(),
    };
    addAdminCustomer(record);
    setIsModalOpen(false);
    setForm({ name: '', phone: '', email: '', area: '', address: '', notes: '', isVip: false });
  };

  const exportCSV = () => {
    const headers = 'Name,Phone,Email,Area,TotalOrders,TotalSpent,LastOrderDate,VIP,Notes\n';
    const rows = adminCustomers.map((c) =>
      `"${c.name}","${c.phone}","${c.email || ''}","${c.area || ''}",${c.totalOrders},${c.totalSpent},"${c.lastOrderDate}",${c.isVip ? 'Yes' : 'No'},"${c.notes || ''}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `customers_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
    showToast('CSV exported! 📥', 'Customer directory downloaded', 'success');
  };

  const waLink = (phone: string, name: string) => {
    const digits = phone.replace(/\D/g, '');
    const full = digits.startsWith('91') ? digits : `91${digits}`;
    return `https://wa.me/${full}?text=${encodeURIComponent(`Hello ${name}! Greetings from ${restaurantProfile.name} 🍽️ We have exciting new chef specials today — would you like to order?`)}`;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">Customer CRM</h1>
          <p className="text-sm text-zinc-500 mt-1">{adminCustomers.length} customers in your directory</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-sm font-bold flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-md shadow-orange-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or area..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
        />
      </div>

      {/* Customer Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-16 text-center shadow-sm">
          <Users className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-700">No customers found</h3>
          <p className="text-xs text-zinc-400 mt-1">Add customer records to your CRM directory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((cust) => (
            <div key={cust.id} className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-zinc-900">{cust.name}</h3>
                      {cust.isVip && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">VIP 👑</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{cust.phone}</p>
                  </div>
                  <button
                    onClick={() => { if (confirm(`Remove "${cust.name}" from CRM?`)) deleteAdminCustomer(cust.id); }}
                    className="p-1.5 text-zinc-300 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {cust.area && (
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span className="truncate">{cust.address || cust.area}</span>
                  </p>
                )}
                {cust.notes && (
                  <p className="text-[11px] text-zinc-600 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-100 mb-3">
                    <strong>Note:</strong> {cust.notes}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100">
                  <div className="bg-zinc-50 py-2 rounded-xl text-center">
                    <p className="text-[10px] text-zinc-400 font-semibold">Orders</p>
                    <p className="text-sm font-black text-zinc-800">{cust.totalOrders}</p>
                  </div>
                  <div className="bg-zinc-50 py-2 rounded-xl text-center">
                    <p className="text-[10px] text-zinc-400 font-semibold">Spent</p>
                    <p className="text-sm font-black text-emerald-700">₹{cust.totalSpent}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-100">
                <a href={waLink(cust.phone, cust.name)} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <a href={`tel:${cust.phone}`} className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl">
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-black text-zinc-900">Add Customer Contact</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Full Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Indrajit Ghosh" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Phone (WhatsApp) *</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+91 98765 43210" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Area</label>
                  <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Indiranagar" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Optional" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Notes / Preferences</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Prefers extra spicy, weekend regular" className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-zinc-700">
                <input type="checkbox" checked={form.isVip} onChange={(e) => setForm({ ...form, isVip: e.target.checked })} className="accent-amber-600 w-4 h-4" />
                Tag as VIP Regular 👑
              </label>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-sm">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
