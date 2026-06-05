import React, { useState } from 'react';
import { 
  Phone, 
  Clock, 
  FileText, 
  ChevronRight, 
  Activity, 
  Search, 
  Filter, 
  Terminal, 
  Settings, 
  PhoneOff, 
  AlertCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface TabCallsProps {
  transcripts: any[];
  callStatus: string;
  onCall: (number: string) => void;
}

const TabCalls: React.FC<TabCallsProps> = ({ transcripts, callStatus, onCall }) => {
  const [selectedCall, setSelectedCall] = useState<number | null>(0);
  const [phoneNumber, setPhoneNumber] = useState('+916306987592');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const initialCalls = [
    { id: 0, number: phoneNumber, time: 'Just now', duration: '--:--', status: callStatus === 'connected' ? 'Active' : 'Ended', agent: 'Admission Bot', intent: 'Admissions' },
    { id: 1, number: '+1 339 201 6440', time: '2 hours ago', duration: '5:24', status: 'Completed', agent: 'Support Bot', intent: 'Fees Inquiry' },
    { id: 2, number: '+91 99887 76655', time: 'Yesterday', duration: '3:12', status: 'Completed', agent: 'Sales Bot', intent: 'Pricing Options' },
    { id: 3, number: '+44 20 7946 0958', time: '2 days ago', duration: '1:45', status: 'Completed', agent: 'Admission Bot', intent: 'Eligibility' },
  ];

  // Filtering logs
  const filteredCalls = initialCalls.filter(c => {
    const matchesSearch = c.number.includes(searchQuery) || c.agent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeFilter === 'All' || c.status === activeFilter;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex h-full divide-x divide-white/10 bg-black text-white">
      
      {/* Left Panel: Call Center History & Controls */}
      <div className="w-1/3 flex flex-col h-full overflow-hidden bg-[#0a0a0a]/50">
        <div className="p-6 border-b border-white/5 flex flex-col gap-4 bg-black shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-black uppercase tracking-wider text-white leading-none font-display">Operational Queue</h2>
            <span className="text-[9px] font-black bg-white/10 text-neutral-400 px-2 py-0.5 rounded-full">Telephony SIP</span>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter subscriber number..."
              className="flex-1 px-3 py-2.5 bg-black border border-white/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-white text-white transition-colors"
            />
            <button 
              onClick={() => onCall(phoneNumber)}
              disabled={callStatus === 'calling' || callStatus === 'connected'}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-md transition-all cursor-pointer
                ${callStatus === 'idle' || callStatus === 'error' 
                  ? 'bg-white text-black hover:bg-neutral-100' 
                  : 'bg-white/5 text-neutral-500 cursor-not-allowed shadow-none'}
              `}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{callStatus === 'connected' ? 'LIVE' : callStatus === 'calling' ? 'DIALING...' : 'DIAL'}</span>
            </button>
          </div>

          {callStatus === 'idle' && transcripts.length > 0 && (
            <div className="px-3 py-2 bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-widest rounded-xl border border-rose-500/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Gateway session completed & saved</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-white/5 flex gap-2 shrink-0 bg-black items-center">
          <Search className="w-3.5 h-3.5 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search filters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none p-0 text-[10px] bg-transparent focus:ring-0 w-full text-white font-semibold"
          />
        </div>
        
        {/* Call Sessions List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredCalls.map((call) => (
            <div 
              key={call.id}
              onClick={() => setSelectedCall(call.id)}
              className={`p-6 border-b border-white/5 cursor-pointer transition-all ${
                selectedCall === call.id ? 'bg-[#0a0a0a] border-l-4 border-l-white shadow-sm' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-black tracking-tight text-white font-display">{call.number}</span>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  call.status === 'Active' 
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 animate-pulse' 
                    : 'text-neutral-400 bg-white/5 border-white/5'
                }`}>
                  {call.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[8px] text-neutral-500 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    {call.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-neutral-500" />
                    {call.duration}
                  </span>
                </div>
                <span>{call.agent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Split-Screen Live WebSocket Monitor */}
      <div className="flex-1 flex flex-col h-full bg-black relative">
        {!transcripts.length && selectedCall !== 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-neutral-500">
             <div className="w-16 h-16 rounded-3xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center mb-6 shadow-lg">
                <FileText className="w-6 h-6 text-neutral-500" />
             </div>
             <p className="text-xs font-black uppercase tracking-widest font-display text-white">Select Operational Session</p>
             <p className="text-[10px] text-neutral-500 font-semibold mt-1">Select a call from the left list to review real-time streaming summaries.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Real-time Status Header */}
            <div className="px-8 py-3.5 border-b border-white/5 flex justify-between items-center shrink-0 shadow-lg bg-black">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 font-display">Live Workspace Stream</span>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/20 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all bg-transparent text-white cursor-pointer">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Carrier Logs</span>
                </button>
                {callStatus === 'connected' && (
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer">
                    <PhoneOff className="w-3.5 h-3.5 text-rose-400" />
                    <span>Drop Gateway</span>
                  </button>
                )}
              </div>
            </div>

            {/* Transcript Stream Panel */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]/50 scrollbar-hide">
              <div className="max-w-2xl mx-auto space-y-6">
                {transcripts.length === 0 ? (
                  <div className="py-24 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-3xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center mb-6 animate-pulse">
                      <Phone className="w-6 h-6 text-neutral-500" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Awaiting Live Telephony</h3>
                    <p className="text-[10px] text-neutral-500 font-semibold mt-1">Grounded voice channels will populate as soon as the sandbox compiles.</p>
                  </div>
                ) : (
                  transcripts.map((t, idx) => (
                    <div key={idx} className={`flex flex-col ${t.speaker === 'user' ? 'items-start' : 'items-end'} space-y-1.5`}>
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500">
                          {t.speaker === 'user' ? 'Subscriber' : 'AI Agent'}
                        </span>
                        <div className={`w-1 h-1 rounded-full ${t.speaker === 'user' ? 'bg-neutral-600' : 'bg-emerald-500'}`} />
                      </div>
                      <div className={`max-w-[80%] px-5 py-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm transition-all ${
                        t.speaker === 'user' 
                          ? 'bg-[#0a0a0a] border border-white/10 text-white rounded-tl-none' 
                          : 'bg-white text-black rounded-tr-none'
                      }`}>
                        {t.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Post-Call Telemetric Analysis Drawer */}
            <div className="h-44 border-t border-white/10 bg-black px-10 flex items-center shrink-0">
               <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-2.5 col-span-2">
                     <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-500">AI Summary & Resolutions</h4>
                     <p className="text-[11px] font-semibold text-neutral-400 leading-relaxed italic line-clamp-3">
                        {transcripts.length > 3 
                          ? '"Student Rahul Sharma queried course eligibility for B.Tech CS. AI resolved that non-CS subjects in high school are allowed under admission guidelines. High interest converted to hot lead CRM."'
                          : 'Operational summary details will populate once conversation reaches minimum conversational depth.'}
                     </p>
                  </div>

                  <div className="space-y-2.5">
                     <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Extracted Intents</h4>
                     <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                           <span className="text-[10px] font-black uppercase text-white">Warm CS Interest</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-white" />
                           <span className="text-[10px] font-black uppercase text-white">MMMUT Eligibility</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2.5">
                     <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Audio Telemetry</h4>
                     <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black text-neutral-500 uppercase">
                           <span>STT Inference</span>
                           <span className="text-white">180ms</span>
                        </div>
                        <div className="flex justify-between text-[8px] font-black text-neutral-500 uppercase">
                           <span>TTS Synthesis</span>
                           <span className="text-white">95ms</span>
                        </div>
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

export default TabCalls;
