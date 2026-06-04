import React from 'react';
import { 
  PhoneCall, 
  Users, 
  Flame, 
  Clock, 
  Activity, 
  HeartHandshake, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  BadgeAlert,
  Server
} from 'lucide-react';

interface TabOverviewProps {
  analyticsData: any[];
  callStatus: string;
  transcripts: any[];
  entities: any[];
}

const TabOverview: React.FC<TabOverviewProps> = ({ analyticsData, callStatus, transcripts, entities }) => {
  // Compute some dynamic values if available
  const callCount = analyticsData?.length || 24;
  const hotLeads = Math.round(callCount * 0.35);

  const stats = [
    { label: 'Calls Conducted', value: callCount, icon: PhoneCall, change: '+18.4%', trend: 'up' },
    { label: 'AI Resolution Rate', value: '94.8%', icon: HeartHandshake, change: '+2.1%', trend: 'up' },
    { label: 'Active Live Streams', value: callStatus === 'connected' ? '1' : '0', icon: Activity, change: callStatus === 'connected' ? 'Active' : 'Idle', trend: callStatus === 'connected' ? 'up' : 'neutral' },
    { label: 'Hot Leads Extracted', value: hotLeads, icon: Flame, change: '+24.1%', trend: 'up' },
    { label: 'Avg Latency', value: '480ms', icon: Cpu, change: '-40ms', trend: 'up' },
    { label: 'Unique Callers', value: '118', icon: Users, change: '+12%', trend: 'up' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white p-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto w-full space-y-8 pb-16">
        
        {/* Command Center Title Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Executive Command Center</h1>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-1">Real-time SaaS Telemetry & Agent Management</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200/50">
            <Server className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">Gateway Status:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-emerald-600">Connected</span>
            </div>
          </div>
        </div>

        {/* Executive Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-5 border border-neutral-100 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 rounded-xl bg-neutral-50 text-neutral-500 group-hover:bg-black group-hover:text-white transition-all">
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                  stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 leading-none mb-1.5">{stat.label}</p>
              <h3 className="text-lg font-black tracking-tight text-neutral-900 leading-none">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Command Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Charts & Systems Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Audio Streaming Monitor (WS connection display) */}
            <div className="border border-neutral-200/60 rounded-3xl p-6 bg-neutral-900 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Live Voice Pipeline Streams</h3>
                </div>
                <div className="px-2.5 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5">
                  Half-Duplex Guard
                </div>
              </div>

              {callStatus === 'connected' && transcripts.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black text-xs">
                        LIVE
                      </div>
                      <div>
                        <p className="text-xs font-bold">Active Customer Session</p>
                        <p className="text-[8px] text-neutral-400 font-bold uppercase mt-0.5">SIP Gateway: Twilio Audio Stream</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Processing...</span>
                  </div>

                  <div className="bg-black/50 border border-white/5 rounded-2xl p-4 max-h-[160px] overflow-y-auto scrollbar-hide space-y-3">
                    {transcripts.slice(-3).map((t, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded h-fit ${
                          t.speaker === 'user' ? 'bg-neutral-800 text-neutral-300' : 'bg-white text-black'
                        }`}>
                          {t.speaker === 'user' ? 'User' : 'Agent'}
                        </span>
                        <p className="text-xs text-neutral-200">{t.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Activity className="w-10 h-10 text-neutral-700 mb-4 animate-pulse" />
                  <p className="text-xs font-bold text-neutral-400">No active calls currently running</p>
                  <p className="text-[9px] text-neutral-600 uppercase tracking-widest mt-1">Initiate inbound calls via the Call Center module</p>
                </div>
              )}
            </div>

            {/* Custom SVG Performance Analytics Chart */}
            <div className="border border-neutral-100 rounded-3xl p-6 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Call Volume & Performance Metrics</h3>
                  <p className="text-[9px] text-neutral-400 font-medium">Daily metrics aggregate across all deployed agents</p>
                </div>
                <div className="flex gap-4 text-[9px] font-black uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                    <span>Inbound Calls</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Lead Conversion</span>
                  </div>
                </div>
              </div>

              {/* Simulated Responsive SVG Graph Chart */}
              <div className="h-60 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 600 240" fill="none">
                  {/* Grid Lines */}
                  <line x1="40" y1="40" x2="580" y2="40" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="40" y1="100" x2="580" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="40" y1="160" x2="580" y2="160" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="40" y1="200" x2="580" y2="200" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Volume Path */}
                  <path 
                    d="M 50 190 Q 120 120 200 150 T 350 80 T 500 60 T 580 40" 
                    fill="none" 
                    stroke="#171717" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                  
                  {/* Conversion Path */}
                  <path 
                    d="M 50 200 Q 120 180 200 190 T 350 140 T 500 110 T 580 90" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  <circle cx="200" cy="150" r="5" fill="#171717" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="350" cy="80" r="5" fill="#171717" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="500" cy="60" r="5" fill="#171717" stroke="#ffffff" strokeWidth="2" />

                  <circle cx="200" cy="190" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="350" cy="140" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="500" cy="110" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

                  {/* X Axis Labels */}
                  <text x="50" y="225" fill="#a3a3a3" fontSize="9" fontWeight="bold">MON</text>
                  <text x="130" y="225" fill="#a3a3a3" fontSize="9" fontWeight="bold">TUE</text>
                  <text x="210" y="225" fill="#a3a3a3" fontSize="9" fontWeight="bold">WED</text>
                  <text x="290" y="225" fill="#a3a3a3" fontSize="9" fontWeight="bold">THU</text>
                  <text x="370" y="225" fill="#a3a3a3" fontSize="9" fontWeight="bold">FRI</text>
                  <text x="450" y="225" fill="#a3a3a3" fontSize="9" fontWeight="bold">SAT</text>
                  <text x="530" y="225" fill="#a3a3a3" fontSize="9" fontWeight="bold">SUN</text>
                </svg>
              </div>
            </div>

          </div>

          {/* Column 3: Status, Targets, Agent Lists */}
          <div className="space-y-6">
            
            {/* System Node & API Gateways */}
            <div className="border border-neutral-100 rounded-3xl p-6 bg-neutral-50/50 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Gateway Latencies</h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Twilio Stream Hook', latency: '42ms', status: 'Optimal' },
                  { name: 'Groq Whisper (STT)', latency: '210ms', status: 'Optimal' },
                  { name: 'Groq Llama-3.3 (LLM)', latency: '190ms', status: 'Optimal' },
                  { name: 'Google Translation (TTS)', latency: '85ms', status: 'Optimal' },
                ].map((gate, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white border border-neutral-100 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-neutral-900 leading-none">{gate.name}</p>
                      <span className="text-[7.5px] text-neutral-400 font-bold uppercase tracking-wider mt-1 block">{gate.status}</span>
                    </div>
                    <span className="text-[11px] font-black text-neutral-900">{gate.latency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Intent Breakdowns */}
            <div className="border border-neutral-100 rounded-3xl p-6 bg-white space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Intent Distributions</h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Admissions & Fees', percent: '48%', color: 'bg-neutral-900' },
                  { label: 'Lead Sales Inquiries', percent: '28%', color: 'bg-emerald-500' },
                  { label: 'Support & FAQs', percent: '14%', color: 'bg-indigo-500' },
                  { label: 'Complaints', percent: '10%', color: 'bg-rose-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest leading-none">
                      <span>{item.label}</span>
                      <span>{item.percent}</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: item.percent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TabOverview;
