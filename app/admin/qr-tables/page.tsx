'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Printer, QrCode } from 'lucide-react';
import Image from 'next/image';

export default function AdminQRTablesPage() {
  const { restaurantProfile } = useApp();
  const [tableCount, setTableCount] = useState(10);
  const [selectedTable, setSelectedTable] = useState('1');

  const qrUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?table=${selectedTable}`
      : `https://zaikakitchen.app/?table=${selectedTable}`;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900">Table QR Standees</h1>
        <p className="text-sm text-zinc-500 mt-1">Generate QR codes for each table so guests can scan and order directly from the menu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-5 lg:col-span-1">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100">
            <QrCode className="w-5 h-5 text-orange-600" />
            <h2 className="text-sm font-black text-zinc-900">QR Generator Settings</h2>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1.5">Total Dine-In Tables</label>
            <input
              type="number"
              min={1}
              max={50}
              value={tableCount}
              onChange={(e) => {
                const v = Math.min(50, Math.max(1, Number(e.target.value)));
                setTableCount(v);
                if (Number(selectedTable) > v) setSelectedTable('1');
              }}
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-2">Select Table to Preview</label>
            <div className="grid grid-cols-4 gap-1.5 max-h-52 overflow-y-auto p-1.5 bg-zinc-50 rounded-xl border border-zinc-200">
              {Array.from({ length: tableCount }, (_, i) => String(i + 1)).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTable(t)}
                  className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                    selectedTable === t ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  T{t}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-zinc-500 bg-zinc-50 p-3 rounded-xl border border-zinc-100 leading-relaxed">
            💡 When guests scan this QR code, they land directly on your menu with Table #{selectedTable} pre-selected. Orders are sent to your WhatsApp kitchen line.
          </p>

          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-black rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            Print Standee
          </button>
        </div>

        {/* Standee Preview */}
        <div className="lg:col-span-2 flex items-center justify-center py-4">
          <div
            id="printable-table-standee"
            className="bg-white border-2 border-orange-500 rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl relative overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-orange-600 to-amber-500" />

            <div className="w-16 h-16 rounded-full bg-[#FFFDF9] border border-[#E9C5A7] mx-auto mt-4 mb-4 shadow-sm relative overflow-hidden">
              <Image
                src={restaurantProfile.logoImage || '/logo-gumti.png'}
                alt={restaurantProfile.name}
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-wide leading-tight">
              {restaurantProfile.name}
            </h2>
            <p className="text-xs text-zinc-500 font-semibold mt-1 mb-6">
              Scan to view digital menu &amp; order via WhatsApp
            </p>

            {/* QR Code */}
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 inline-block mb-6 shadow-inner">
              <div className="w-44 h-44 bg-white p-2 rounded-xl border border-zinc-100 shadow-sm flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrUrl)}`}
                  alt={`QR Code for Table ${selectedTable}`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>

            {/* Table Number Badge */}
            <div className="bg-orange-600 text-white py-2.5 px-6 rounded-2xl font-black text-base uppercase tracking-widest inline-block shadow-md">
              TABLE #{selectedTable}
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-100 text-[10px] text-zinc-400 space-y-1">
              <p className="font-bold text-zinc-600">No App Download • No Login Required</p>
              <p>Orders sent directly to kitchen WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
