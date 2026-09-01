'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import { DeliveryAddress } from '@/lib/types';
import { X, MapPin, Navigation, Home, Briefcase, Plus, Check } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    currentAddress,
    setCurrentAddress,
    restaurantProfile,
    guestCustomer,
    updateGuestCustomer,
    showToast,
  } = useApp();
  const { modalRef } = useModalAccessibility(isLocationModalOpen, () => setIsLocationModalOpen(false));

  const [street, setStreet] = useState(guestCustomer.street || currentAddress.street || '');
  const [area, setArea] = useState(guestCustomer.area || currentAddress.area || restaurantProfile.locality);

  if (!isLocationModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAddr: DeliveryAddress = {
      ...currentAddress,
      street: street.trim(),
      area: area.trim(),
      city: restaurantProfile.city,
      pincode: restaurantProfile.pincode,
    };
    setCurrentAddress(updatedAddr);
    updateGuestCustomer({ street: street.trim(), area: area.trim() });
    setIsLocationModalOpen(false);
    showToast('Delivery Location Set 📍', `${area}, ${restaurantProfile.city}`, 'success');
  };

  return (
    <div
      id="location-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="location-modal-content"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Set delivery location"
        tabIndex={-1}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 text-zinc-900 focus:outline-none"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-extrabold text-zinc-900">Set Delivery Address</h3>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
          Delivering from <strong className="text-zinc-800">{restaurantProfile.name}</strong> ({restaurantProfile.locality}, {restaurantProfile.city}).
        </p>

        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">House / Flat / Street</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Flat 301, Sunshine Heights"
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">Area / Landmark</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Indiranagar, 100ft Road"
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
