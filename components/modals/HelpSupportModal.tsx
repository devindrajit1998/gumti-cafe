'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, MessageSquare, PhoneCall, HelpCircle, ChevronRight, Send, CheckCircle } from 'lucide-react';

const FAQS = [
  { q: 'How do I track my active live order?', a: 'Tap on the "Orders" tab or top banner to see live real-time GPS delivery tracking, driver phone, and live route status.' },
  { q: 'Can I cancel or modify my food order?', a: 'Orders can be cancelled before the restaurant accepts it. Once cooking begins, reach out to 24x7 live chat for assistance.' },
  { q: 'How do discount promo coupons work?', a: 'You can select from active deals on the Offers page or enter coupons like WELCOME50, FEAST150, or FREEDEL directly during cart review.' },
  { q: 'What safety standards are followed?', a: 'All delivery partners undergo thermal screening, use tamper-proof food seals, and offer 100% contactless doorstep delivery.' },
];

export const HelpSupportModal: React.FC = () => {
  const { isHelpModalOpen, setIsHelpModalOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'faq' | 'chat'>('faq');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to Zaika 24x7 Priority Support. How may I assist you with your orders or delivery today?',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isHelpModalOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    const newMsgList = [
      ...chatMessages,
      { sender: 'user' as const, text: userMsg, time: 'Now' },
    ];
    setChatMessages(newMsgList);
    setInputText('');

    setTimeout(() => {
      let reply = 'Thank you for reaching out! A dedicated Zaika support specialist is checking your account and will assist you immediately.';
      if (userMsg.toLowerCase().includes('order') || userMsg.toLowerCase().includes('late') || userMsg.toLowerCase().includes('track')) {
        reply = 'We are monitoring your delivery partner live on GPS. Your food is safely packed and arriving right on time!';
      } else if (userMsg.toLowerCase().includes('refund') || userMsg.toLowerCase().includes('cancel')) {
        reply = 'Refund requests are credited instantly to your original payment method (UPI / Card) within 15 minutes of verification.';
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: reply, time: 'Just now' },
      ]);
    }, 900);
  };

  return (
    <div
      id="help-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
      onClick={() => setIsHelpModalOpen(false)}
    >
      <div
        id="help-modal-content"
        className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Zaika Help & Support</h3>
              <p className="text-[11px] text-zinc-400">24x7 Customer Care & Live Assistance</p>
            </div>
          </div>
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 px-4 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'faq' ? 'border-orange-600 text-orange-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Frequent Questions
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'border-orange-600 text-orange-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Chat
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'faq' ? (
            <div className="space-y-4">
              {/* Quick Contact buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="p-3 rounded-xl border border-zinc-200 bg-orange-50/50 hover:bg-orange-50 text-left transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-orange-600 mb-1.5" />
                  <span className="text-xs font-bold text-zinc-900 block">Chat with Us</span>
                  <span className="text-[11px] text-zinc-500 block">Average reply &lt; 1 min</span>
                </button>
                <a
                  href="tel:18002008899"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Calling Toll-Free Care', '1800-200-8899 (Demo mode)', 'info');
                  }}
                  className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-left transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600 mb-1.5" />
                  <span className="text-xs font-bold text-zinc-900 block">Call Helpline</span>
                  <span className="text-[11px] text-zinc-500 block">Toll-free 1800-200-8899</span>
                </a>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">FAQs</h4>
                <div className="space-y-2">
                  {FAQS.map((faq, idx) => (
                    <details key={idx} className="group p-3 rounded-xl border border-zinc-200 bg-white">
                      <summary className="text-xs font-bold text-zinc-800 cursor-pointer list-none flex items-center justify-between">
                        <span>{faq.q}</span>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                      </summary>
                      <p className="text-xs text-zinc-600 mt-2 pt-2 border-t border-zinc-100 leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[380px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-orange-600 text-white rounded-br-xs'
                          : 'bg-zinc-100 text-zinc-800 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[9px] block mt-1 ${msg.sender === 'user' ? 'text-orange-200' : 'text-zinc-600'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-3 border-t border-zinc-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 bg-zinc-50"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
