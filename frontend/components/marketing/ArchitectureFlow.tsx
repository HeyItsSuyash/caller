'use client';

import React from 'react';
import { 
  PhoneCall, 
  Settings, 
  Layers, 
  Cpu, 
  Database, 
  TrendingUp,
  Globe2,
  FileCheck
} from 'lucide-react';

const ArchitectureFlow = () => {
  const steps = [
    { name: 'Customer Dial', desc: 'μ-law stream', icon: PhoneCall },
    { name: 'Telephony Layer', desc: 'SIP Trunks', icon: Globe2 },
    { name: 'Streaming Node', desc: 'Audio Chunker', icon: Layers },
    { name: 'STT Converter', desc: 'Whisper-v3', icon: Cpu },
    { name: 'Agent Runtime', desc: 'Llama-3 logic', icon: Settings },
    { name: 'Knowledge Ingest', desc: 'MongoDB RAG', icon: Database },
    { name: 'TTS Compiler', desc: 'Poly Synthesis', icon: FileCheck },
    { name: 'CRM Pipeline', desc: 'Auto Leads', icon: TrendingUp },
  ];

  return (
    <div className="w-full py-12 px-8 border border-white/5 bg-[#050505] rounded-3xl overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,#ffffff/1.5,transparent_100%)] pointer-events-none" />
      
      <div className="text-center mb-10">
        <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500">Low-Latency Processing Pipeline</h3>
        <h2 className="text-xl font-black uppercase tracking-tight text-white mt-1">Cinematic Telecom Architecture</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-5 border border-white/5 bg-white/[0.005] hover:bg-white/[0.015] hover:border-white/10 rounded-2xl group transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-white/15 flex items-center justify-center mb-3 text-neutral-400 group-hover:text-white group-hover:border-white/30 transition-all duration-300 shadow-sm">
              <step.icon className="w-4.5 h-4.5" />
            </div>
            
            <h4 className="text-[10px] font-black uppercase tracking-wider text-white leading-none mb-1">{step.name}</h4>
            <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchitectureFlow;
