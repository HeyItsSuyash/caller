'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
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
      <div className="w-full max-w-[420px] bg-white p-10 rounded-[32px] border border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] space-y-10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <Activity className="text-white w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Caller AI</h1>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em] opacity-50">Secure Access Terminal</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50/50 border border-red-100 text-red-600 rounded-2xl text-[11px] font-bold flex items-center gap-3 animate-in shake duration-300">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-70 px-1">Workspace Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                  <Mail className="w-4 h-4 text-secondary group-focus-within:text-black transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  className="w-full py-4 pl-12 pr-4 bg-[#f9f9f9] border border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none text-sm transition-all disabled:opacity-50 font-medium placeholder:text-neutral-400 input-with-icon" 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-70">Secret Password</label>
                <Link href="#" className="text-[10px] font-bold text-secondary hover:text-black transition-colors">Recover</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                  <Lock className="w-4 h-4 text-secondary group-focus-within:text-black transition-colors" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  required
                  className="w-full py-4 pl-12 pr-4 bg-[#f9f9f9] border border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none text-sm transition-all disabled:opacity-50 font-medium placeholder:text-neutral-400 input-with-icon" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-[54px] bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 active:scale-[0.98] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Verifying Credentials...' : 'Launch Workspace'}</span>
            {!loading && (
              <div className="pt-0.5">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </form>

        <div className="space-y-6 pt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.06]"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
              <span className="bg-white px-4 text-secondary/40">Nexus Network</span>
            </div>
          </div>

          <div className="text-center text-[11px] text-secondary font-medium">
            New to Caller AI? <Link href="/signup" className="text-black font-black hover:underline underline-offset-4 decoration-2">Create Account</Link>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-[9px] font-black text-secondary/30 uppercase tracking-[0.4em]">
        © 2026 CALLER AI • GLOBAL ACCESS
      </div>
    </div>
  );
}
