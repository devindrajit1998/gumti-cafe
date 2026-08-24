'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Trash2,
  Phone,
  MessageCircle,
  Sparkles,
  Settings2,
  Plus,
  Save,
  Sliders,
} from 'lucide-react';
import { TableBookingStatus } from '@/lib/types';
import { generateWhatsAppUrl } from '@/lib/whatsapp';

export default function AdminBookingsPage() {
  const {
    tableBookings,
    tableBookingConfig,
    updateTableBookingConfig,
    updateTableBookingStatus,
    deleteTableBooking,
    restaurantProfile,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reservations' | 'form-fields'>('reservations');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TableBookingStatus>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Local Form Settings State
  const [configState, setConfigState] = useState(tableBookingConfig);
  const [prevTableBookingConfig, setPrevTableBookingConfig] = useState(tableBookingConfig);
  if (prevTableBookingConfig !== tableBookingConfig) {
    setPrevTableBookingConfig(tableBookingConfig);
    setConfigState(tableBookingConfig);
  }
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newSeatingLabel, setNewSeatingLabel] = useState('');
  const [newSeatingIcon, setNewSeatingIcon] = useState('🪑');
  const [newOccasionLabel, setNewOccasionLabel] = useState('');
  const [newOccasionIcon, setNewOccasionIcon] = useState('🎉');

  const filteredBookings = useMemo(() => {
    return tableBookings.filter((b) => {
      const matchSearch =
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestPhone.includes(searchQuery) ||
        (b.tableNumber && b.tableNumber.includes(searchQuery)) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchDate = !dateFilter || b.bookingDate === dateFilter;

      return matchSearch && matchStatus && matchDate;
    });
  }, [tableBookings, searchQuery, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    const total = tableBookings.length;
    const confirmed = tableBookings.filter((b) => b.status === 'confirmed').length;
    const pending = tableBookings.filter((b) => b.status === 'pending').length;
    const totalGuests = tableBookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.guestsCount, 0);

    return { total, confirmed, pending, totalGuests };
  }, [tableBookings]);

  const handleSendWhatsAppConfirmation = (booking: (typeof tableBookings)[0]) => {
    const seatingPart = booking.seatingArea ? ` (${booking.seatingArea.toUpperCase()} SEATING)` : '';
    const tablePart = booking.tableNumber ? ` • TABLE #${booking.tableNumber}` : '';
    const msg = `*Table Reservation Confirmed - ${restaurantProfile.name}* 🎉\n\nDear ${booking.guestName},\nYour table reservation for *${booking.guestsCount} guests* on *${booking.bookingDate} at ${booking.timeSlot}*${seatingPart}${tablePart} is CONFIRMED.\n\nWe look forward to serving you!\n📍 ${restaurantProfile.address}, ${restaurantProfile.city}\n📞 Helpline: ${restaurantProfile.phone}`;
    const url = generateWhatsAppUrl(msg, booking.guestPhone);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const handleSaveConfig = () => {
    updateTableBookingConfig(configState);
  };

  const handleAddTimeSlot = () => {
    if (!newTimeSlot.trim()) return;
    const trimmed = newTimeSlot.trim();
    if (configState.timeSlots.includes(trimmed)) {
      showToast('Time slot already exists', undefined, 'error');
      return;
    }
    setConfigState((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, trimmed],
    }));
    setNewTimeSlot('');
  };

  const handleRemoveTimeSlot = (slot: string) => {
    setConfigState((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((s) => s !== slot),
    }));
  };

  const handleAddSeating = () => {
    if (!newSeatingLabel.trim()) return;
    const id = newSeatingLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setConfigState((prev) => ({
      ...prev,
      seatingOptions: [
        ...prev.seatingOptions,
        { id, label: newSeatingLabel.trim(), icon: newSeatingIcon || '🪑' },
      ],
    }));
    setNewSeatingLabel('');
  };

  const handleRemoveSeating = (id: string) => {
    setConfigState((prev) => ({
      ...prev,
      seatingOptions: prev.seatingOptions.filter((s) => s.id !== id),
    }));
  };

  const handleAddOccasion = () => {
    if (!newOccasionLabel.trim()) return;
    const id = newOccasionLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setConfigState((prev) => ({
      ...prev,
      occasions: [
        ...prev.occasions,
        { id, label: newOccasionLabel.trim(), icon: newOccasionIcon || '🎉' },
      ],
    }));
    setNewOccasionLabel('');
  };

  const handleRemoveOccasion = (id: string) => {
    setConfigState((prev) => ({
      ...prev,
      occasions: prev.occasions.filter((o) => o.id !== id),
    }));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
            <span>🍽️ Table Reservations</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-extrabold">
              {tableBookings.length} Bookings
            </span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage guest reservations, assign table numbers, and customize booking form fields.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-orange-600" />
            <span>Live Bookings ({tableBookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('form-fields')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'form-fields'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-orange-600" />
            <span>Form Fields &amp; Rules</span>
          </button>
        </div>
      </div>

      {activeTab === 'form-fields' ? (
        /* =================== FORM FIELDS MANAGEMENT TAB =================== */
        <div className="space-y-6 animate-fade-in">
          {/* Header Action Card */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-orange-600" />
                <span>Customize Table Booking Form</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Toggle visible inputs, guest count rules, time slots, seating sections, and special occasions.
              </p>
            </div>
            <button
              onClick={handleSaveConfig}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save Form Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* 1. Field Visibility Toggles */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                  1. Field Visibility &amp; Requirements
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Control which inputs appear on the customer form.</p>
              </div>

              <div className="space-y-3.5">
                {/* Accept Bookings Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div>
                    <span className="text-xs font-black text-zinc-900 block">Accept Online Table Bookings</span>
                    <span className="text-[11px] text-zinc-500">Enable or temporarily pause reservations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={configState.enableBookings}
                    onChange={(e) => setConfigState({ ...configState, enableBookings: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 cursor-pointer"
                  />
                </div>

                {/* Email Field Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div>
                    <span className="text-xs font-black text-zinc-900 block">Guest Email Address Field</span>
                    <span className="text-[11px] text-zinc-500">Allow customers to input their email for receipts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={configState.showEmailField}
                    onChange={(e) => setConfigState({ ...configState, showEmailField: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 cursor-pointer"
                  />
                </div>

                {/* Require Email Toggle */}
                {configState.showEmailField && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/60 border border-orange-100 pl-6">
                    <div>
                      <span className="text-xs font-bold text-orange-950 block">Make Email Mandatory</span>
                      <span className="text-[11px] text-orange-700">Require guests to provide an email before submission</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={configState.requireEmail}
                      onChange={(e) => setConfigState({ ...configState, requireEmail: e.target.checked })}
                      className="w-4 h-4 accent-orange-600 cursor-pointer"
                    />
                  </div>
                )}

                {/* Seating Area Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div>
                    <span className="text-xs font-black text-zinc-900 block">Seating Area Selector</span>
                    <span className="text-[11px] text-zinc-500">Allow guests to choose AC Indoor, Garden, etc.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={configState.showSeatingArea}
                    onChange={(e) => setConfigState({ ...configState, showSeatingArea: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 cursor-pointer"
                  />
                </div>

                {/* Special Occasion Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div>
                    <span className="text-xs font-black text-zinc-900 block">Special Occasion Selector</span>
                    <span className="text-[11px] text-zinc-500">Birthday, Anniversary, Date, Business badges</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={configState.showSpecialOccasion}
                    onChange={(e) => setConfigState({ ...configState, showSpecialOccasion: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 cursor-pointer"
                  />
                </div>

                {/* Special Notes Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div>
                    <span className="text-xs font-black text-zinc-900 block">Dietary &amp; Table Notes Textarea</span>
                    <span className="text-[11px] text-zinc-500">Free text box for custom requests and high-chair needs</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={configState.showSpecialNotes}
                    onChange={(e) => setConfigState({ ...configState, showSpecialNotes: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Guest Count Limits */}
              <div className="pt-2 border-t border-zinc-100 space-y-3">
                <span className="text-xs font-black text-zinc-900 uppercase tracking-wider block">
                  Party Size Limits
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-600 block mb-1">Min Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={configState.maxGuests}
                      value={configState.minGuests}
                      onChange={(e) => setConfigState({ ...configState, minGuests: parseInt(e.target.value) || 1 })}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-600 block mb-1">Max Guests</label>
                    <input
                      type="number"
                      min={configState.minGuests}
                      max={50}
                      value={configState.maxGuests}
                      onChange={(e) => setConfigState({ ...configState, maxGuests: parseInt(e.target.value) || 10 })}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-zinc-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Time Slots Management */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                    2. Available Time Slots ({configState.timeSlots.length})
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Guests can choose from these booking times.</p>
                </div>

                {/* Add new time slot */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="e.g. 11:00 AM or 08:00 PM"
                    className="flex-1 text-xs font-bold px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={handleAddTimeSlot}
                    className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slot</span>
                  </button>
                </div>

                {/* Time Slots Pills */}
                <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
                  {configState.timeSlots.map((slot) => (
                    <span
                      key={slot}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-800"
                    >
                      <Clock className="w-3 h-3 text-orange-600" />
                      <span>{slot}</span>
                      <button
                        onClick={() => handleRemoveTimeSlot(slot)}
                        className="ml-1 text-zinc-400 hover:text-rose-600 cursor-pointer text-sm font-black leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Seating Options Management */}
              {configState.showSeatingArea && (
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
                  <div className="border-b border-zinc-100 pb-3">
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                      3. Seating Areas ({configState.seatingOptions.length})
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Dining corners customers can select.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSeatingIcon}
                      onChange={(e) => setNewSeatingIcon(e.target.value)}
                      placeholder="Icon"
                      className="w-14 text-center text-xs font-bold px-2 py-2 rounded-xl border border-zinc-200"
                    />
                    <input
                      type="text"
                      value={newSeatingLabel}
                      onChange={(e) => setNewSeatingLabel(e.target.value)}
                      placeholder="e.g. Poolside Cabana"
                      className="flex-1 text-xs font-bold px-3 py-2 rounded-xl border border-zinc-200"
                    />
                    <button
                      onClick={handleAddSeating}
                      className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Area</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    {configState.seatingOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{opt.icon || '🪑'}</span>
                          <span className="font-bold text-zinc-900">{opt.label}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSeating(opt.id)}
                          className="text-zinc-400 hover:text-rose-600 font-bold p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Special Occasions Management */}
              {configState.showSpecialOccasion && (
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
                  <div className="border-b border-zinc-100 pb-3">
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                      4. Special Occasion Badges ({configState.occasions.length})
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Occasion types customers can tag.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newOccasionIcon}
                      onChange={(e) => setNewOccasionIcon(e.target.value)}
                      placeholder="Icon"
                      className="w-14 text-center text-xs font-bold px-2 py-2 rounded-xl border border-zinc-200"
                    />
                    <input
                      type="text"
                      value={newOccasionLabel}
                      onChange={(e) => setNewOccasionLabel(e.target.value)}
                      placeholder="e.g. Farewell Party"
                      className="flex-1 text-xs font-bold px-3 py-2 rounded-xl border border-zinc-200"
                    />
                    <button
                      onClick={handleAddOccasion}
                      className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Occasion</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {configState.occasions.map((occ) => (
                      <span
                        key={occ.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 border border-purple-100 text-xs font-bold text-purple-900"
                      >
                        <span>{occ.icon || '🎉'}</span>
                        <span>{occ.label}</span>
                        <button
                          onClick={() => handleRemoveOccasion(occ.id)}
                          className="ml-1 text-purple-400 hover:text-rose-600 cursor-pointer text-sm font-black leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* =================== LIVE BOOKINGS TAB =================== */
        <div className="space-y-6 animate-fade-in">
          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Bookings</span>
              <div className="text-2xl font-black text-zinc-900">{stats.total}</div>
              <span className="text-[11px] text-zinc-400">All-time reservation logs</span>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Confirmation</span>
              <div className="text-2xl font-black text-amber-700">{stats.pending}</div>
              <span className="text-[11px] text-amber-600 font-semibold">Requires host approval</span>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Confirmed Tables</span>
              <div className="text-2xl font-black text-emerald-700">{stats.confirmed}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Active reserved slots</span>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Guests Expected</span>
              <div className="text-2xl font-black text-orange-700">{stats.totalGuests}</div>
              <span className="text-[11px] text-zinc-400">Confirmed dine-in covers</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by guest name, phone, table #..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Tabs */}
              {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {status}
                </button>
              ))}

              {/* Date Picker */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 focus:outline-none"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear Date
                </button>
              )}
            </div>
          </div>

          {/* Bookings List Cards */}
          <div className="space-y-3">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => {
                const isConfirmed = b.status === 'confirmed';
                const isPending = b.status === 'pending';

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                  >
                    {/* Left: Guest Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-black text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                          {b.id}
                        </span>

                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : b.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.status}
                        </span>

                        {b.specialOccasion && b.specialOccasion !== 'none' && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span className="capitalize">{b.specialOccasion}</span>
                          </span>
                        )}

                        {b.tableNumber && (
                          <span className="text-xs font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                            Table #{b.tableNumber}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-base text-zinc-900">{b.guestName}</h3>
                        <a
                          href={`tel:${b.guestPhone}`}
                          className="text-xs font-bold text-zinc-500 hover:text-orange-600 flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{b.guestPhone}</span>
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
                        <span className="flex items-center gap-1 font-semibold text-zinc-700">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" />
                          <span>{b.bookingDate}</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-zinc-700">
                          <Clock className="w-3.5 h-3.5 text-orange-600" />
                          <span>{b.timeSlot}</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-zinc-700">
                          <Users className="w-3.5 h-3.5 text-orange-600" />
                          <span>{b.guestsCount} Guests</span>
                        </span>
                        {b.seatingArea && (
                          <span className="flex items-center gap-1 font-semibold text-zinc-700 capitalize">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
                            <span>{b.seatingArea} Area</span>
                          </span>
                        )}
                      </div>

                      {b.specialNotes && (
                        <p className="text-xs text-zinc-600 bg-zinc-50 p-2 rounded-xl border border-zinc-100 mt-1">
                          <strong>Notes:</strong> {b.specialNotes}
                        </p>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {/* Table assigner */}
                      <input
                        type="text"
                        placeholder="Table #"
                        defaultValue={b.tableNumber || ''}
                        onBlur={(e) => {
                          if (e.target.value !== b.tableNumber) {
                            updateTableBookingStatus(b.id, b.status, e.target.value);
                          }
                        }}
                        className="w-20 px-2.5 py-1.5 text-xs font-bold border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
                        title="Assign Table Number"
                      />

                      {isPending && (
                        <button
                          onClick={() => {
                            updateTableBookingStatus(b.id, 'confirmed');
                            handleSendWhatsAppConfirmation({ ...b, status: 'confirmed' });
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm &amp; WhatsApp</span>
                        </button>
                      )}

                      {isConfirmed && (
                        <>
                          <button
                            onClick={() => handleSendWhatsAppConfirmation(b)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Send Slip</span>
                          </button>
                          <button
                            onClick={() => updateTableBookingStatus(b.id, 'completed')}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Complete
                          </button>
                        </>
                      )}

                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => updateTableBookingStatus(b.id, 'cancelled')}
                          className="px-3 py-1.5 bg-zinc-100 hover:bg-rose-50 text-zinc-600 hover:text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Delete reservation for ${b.guestName}?`)) {
                            deleteTableBooking(b.id);
                          }
                        }}
                        className="p-2 text-zinc-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-12 text-center space-y-2">
                <UtensilsCrossed className="w-10 h-10 text-zinc-300 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-700">No Reservations Found</h3>
                <p className="text-xs text-zinc-400">Try changing your search query or status filter.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
