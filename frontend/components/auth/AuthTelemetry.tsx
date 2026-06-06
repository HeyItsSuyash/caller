'use client';

import React from 'react';

export default function AuthTelemetry() {
  return (
    <div className="space-y-3 max-w-md w-full z-10 relative">
      {/* Stats metrics block */}
      <div className="border border-white/30 bg-white/[0.01] rounded-lg p-2.5 grid grid-cols-3 text-center divide-x divide-white/30 w-full shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-white block leading-none mb-0.5">24M+</span>
          <span className="text-[7px] text-neutral-600 font-bold uppercase tracking-wider">Calls Processed</span>
        </div>
        <div>
          <span className="text-[10px] font-extrabold text-white block leading-none mb-0.5">480ms</span>
          <span className="text-[7px] text-neutral-600 font-bold uppercase tracking-wider">Average Latency</span>
        </div>
        <div>
          <span className="text-[10px] font-extrabold text-white block leading-none mb-0.5">99.99%</span>
          <span className="text-[7px] text-neutral-600 font-bold uppercase tracking-wider">Uptime</span>
        </div>
      </div>

      {/* Partner logos block */}
      <div className="border border-white/30 bg-white/[0.01] rounded-lg p-2 flex justify-between items-center w-full px-6 text-[9.5px] font-bold text-neutral-500 font-mono shadow-sm">
        <span className="hover:text-neutral-300 cursor-default transition-colors">deel.</span>
        <span className="hover:text-neutral-300 cursor-default transition-colors">_zapier</span>
        <span className="hover:text-neutral-300 cursor-default transition-colors flex items-center gap-0.5">
          ramp
          <svg className="w-1.5 h-1.5 fill-current rotate-45" viewBox="0 0 24 24">
            <polygon points="24,0 0,24 24,24" />
          </svg>
        </span>
        <span className="hover:text-neutral-300 cursor-default transition-colors">Vanta</span>
        <span className="hover:text-neutral-300 cursor-default transition-colors">HubSpot</span>
      </div>
    </div>
  );
}
