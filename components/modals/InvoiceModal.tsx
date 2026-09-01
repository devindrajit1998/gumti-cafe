'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import {
  FileText,
  X,
  Printer,
  Download,
  ShieldCheck,
  Building,
  Calendar,
  CreditCard,
  MapPin,
} from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, activeOrder, viewingInvoiceOrder, showToast } = useApp();
  const { modalRef } = useModalAccessibility(isInvoiceModalOpen, () => setIsInvoiceModalOpen(false));
  const order = viewingInvoiceOrder || activeOrder;

  if (!isInvoiceModalOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Invoice Downloaded 📄', `GST Tax Invoice #${order.orderNumber || order.id} saved as PDF`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Order invoice"
        tabIndex={-1}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] focus:outline-none"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-orange-400" />
            <div>
              <h2 className="text-sm font-black tracking-tight">Tax Invoice &amp; Food Bill</h2>
              <span className="text-[11px] text-zinc-400">GSTIN: 29AABCU9603R1ZM</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-zinc-700">
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFFDF9] border border-[#E9C5A7] relative overflow-hidden shrink-0 p-1">
                <Image
                  src={order.restaurantImage || '/logo-gumti.png'}
                  alt={order.restaurantName}
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-[#7C203A] uppercase tracking-wider block">
                  OFFICIAL TAX INVOICE
                </span>
                <h3 className="text-xl font-black text-zinc-950 mt-0.5">{order.restaurantName}</h3>
                <p className="text-zinc-500 mt-1 max-w-xs">{order.restaurantAddress}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">FSSAI Lic No: 11223344556677</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 bg-zinc-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className="text-xs font-black text-zinc-900 block">
                INVOICE #{order.orderNumber || order.id}
              </span>
              <p className="text-zinc-500">Date: {order.createdAt || '19 Aug 2026'}</p>
              <p className="text-zinc-500">Order ID: {order.id}</p>
              <p className="text-zinc-500">Mode: {order.paymentMethod}</p>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-200">
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Billed To:
              </span>
              <h4 className="font-extrabold text-zinc-900">Indrajit Ghosh</h4>
              <p className="text-zinc-600 mt-0.5">{order.deliveryAddress.phone}</p>
              <p className="text-zinc-500 text-[11px] mt-0.5">IndrajitGhosh449@gmail.com</p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Delivered To:
              </span>
              <p className="font-medium text-zinc-800">
                {order.deliveryAddress.street}, {order.deliveryAddress.area}
              </p>
              <p className="text-zinc-500 text-[11px]">
                {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] font-black uppercase text-zinc-500">
                  <th className="pb-2">Dish Description</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Unit Rate</th>
                  <th className="pb-2 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {order.items.map((it) => (
                  <tr key={it.id} className="py-2.5">
                    <td className="py-2.5 pr-2">
                      <span className="font-bold text-zinc-900 block">{it.name}</span>
                      {it.customizations && it.customizations.length > 0 && (
                        <span className="text-[10px] text-zinc-500">
                          {it.customizations
                            .map((c) => `${c.groupTitle}: ${c.selectedOptions.map((o) => o.name).join(', ')}`)
                            .join(' • ')}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-center font-semibold">{it.quantity}</td>
                    <td className="py-2.5 text-right font-medium">₹{it.price}</td>
                    <td className="py-2.5 text-right font-bold text-zinc-900">
                      ₹{it.price * it.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bill Totals Calculation */}
          <div className="pt-4 border-t border-zinc-200 flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">₹{order.itemTotal}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>CGST (2.5%)</span>
                <span>₹{(order.taxes / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>SGST (2.5%)</span>
                <span>₹{(order.taxes / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery &amp; Packaging</span>
                <span>₹{order.deliveryFee}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- ₹{order.discount}</span>
                </div>
              )}
              {order.tip > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Rider Tip</span>
                  <span>₹{order.tip}</span>
                </div>
              )}
              <div className="pt-2 border-t border-zinc-300 flex justify-between font-black text-sm text-zinc-950">
                <span>GRAND TOTAL</span>
                <span className="text-orange-600">₹{order.grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Legal Footer */}
          <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Computer generated invoice. No physical signature required.</span>
            </div>
            <span>Zaika Food Platform Pvt Ltd</span>
          </div>
        </div>
      </div>
    </div>
  );
};
