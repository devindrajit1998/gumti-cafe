'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Store,
  QrCode,
  MessageCircle,
  Save,
  UtensilsCrossed,
  CheckCircle2,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    guestCustomer,
    updateGuestCustomer,
    restaurantProfile,
    navigateTo,
    showToast,
  } = useApp();

  const [name, setName] = useState(guestCustomer.name || '');
  const [phone, setPhone] = useState(guestCustomer.phone || '');
  const [street, setStreet] = useState(guestCustomer.street || '');
  const [area, setArea] = useState(guestCustomer.area || '');
  const [specialNotes, setSpecialNotes] = useState(guestCustomer.specialNotes || '');

  const handleSaveCustomerInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateGuestCustomer({
      name: name.trim(),
      phone: phone.trim(),
      street: street.trim(),
      area: area.trim(),
      specialNotes: specialNotes.trim(),
    });
    showToast('Details Saved! 💾', 'Your preferences will auto-fill on WhatsApp checkout', 'success');
  };

  return (
    <div className="pb-28 w-full space-y-6">
      {/* Profile Header */}
      <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {name ? name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900">
                {name || 'Guest Customer'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> NO LOGIN NEEDED
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              {phone || 'Your orders dispatch directly via WhatsApp to the kitchen'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          Browse Menu
        </button>
      </div>

      {/* Guest Details Edit Form */}
      <form onSubmit={handleSaveCustomerInfo} className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-600" />
            <span>Saved Customer Details for Fast WhatsApp Ordering</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Saved on your device so you never have to retype your name or address when ordering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Indrajit Ghosh"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Mobile Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Default Delivery Address
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Flat 402, Green Glen Layout, 100ft Road"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Locality / Area
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Indiranagar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Special Food Preferences
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Medium spicy, extra salad"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-[#7C203A] hover:bg-[#5D162C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Table QR Card */}
        <div
          onClick={() => navigateTo('qr-code')}
          className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Table QR Standees</h3>
              <p className="text-xs text-zinc-500">Generate dine-in QR codes</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </div>

        {/* Owner Menu Portal Card */}
        <a
          href="/admin"
          target="_blank"
          rel="noreferrer"
          className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF4E8] text-[#7C203A] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Owner Portal</h3>
              <p className="text-xs text-zinc-500">Protected admin dashboard</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </a>
      </div>
    </div>
  );
};
