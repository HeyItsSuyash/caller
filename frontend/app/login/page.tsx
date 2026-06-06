'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import Globe3DDemo from '@/components/3d-globe-demo';
import GlobeTelemetry from '@/components/auth/GlobeTelemetry';
import AuthTelemetry from '@/components/auth/AuthTelemetry';

const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('caller.work')) {
      return 'https://caller-24ie.onrender.com';
    }
  }
  return 'http://127.0.0.1:3001';
};

const BACKEND_URL = getBackendUrl();

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = '/workspace';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      globe={<Globe3DDemo />}
      telemetry={<GlobeTelemetry />}
    >
      <div className="space-y-3.5">
        {/* logo */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-extrabold text-[14px] tracking-tight text-white font-display">caller.work</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Subheader */}
        <p className="text-neutral-500 text-[10px] font-bold leading-tight max-w-xs uppercase tracking-wider">
          Professional communications infrastructure for modern organizations.
        </p>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-white leading-tight font-display">
            Deploy AI Agents.<br />Scale Every Conversation.
          </h1>
          <p className="text-neutral-500 text-[10.5px] font-semibold max-w-sm leading-relaxed">
            AI-powered voice agents for sales, support, recruiting, operations, and customer success.
          </p>
        </div>

        {/* Form container */}
        <div className="max-w-md w-full space-y-3">
          
          {/* Google authentication */}
          <button 
            type="button" 
            onClick={() => alert('OAuth configured. Add credentials in Google Developer console.')}
            className="w-full py-2 bg-white text-black font-extrabold text-[11px] rounded-lg transition-all flex items-center justify-center gap-2 hover:bg-neutral-100 cursor-pointer shadow-sm"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 text-[8px] font-black text-neutral-600 uppercase tracking-widest py-0.5">
            <div className="flex-1 h-[1px] bg-white/30" />
            <span>or continue with</span>
            <div className="flex-1 h-[1px] bg-white/30" />
          </div>

          {/* Phone Authentication */}
          <div className="space-y-1">
            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-white/[0.015] border border-white/30 rounded-lg px-2.5 py-1.5 text-[11px] text-neutral-400 cursor-pointer hover:border-white/45">
                <span>🇺🇸</span>
                <span className="font-bold">+1</span>
                <span className="text-[6px] text-neutral-500">▼</span>
              </div>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number" 
                className="flex-1 bg-white/[0.015] border border-white/30 rounded-lg px-3 py-1.5 text-[11px] text-white placeholder-neutral-600 focus:outline-none focus:border-white/45 font-semibold"
              />
            </div>
            <button 
              type="button" 
              onClick={() => alert('SMS verification setup is active. Fill email form to proceed.')}
              className="w-full py-1.5 bg-white/[0.03] hover:bg-white/5 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-white/30 hover:border-white/45 transition-all cursor-pointer"
            >
              Continue
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 text-[8px] font-black text-neutral-600 uppercase tracking-widest py-0.5">
            <div className="flex-1 h-[1px] bg-white/30" />
            <span>or</span>
            <div className="flex-1 h-[1px] bg-white/30" />
          </div>

          {/* Core Credentials Login Form */}
          <form onSubmit={handleLogin} className="space-y-1.5">
            {error && (
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-[10px] font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="relative">
              <Mail className="w-3 h-3 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-white/[0.015] border border-white/30 rounded-lg pl-9 pr-4 py-1.5 text-[11px] text-white placeholder-neutral-600 focus:outline-none focus:border-white/45 font-semibold"
              />
            </div>

            <div className="relative">
              <Lock className="w-3 h-3 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-white/[0.015] border border-white/30 rounded-lg pl-9 pr-9 py-1.5 text-[11px] text-white placeholder-neutral-600 focus:outline-none focus:border-white/45 font-semibold"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-1.5 bg-white/[0.03] hover:bg-white/5 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-white/30 hover:border-white/45 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>

          {/* Links */}
          <div className="flex justify-between text-[9px] font-bold text-neutral-500 uppercase tracking-widest pt-0.5 px-1">
            <Link href="#" className="hover:text-white transition-colors">Forgot Password</Link>
            <Link href="/signup" className="text-white hover:underline">Create Account</Link>
          </div>

        </div>

        {/* Telemetry statistics & Partner badges */}
        <AuthTelemetry />
      </div>

      {/* Footer links */}
      <div className="flex gap-4 text-[9px] font-bold text-neutral-600 uppercase tracking-widest mt-2 z-10 relative">
        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
      </div>
    </AuthFormLayout>
  );
}
