'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Mail, Lock, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans antialiased text-black">
      <div className="w-full max-w-[360px] space-y-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-2xl">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Caller AI</h1>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] opacity-60">Authentication Portal</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-black transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  required
                  className="w-full py-4 pl-12 pr-4 border border-border rounded-2xl focus:ring-1 focus:ring-black outline-none text-sm transition-all bg-transparent" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Password</label>
                <Link href="#" className="text-[10px] font-bold text-secondary hover:text-black transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-black transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full py-4 pl-12 pr-4 border border-border rounded-2xl focus:ring-1 focus:ring-black outline-none text-sm transition-all bg-transparent" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-black text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-black/90 shadow-2xl transition-all flex items-center justify-center gap-2 group"
          >
            <span>Access Workspace</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white px-4 text-secondary">Or join the waitlist</span>
            </div>
          </div>

          <div className="text-center text-xs text-secondary font-medium">
            Don't have an account? <Link href="/signup" className="text-black font-bold hover:underline">Create a free account</Link>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-8 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">
        © 2026 CALLER AI SYSTEMS INC.
      </div>
    </div>
  );
}
