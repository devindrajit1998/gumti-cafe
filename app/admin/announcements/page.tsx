'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Save, Megaphone } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const { bannerAnnouncement, updateBannerAnnouncement, showToast } = useApp();

  const [enabled, setEnabled] = useState(bannerAnnouncement?.enabled ?? false);
  const [badge, setBadge] = useState(bannerAnnouncement?.badge ?? 'NOTICE');
  const [text, setText] = useState(bannerAnnouncement?.text ?? '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBannerAnnouncement({ enabled, badge, text });
    showToast('Announcement saved! 📢', enabled ? 'Banner is now live on your store.' : 'Banner is currently hidden.', 'success');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900">Announcement Banner</h1>
        <p className="text-sm text-zinc-500 mt-1">Display a scrolling banner at the top of your storefront for promotions, alerts, or specials.</p>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Toggle Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-zinc-900">Banner Status</p>
            <p className="text-xs text-zinc-500 mt-0.5">{enabled ? 'Visible on your storefront' : 'Hidden from customers'}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="sr-only peer" />
            <div className="w-12 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100">
            <Megaphone className="w-5 h-5 text-orange-600" />
            <h2 className="text-sm font-black text-zinc-900">Banner Content</h2>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1.5">Badge Tag</label>
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. FESTIVAL OFFER, WEEKEND SPECIAL, NOTICE"
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-[11px] text-zinc-400 mt-1">Short label that appears on the left side of the banner.</p>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1.5">Announcement Message</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Flat 20% OFF on all Tandoori Kebabs & Biryanis today! Use code ZAIKA20 at checkout."
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          {/* Live Preview */}
          <div>
            <p className="text-[11px] font-bold text-zinc-400 uppercase mb-2">Storefront Preview</p>
            <div className={`p-3 rounded-xl flex items-center gap-3 text-sm transition-all ${enabled ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-zinc-100'}`}>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shrink-0 ${enabled ? 'bg-white text-orange-700' : 'bg-zinc-200 text-zinc-500'}`}>
                {badge || 'NOTICE'}
              </span>
              <span className={`text-xs font-bold truncate ${enabled ? 'text-white' : 'text-zinc-400'}`}>
                {text || 'Your announcement text will appear here...'}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-sm flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
