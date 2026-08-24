'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  X,
  Plus,
  Share2,
  Copy,
  Check,
  UserCheck,
  Utensils,
  Sparkles,
  ArrowRight,
  LogOut,
} from 'lucide-react';

export const GroupOrderModal: React.FC = () => {
  const {
    isGroupOrderModalOpen,
    setIsGroupOrderModalOpen,
    groupOrder,
    startGroupOrder,
    joinGroupOrder,
    leaveGroupOrder,
    setGroupOrderMember,
    cart,
    showToast,
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [inputName, setInputName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!isGroupOrderModalOpen) return null;

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(groupOrder.code);
      setIsCopied(true);
      showToast('Group Code Copied! 📋', 'Share it with your friends or coworkers', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast('Group Code', groupOrder.code, 'info');
    }
  };

  // Group items by contributor
  const contributorBreakdown: Record<string, { itemsCount: number; totalCost: number; items: typeof cart }> = {};
  for (const it of cart) {
    const owner = it.orderedBy || 'Host / Unassigned';
    if (!contributorBreakdown[owner]) {
      contributorBreakdown[owner] = { itemsCount: 0, totalCost: 0, items: [] };
    }
    contributorBreakdown[owner].itemsCount += it.quantity;
    contributorBreakdown[owner].totalCost += it.price * it.quantity;
    contributorBreakdown[owner].items.push(it);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-blue-700 via-indigo-700 to-blue-900 text-white relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Group Food Order</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-300 text-blue-950 rounded-md">
                  Bill Split
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Order together with friends &mdash; track who ordered what &amp; split bills easily on WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGroupOrderModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {!groupOrder.isGroup ? (
            /* Start or Join Group Flow */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-black text-blue-950">Host a Group Order</h3>
                    <p className="text-[11px] text-blue-800 font-medium mt-0.5">
                      Start a session, invite friends with a code, and all items are merged into a single WhatsApp delivery ticket.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Your Name (e.g. Indrajit)"
                    className="flex-1 text-xs font-semibold px-3 py-2.5 rounded-xl border border-blue-200 bg-white focus:outline-hidden focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => startGroupOrder(inputName || 'Indrajit Ghosh')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    Start Group
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-zinc-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-black uppercase text-zinc-400 absolute">
                  OR JOIN EXISTING
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h3 className="text-xs font-extrabold text-zinc-800">Join a Friend&apos;s Order</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Group Code (e.g. ZK-4821)"
                    className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white uppercase focus:outline-hidden focus:border-blue-600"
                  />
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Your Name (e.g. Rahul)"
                    className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!inputCode.trim() || !newMemberName.trim()) {
                      showToast('Missing details', 'Please enter code and your name', 'error');
                      return;
                    }
                    joinGroupOrder(inputCode, newMemberName);
                  }}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors"
                >
                  Join Group Session
                </button>
              </div>
            </div>
          ) : (
            /* Active Group Session Info */
            <div className="space-y-4">
              {/* Session Banner */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider block">
                    Active Group Session
                  </span>
                  <span className="text-xl font-black text-blue-950">{groupOrder.code}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-900 text-xs font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors shadow-2xs"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={leaveGroupOrder}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Leave Group"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Ordering Contributor */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {groupOrder.currentMember.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold block">Currently Adding Dishes As:</span>
                    <span className="text-xs font-black text-zinc-900">{groupOrder.currentMember}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Switch Member"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-zinc-200 bg-white w-28"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (inputName.trim()) {
                        setGroupOrderMember(inputName.trim());
                        setInputName('');
                      }
                    }}
                    className="px-2.5 py-1 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Contributor Bill Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                  Group Bill Split ({Object.keys(contributorBreakdown).length} Members)
                </h4>

                {Object.keys(contributorBreakdown).length === 0 ? (
                  <p className="text-xs text-zinc-400 italic text-center py-4 bg-zinc-50 rounded-xl">
                    No items in cart yet. Add dishes from any restaurant menu!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(contributorBreakdown).map(([member, data]) => (
                      <div
                        key={member}
                        className="p-3 rounded-xl border border-zinc-200 bg-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                            {member.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-zinc-900 block">{member}</span>
                            <span className="text-[10px] text-zinc-500">
                              {data.itemsCount} dishes &bull;{' '}
                              {data.items.map((i) => i.name).slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black text-zinc-900">₹{data.totalCost}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
