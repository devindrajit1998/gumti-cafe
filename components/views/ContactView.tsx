'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/whatsapp';

export const ContactView: React.FC = () => {
  const { restaurantProfile, showToast } = useApp();
  const [form, setForm] = useState({ name: '', phone: '', message: '', subject: 'General Inquiry' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      showToast('Please fill all required fields', undefined, 'error');
      return;
    }

    // Prepare WhatsApp message
    const msg = `*Customer Inquiry - ${restaurantProfile.name}*\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Subject:* ${form.subject}\n*Message:* ${form.message}`;
    const url = generateWhatsAppUrl(msg, restaurantProfile.whatsappPhone);
    setIsSubmitted(true);
    showToast('Message Ready! Opening WhatsApp...', undefined, 'success');
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-10 py-4 max-w-[1200px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3D1020] via-[#5D162C] to-[#3D1020] text-[#FFFDF9] rounded-3xl p-8 sm:p-12 border border-[#6A2940] shadow-md">
        <span className="inline-block bg-[#FBE4CB]/20 text-[#F8D6B2] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#FBE4CB]/30 mb-3">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight">
          Contact {restaurantProfile.name}
        </h1>
        <p className="text-sm sm:text-base text-[#F8D6B2] mt-2 max-w-xl">
          Have questions, custom catering requests, or feedback? Reach out directly via WhatsApp or phone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* WhatsApp Direct Card */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9C5A7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 flex items-center justify-center text-[#22C55E]">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-black text-[#3D1020]">Direct WhatsApp Orders &amp; Help</h3>
            <p className="text-xs text-[#684332] leading-relaxed">
              Instant responses from our cafe manager during kitchen operating hours.
            </p>
            <a
              href={generateWhatsAppUrl(`Hello ${restaurantProfile.name}! 👋`, restaurantProfile.whatsappPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-black text-[#22C55E] hover:underline"
            >
              <span>+91 {restaurantProfile.whatsappPhone}</span>
            </a>
          </div>

          {/* Helpline Phone */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9C5A7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#7C203A]/15 flex items-center justify-center text-[#7C203A]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-black text-[#3D1020]">Phone Helpline</h3>
            <p className="text-xs text-[#684332] leading-relaxed">
              For table reservations and direct store queries.
            </p>
            <a
              href={`tel:${restaurantProfile.phone}`}
              className="inline-flex items-center gap-2 text-xs font-black text-[#7C203A] hover:underline"
            >
              <span>{restaurantProfile.phone}</span>
            </a>
          </div>

          {/* Address & Hours */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9C5A7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBE4CB] flex items-center justify-center text-[#3D1020]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-black text-[#3D1020]">Location &amp; Hours</h3>
            <div className="space-y-1.5 text-xs text-[#684332]">
              <p>
                {restaurantProfile.address}, {restaurantProfile.locality}, {restaurantProfile.city} - {restaurantProfile.pincode}
              </p>
              <p className="font-semibold text-[#3D1020] flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#7C203A]" />
                <span>{restaurantProfile.openingHours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9C5A7] shadow-xs space-y-5">
          <div>
            <h2 className="font-serif text-xl font-black text-[#3D1020]">Send Us a Message</h2>
            <p className="text-xs text-[#947362] mt-1">We will connect with you immediately.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-[#3D1020] block mb-1.5">Your Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A]"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#3D1020] block mb-1.5">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-[#3D1020] block mb-1.5">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A]"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Table Reservation">Table Reservation</option>
                <option value="Bulk / Party Catering">Bulk / Party Catering</option>
                <option value="Feedback / Suggestion">Feedback / Suggestion</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-[#3D1020] block mb-1.5">Your Message *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we assist you today?"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E9C5A7] bg-[#FFF4E8]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C203A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#7C203A] hover:bg-[#5D162C] text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
