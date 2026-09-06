'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export interface AdminUser {
  username: string;
  role: 'admin';
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  logout: async () => {},
  checkSession: async () => false,
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { restaurantProfile } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Form states
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  // Countdown timer for lockout if rate-limited
  useEffect(() => {
    if (!lockoutSeconds || lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (!prev || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Session verification on mount
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/auth/session', {
        method: 'GET',
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          return true;
        }
      }
      setIsAuthenticated(false);
      setAdminUser(null);
      return false;
    } catch (err) {
      console.error('Failed to verify admin session:', err);
      setIsAuthenticated(false);
      setAdminUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds && lockoutSeconds > 0) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        setPassword('');
        setError('');
      } else {
        if (res.status === 429 && data.retryAfter) {
          setLockoutSeconds(data.retryAfter);
        }
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to the authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      setPassword('');
      setError('');
    }
  };

  // 1. Session verification loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A0B16] via-[#3D1020] to-[#1A050E] flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center">
          <div className="w-14 h-14 relative mb-4">
            <Image
              src={restaurantProfile.logoImage || '/logo-gumti.png'}
              alt={restaurantProfile.name || 'Gumti Cafe'}
              fill
              className="object-contain animate-pulse"
              priority
            />
          </div>
          <div className="flex items-center gap-2.5 text-[#F8D6B2] text-xs font-semibold tracking-wider uppercase">
            <div className="w-4 h-4 border-2 border-[#F8D6B2] border-t-transparent rounded-full animate-spin" />
            <span>Verifying Admin Session...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Render Production-Grade Login Form
  if (!isAuthenticated) {
    const isLocked = Boolean(lockoutSeconds && lockoutSeconds > 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#220710] via-[#370D1C] to-[#15030A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#7C203A]/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#C64B3C]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl shadow-2xl border border-[#E9C5A7]/80 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
          {/* Top Brand Header */}
          <div className="bg-gradient-to-r from-[#501324] via-[#7C203A] to-[#501324] p-7 text-center relative text-white border-b border-[#E9C5A7]/30">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-md mb-3 border border-white/10 shadow-inner">
              <div className="h-14 w-44 relative">
                <Image
                  src={restaurantProfile.logoImage || '/logo-gumti.png'}
                  alt={restaurantProfile.name || 'Gumti Cafe'}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-[#F8D6B2] font-black uppercase tracking-widest mt-1">
              <ShieldCheck className="w-4 h-4 text-[#F8D6B2]" />
              <span>Admin Management Portal</span>
            </div>
            <p className="text-[11px] text-white/60 mt-0.5">Secure server-verified credentials required</p>
          </div>

          {/* Form Area */}
          <div className="p-7 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Input */}
              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-[11px] font-black uppercase tracking-wider text-[#684332] mb-1.5 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#7C203A]" />
                  <span>Admin Username</span>
                </label>
                <div className="relative">
                  <input
                    id="admin-username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter admin username..."
                    autoComplete="username"
                    required
                    disabled={isLoading || isLocked}
                    className="w-full px-4 py-3 bg-[#FFF7EE] border border-[#E9C5A7] rounded-xl text-sm font-semibold text-[#3D1020] placeholder-[#B89C8A] focus:outline-none focus:ring-2 focus:ring-[#7C203A] focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-[11px] font-black uppercase tracking-wider text-[#684332] mb-1.5 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#7C203A]" />
                  <span>Master Password</span>
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter master password..."
                    autoComplete="current-password"
                    required
                    disabled={isLoading || isLocked}
                    className="w-full pl-4 pr-11 py-3 bg-[#FFF7EE] border border-[#E9C5A7] rounded-xl text-sm font-semibold text-[#3D1020] placeholder-[#B89C8A] focus:outline-none focus:ring-2 focus:ring-[#7C203A] focus:bg-white transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isLocked}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#947362] hover:text-[#7C203A] transition-colors focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading || isLocked}
                    className="w-4 h-4 rounded border-[#E9C5A7] text-[#7C203A] focus:ring-[#7C203A] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-[#684332]">Remember me for 7 days</span>
                </label>
                <span className="text-[10px] text-[#947362] font-mono">v2.0 Secure</span>
              </div>

              {/* Error or Lockout Notification */}
              {isLocked ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs font-bold text-amber-900 animate-in fade-in">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black">Temporary Security Lockout</p>
                    <p className="text-[11px] font-medium text-amber-800 mt-0.5">
                      Too many incorrect attempts. Please wait{' '}
                      <span className="font-mono font-bold text-amber-950">{lockoutSeconds}s</span> before retrying.
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-700 animate-in shake duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isLocked}
                className="w-full py-3.5 bg-gradient-to-r from-[#7C203A] to-[#63142B] hover:from-[#6A1B31] hover:to-[#501022] active:scale-[0.99] text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Customer Storefront */}
            <div className="mt-6 pt-5 border-t border-[#F3DCC5] text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#947362] hover:text-[#7C203A] transition-colors"
              >
                ← Return to Customer Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated: Wrap with AdminAuthContext and render dashboard children
  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        logout: handleLogout,
        checkSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
