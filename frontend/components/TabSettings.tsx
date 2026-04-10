import React from 'react';
import { Save, User, Globe, MessageSquare, Volume2, Shield } from 'lucide-react';

const TabSettings = () => {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white p-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Agent Settings</h1>
            <p className="text-sm text-secondary">Configure your AI voice model, identity, and behavior.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/90 transition-all shadow-lg hover:shadow-black/10">
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

        <div className="grid gap-10">
          {/* Identity Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <User className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Identity & Voice</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6 p-8 border border-border rounded-[2rem] bg-white">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">Voice Model</label>
                <select className="w-full">
                  <option>Google Standard (Poly.Aditi)</option>
                  <option>ElevenLabs (Rachel)</option>
                  <option>OpenAI Whisper (Beta)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">Primary Language</label>
                <select className="w-full">
                  <option>Hinglish (Mix of Hindi/English)</option>
                  <option>Pure English (IN)</option>
                  <option>Pure Hindi</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">Tone & Personality</label>
                <select className="w-full">
                  <option>Friendly & Professional</option>
                  <option>Strict & Direct</option>
                  <option>Casual & Empathetic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">Response Speed</label>
                <div className="flex items-center gap-4 py-2 px-1">
                  <input type="range" className="flex-1 accent-black h-1 bg-accent rounded-full appearance-none" min="0" max="100" />
                  <span className="text-[10px] font-bold text-secondary">Fast (0.8s)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Prompt Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <MessageSquare className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Behavioral Instructions</h3>
            </div>
            
            <div className="p-8 border border-border rounded-[2rem] bg-accent/20 space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">System Prompt / Personna</label>
              <textarea 
                className="w-full min-h-[200px] p-6 text-sm font-medium leading-relaxed rounded-2xl border-none focus:ring-1 focus:ring-black scrollbar-hide"
                placeholder="Example: You are an admission counselor for VANI University. Your goal is to help students understand fee structures..."
                defaultValue={`You are CALLER AI, a warm and professional Indian phone agent. 
- Use natural Hinglish.
- Be patient and empathetic.
- Keep responses short (1-3 sentences).
- If you learn the caller's name, use it naturally.`}
              />
              <div className="flex items-center gap-2 px-2 text-[10px] font-medium text-secondary italic">
                 <Shield className="w-3 h-3" />
                 <span>Prompt is protected by 256-bit encryption before storage.</span>
              </div>
            </div>
          </section>

          {/* Advanced Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Globe className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Advanced Integration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6 p-8 border border-border rounded-[2rem] bg-white">
              <div className="p-4 border border-border rounded-xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Call Automation</span>
                    <input type="checkbox" className="w-4 h-4 accent-black" defaultChecked />
                 </div>
                 <p className="text-[10px] text-secondary">Enable AI to automatically handle outbound queue if leads are hot.</p>
              </div>
              <div className="p-4 border border-border rounded-xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Sentiment Alerts</span>
                    <input type="checkbox" className="w-4 h-4 accent-black" defaultChecked />
                 </div>
                 <p className="text-[10px] text-secondary">Notify via WhatsApp if a caller is frustrated or uses abusive language.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="pt-8 border-t border-border flex justify-end gap-3 pb-20">
          <button className="px-6 py-3 border border-border rounded-xl text-xs font-bold hover:bg-accent transition-all uppercase tracking-widest">Reset Default</button>
          <button className="px-10 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/90 transition-all shadow-xl uppercase tracking-widest">Update Agent</button>
        </div>
      </div>
    </div>
  );
};

export default TabSettings;
