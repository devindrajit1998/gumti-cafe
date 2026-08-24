'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Lock, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { restaurantProfile } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => (
    typeof window !== 'undefined'
      ? sessionStorage.getItem('ghuti_admin_auth') === 'authenticated'
      : null
  ));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Default admin credentials / master password
    const validPass = 'admin123';

    setTimeout(() => {
      if (password === validPass || password === 'ghuti2026' || password === 'admin') {
        sessionStorage.setItem('ghuti_admin_auth', 'authenticated');
        setIsAuthenticated(true);
      } else {
        setError('Incorrect password. Please try again.');
      }
      setIsLoading(false);
    }, 300);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ghuti_admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  // While checking initial session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#3D1020] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#F8D6B2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated: render premium login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A0B16] via-[#3D1020] to-[#1A050E] flex flex-col items-center justify-center p-4">
        {/* Subtle decorative circles */}
        <div className="absolute w-96 h-96 bg-[#7C203A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl shadow-2xl border border-[#E9C5A7] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
          {/* Header Banner */}
          <div className="bg-[#7C203A] p-8 text-center relative">
            <div className="h-20 w-56 mx-auto relative mb-3">
              <Image
                src={restaurantProfile.logoImage || '/logo-gumti.png'}
                alt={restaurantProfile.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-xs text-[#F8D6B2] font-semibold mt-1 uppercase tracking-wider">
              Management Portal Login
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#684332] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#7C203A]" />
                  <span>Admin Access Password</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#947362] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter owner password..."
                    autoFocus
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF4E8] border border-[#E9C5A7] rounded-xl text-sm font-semibold text-[#3D1020] placeholder-[#B89C8A] focus:outline-none focus:ring-2 focus:ring-[#7C203A] transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#947362] mt-1.5">
                  Default pass: <span className="font-mono font-bold text-[#7C203A]">admin123</span>
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-700 animate-in shake duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#7C203A] hover:bg-[#5D162C] active:scale-[0.99] text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Unlock Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#F3DCC5] text-center">
              <Link
                href="/"
                className="text-xs font-bold text-[#947362] hover:text-[#7C203A] transition-colors"
              >
                ← Return to Customer Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated
  return <>{children}</>;
};
