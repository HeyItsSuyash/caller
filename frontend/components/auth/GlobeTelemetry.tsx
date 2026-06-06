'use client';

import React from 'react';

export default function GlobeTelemetry() {
  return (
    <div className="w-full max-w-lg space-y-4 text-left mt-2 z-10">
      
      {/* Real-Time Global Communications Card */}
      <div className="border border-white/30 bg-white/[0.01] rounded-lg p-4 shadow-sm space-y-2.5">
        <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500">
          Real-Time Global Communications
        </h4>
        <div className="grid grid-cols-3 gap-2 divide-x divide-white/30 text-left">
          <div className="px-1.5">
            <div className="flex items-center gap-0.5">
              <span className="text-[12px] font-black text-white">8,800+</span>
              <span className="text-[8.5px] text-emerald-400 font-bold">↗</span>
            </div>
            <span className="text-[7px] text-neutral-500 font-bold uppercase block leading-tight mt-0.5">
              Calls initiated every second
            </span>
          </div>
          <div className="px-2">
            <div className="flex items-center gap-0.5">
              <span className="text-[12px] font-black text-white">~2,100+</span>
              <span className="text-[8.5px] text-emerald-400 font-bold">↗</span>
            </div>
            <span className="text-[7px] text-neutral-500 font-bold uppercase block leading-tight mt-0.5">
              Business conversations
            </span>
          </div>
          <div className="px-2">
            <div className="flex items-center gap-0.5">
              <span className="text-[12px] font-black text-white">~950+</span>
              <span className="text-[8.5px] text-emerald-400 font-bold">↗</span>
            </div>
            <span className="text-[7px] text-neutral-500 font-bold uppercase block leading-tight mt-0.5">
              Support interactions
            </span>
          </div>
        </div>
      </div>

      {/* Copy and description block */}
      <div className="space-y-1.5">
        <h3 className="text-sm font-extrabold text-white tracking-tight">
          Every conversation moves business forward.
        </h3>
        <p className="text-[9.5px] text-neutral-500 font-semibold leading-relaxed">
          From sales outreach and recruiting interviews to customer support and account management, millions of professional conversations happen every hour.
        </p>
        <p className="text-[9.5px] text-neutral-500 font-semibold leading-relaxed">
          Caller.work helps organizations automate, augment, and scale every type of business communication.
        </p>
      </div>

      {/* Status Indicator */}
      <div className="pt-2 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">
            Global Communication Network Active
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
        </div>
        <span className="text-[9px] text-neutral-600 font-bold">
          Real-time processing across multiple regions.
        </span>
      </div>

    </div>
  );
}
