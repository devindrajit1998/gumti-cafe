'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  QrCode,
  Printer,
  Download,
  Share2,
  ExternalLink,
  UtensilsCrossed,
  Sparkles,
  MessageCircle,
  Copy,
  ChevronLeft,
} from 'lucide-react';

export const QRCodeView: React.FC = () => {
  const { restaurantProfile, navigateTo, showToast } = useApp();
  const [selectedTable, setSelectedTable] = useState<string>('1');
  const [qrType, setQrType] = useState<'table' | 'menu'>('table');

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://zaikakitchen.com';
  
  const targetUrl =
    qrType === 'table'
      ? `${originUrl}/?table=${selectedTable}`
      : `${originUrl}/`;

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
    targetUrl
  )}&bgcolor=ffffff&color=18181b&margin=1`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(targetUrl);
      showToast('QR Code URL Copied! 📋', targetUrl, 'success');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleOpenTableMenu = () => {
    navigateTo('home', { table: selectedTable });
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1 text-xs font-semibold text-[#7D7872] hover:text-[#1A1816] mb-2 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Menu</span>
          </button>
          <div className="flex items-center gap-2 text-[#D94814] text-[10px] font-bold uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5" />
            <span>Table Standee QR Generator</span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1816] mt-0.5">
            Dine-In Table QR Tent Card
          </h1>
          <p className="text-xs text-[#7D7872] mt-0.5 max-w-lg">
            Printable QR tent cards for your restaurant tables so guests can scan and order directly via WhatsApp with zero login.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#1A1816] hover:bg-[#2E2B27] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print QR Card</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E5DD] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[#1A1816]">QR Type:</label>
          <div className="flex bg-[#FAF9F5] p-1 rounded-lg border border-[#E8E5DD]">
            <button
              onClick={() => setQrType('table')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                qrType === 'table' ? 'bg-white text-[#1A1816] shadow-xs' : 'text-[#7D7872]'
              }`}
            >
              Dine-In Table QR
            </button>
            <button
              onClick={() => setQrType('menu')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                qrType === 'menu' ? 'bg-white text-[#1A1816] shadow-xs' : 'text-[#7D7872]'
              }`}
            >
              Counter Standee QR
            </button>
          </div>
        </div>

        {qrType === 'table' && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#1A1816]">Select Table:</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-white border border-[#E8E5DD] rounded-lg px-3 py-1 text-xs font-bold text-[#1A1816] focus:outline-none focus:border-[#D94814]"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Table #{n}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* PRINTABLE QR CARD DISPLAY */}
      <div className="flex justify-center py-4">
        <div
          id="printable-table-qr-card"
          className="bg-white rounded-2xl p-8 sm:p-10 border border-[#D8D4CA] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] max-w-sm w-full text-center space-y-4 relative overflow-hidden"
        >
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#D94814]" />

          {/* Restaurant Brand Header */}
          <div className="space-y-1 pt-2">
            <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border border-[#E9C5A7] mx-auto flex items-center justify-center relative overflow-hidden p-1">
              <Image
                src={restaurantProfile.logoImage || '/logo-gumti.png'}
                alt={restaurantProfile.name}
                fill
                className="object-contain p-0.5"
              />
            </div>
            <h2 className="font-serif text-lg font-bold text-[#1A1816] tracking-tight mt-2">
              {restaurantProfile.name}
            </h2>
            <p className="text-[10px] font-bold text-[#7D7872] uppercase tracking-wider">
              Scan • Select • Direct WhatsApp Order
            </p>
          </div>

          {/* Table Number Badge */}
          <div className="py-1 px-3 bg-[#FCF7EC] rounded-md border border-[#F2E5C8] inline-block">
            <span className="text-xs font-bold text-[#8A6A1E]">
              {qrType === 'table' ? `TABLE #${selectedTable}` : 'MAIN RESTAURANT MENU'}
            </span>
          </div>

          {/* QR Code */}
          <div className="bg-white p-3 rounded-xl border border-[#E8E5DD] inline-block">
            <img
              src={qrCodeImageUrl}
              alt={`QR Code for ${restaurantProfile.name}`}
              className="w-48 h-48 sm:w-52 sm:h-52 mx-auto object-contain"
            />
          </div>

          {/* Footnote */}
          <div className="space-y-1.5 text-xs text-[#7D7872] pt-1">
            <div className="flex items-center justify-center gap-1.5 text-[#1A1816] font-semibold text-[11px]">
              <Sparkles className="w-3 h-3 text-[#C59A3F]" />
              <span>Zero Login • Zero App Download</span>
            </div>
            <p className="text-[10px] text-[#7D7872] max-w-[220px] mx-auto leading-tight">
              Scan with your phone camera to view full digital menu and send order to the kitchen.
            </p>
          </div>

          {/* WhatsApp Direct */}
          <div className="pt-2 border-t border-[#F0EDE5] flex items-center justify-center gap-1 text-[10px] font-semibold text-[#15803D]">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Instant Kitchen Confirmation via WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Action Links */}
      <div className="bg-[#FAF9F5] rounded-xl p-4 border border-[#E8E5DD] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[#7D7872]">
          <span className="font-semibold text-[#1A1816]">Target Link: </span>
          <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#E8E5DD] text-[11px]">{targetUrl}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-white hover:bg-[#F4F2EC] border border-[#E8E5DD] rounded-lg font-semibold text-[#1A1816] flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>

          <button
            onClick={handleOpenTableMenu}
            className="px-3 py-1.5 bg-[#D94814] hover:bg-[#C03E0F] text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test Table #{selectedTable}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
