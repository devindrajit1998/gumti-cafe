'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div
      id="app-toast-container"
      className="fixed bottom-20 md:bottom-8 right-4 left-4 md:left-auto md:w-96 z-50 transition-all duration-300 transform translate-y-0"
    >
      <div
        id="app-toast"
        className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-900/95 text-white border-emerald-700/50'
            : isError
            ? 'bg-rose-900/95 text-white border-rose-700/50'
            : 'bg-zinc-900/95 text-white border-zinc-700/50'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-300" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-300" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold tracking-tight leading-snug">{toast.title}</p>
          {toast.desc && <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{toast.desc}</p>}
        </div>
      </div>
    </div>
  );
};
