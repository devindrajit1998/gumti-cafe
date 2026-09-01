'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useModalAccessibility } from '@/hooks/useModalAccessibility';
import { X, Phone, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, showToast } = useApp();
  const { modalRef } = useModalAccessibility(isAuthModalOpen, () => setIsAuthModalOpen(false));
  const [phoneOrEmail, setPhoneOrEmail] = useState('9876543210');
  const [name, setName] = useState('Indrajit Ghosh');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState(['5', '8', '2', '4', '1', '9']);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) {
      showToast('Please enter mobile or email', undefined, 'error');
      return;
    }
    setStep('otp');
    showToast('OTP sent!', 'Use code 582419 for demo login', 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(phoneOrEmail, name || 'Indrajit Ghosh');
    setStep('input');
  };

  const handleQuickLogin = (demoName: string, demoContact: string) => {
    loginUser(demoContact, demoName);
    setStep('input');
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        id="auth-modal-content"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        tabIndex={-1}
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Close sign-in dialog"
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white text-orange-600 flex items-center justify-center mb-3 shadow-md font-black text-xl">
            Z
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Welcome to Zaika</h3>
          <p className="text-xs text-orange-100 mt-1">Sign in to unlock exclusive dining perks, saved addresses & quick ordering</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'input' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 bg-zinc-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Phone Number or Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 text-xs font-semibold">
                    +91
                  </div>
                  <input
                    type="text"
                    placeholder="98765 43210"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    required
                    className="w-full text-xs p-3 pl-12 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 bg-zinc-50 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="send-otp-btn"
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-zinc-400 font-semibold">1-Click Fast Login</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickLogin('Indrajit Ghosh', 'IndrajitGhosh449@gmail.com')}
                className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-zinc-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Demo User: Indrajit Ghosh
              </button>

              <p className="text-[10px] text-zinc-400 text-center leading-relaxed mt-2">
                By continuing, you agree to Zaika&apos;s Terms of Service and Privacy Policy.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-zinc-600 font-medium">
                  Enter the 6-digit OTP sent to <span className="font-bold text-zinc-900">+91 {phoneOrEmail}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2 my-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-10 h-11 text-center text-base font-bold rounded-xl border border-zinc-300 focus:border-orange-500 bg-zinc-50 focus:outline-hidden"
                  />
                ))}
              </div>

              <button
                type="submit"
                id="verify-otp-btn"
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify & Log In
              </button>

              <button
                type="button"
                onClick={() => setStep('input')}
                className="w-full text-center text-xs text-zinc-500 hover:text-zinc-800 font-medium"
              >
                Change Number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
