import React, { useState } from 'react';
import { 
  Save, 
  User, 
  Globe, 
  MessageSquare, 
  Volume2, 
  Shield, 
  Sliders, 
  Play, 
  Activity,
  Radio,
  FileCheck
} from 'lucide-react';

const TabSettings = () => {
  const [voiceModel, setVoiceModel] = useState('Google Standard (Poly.Aditi)');
  const [language, setLanguage] = useState('Hinglish (Mix of Hindi/English)');
  const [tone, setTone] = useState('Friendly & Professional');
  const [prompt, setPrompt] = useState(`You are CALLER AI, a warm and professional Indian phone agent. 
- Use natural Hinglish.
- Be patient and empathetic.
- Keep responses short (1-3 sentences).
- If you learn the caller's name, use it naturally.`);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simText, setSimText] = useState('Simulation offline. Trigger outbound calls to verify agent logic.');

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimText('Initializing VANI Sandbox Environment...');
    setTimeout(() => {
      setSimText('[VANI Gateway] Sandbox Connected. Agent successfully loaded instructions.');
    }, 1200);
  };

  return (
    <div className="flex-1 flex h-full divide-x divide-neutral-100 bg-white overflow-hidden">
      {/* Left Panel: Settings Form */}
      <div className="w-3/5 p-8 overflow-y-auto scrollbar-hide space-y-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Agent Configurations</h1>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-1">Refine prompt models, synthetic speech accents, and latency controls</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/90 transition-all shadow-lg hover:shadow-black/10">
            <Save className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
        </div>

        <div className="grid gap-8">
          {/* Tone & Accents */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Sliders className="w-4 h-4 text-neutral-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Speech Profile</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-6 border border-neutral-100 rounded-3xl bg-white shadow-sm">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Voice Accent Model</label>
                <select 
                  value={voiceModel}
                  onChange={(e) => setVoiceModel(e.target.value)}
                  className="w-full text-xs font-bold p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl focus:border-black focus:ring-0"
                >
                  <option>Google Standard (Poly.Aditi)</option>
                  <option>ElevenLabs (Rachel)</option>
                  <option>OpenAI Whisper TTS (IN)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Conversational Dialect</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-xs font-bold p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl focus:border-black focus:ring-0"
                >
                  <option>Hinglish (Mix of Hindi/English)</option>
                  <option>Pure English (IN)</option>
                  <option>Pure Hindi (Devanagari compatible)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Empathetic Style</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full text-xs font-bold p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl focus:border-black focus:ring-0"
                >
                  <option>Friendly & Professional</option>
                  <option>Strict & Direct</option>
                  <option>Casual & Empathetic</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Response Latency Target</label>
                <div className="flex items-center gap-4 py-2 px-1">
                  <input type="range" className="flex-1 accent-black h-1 bg-neutral-100 rounded-full appearance-none" min="0" max="100" defaultValue="70" />
                  <span className="text-[9px] font-black text-neutral-400">Fast (0.4s)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Core System Instructions Prompt */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <MessageSquare className="w-4 h-4 text-neutral-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Instructions Prompt</h3>
            </div>
            
            <div className="p-6 border border-neutral-100 rounded-3xl bg-neutral-50/50 space-y-4">
              <textarea 
                className="w-full min-h-[160px] p-5 text-xs font-semibold leading-relaxed rounded-2xl border border-neutral-200/60 focus:border-black focus:ring-0 scrollbar-hide bg-white shadow-sm"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write system instructions..."
              />
              <div className="flex items-center gap-2 px-2 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                 <Shield className="w-3.5 h-3.5 text-neutral-400" />
                 <span>Prompt grounded strictly with Data Room fragments during routing.</span>
              </div>
            </div>
          </section>

          {/* Advanced Integration Features */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Globe className="w-4 h-4 text-neutral-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Automated Actions</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-6 border border-neutral-100 rounded-3xl bg-white shadow-sm">
              <div className="p-3 border border-neutral-100 rounded-xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest">Call Automation Queue</span>
                    <input type="checkbox" className="w-4 h-4 accent-black" defaultChecked />
                 </div>
                 <p className="text-[9px] text-neutral-400 font-medium">Allows agent to trigger automatic dials as soon as fresh leads land.</p>
              </div>

              <div className="p-3 border border-neutral-100 rounded-xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest">Sentiment Escalation</span>
                    <input type="checkbox" className="w-4 h-4 accent-black" defaultChecked />
                 </div>
                 <p className="text-[9px] text-neutral-400 font-medium">Forward transcript to admin slack channels if caller gets highly frustrated.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Right Panel: Sandbox Live Simulator */}
      <div className="flex-1 p-8 bg-neutral-50/50 flex flex-col justify-between overflow-y-auto scrollbar-hide">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-neutral-400 animate-pulse" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Sandbox Playground</h3>
            </div>
            <span className="text-[8px] font-black bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Simulation Sandbox</span>
          </div>

          <div className="border border-neutral-200/60 rounded-3xl p-6 bg-neutral-900 text-white min-h-[280px] flex flex-col justify-between relative shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sandbox Logs</span>
              </div>
              <div className="h-[1px] w-full bg-white/5" />
              
              <p className="text-xs font-mono text-neutral-300 leading-relaxed">
                {simText}
              </p>
            </div>

            {isSimulating && (
              <div className="mt-8 flex gap-2 items-center bg-white/5 border border-white/5 p-3 rounded-2xl">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <div className="flex-1">
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">Grounded Context</p>
                  <p className="text-[10px] font-medium mt-0.5">Prompt validated against Llama-3 compiler.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleSimulate}
          className="w-full py-4 bg-neutral-950 hover:bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 mt-8"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Execute Simulation Sandbox</span>
        </button>
      </div>
    </div>
  );
};

export default TabSettings;
