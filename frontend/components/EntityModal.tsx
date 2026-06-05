import React, { useState } from 'react';
import { X, Activity, Mic, Terminal, Sparkles } from 'lucide-react';

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (entity: any) => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001';

const EntityModal: React.FC<EntityModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('Admission Counseling');
  const [voiceModel, setVoiceModel] = useState('Google Standard');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/entities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          purpose,
          voice_model: voiceModel,
          instructions
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create entity');

      onCreated(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-[#0a0a0a] w-full max-w-[500px] border border-white/10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-10 animate-in zoom-in-95 duration-300 relative overflow-hidden text-white">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex justify-between items-start mb-10 relative">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg transform -rotate-3">
              <Sparkles className="text-black w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase leading-none font-display text-white">New Agent</h2>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mt-1">Agent Neural Initialization</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-neutral-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-[11px] font-bold animate-in shake duration-300">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Entity Identity</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Senior Admissions Officer" 
                required
                className="w-full py-4 px-5 bg-black border border-white/10 text-white rounded-2xl focus:border-white focus:ring-4 focus:ring-white/5 outline-none text-sm transition-all font-medium placeholder:text-neutral-600" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Behavioral Purpose</label>
              <select 
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full py-4 px-5 bg-black border border-white/10 text-white rounded-2xl focus:border-white focus:ring-4 focus:ring-white/5 outline-none text-sm transition-all font-medium appearance-none cursor-pointer"
              >
                <option className="bg-black text-white">Admission Counseling</option>
                <option className="bg-black text-white">Customer Support</option>
                <option className="bg-black text-white">Outbound Sales</option>
                <option className="bg-black text-white">Survey Collector</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Acoustic Architecture</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setVoiceModel('Google Standard')}
                  className={`py-4 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                    voiceModel === 'Google Standard' ? 'bg-white text-black border-white shadow-lg' : 'bg-black border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  Standard Core
                </button>
                <button 
                  type="button"
                  onClick={() => setVoiceModel('ElevenLabs')}
                  className={`py-4 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                    voiceModel === 'ElevenLabs' ? 'bg-white text-black border-white shadow-lg' : 'bg-black border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  Premium Neural
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">System Instructions</label>
              <textarea 
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Define your agent's tone, rules, and logic..." 
                className="w-full h-32 py-4 px-5 bg-black border border-white/10 text-white rounded-2xl focus:border-white focus:ring-4 focus:ring-white/5 outline-none text-sm transition-all font-medium placeholder:text-neutral-600 resize-none" 
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4.5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-neutral-400 hover:text-white cursor-pointer bg-transparent"
            >
              Abort
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-4.5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neutral-100 active:scale-[0.98] shadow-xl transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer font-display"
            >
              {loading ? 'Initializing...' : 'Establish Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntityModal;
