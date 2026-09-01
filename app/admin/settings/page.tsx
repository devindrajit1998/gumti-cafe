'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Save, Download, Building, DollarSign, Sliders } from 'lucide-react';
import { RestaurantProfile } from '@/lib/types';
import { ImageKitUploader } from '@/components/admin/ImageKitUploader';

export default function AdminSettingsPage() {
  const { restaurantProfile, updateRestaurantProfile, exportFullDatabase, importFullDatabase, showToast } = useApp();
  const backupRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<RestaurantProfile>>({
    name: restaurantProfile.name,
    tagline: restaurantProfile.tagline,
    whatsappPhone: restaurantProfile.whatsappPhone,
    phone: restaurantProfile.phone,
    locality: restaurantProfile.locality,
    city: restaurantProfile.city,
    fssaiNumber: restaurantProfile.fssaiNumber,
    address: restaurantProfile.address,
    upiId: restaurantProfile.upiId,
    upiPayeeName: restaurantProfile.upiPayeeName,
    deliveryFee: restaurantProfile.deliveryFee,
    freeDeliveryThreshold: restaurantProfile.freeDeliveryThreshold,
    serviceTaxPercentage: restaurantProfile.serviceTaxPercentage,
    estimatedDeliveryTime: restaurantProfile.estimatedDeliveryTime,
    openingHours: restaurantProfile.openingHours,
    logoImage: restaurantProfile.logoImage,
    bannerImage: restaurantProfile.bannerImage,
    bannerImageMobile: restaurantProfile.bannerImageMobile,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantProfile({
      ...form,
      deliveryFee: Number(form.deliveryFee),
      freeDeliveryThreshold: Number(form.freeDeliveryThreshold),
      serviceTaxPercentage: Number(form.serviceTaxPercentage),
    });
    showToast('Settings saved! ✅', 'All restaurant details updated.', 'success');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportFullDatabase(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `zaika_backup_${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
    showToast('Backup exported! 💾', 'JSON file downloaded.', 'success');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const result = importFullDatabase(JSON.parse(await file.text()));
      if (result.success) { showToast('Import successful! ✅', 'All data restored from backup.', 'success'); }
      else { showToast('Import failed', result.error || 'Invalid backup file.', 'error'); }
    } catch {
      showToast('Import failed', 'The selected file is not valid JSON.', 'error');
    }
    event.target.value = '';
  };

  const inputClass = "w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <div className="p-6 lg:p-8 w-full space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900">Restaurant Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Configure your restaurant profile, payment details, and delivery settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity & Contact */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100">
            <Building className="w-5 h-5 text-orange-600" />
            <h2 className="text-sm font-black text-zinc-900">Restaurant Identity & Contact</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Restaurant Name *</label>
              <input required value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Tagline / Cuisine Specialty</label>
              <input value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">WhatsApp Order Number (No +)</label>
              <input value={form.whatsappPhone || ''} onChange={(e) => setForm({ ...form, whatsappPhone: e.target.value })} placeholder="919876543210" className={inputClass} />
              <p className="text-[11px] text-zinc-400 mt-1">Orders are delivered to this WhatsApp number.</p>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Helpline Phone</label>
              <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Locality</label>
              <input value={form.locality || ''} onChange={(e) => setForm({ ...form, locality: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">City</label>
              <input value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">FSSAI License #</label>
              <input value={form.fssaiNumber || ''} onChange={(e) => setForm({ ...form, fssaiNumber: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1.5">Full Address</label>
            <input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <div className="max-w-xs">
              <ImageKitUploader
                label="Restaurant Brand Logo"
                currentImageUrl={form.logoImage || '/logo-gumti.png'}
                onUploadSuccess={(url) => {
                  setForm((prev) => ({ ...prev, logoImage: url }));
                  updateRestaurantProfile({ logoImage: url });
                  showToast('Logo Updated! ✅', 'Brand logo updated live across the site.', 'success');
                }}
                folder="/gumti-cafe/branding"
              />
            </div>
          </div>
        </div>

        {/* UPI */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-zinc-900">UPI Payment Settings</h2>
          </div>
          <p className="text-xs text-zinc-500">Configure your UPI ID to receive payments directly with zero commission.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Merchant UPI VPA ID</label>
              <input value={form.upiId || ''} onChange={(e) => setForm({ ...form, upiId: e.target.value })} placeholder="e.g. zaika.kitchen@okhdfcbank" className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Payee Name</label>
              <input value={form.upiPayeeName || ''} onChange={(e) => setForm({ ...form, upiPayeeName: e.target.value })} placeholder="e.g. Zaika Grand Kitchen" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Delivery & Tax */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100">
            <Sliders className="w-5 h-5 text-orange-600" />
            <h2 className="text-sm font-black text-zinc-900">Delivery Charges & Tax</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Delivery Fee (₹)</label>
              <input type="number" value={form.deliveryFee || 0} onChange={(e) => setForm({ ...form, deliveryFee: +e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Free Delivery Above (₹)</label>
              <input type="number" value={form.freeDeliveryThreshold || 0} onChange={(e) => setForm({ ...form, freeDeliveryThreshold: +e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">GST / Tax (%)</label>
              <input type="number" value={form.serviceTaxPercentage || 0} onChange={(e) => setForm({ ...form, serviceTaxPercentage: +e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Estimated Delivery Time</label>
              <input value={form.estimatedDeliveryTime || ''} onChange={(e) => setForm({ ...form, estimatedDeliveryTime: e.target.value })} placeholder="e.g. 30-40 mins" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">Opening Hours</label>
              <input value={form.openingHours || ''} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} placeholder="e.g. 11:00 AM - 11:30 PM" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all">
            <Save className="w-4 h-4" /> Save All Settings
          </button>
        </div>
      </form>

      {/* Backup & Restore */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm">
        <h2 className="text-sm font-black text-zinc-900 mb-1">Backup & Restore</h2>
        <p className="text-xs text-zinc-500 mb-5">Export or restore all menu, orders, customers, coupons, categories, profile, and banner data as a JSON file.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-black flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export Full Backup
          </button>
          <button
            onClick={() => backupRef.current?.click()}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black transition-all"
          >
            Import Backup
          </button>
          <input ref={backupRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
        </div>
        <p className="text-[11px] text-zinc-400 mt-4">
          ⚠️ Importing a backup will overwrite all current data. Make sure to export a backup before importing.
        </p>
      </div>
    </div>
  );
}
