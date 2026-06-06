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
  Trash2,
  AlertCircle
} from 'lucide-react';

interface TabAgentsProps {
  activeSubpage?: string;
  entities: any[];
  fetchEntities: () => void;
  activeEntity: string;
  setActiveEntity: (entity: string) => void;
}

const TabAgents: React.FC<TabAgentsProps> = ({ 
  activeSubpage, 
  entities, 
  fetchEntities, 
  activeEntity, 
  setActiveEntity 
}) => {
  const [selectedSubpage, setSelectedSubpage] = useState<'My Agents' | 'Agent Builder' | 'Voice Library' | 'Prompt Studio' | 'Testing Sandbox'>('My Agents');
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (activeSubpage) {
      const formatted = activeSubpage.trim();
      setSelectedSubpage(formatted as any);
    }
  }, [activeSubpage]);
  
  // Builder States
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('Outbound Sales');
  const [voiceModel, setVoiceModel] = useState('Google Standard');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSaveAgent = async () => {
    if (!name || !purpose) {
      setError('Name and purpose are required.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingAgentId 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001'}/entities/${editingAgentId}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001'}/entities`;
      
      const method = editingAgentId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          purpose,
          voice_model: voiceModel,
          instructions
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save agent');

      fetchEntities();
      
      // Reset form
      setName('');
      setPurpose('Outbound Sales');
      setVoiceModel('Google Standard');
      setInstructions('');
      setEditingAgentId(null);
      setSelectedSubpage('My Agents');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001'}/entities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchEntities();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete agent');
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent text-white relative">
      
      {/* Subpage navigation */}
      <div className="px-8 border-b border-white/5 bg-transparent shrink-0 flex justify-between items-center h-12">
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

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
        
        {/* ====================================================
            MY AGENTS SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'My Agents' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Active Agent Workforce</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Currently provisioned voice models</p>
              </div>
              <button 
                onClick={() => {
                  setEditingAgentId(null);
                  setName('');
                  setPurpose('Outbound Sales');
                  setVoiceModel('Google Standard');
                  setInstructions('');
                  setSelectedSubpage('Agent Builder');
                }}
                className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Deploy Agent</span>
              </button>
            </div>

            {entities.length === 0 ? (
              <div className="p-12 text-center border border-white/[0.05] rounded-lg bg-white/[0.01] text-neutral-500">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-neutral-600 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-wider text-white">No active agents</p>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-1">Configure and deploy your first voice agent</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entities.map((agent) => (
                  <div 
                    key={agent._id} 
                    onClick={() => setActiveEntity(agent.name)}
                    className={`p-6 border rounded-lg flex flex-col justify-between shadow-lg relative overflow-hidden group cursor-pointer transition-all ${
                      activeEntity === agent.name ? 'border-white bg-white/[0.03]' : 'bg-white/[0.015] border-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
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
                          <span>{agent.voice_model}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-neutral-500 uppercase block font-semibold">System Routing</span>
                          <span className="text-neutral-500 max-w-[150px] truncate block">{agent.instructions || 'Default instructions'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                      <span className="text-[9px] font-black text-neutral-500 uppercase font-mono">Real-Time Ready</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAgentId(agent._id);
                            setName(agent.name);
                            setPurpose(agent.purpose);
                            setVoiceModel(agent.voice_model || 'Google Standard');
                            setInstructions(agent.instructions || '');
                            setSelectedSubpage('Agent Builder');
                          }}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-white/5 cursor-pointer text-white"
                        >
                          Configure
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAgent(agent._id);
                          }}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            AGENT BUILDER SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Agent Builder' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">
                  {editingAgentId ? 'Update Agent' : 'Configure Agent'}
                </h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 font-sans">Define behavioral models & synthetic speech variables</p>
              </div>
              <button 
                onClick={handleSaveAgent}
                disabled={loading}
                className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving...' : editingAgentId ? 'Update Agent' : 'Save Agent'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.015] p-6 border border-white/[0.05] rounded-lg">
              {error && (
                <div className="col-span-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Agent Identity Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Senior Admissions Officer"
                  className="w-full py-2.5 px-3 bg-black/40 border border-white/[0.05] text-white rounded-lg focus:border-white/20 focus:ring-0 text-xs font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Behavioral Purpose</label>
                <select 
                  value={purpose} 
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#0a0a0a] border border-white/[0.05] text-white rounded-lg focus:border-white/20 focus:ring-0 text-xs font-semibold"
                >
                  <option className="bg-neutral-900 text-white" value="Outbound Sales">Outbound Sales</option>
                  <option className="bg-neutral-900 text-white" value="Admission Counseling">Admission Counseling</option>
                  <option className="bg-neutral-900 text-white" value="Recruiting Screening">Recruiting Screening</option>
                  <option className="bg-neutral-900 text-white" value="Customer Support">Customer Support</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Voice Accents</label>
                <select 
                  value={voiceModel} 
                  onChange={(e) => setVoiceModel(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#0a0a0a] border border-white/[0.05] text-white rounded-lg focus:border-white/20 focus:ring-0 text-xs font-semibold"
                >
                  <option className="bg-neutral-900 text-white" value="Google Standard">Google Standard Core</option>
                  <option className="bg-neutral-900 text-white" value="ElevenLabs">ElevenLabs Premium Neural</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Dialect Accent</label>
                <select 
                  className="w-full py-2.5 px-3 bg-[#0a0a0a] border border-white/[0.05] text-white rounded-lg focus:border-white/20 focus:ring-0 text-xs font-semibold"
                  defaultValue="Hinglish (Mix of Hindi/English)"
                >
                  <option className="bg-neutral-900 text-white">Hinglish (Mix of Hindi/English)</option>
                  <option className="bg-neutral-900 text-white">English (IN)</option>
                  <option className="bg-neutral-900 text-white">Hindi (Devanagari)</option>
                </select>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">System Instruction Prompt</label>
                <textarea 
                  rows={4}
                  value={instructions} 
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Define your agent's conversational guide lines..."
                  className="w-full py-3 px-4 bg-black/40 border border-white/[0.05] text-white rounded-lg focus:border-white/20 focus:ring-0 text-xs font-semibold resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            VOICE LIBRARY SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Voice Library' && (
          <div className="max-w-4xl mx-auto space-y-6">
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
                <div key={i} className="p-5 bg-white/[0.015] border border-white/[0.05] rounded-lg flex items-center justify-between shadow-lg">
                  <div>
                    <h4 className="text-xs font-black text-white font-display">{v.name} ({v.accent})</h4>
                    <p className="text-[8.5px] text-neutral-500 font-bold uppercase mt-0.5">{v.provider} • Low Latency</p>
                    <p className="text-[10px] text-neutral-400 mt-2 font-medium leading-relaxed">{v.desc}</p>
                  </div>
                  <button className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white hover:text-black hover:bg-white transition-all cursor-pointer shrink-0 ml-4">
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
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Prompt Studio</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Author advanced system parameters with runtime variables</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-white/[0.015] border border-white/[0.05] rounded-lg space-y-4">
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
                  className="w-full p-4 bg-transparent border border-white/[0.05] text-white rounded-lg font-mono text-xs leading-relaxed focus:border-white focus:ring-0 resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[8.5px] font-black uppercase text-neutral-500">Variables detected: lead.name, lead.interest</span>
                  <button className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-all cursor-pointer">
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
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Testing Sandbox</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Test prompts and logic loops in isolated playground</p>
              </div>
              <button 
                onClick={handleSimulate}
                className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-1.5 font-display"
              >
                <Play className="w-3 h-3" />
                <span>Execute Sandbox</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Sandbox Logger */}
              <div className="md:col-span-2 p-6 bg-white/[0.015] border border-white/[0.05] rounded-lg min-h-[300px] flex flex-col justify-between shadow-xl font-mono text-xs">
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
              <div className="p-6 bg-white/[0.015] border border-white/[0.05] rounded-lg space-y-4">
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
