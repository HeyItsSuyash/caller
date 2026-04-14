'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, User, Building2, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const [accountType, setAccountType] = useState<'personal' | 'agency'>('personal');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, accountType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 font-sans antialiased text-black">
      <div className="w-full max-w-[440px] bg-white p-10 rounded-[32px] border border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] space-y-10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-xl transform skew-y-3 hover:skew-y-0 transition-transform duration-500">
            <Activity className="text-white w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Caller AI</h1>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em] opacity-50">Initialize New Workspace</p>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50/50 border border-red-100 text-red-600 rounded-2xl text-[11px] font-bold flex items-center gap-3 animate-in shake duration-300">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setAccountType('personal')}
                className={`p-5 border rounded-[20px] cursor-pointer transition-all flex flex-col gap-4 relative overflow-hidden group ${
                  accountType === 'personal' ? 'border-black bg-black/[0.02] ring-1 ring-black' : 'border-black/5 hover:border-black/20 bg-[#fbfbfb]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${accountType === 'personal' ? 'bg-black text-white' : 'bg-white text-secondary'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider">Personal</p>
                  <p className="text-[9px] text-secondary/60 font-bold uppercase tracking-tighter">Individual</p>
                </div>
                {accountType === 'personal' && <CheckCircle2 className="w-4 h-4 absolute top-4 right-4 text-black" />}
              </div>
              <div 
                onClick={() => setAccountType('agency')}
                className={`p-5 border rounded-[20px] cursor-pointer transition-all flex flex-col gap-4 relative overflow-hidden group ${
                  accountType === 'agency' ? 'border-black bg-black/[0.02] ring-1 ring-black' : 'border-border hover:border-black/30 bg-[#fbfbfb]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${accountType === 'agency' ? 'bg-black text-white' : 'bg-white text-secondary'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider">Agency</p>
                  <p className="text-[9px] text-secondary/60 font-bold uppercase tracking-tighter">Enterprise</p>
                </div>
                {accountType === 'agency' && <CheckCircle2 className="w-4 h-4 absolute top-4 right-4 text-black" />}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-70 px-1">Identity Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name" 
                  required
                  className="w-full py-4 px-5 bg-[#f9f9f9] border border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none text-sm transition-all disabled:opacity-50 font-medium placeholder:text-neutral-400" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-70 px-1">Workspace Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  className="w-full py-4 px-5 bg-[#f9f9f9] border border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none text-sm transition-all disabled:opacity-50 font-medium placeholder:text-neutral-400" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-70 px-1">Access Key</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create strong password" 
                  required
                  className="w-full py-4 px-5 bg-[#f9f9f9] border border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none text-sm transition-all disabled:opacity-50 font-medium placeholder:text-neutral-400" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-[54px] bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 active:scale-[0.98] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Initializing...' : 'Establish Workspace'}</span>
            {!loading && (
              <div className="pt-0.5">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] font-medium text-secondary pt-4 border-t border-black/[0.04]">
          Managed entity already exists? <Link href="/login" className="text-black font-black hover:underline underline-offset-4 decoration-2">Sign In</Link>
        </div>
      </div>
      
      <div className="mt-12 text-[9px] font-black text-secondary/30 uppercase tracking-[0.4em]">
        SYSTEM CORE • SECURE REGISTRATION
      </div>
    </div>
  );
}
