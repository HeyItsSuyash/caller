'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, User, Building2, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const [accountType, setAccountType] = useState<'personal' | 'agency'>('personal');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans antialiased text-black">
      <div className="w-full max-w-[400px] space-y-10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-xl">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Caller AI</h1>
            <p className="text-xs font-bold text-secondary uppercase tracking-[0.2em] opacity-60">Create your workspace</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setAccountType('personal')}
              className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-3 relative overflow-hidden ${
                accountType === 'personal' ? 'border-black bg-accent/20 ring-1 ring-black' : 'border-border hover:border-black/20'
              }`}
            >
              <User className={`w-5 h-5 ${accountType === 'personal' ? 'text-black' : 'text-secondary'}`} />
              <div>
                <p className="text-xs font-bold">Personal</p>
                <p className="text-[10px] text-secondary">Individual use</p>
              </div>
              {accountType === 'personal' && <CheckCircle2 className="w-4 h-4 absolute top-3 right-3 text-black" />}
            </div>
            <div 
              onClick={() => setAccountType('agency')}
              className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-3 relative overflow-hidden ${
                accountType === 'agency' ? 'border-black bg-accent/20 ring-1 ring-black' : 'border-border hover:border-black/20'
              }`}
            >
              <Building2 className={`w-5 h-5 ${accountType === 'agency' ? 'text-black' : 'text-secondary'}`} />
              <div>
                <p className="text-xs font-bold">Agency</p>
                <p className="text-[10px] text-secondary">Manage entities</p>
              </div>
              {accountType === 'agency' && <CheckCircle2 className="w-4 h-4 absolute top-3 right-3 text-black" />}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full py-3 px-4 border border-border rounded-xl focus:ring-1 focus:ring-black outline-none text-sm transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Work Email</label>
              <input type="email" placeholder="john@example.com" className="w-full py-3 px-4 border border-border rounded-xl focus:ring-1 focus:ring-black outline-none text-sm transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full py-3 px-4 border border-border rounded-xl focus:ring-1 focus:ring-black outline-none text-sm transition-all" />
            </div>
          </div>

          <button className="w-full py-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/90 shadow-xl transition-all flex items-center justify-center gap-2 group">
            <span>Continue To Setup</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="text-center text-xs text-secondary font-medium">
          Already have an account? <Link href="/login" className="text-black font-bold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
