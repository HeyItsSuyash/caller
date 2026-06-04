'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Radio, Phone } from 'lucide-react';

const HeroVisual = () => {
  const [turn, setTurn] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const conversations = [
    { speaker: 'user', label: 'Subscriber', text: 'Hello? Mujhe checkbook request initiate karni hai.' },
    { speaker: 'ai', label: 'Grounded Agent', text: 'Namaste! Main aapka AI assistant hoon. Main abhi aapki request register kar deta hoon. Confirm kijiye...' },
    { speaker: 'user', label: 'Subscriber', text: 'Haan, standard 15 leaves waali request approve kar do.' },
    { speaker: 'ai', label: 'Grounded Agent', text: 'Done! Verification complete. Request processed in 480ms.' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTurn(prev => (prev + 1) % (conversations.length + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // range -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[520px] flex items-center justify-center overflow-hidden bg-transparent cursor-pointer z-20"
    >
      
      {/* Ambient Spotlight Layer inside Card context */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 z-0" />

      {/* Foreground Live Transcription Dashboard Card (Centered Parallax without offsets) */}
      <motion.div
        animate={{ 
          x: mousePos.x * 30,
          y: mousePos.y * 30,
          rotateY: mousePos.x * 12,
          rotateX: mousePos.y * -12
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 25 }}
        style={{ perspective: 1200 }}
        className="w-full max-w-[500px] bg-[#030303]/90 border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.05)] relative z-10"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-white/5 flex items-center justify-between bg-white/[0.005]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-4 font-mono">CALLER_OS_PIPELINE // SESSION_ACTIVE</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[8.5px] font-black text-emerald-400 uppercase tracking-widest leading-none">Live Connection</span>
          </div>
        </div>

        {/* Main Grid Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5 h-[375px]">
          
          {/* Left Conversation Monitor */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
                  Live Transcription Stream
                </span>
                <span className="text-[8px] font-mono text-neutral-600">WS // port_3005</span>
              </div>

              <div className="space-y-3.5">
                <AnimatePresence mode="popLayout">
                  {conversations.slice(0, Math.max(1, turn)).map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex flex-col ${item.speaker === 'user' ? 'items-start' : 'items-end'} space-y-1`}
                    >
                      <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500">
                        {item.label}
                      </span>
                      <div className={`px-4 py-2.5 rounded-2xl text-[11px] font-semibold leading-relaxed max-w-[90%] shadow-sm transition-all ${
                        item.speaker === 'user' 
                          ? 'bg-white/5 text-neutral-300 border border-white/5 rounded-tl-none' 
                          : 'bg-white text-black rounded-tr-none font-bold'
                      }`}>
                        {item.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {turn === 0 && (
                  <div className="flex items-center gap-2 text-neutral-600 text-[10px] italic py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" />
                    Waiting for subscriber speech packets...
                  </div>
                )}
              </div>
            </div>

            {/* Animated Waveform Section */}
            <div className="pt-4 border-t border-white/5 flex gap-3 items-center">
              <Activity className="w-4 h-4 text-neutral-400 shrink-0" />
              <div className="flex-1 flex gap-[3px] h-8 items-center justify-start overflow-hidden">
                {[15, 45, 75, 40, 15, 60, 85, 50, 25, 15, 40, 70, 35, 85, 50, 30, 15, 65, 80, 25, 50, 35, 20, 70].map((h, i) => (
                  <motion.div 
                    key={i} 
                    className="w-[3px] rounded-full bg-white" 
                    initial={{ height: 4 }}
                    animate={{ 
                      height: turn > 0 && turn % 2 === 0 ? [4, h * 0.4, 4] : [4, h * 0.9, 4]
                    }}
                    transition={{ 
                      duration: 0.8 + (i % 4) * 0.15, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.03
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Latency Telemetry Panel */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between bg-white/[0.002]">
            <div className="space-y-5">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block leading-none flex items-center gap-1.5 font-mono">
                <Radio className="w-3 h-3 animate-pulse" />
                Latency metrics
              </span>
              
              <div className="space-y-3">
                {[
                  { name: 'STT (Groq Whisper)', latency: '180ms', pct: 85 },
                  { name: 'LLM (Llama-3.3-70B)', latency: '220ms', pct: 90 },
                  { name: 'TTS (Google Accent)', latency: '80ms', pct: 95 },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col gap-2 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white leading-none">{item.name}</span>
                      <span className="text-[10px] font-black text-white font-mono">{item.latency}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <div className="flex justify-between text-[8px] font-black uppercase text-neutral-500 tracking-wider">
                <span>Grounding Confidence</span>
                <span className="text-white font-mono">100.0%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neutral-200 to-white w-full" />
              </div>
            </div>
          </div>

        </div>

      </motion.div>

    </div>
  );
};

export default HeroVisual;
