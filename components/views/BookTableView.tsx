'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  Users,
  UtensilsCrossed,
  Sparkles,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { TableBooking } from '@/lib/types';

export const BookTableView: React.FC = () => {
  const { restaurantProfile, tableBookingConfig, createTableBooking, navigateTo } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const config = tableBookingConfig;
  const timeSlots = config.timeSlots && config.timeSlots.length > 0 ? config.timeSlots : ['07:30 PM'];
  const seatingOptions = config.seatingOptions && config.seatingOptions.length > 0 ? config.seatingOptions : [];
  const occasions = config.occasions && config.occasions.length > 0 ? config.occasions : [];

  const [form, setForm] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    guestsCount: Math.max(1, config.minGuests || 2),
    bookingDate: todayStr,
    timeSlot: timeSlots[0] || '07:30 PM',
    seatingArea: seatingOptions[0]?.id || 'indoor',
    specialOccasion: 'none',
    specialNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TableBooking | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName || !form.guestPhone) {
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await createTableBooking({
        guestName: form.guestName,
        guestPhone: form.guestPhone,
        guestEmail: config.showEmailField ? form.guestEmail : undefined,
        guestsCount: form.guestsCount,
        bookingDate: form.bookingDate,
        timeSlot: form.timeSlot,
        seatingArea: config.showSeatingArea ? form.seatingArea : undefined,
        specialOccasion: config.showSpecialOccasion ? form.specialOccasion : undefined,
        specialNotes: config.showSpecialNotes ? form.specialNotes : undefined,
      });

      setConfirmedBooking(booking);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate guest count numbers dynamically from minGuests to maxGuests
  const minG = config.minGuests || 1;
  const maxG = Math.max(minG, config.maxGuests || 10);
  const guestCountOptions: number[] = [];
  for (let i = minG; i <= Math.min(maxG, 20); i++) {
    guestCountOptions.push(i);
  }

  if (config.enableBookings === false) {
    return (
      <div className="max-w-[800px] mx-auto py-12 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#FBE4CB] text-[#7C203A] flex items-center justify-center mx-auto text-2xl">
          🍽️
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#3D1020]">
          Table Reservations Currently Paused
        </h2>
        <p className="text-xs text-[#684332] max-w-md mx-auto">
          We are accepting walk-in guests at our cafe counters. Feel free to visit or call our manager directly.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 bg-[#7C203A] text-white rounded-xl text-xs font-black cursor-pointer"
          >
            Order for Delivery / Takeaway
          </button>
          <a
            href={`tel:${restaurantProfile.phone}`}
            className="px-5 py-2.5 bg-white border border-[#E9C5A7] text-[#3D1020] rounded-xl text-xs font-black"
          >
            Call {restaurantProfile.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-4 space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#3D1020] via-[#5D162C] to-[#3D1020] text-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#6A2940] shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBE4CB]/20 border border-[#FBE4CB]/30 text-[#F8D6B2] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Direct Reservation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Book a Table at {restaurantProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#F8D6B2] leading-relaxed">
            Reserve your preferred dining corner, special occasion seating, or intimate coffee date. Instant confirmation sent straight to your WhatsApp.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-white/80 font-bold">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#F8D6B2]" /> {restaurantProfile.openingHours}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#F8D6B2]" /> {restaurantProfile.locality}, {restaurantProfile.city}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center shrink-0">
          <UtensilsCrossed className="w-10 h-10 text-[#F8D6B2] mb-2" />
          <span className="text-xs font-black text-white uppercase tracking-wider">Zero Booking Fees</span>
          <span className="text-[11px] text-[#F8D6B2] mt-0.5">Priority Seating Guarantee</span>
        </div>
      </div>

      {confirmedBooking ? (
        /* Success Screen */
        <div className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-12 border border-[#E9C5A7] shadow-sm text-center max-w-2xl mx-auto space-y-6 animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 text-[#15803D] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-[#15803D] uppercase tracking-wider bg-[#DCFCE7] px-3 py-1 rounded-full">
              Reservation Requested
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#3D1020]">
              We Look Forward to Welcoming You!
            </h2>
            <p className="text-xs text-[#684332] max-w-md mx-auto">
              Your reservation request for <strong>{confirmedBooking.guestsCount} guests</strong> on{' '}
              <strong>{confirmedBooking.bookingDate} at {confirmedBooking.timeSlot}</strong> has been transmitted to our cafe manager.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-[#FFF4E8] rounded-2xl p-5 border border-[#E9C5A7] text-left space-y-2.5 text-xs text-[#3D1020]">
            <div className="flex justify-between border-b border-[#E9C5A7]/60 pb-2">
              <span className="text-[#947362] font-semibold">Booking ID</span>
              <span className="font-mono font-black">{confirmedBooking.id}</span>
            </div>
            <div className="flex justify-between border-b border-[#E9C5A7]/60 pb-2">
              <span className="text-[#947362] font-semibold">Guest Name</span>
              <span className="font-black">{confirmedBooking.guestName}</span>
            </div>
            <div className="flex justify-between border-b border-[#E9C5A7]/60 pb-2">
              <span className="text-[#947362] font-semibold">Guests Count</span>
              <span className="font-black">{confirmedBooking.guestsCount} People</span>
            </div>
            {confirmedBooking.seatingArea && (
              <div className="flex justify-between border-b border-[#E9C5A7]/60 pb-2">
                <span className="text-[#947362] font-semibold">Seating Area</span>
                <span className="font-black capitalize">{confirmedBooking.seatingArea}</span>
              </div>
            )}
            {confirmedBooking.specialOccasion && confirmedBooking.specialOccasion !== 'none' && (
              <div className="flex justify-between border-b border-[#E9C5A7]/60 pb-2">
                <span className="text-[#947362] font-semibold">Special Occasion</span>
                <span className="font-black capitalize">{confirmedBooking.specialOccasion}</span>
              </div>
            )}
            {confirmedBooking.specialNotes && (
              <div className="flex justify-between">
                <span className="text-[#947362] font-semibold">Special Notes</span>
                <span className="font-medium text-right max-w-xs">{confirmedBooking.specialNotes}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-3 bg-[#7C203A] hover:bg-[#5D162C] text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
            >
              Browse Cafe Menu
            </button>
            <button
              onClick={() => setConfirmedBooking(null)}
              className="px-6 py-3 bg-[#FFFDF9] hover:bg-[#FBE4CB] border border-[#E9C5A7] text-[#3D1020] rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              Book Another Table
            </button>
          </div>
        </div>
      ) : (
        /* Dynamic Reservation Form */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6 bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9C5A7] shadow-xs">
            {/* 1. Date & Time Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F3DCC5] pb-3">
                <Calendar className="w-5 h-5 text-[#7C203A]" />
                <h3 className="font-serif text-base font-black text-[#3D1020]">1. Select Date &amp; Time</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-[#3D1020] block mb-1.5">Reservation Date *</label>
                  <input
                    required
                    type="date"
                    min={todayStr}
                    value={form.bookingDate}
                    onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#3D1020] block mb-1.5">Number of Guests *</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {guestCountOptions.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setForm({ ...form, guestsCount: num })}
                        className={`min-w-8 py-2 px-2.5 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                          form.guestsCount === num
                            ? 'bg-[#7C203A] text-white border-[#7C203A] shadow-2xs'
                            : 'bg-[#FFF4E8]/50 text-[#684332] border-[#E9C5A7] hover:bg-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-black text-[#3D1020] block">Preferred Time Slot *</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm({ ...form, timeSlot: slot })}
                      className={`py-2 text-[11px] font-black rounded-xl border transition-all cursor-pointer ${
                        form.timeSlot === slot
                          ? 'bg-[#7C203A] text-white border-[#7C203A] shadow-xs'
                          : 'bg-[#FFF4E8]/40 text-[#684332] border-[#E9C5A7] hover:bg-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Seating Preference (Admin Configurable) */}
            {config.showSeatingArea && seatingOptions.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-[#F3DCC5] pb-3">
                  <UtensilsCrossed className="w-5 h-5 text-[#7C203A]" />
                  <h3 className="font-serif text-base font-black text-[#3D1020]">2. Choose Seating Area</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {seatingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setForm({ ...form, seatingArea: opt.id })}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        form.seatingArea === opt.id
                          ? 'border-[#7C203A] bg-[#FBE4CB] ring-2 ring-[#7C203A]/20 shadow-xs'
                          : 'border-[#E9C5A7] bg-[#FFF4E8]/40 hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.icon || '🍽️'}</span>
                      <div>
                        <span className="font-black text-xs text-[#3D1020] block">{opt.label}</span>
                        {opt.desc && <span className="text-[11px] text-[#684332] mt-0.5 block">{opt.desc}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Occasion & Special Requests (Admin Configurable) */}
            {(config.showSpecialOccasion || config.showSpecialNotes) && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-[#F3DCC5] pb-3">
                  <Sparkles className="w-5 h-5 text-[#7C203A]" />
                  <h3 className="font-serif text-base font-black text-[#3D1020]">
                    {config.showSeatingArea ? '3. Special Occasion & Notes' : '2. Special Occasion & Notes'}
                  </h3>
                </div>

                {config.showSpecialOccasion && occasions.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {occasions.map((occ) => (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => setForm({ ...form, specialOccasion: occ.id })}
                        className={`py-2 px-3 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          form.specialOccasion === occ.id
                            ? 'bg-[#3D1020] text-white border-[#3D1020] shadow-xs'
                            : 'bg-[#FFF4E8]/40 text-[#684332] border-[#E9C5A7] hover:bg-white'
                        }`}
                      >
                        <span>{occ.icon || '🎉'}</span>
                        <span className="truncate">{occ.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {config.showSpecialNotes && (
                  <div>
                    <label className="text-xs font-black text-[#3D1020] block mb-1.5">
                      Special Dietary / Table Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={form.specialNotes}
                      onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
                      placeholder="e.g. Need high chair for baby, celebrating birthday, silent corner..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 4. Guest Contact Details */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-[#F3DCC5] pb-3">
                <Users className="w-5 h-5 text-[#7C203A]" />
                <h3 className="font-serif text-base font-black text-[#3D1020]">Primary Guest Contact</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-[#3D1020] block mb-1.5">Full Name *</label>
                  <input
                    required
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                    placeholder="e.g. Priya Sen"
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#3D1020] block mb-1.5">WhatsApp / Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={form.guestPhone}
                    onChange={(e) => setForm({ ...form, guestPhone: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 9830123456"
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A] font-mono text-emerald-800"
                  />
                </div>

                {config.showEmailField && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-black text-[#3D1020] block mb-1.5">
                      Email Address {config.requireEmail ? '*' : '(Optional for confirmation receipt)'}
                    </label>
                    <input
                      required={config.requireEmail}
                      type="email"
                      value={form.guestEmail}
                      onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                      placeholder="e.g. priya@example.com"
                      className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Booking Summary & Submission (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9C5A7] shadow-sm space-y-4">
              <div className="border-b border-[#F3DCC5] pb-3">
                <h3 className="font-serif text-base font-black text-[#3D1020]">Reservation Summary</h3>
                <span className="text-xs text-[#947362]">{restaurantProfile.name}</span>
              </div>

              <div className="space-y-3 text-xs text-[#684332]">
                <div className="flex items-center justify-between">
                  <span className="text-[#947362]">Date:</span>
                  <span className="font-black text-[#3D1020]">{form.bookingDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#947362]">Time:</span>
                  <span className="font-black text-[#3D1020]">{form.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#947362]">Party Size:</span>
                  <span className="font-black text-[#3D1020]">{form.guestsCount} Guests</span>
                </div>
                {config.showSeatingArea && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#947362]">Seating:</span>
                    <span className="font-black text-[#3D1020] capitalize">{form.seatingArea}</span>
                  </div>
                )}
                {config.showSpecialOccasion && form.specialOccasion !== 'none' && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#947362]">Occasion:</span>
                    <span className="font-black text-[#7C203A] capitalize">{form.specialOccasion}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#F3DCC5] space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !form.guestName || !form.guestPhone || (config.requireEmail && !form.guestEmail)}
                  className="w-full py-3.5 bg-[#7C203A] hover:bg-[#5D162C] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming...' : 'Request Table on WhatsApp'}</span>
                </button>

                <div className="p-3 bg-[#FFF4E8] rounded-xl border border-[#E9C5A7] text-[11px] text-[#684332] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#15803D]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Instant Confirmation</span>
                  </div>
                  <p>Our host will reserve your table and confirm back on WhatsApp.</p>
                </div>
              </div>
            </div>

            {/* Direct Helpline Card */}
            <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E9C5A7] text-xs text-[#684332] flex items-center justify-between">
              <div>
                <span className="font-black text-[#3D1020] block">Prefer to call?</span>
                <span className="text-[11px] text-[#947362]">Direct phone booking</span>
              </div>
              <a
                href={`tel:${restaurantProfile.phone}`}
                className="px-3.5 py-1.5 rounded-xl bg-[#FFF4E8] hover:bg-[#FBE4CB] text-[#7C203A] font-black border border-[#E9C5A7] flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Host</span>
              </a>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
