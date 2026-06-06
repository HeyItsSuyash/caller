import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Cpu,
  Mic,
  Calendar,
  Volume2,
  ListFilter,
  Play,
  Download,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

interface TabCallsProps {
  transcripts: any[];
  callStatus: string;
  onCall: (number: string) => void;
  onHangup: () => void;
  activeSubpage?: string;
}

const TabCalls: React.FC<TabCallsProps> = ({ transcripts, callStatus, onCall, onHangup, activeSubpage }) => {
  const [selectedSubpage, setSelectedSubpage] = useState<'Live Calls' | 'Recent Calls' | 'Scheduled Calls' | 'Recordings' | 'Call Logs'>('Live Calls');

  React.useEffect(() => {
    if (activeSubpage) {
      setSelectedSubpage(activeSubpage as any);
    }
  }, [activeSubpage]);
  const [phoneNumber, setPhoneNumber] = useState('+91 63069 87592');
  const [selectedCallId, setSelectedCallId] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);

  const callsData = [
    { id: 0, number: phoneNumber, time: 'Just now', duration: '--:--', status: callStatus === 'connected' ? 'Active' : 'Ended', agent: 'Admission Bot', intent: 'Admissions Inquiry', sentiment: 'Positive', confidence: '94%' },
    { id: 1, number: '+1 339 201 6440', time: '2 hours ago', duration: '5:24', status: 'Completed', agent: 'Support Bot', intent: 'Fees Refund Query', sentiment: 'Neutral', confidence: '89%' },
    { id: 2, number: '+91 99887 76655', time: 'Yesterday', duration: '3:12', status: 'Completed', agent: 'Sales Bot', intent: 'Pricing Discussion', sentiment: 'Positive', confidence: '91%' },
    { id: 3, number: '+44 20 7946 0958', time: '2 days ago', duration: '1:45', status: 'Completed', agent: 'Admission Bot', intent: 'Course Eligibility', sentiment: 'Negative', confidence: '85%' },
  ];

  const scheduledCalls = [
    { id: 101, number: '+91 90909 12345', time: 'Today, 4:00 PM', agent: 'Follow-up Bot', description: 'Callback query regarding admissions eligibility' },
    { id: 102, number: '+1 617 555 0199', time: 'Tomorrow, 10:30 AM', agent: 'Sales Bot', description: 'Outbound qualification campaign call' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent text-white relative">
      
      {/* Subpage Tabs Switcher */}
      <div className="px-8 border-b border-white/5 bg-transparent shrink-0 flex justify-between items-center h-12">
        <div className="flex gap-4">
          {(['Live Calls', 'Recent Calls', 'Scheduled Calls', 'Recordings', 'Call Logs'] as const).map((tab) => (
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

      {/* Workspace Display Area */}
      <div className="flex-1 overflow-hidden flex p-6 gap-6">
        
        {/* ====================================================
            LIVE CALLS SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Live Calls' && (
          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* Left dial controller */}
            <div className="w-1/3 p-5 flex flex-col gap-5 bg-white/[0.015] border border-white/[0.05] rounded-lg overflow-y-auto">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 font-display mb-1">Outbound Dialer</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase">Configure & initialize live outbound dialing</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Phone Number</label>
                  <input 
                    type="text" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number..."
                    className="w-full px-4 py-2 bg-transparent border border-white/[0.05] text-white rounded-lg focus:border-white focus:ring-0 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onCall(phoneNumber)}
                    disabled={callStatus === 'calling' || callStatus === 'connected'}
                    className={`w-full py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2
                      ${callStatus === 'idle' || callStatus === 'error'
                        ? 'bg-white text-black hover:bg-neutral-100'
                        : 'bg-white/5 text-neutral-500 cursor-not-allowed'}
                    `}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Dial</span>
                  </button>
                  <button 
                    onClick={onHangup}
                    disabled={callStatus !== 'connected'}
                    className={`w-full py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2
                      ${callStatus === 'connected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' : 'bg-white/5 text-neutral-500 cursor-not-allowed'}
                    `}
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>Hangup</span>
                  </button>
                </div>
              </div>

              {/* Status Display */}
              <div className="p-4 rounded-lg bg-white/[0.01] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      callStatus === 'connected' ? 'bg-emerald-400' : 'bg-neutral-600'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      callStatus === 'connected' ? 'bg-emerald-500' : 'bg-neutral-500'
                    }`}></span>
                  </span>
                  <div>
                    <p className="text-[10px] font-black text-white leading-none">Telephony State</p>
                    <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">
                      {callStatus === 'connected' ? 'Connected' : callStatus === 'calling' ? 'Dialing Trunk' : 'Gateway Idle'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Active Transcript Screen */}
            <div className="flex-1 flex flex-col justify-between bg-white/[0.015] border border-white/[0.05] rounded-lg overflow-hidden relative">
              <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 font-display">Live Speech Gateway</h3>
                <span className="text-[8.5px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-neutral-400">WebSocket Active</span>
              </div>

              {/* Active Audio Waveform & Speech states */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {callStatus === 'connected' && transcripts.length > 0 ? (
                  transcripts.map((t, i) => (
                    <div key={i} className={`flex flex-col ${t.speaker === 'user' ? 'items-start' : 'items-end'} space-y-1`}>
                      <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest ml-1">{t.speaker === 'user' ? 'Caller' : 'AI Agent'}</span>
                      <div className={`px-4 py-3 rounded-lg text-xs font-semibold leading-relaxed max-w-[75%] shadow-sm ${
                        t.speaker === 'user' ? 'bg-white/[0.02] border border-white/10 text-white rounded-tl-none' : 'bg-white text-black rounded-tr-none'
                      }`}>
                        {t.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 text-neutral-500">
                    <Volume2 className="w-8 h-8 mb-3 text-neutral-600 animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-widest text-white">No Active Voice Stream</p>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Grounded telemetry registers when call connects</p>
                  </div>
                )}
              </div>

              {/* Live Waveform placeholder */}
              {callStatus === 'connected' && (
                <div className="p-6 border-t border-white/5 bg-white/[0.01] flex gap-1 h-14 items-center justify-center overflow-hidden">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-[2.5px] bg-white rounded-full"
                      animate={{ height: [4, Math.floor(Math.random() * 32) + 8, 4] }}
                      transition={{ duration: 0.8 + (i % 4) * 0.1, repeat: Infinity, delay: i * 0.02 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            RECENT CALLS SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Recent Calls' && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Recent Calls</h3>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Logs of completed conversation routes</p>
                </div>
              </div>

              <div className="bg-white/[0.015] border border-white/[0.05] rounded-lg overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-neutral-500">
                      <th className="px-6 py-4">Number</th>
                      <th className="px-6 py-4">Agent</th>
                      <th className="px-6 py-4">Intent</th>
                      <th className="px-6 py-4">Sentiment</th>
                      <th className="px-6 py-4">Confidence</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {callsData.map((call) => (
                      <tr key={call.id} className="hover:bg-white/[0.02] transition-colors text-xs font-semibold">
                        <td className="px-6 py-4 font-mono text-white">{call.number}</td>
                        <td className="px-6 py-4 text-neutral-300">{call.agent}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-wider rounded text-neutral-400">
                            {call.intent}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                            call.sentiment === 'Positive' ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400 bg-white/5'
                          }`}>
                            {call.sentiment}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-300 font-mono">{call.confidence}</td>
                        <td className="px-6 py-4 text-neutral-300 font-mono">{call.duration}</td>
                        <td className="px-6 py-4 text-neutral-500">{call.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            SCHEDULED CALLS SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Scheduled Calls' && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Scheduled Calls</h3>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Queued outbound campaigns pending dialer windows</p>
                </div>
                <button className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-all cursor-pointer">
                  Schedule Call
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheduledCalls.map((sc) => (
                  <div key={sc.id} className="p-6 bg-white/[0.015] border border-white/[0.05] rounded-lg flex flex-col justify-between shadow-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-neutral-500" />
                          <span className="text-xs font-black text-white font-mono">{sc.number}</span>
                        </div>
                        <span className="text-[9px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-neutral-400 font-mono">{sc.time}</span>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium leading-relaxed">{sc.description}</p>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Agent: {sc.agent}</span>
                      <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-white/5 cursor-pointer">
                        Cancel Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            RECORDINGS SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Recordings' && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">Audio Recordings Library</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Access voice archives and call playback waveforms</p>
              </div>

              <div className="space-y-4">
                {callsData.slice(1).map((record) => (
                  <div key={record.id} className="p-5 bg-white/[0.015] border border-white/[0.05] rounded-lg flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-4">
                      <button className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-black hover:bg-neutral-100 transition-all cursor-pointer">
                        <Play className="w-4 h-4" />
                      </button>
                      <div>
                        <h4 className="text-xs font-black text-white font-mono">{record.number}</h4>
                        <p className="text-[9.5px] text-neutral-500 font-bold uppercase mt-0.5">Agent: {record.agent} • Duration: {record.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2.5 bg-white/5 border border-white/5 rounded-lg hover:border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setSelectedSubpage('Live Calls')}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Inspect Transcript
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            CALL LOGS SUBPAGE
            ==================================================== */}
        {selectedSubpage === 'Call Logs' && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 font-display">System-wide Call Logs</h3>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Filterable telecom carrier events</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-white/5 p-1 rounded-lg">
                    <button className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-white text-black shadow-sm">All</button>
                    <button className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-neutral-500 hover:text-white bg-transparent border-none">Success</button>
                    <button className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-neutral-500 hover:text-white bg-transparent border-none">Failed</button>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.015] border border-white/[0.05] rounded-lg overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-neutral-500">
                      <th className="px-6 py-4">Session ID</th>
                      <th className="px-6 py-4">Number</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Cost</th>
                      <th className="px-6 py-4">Disposition</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs text-neutral-400">
                    {[
                      { id: 'sess_982A1C', phone: '+91 63069 87592', duration: '2m 15s', cost: '₹1.91', disp: 'Answered / Qualified', status: 'Completed' },
                      { id: 'sess_12B58D', phone: '+1 339 201 6440', duration: '5m 24s', cost: '₹4.59', disp: 'Answered / Refund Request', status: 'Completed' },
                      { id: 'sess_84C91A', phone: '+91 99887 76655', duration: '3m 12s', cost: '₹2.72', disp: 'Answered / Callback Scheduled', status: 'Completed' },
                      { id: 'sess_71D09E', phone: '+44 20 7946 0958', duration: '0m 00s', cost: '₹0.00', disp: 'No Answer', status: 'Failed' },
                    ].map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors font-semibold">
                        <td className="px-6 py-4 text-white">{log.id}</td>
                        <td className="px-6 py-4 text-white">{log.phone}</td>
                        <td className="px-6 py-4">{log.duration}</td>
                        <td className="px-6 py-4">{log.cost}</td>
                        <td className="px-6 py-4 text-neutral-400 font-sans">{log.disp}</td>
                        <td className="px-6 py-4 font-sans">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                            log.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TabCalls;
