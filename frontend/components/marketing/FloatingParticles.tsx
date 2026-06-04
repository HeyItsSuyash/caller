'use client';

import React from 'react';

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Glow shapes */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-emerald-500/5 blur-[100px] animate-pulse [animation-delay:2s]" />
      
      {/* SVG particles grid for cross-platform visual consistency without hydration mismatches */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-indigo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Floating animated points */}
        <circle cx="15%" cy="20%" r="20" fill="url(#glow-grad)" className="animate-bounce" />
        <circle cx="85%" cy="30%" r="35" fill="url(#glow-indigo)" className="animate-pulse" />
        <circle cx="75%" cy="75%" r="25" fill="url(#glow-grad)" className="animate-bounce [animation-delay:1.5s]" />
        <circle cx="25%" cy="80%" r="30" fill="url(#glow-indigo)" className="animate-pulse [animation-delay:1s]" />
      </svg>
    </div>
  );
};

export default FloatingParticles;
