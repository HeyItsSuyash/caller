'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building2, Eye, EyeOff, AlertCircle } from 'lucide-react';
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

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'personal' | 'agency'>('personal');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, accountType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
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
        <div className="space-y-1 mb-2">
          <h1 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-white leading-tight font-display">
            Initialize Workspace.<br />Scale Your Operations.
          </h1>
          <p className="text-neutral-500 text-[10.5px] font-semibold max-w-sm leading-relaxed">
            Register your workspace identity to coordinate outbound sales and automated voice agents.
          </p>
        </div>

        {/* Form container */}
        <div className="max-w-md w-full space-y-2.5">
          
          {/* Account Type Selector */}
          <div className="grid grid-cols-2 gap-2">
            <div 
              onClick={() => setAccountType('personal')}
              className={`p-2 border rounded-lg cursor-pointer transition-all flex items-center gap-3 relative overflow-hidden group ${
                accountType === 'personal' ? 'border-white bg-white/[0.05]' : 'border-white/30 bg-white/[0.015] hover:border-white/45'
              }`}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.05] text-neutral-300">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider">Personal</p>
                <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-tighter">Individual</p>
              </div>
            </div>
            
            <div 
              onClick={() => setAccountType('agency')}
              className={`p-2 border rounded-lg cursor-pointer transition-all flex items-center gap-3 relative overflow-hidden group ${
                accountType === 'agency' ? 'border-white bg-white/[0.05]' : 'border-white/30 bg-white/[0.015] hover:border-white/45'
              }`}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.05] text-neutral-300">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider">Agency</p>
                <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-tighter">Enterprise</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 text-[8px] font-black text-neutral-600 uppercase tracking-widest py-0.5">
            <div className="flex-1 h-[1px] bg-white/30" />
            <span>or register with credentials</span>
            <div className="flex-1 h-[1px] bg-white/30" />
          </div>

          {/* Core Credentials Signup Form */}
          <form onSubmit={handleSignup} className="space-y-1.5">
            {error && (
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-[10px] font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="relative">
              <User className="w-3.5 h-3.5 text-neutral-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Identity Name"
                required
                className="w-full bg-white/[0.015] border border-white/30 rounded-lg pl-10 pr-4 py-1.5 text-[11px] text-white placeholder-neutral-600 focus:outline-none focus:border-white/45 font-semibold"
              />
            </div>

            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-neutral-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-white/[0.015] border border-white/30 rounded-lg pl-10 pr-4 py-1.5 text-[11px] text-white placeholder-neutral-600 focus:outline-none focus:border-white/45 font-semibold"
              />
            </div>

            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-neutral-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Key Password"
                required
                className="w-full bg-white/[0.015] border border-white/30 rounded-lg pl-10 pr-10 py-1.5 text-[11px] text-white placeholder-neutral-600 focus:outline-none focus:border-white/45 font-semibold"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-1.5 bg-white/[0.03] hover:bg-white/5 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-white/30 hover:border-white/45 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Continue'}
            </button>
          </form>

          {/* Links */}
          <div className="text-center text-[9px] font-bold text-neutral-500 uppercase tracking-widest pt-1">
            Already have an account? <Link href="/login" className="text-white hover:underline">Sign In</Link>
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
