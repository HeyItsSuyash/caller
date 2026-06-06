'use client';

import React from 'react';

interface AuthFormLayoutProps {
  children: React.ReactNode;
  globe: React.ReactNode;
  telemetry: React.ReactNode;
}

export default function AuthFormLayout({ children, globe, telemetry }: AuthFormLayoutProps) {
  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col lg:flex-row p-5 lg:p-7 relative overflow-hidden font-sans selection:bg-neutral-800 selection:text-white">
      {/* Decorative vertical & horizontal background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      
      {/* Static white ambient glows */}
      <div className="absolute top-[10%] left-[25%] w-[800px] h-[600px] bg-white/[0.02] blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none z-0" />

      {/* LEFT SECTION: Auth Form, Metrics & Trust Logos */}
      <div className="w-full lg:w-[46%] flex flex-col justify-between relative z-10 pr-0 lg:pr-6 h-full">
        {children}
      </div>

      {/* RIGHT SECTION: Dotted Earth Globe & Live Network Telemetry */}
      <div className="w-full lg:w-[54%] flex flex-col justify-between items-center lg:items-end h-full relative z-10">
        {globe}
        {telemetry}
      </div>
    </div>
  );
}
