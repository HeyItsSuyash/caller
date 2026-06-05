import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Sparkles, 
  Save, 
  Mic, 
  Settings2, 
  Sliders, 
  Play, 
  Activity, 
  Radio, 
  FileCheck,
  Shield,
  MessageSquare,
  Globe,
  SlidersHorizontal,
  Volume2,
  Trash2
} from 'lucide-react';

interface TabAgentsProps {
  activeSubpage?: string;
}

const TabAgents: React.FC<TabAgentsProps> = ({ activeSubpage }) => {
  const [selectedSubpage, setSelectedSubpage] = useState<'My Agents' | 'Agent Builder' | 'Voice Library' | 'Prompt Studio' | 'Testing Sandbox'>('My Agents');
  
  React.useEffect(() => {
    if (activeSubpage) {
      // Normalize casing and spaces to match state options
      const formatted = activeSubpage.trim();
      setSelectedSubpage(formatted as any);
    }
  }, [activeSubpage]);
  
  // Agent States
  const [agents, setAgents] = useState([
    { id: 1, name: 'Sales Closer', purpose: 'Outbound Sales', voice: 'ElevenLabs Aditi', language: 'Hinglish', calls: 532, success: '88.1%' },
    { id: 2, name: 'Lead Qualifier', purpose: 'CRM Ingestion', voice: 'Google Standard IN', language: 'Pure Hindi', calls: 412, success: '82.3%' },
    { id: 3, name: 'Recruiter Pro', purpose: 'Candidate Screening', voice: 'ElevenLabs Rachel', language: 'Pure English (IN)', calls: 298, success: '85.6%' },
    { id: 4, name: 'Support Ace', purpose: 'Customer FAQ Resolution', voice: 'Google Standard IN', language: 'Hinglish', calls: 264, success: '80.2%' }
  ]);

  // Builder States
  const [name, setName] = useState('Sales Closer');
  const [purpose, setPurpose] = useState('Outbound Sales');
  const [voiceModel, setVoiceModel] = useState('ElevenLabs Aditi (Hinglish Accent)');
  const [language, setLanguage] = useState('Hinglish (Mix of Hindi/English)');
  const [prompt, setPrompt] = useState(`You are CALLER AI, a warm and professional Indian phone agent. 
- Ingest CRM hot lead attributes.
- Answer user queries about pricing models.
- If user requests callback, queue outbound automation.`);

  // Sandbox simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([
    'Playground offline. Establish chat or click "Execute Sandbox" to test LLM logic.'
  ]);

  const handleSimulate = () => {
    setIsSimulating(true);
    setSandboxLogs(prev => [
      ...prev,
      '[VANI SDK] Spawning isolated testing sandbox container...',
      '[AI Compiler] Context grounded from admissions data vector table.',
      '[Telephony Gateway] Compiling audio synthesizers (AWS Polly / Aditi)...',
      '[Sandbox Online] Ready for chat testing.'
    ]);
  };

  const handleCreateAgent = () => {
    const newId = agents.length + 1;
    setAgents(prev => [
      ...prev,
      { id: newId, name: 'Support Bot Pro', purpose: 'Custom FAQ', voice: 'Google Standard', language: 'Hinglish', calls: 0, success: '--%' }
    ]);
    setSelectedSubpage('My Agents');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black text-white relative">
      
      {/* Subpage navigation */}
      <div className="px-8 border-b border-white/5 bg-black/60 shrink-0 flex justify-between items-center h-12">
        <div className="flex gap-4">
          {(['My Agents', 'Agent Builder', 'Voice Library', 'Prompt Studio', 'Testing Sandbox'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedSubpage(tab)}
              className={`text-[9px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer relative h-12
                ${selectedSubpage === tab ? 'text-white font-extrabold' : 'text-neutral-500 hover:text-white'}
              `}
            >
              {tab}
              {selectedSubpage === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        
        {/* ====================================================
            MY AGENTS SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'My Agents' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Active Agent Workforce</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Currently provisioned voice models</p>
              </div>
              <button 
                onClick={() => setSelectedSubpage('Agent Builder')}
                className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Deploy Agent</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl flex flex-col justify-between shadow-lg relative overflow-hidden group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <Sparkles className="text-white w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white font-display leading-none">{agent.name}</h4>
                          <p className="text-[8.5px] text-neutral-500 font-bold uppercase mt-0.5">{agent.purpose}</p>
                        </div>
                      </div>
                      <span className="text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">Active</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-neutral-400">
                      <div>
                        <span className="text-[8px] text-neutral-500 uppercase block font-semibold">Voice Model</span>
                        <span>{agent.voice}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-neutral-500 uppercase block font-semibold">Dialect</span>
                        <span>{agent.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                    <span className="text-[9px] font-black text-neutral-500 uppercase font-mono">{agent.calls} Calls conducted • {agent.success} Success</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setName(agent.name);
                          setPurpose(agent.purpose);
                          setSelectedSubpage('Agent Builder');
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-white/5 cursor-pointer text-white"
                      >
                        Configure
                      </button>
                      <button 
                        onClick={() => setAgents(prev => prev.filter(a => a.id !== agent.id))}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            AGENT BUILDER SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Agent Builder' && (
          <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Configure Agent</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Define behavioral models & synthetic speech variables</p>
              </div>
              <button 
                onClick={handleCreateAgent}
                className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Agent</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0a0a0a] p-6 border border-white/5 rounded-3xl">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Agent Identity Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-3 px-4 bg-black border border-white/10 text-white rounded-xl focus:border-white focus:ring-0 text-xs font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Behavioral Purpose</label>
                <select 
                  value={purpose} 
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full py-3 px-4 bg-black border border-white/10 text-white rounded-xl focus:border-white focus:ring-0 text-xs font-semibold"
                >
                  <option>Outbound Sales</option>
                  <option>Admission Counseling</option>
                  <option>Recruiting Screening</option>
                  <option>Customer Support FAQ</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Voice Accents</label>
                <select 
                  value={voiceModel} 
                  onChange={(e) => setVoiceModel(e.target.value)}
                  className="w-full py-3 px-4 bg-black border border-white/10 text-white rounded-xl focus:border-white focus:ring-0 text-xs font-semibold"
                >
                  <option>ElevenLabs Aditi (Hinglish Accent)</option>
                  <option>Google Standard IN (Rachel)</option>
                  <option>AWS Polly (Aditi)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Dialect Accent</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full py-3 px-4 bg-black border border-white/10 text-white rounded-xl focus:border-white focus:ring-0 text-xs font-semibold"
                >
                  <option>Hinglish (Mix of Hindi/English)</option>
                  <option>English (IN)</option>
                  <option>Hindi (Devanagari)</option>
                </select>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">System Instruction Prompt</label>
                <textarea 
                  rows={4}
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full py-3 px-4 bg-black border border-white/10 text-white rounded-xl focus:border-white focus:ring-0 text-xs font-semibold resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            VOICE LIBRARY SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Voice Library' && (
          <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Voice Library</h3>
              <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Preview native accent profiles for global operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Aditi', provider: 'ElevenLabs', accent: 'Hinglish Native', desc: 'Curated mix of Hindi and English accents ideal for urban demographics.' },
                { name: 'Rachel', provider: 'Google Premium', accent: 'English (IN)', desc: 'Professional, direct tone suitable for corporate qualification queries.' },
                { name: 'Neerja', provider: 'Sarvam AI', accent: 'Hindi Accent', desc: 'Deeply native Hindi vocabulary synthesizer with high cadence resolution.' },
                { name: 'Aditi Standard', provider: 'AWS Polly', accent: 'Standard Hinglish', desc: 'High-availability low latency synthetic carrier-grade speech model.' },
              ].map((v, i) => (
                <div key={i} className="p-5 bg-[#0a0a0a] border border-white/5 rounded-3xl flex items-center justify-between shadow-lg">
                  <div>
                    <h4 className="text-xs font-black text-white font-display">{v.name} ({v.accent})</h4>
                    <p className="text-[8.5px] text-neutral-500 font-bold uppercase mt-0.5">{v.provider} • Low Latency</p>
                    <p className="text-[10px] text-neutral-400 mt-2 font-medium leading-relaxed">{v.desc}</p>
                  </div>
                  <button className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:text-black hover:bg-white transition-all cursor-pointer shrink-0 ml-4">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            PROMPT STUDIO SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Prompt Studio' && (
          <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Prompt Studio</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Author advanced system parameters with runtime variables</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl space-y-4">
                <textarea 
                  rows={8}
                  defaultValue={`# SYSTEM ROLE
You are CALLER OS Sales Executive. Automate callback queues.

# CONTEXT VARIABLES
- prospect_name: {{lead.name}}
- course_selected: {{lead.interest}}
- timestamp: {{telephony.time}}

# INSTRUCTIONS
Ground your responses strictly using {{knowledge.mongodb_data}} vectors. Do not hallucinate.`}
                  className="w-full p-4 bg-black border border-white/10 text-white rounded-xl font-mono text-xs leading-relaxed focus:border-white focus:ring-0 resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[8.5px] font-black uppercase text-neutral-500">Variables detected: lead.name, lead.interest</span>
                  <button className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-100 transition-all cursor-pointer">
                    Validate Prompt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TESTING SANDBOX SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Testing Sandbox' && (
          <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Testing Sandbox</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Test prompts and logic loops in isolated playground</p>
              </div>
              <button 
                onClick={handleSimulate}
                className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-1.5 font-display"
              >
                <Play className="w-3 h-3" />
                <span>Execute Sandbox</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Sandbox Logger */}
              <div className="md:col-span-2 p-6 bg-black border border-white/10 rounded-3xl min-h-[300px] flex flex-col justify-between shadow-xl font-mono text-xs">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 font-display">Sandbox Log Feed</h4>
                  <div className="h-[1px] w-full bg-white/5" />
                  <div className="space-y-2 text-neutral-300">
                    {sandboxLogs.map((log, idx) => (
                      <p key={idx} className="leading-relaxed">{log}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sandbox parameters */}
              <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 font-display">Sandbox Parameters</h4>
                <div className="space-y-3 text-[10px] font-bold text-neutral-400">
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase block">Mock Latency Trigger</span>
                    <span>180ms</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase block">Audio Codec Override</span>
                    <span>PCM 16kHz</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase block">RAG Vector Matching</span>
                    <span>Top 3 Chunks</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TabAgents;
