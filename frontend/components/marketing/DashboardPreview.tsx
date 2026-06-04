'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Activity, 
  Cpu, 
  Radio, 
  Layers 
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPreview = () => {
  const [activeCall, setActiveCall] = useState(true);
  const [transcripts, setTranscripts] = useState([
    { speaker: 'user', text: 'Hello? Mujhe Admission guidelines ke baare mein jaanna hai.' },
    { speaker: 'ai', text: 'Namaste! Main MMMUT Admission assistant hoon. Main aapki kya help kar sakti hoon?' },
    { speaker: 'user', text: 'B.Tech CS ki fees aur eligibility criteria kya hai?' }
  ]);

  useEffect(() => {
    const extraTurns = [
      { speaker: 'ai', text: 'B.Tech CS ki annual tuition fees ₹1.2L hai, aur eligibility ke liye high school mein Physics aur Math compulsory subjects hain.' },
      { speaker: 'user', text: 'Acha! Aur scholarships ke guidelines kya hain?' },
      { speaker: 'ai', text: 'Merit-based scholarships available hain based on state entrance ranks. Main aapki details register kar rahi hoon.' }
    ];
    let turnIdx = 0;
    const interval = setInterval(() => {
      if (turnIdx < extraTurns.length) {
        const nextTurn = extraTurns[turnIdx];
        setTranscripts(prev => [...prev, nextTurn]);
        turnIdx++;
      } else {
        setTranscripts([
          { speaker: 'user', text: 'Hello? Mujhe Admission guidelines ke baare mein jaanna hai.' },
          { speaker: 'ai', text: 'Namaste! Main MMMUT Admission assistant hoon. Main aapki kya help kar sakti hoon?' },
          { speaker: 'user', text: 'B.Tech CS ki fees aur eligibility criteria kya hai?' }
        ]);
        turnIdx = 0;
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#030303] border border-white/5 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.005]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-4">VANI-OS-GATEWAY // sandbox_node_active</span>
        </div>
        
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
          <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Telephony Active</span>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 h-[340px]">
        
        {/* Logs */}
        <div className="md:col-span-2 p-6 flex flex-col justify-between overflow-hidden">
          <div className="space-y-4 overflow-y-auto scrollbar-hide flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
                Live Binary Voice Stream Monitor
              </span>
              <span className="text-[8px] font-mono text-neutral-600">SID: tw_call_6347</span>
            </div>

            <div className="space-y-3.5">
              {transcripts.slice(-3).map((t, idx) => (
                <div key={idx} className={`flex flex-col ${t.speaker === 'user' ? 'items-start' : 'items-end'} space-y-1`}>
                  <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">
                    {t.speaker === 'user' ? 'Subscriber' : 'Grounded Agent'}
                  </span>
                  <div className={`px-4 py-2.5 rounded-2xl text-[11px] font-semibold leading-relaxed max-w-[85%] shadow-sm ${
                    t.speaker === 'user' ? 'bg-white/5 text-neutral-300 border border-white/5 rounded-tl-none' : 'bg-white text-black rounded-tr-none'
                  }`}>
                    {t.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waveform */}
          <div className="pt-4 border-t border-white/5 flex gap-3 items-center">
            <Activity className="w-4 h-4 text-white animate-pulse shrink-0" />
            <div className="flex-1 flex gap-[3px] h-8 items-center justify-start overflow-hidden">
              {[20, 50, 80, 40, 20, 60, 90, 70, 30, 20, 50, 80, 45, 95, 60, 40, 20, 70, 90, 30, 60, 40].map((h, i) => (
                <motion.div 
                  key={i} 
                  className="w-[3px] bg-white rounded-full" 
                  initial={{ height: 4 }}
                  animate={{ 
                    height: activeCall ? [4, h, 4] : 4
                  }}
                  transition={{ 
                    duration: 1 + (i % 3) * 0.2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.05
                  }} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry */}
        <div className="p-6 flex flex-col justify-between bg-white/[0.002]">
          <div className="space-y-5">
            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest block leading-none">Pipeline Latency</span>
            
            <div className="space-y-3">
              {[
                { name: 'STT (Whisper-V3)', latency: '190ms', status: 'Optimal' },
                { name: 'Agent LLM Logic', latency: '210ms', status: 'Optimal' },
                { name: 'TTS (Google IN)', latency: '80ms', status: 'Optimal' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center hover:border-white/10 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-white leading-none">{item.name}</p>
                    <span className="text-[7.5px] font-bold text-neutral-500 uppercase tracking-wider block mt-0.5">{item.status}</span>
                  </div>
                  <span className="text-[10px] font-black text-white">{item.latency}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="flex justify-between text-[8px] font-black uppercase text-neutral-500 tracking-wider">
              <span>Conversion Pulse</span>
              <span className="text-white">94.8%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[94.8%]" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPreview;
