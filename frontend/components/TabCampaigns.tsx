import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Plus, 
  Settings2, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Users, 
  Sliders, 
  PhoneCall, 
  Calendar,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

const TabCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'B.Tech CS Admissions Follow-up', status: 'Running', type: 'Outbound', agent: 'Admission Bot', leads: 480, progress: 68, answerRate: '72%', conversion: '18.4%' },
    { id: 2, name: 'MBA Finance Prospecting', status: 'Paused', type: 'Outbound', agent: 'Sales Bot', leads: 1200, progress: 32, answerRate: '58%', conversion: '12.1%' },
    { id: 3, name: 'Placement Screening Campaign', status: 'Completed', type: 'Outbound', agent: 'Recruiter Pro', leads: 250, progress: 100, answerRate: '88%', conversion: '42.6%' },
    { id: 4, name: 'Alumni Engagement Drive', status: 'Draft', type: 'Outbound', agent: 'Support Ace', leads: 850, progress: 0, answerRate: '--%', conversion: '--%' }
  ]);

  // Dialer rules state
  const [retryLimit, setRetryLimit] = useState(3);
  const [retryInterval, setRetryInterval] = useState(15); // minutes
  const [concurrency, setConcurrency] = useState(10);
  const [selectedAgent, setSelectedAgent] = useState('Admission Bot');

  const toggleCampaignStatus = (id: number) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        if (c.status === 'Running') return { ...c, status: 'Paused' };
        if (c.status === 'Paused') return { ...c, status: 'Running' };
      }
      return c;
    }));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent p-6 overflow-y-auto scrollbar-hide text-white">
      <div className="max-w-6xl mx-auto w-full space-y-8 pb-16 relative">

        {/* Title */}
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white font-display">Campaign Launchpad</h1>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mt-1">Configure automated outbound dialers, callback logic, and agent parameters</p>
          </div>
          <button className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-1.5 font-display">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>

        {/* Top metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 border border-white/[0.05] rounded-lg bg-white/[0.015] shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">Active Campaigns</p>
            <h3 className="text-2xl font-black tracking-tight text-white font-display">
              {campaigns.filter(c => c.status === 'Running').length}
            </h3>
            <span className="text-[8px] text-neutral-500 font-bold uppercase mt-1 block">Across 4 deployed templates</span>
          </div>
          <div className="p-6 border border-white/[0.05] rounded-lg bg-white/[0.015] shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">Answer Rate (Avg)</p>
            <h3 className="text-2xl font-black tracking-tight text-emerald-400 font-display">72.6%</h3>
            <span className="text-[8px] text-emerald-500/80 font-bold uppercase mt-1 block">+4.8% vs last week</span>
          </div>
          <div className="p-6 border border-white/[0.05] rounded-lg bg-white/[0.015] shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">Outbound Concurrency</p>
            <h3 className="text-2xl font-black tracking-tight text-cyan-400 font-display">{concurrency} calls/s</h3>
            <span className="text-[8px] text-neutral-500 font-bold uppercase mt-1 block">Twilio SIP Trunk Limit</span>
          </div>
          <div className="p-6 border border-white/[0.05] rounded-lg bg-white/[0.015] shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1.5">Conversion Funnel Success</p>
            <h3 className="text-2xl font-black tracking-tight text-white font-display">24.5%</h3>
            <span className="text-[8px] text-emerald-400 font-bold uppercase mt-1 block">Meetings Booked target</span>
          </div>
        </div>

        {/* Split screen: Campaign list + Outbound Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Deployed campaigns list */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 px-2 font-display">Outbound Campaign Registry</h3>
            <div className="space-y-4">
              {campaigns.map((c) => (
                <div key={c.id} className="p-6 border border-white/[0.05] rounded-lg bg-white/[0.015] shadow-lg hover:border-white/10 transition-all flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.status === 'Running' ? 'bg-emerald-500 animate-pulse' : c.status === 'Paused' ? 'bg-amber-500' : c.status === 'Completed' ? 'bg-blue-500' : 'bg-neutral-500'
                        }`} />
                        <h4 className="text-xs font-black text-white font-display">{c.name}</h4>
                      </div>
                      <p className="text-[8px] text-neutral-500 font-bold uppercase mt-1">Agent Assigned: {c.agent} • {c.type}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {c.status !== 'Draft' && c.status !== 'Completed' && (
                        <button 
                          onClick={() => toggleCampaignStatus(c.id)}
                          className="p-1.5 bg-white/5 border border-white/10 hover:border-white rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer"
                        >
                          {c.status === 'Running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <span className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        c.status === 'Running' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        c.status === 'Paused' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        c.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-neutral-900 text-neutral-400 border-white/5'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {c.status !== 'Draft' && (
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-[8px] font-bold text-neutral-500">
                        <span>Leads Contacted: {Math.floor(c.leads * (c.progress / 100))}/{c.leads}</span>
                        <span>{c.progress}% Completed</span>
                      </div>
                      <div className="h-1.5 w-full bg-black border border-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${c.progress}%` }}
                          className={`h-full rounded-full ${
                            c.status === 'Completed' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats snippet */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-white/5 text-[10px] font-bold text-neutral-400">
                    <div>
                      <span className="text-[7.5px] text-neutral-500 uppercase block font-bold leading-none mb-1">Answer Rate</span>
                      <span>{c.answerRate}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-neutral-500 uppercase block font-bold leading-none mb-1">Conversions</span>
                      <span>{c.conversion}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-neutral-500 uppercase block font-bold leading-none mb-1">Total Leads</span>
                      <span>{c.leads}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-neutral-500 uppercase block font-bold leading-none mb-1">Avg Duration</span>
                      <span>{c.status === 'Draft' ? '--' : '2m 15s'}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right: Outbound Rules & Dial Settings */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 px-2 font-display">System Outbound Rules</h3>
            
            <div className="p-6 bg-white/[0.015] border border-white/[0.05] rounded-lg shadow-xl space-y-6">
              
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 font-display">Dialer Concurrency</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-neutral-400">
                    <span>Simultaneous Channels</span>
                    <span className="text-white font-mono">{concurrency} calls</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={concurrency}
                    onChange={(e) => setConcurrency(parseInt(e.target.value))}
                    className="w-full accent-white" 
                  />
                </div>
              </div>

              <div className="h-[1px] w-full bg-white/5" />

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 font-display">Redial Retry Policy</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Max Attempts</label>
                    <select 
                      value={retryLimit}
                      onChange={(e) => setRetryLimit(parseInt(e.target.value))}
                      className="w-full p-2 bg-transparent border border-white/[0.05] text-xs font-semibold rounded-lg text-white"
                    >
                      <option className="bg-neutral-900 text-white" value={1}>1 Attempt</option>
                      <option className="bg-neutral-900 text-white" value={2}>2 Attempts</option>
                      <option className="bg-neutral-900 text-white" value={3}>3 Attempts</option>
                      <option className="bg-neutral-900 text-white" value={5}>5 Attempts</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Retry Cool-down</label>
                    <select 
                      value={retryInterval}
                      onChange={(e) => setRetryInterval(parseInt(e.target.value))}
                      className="w-full p-2 bg-transparent border border-white/[0.05] text-xs font-semibold rounded-lg text-white"
                    >
                      <option className="bg-neutral-900 text-white" value={5}>5 mins</option>
                      <option className="bg-neutral-900 text-white" value={15}>15 mins</option>
                      <option className="bg-neutral-900 text-white" value={30}>30 mins</option>
                      <option className="bg-neutral-900 text-white" value={60}>1 hour</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="h-[1px] w-full bg-white/5" />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500/80">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="text-[9px] font-black uppercase tracking-widest leading-none font-display">Compliance Safeguards</h4>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                  NDNC / Do Not Call regulations are enforced. Dialer will automatically block calls outside local timezone hours (09:00 AM - 08:00 PM).
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabCampaigns;
