'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  PhoneCall, 
  Users, 
  Flame, 
  Activity, 
  HeartHandshake, 
  Cpu,
  Server,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface TabOverviewProps {
  analyticsData: any[];
  callStatus: string;
  transcripts: any[];
  entities: any[];
}

const TabOverview: React.FC<TabOverviewProps> = ({ analyticsData, callStatus, transcripts, entities }) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const callCount = analyticsData?.length || 24;
  const hotLeads = Math.round(callCount * 0.35);

  const stats = [
    { label: 'Calls Conducted', value: callCount, icon: PhoneCall, change: '+18.4%', trend: 'up' },
    { label: 'AI Resolution Rate', value: '94.8%', icon: HeartHandshake, change: '+2.1%', trend: 'up' },
    { label: 'Active Streams', value: callStatus === 'connected' ? '1' : '0', icon: Activity, change: callStatus === 'connected' ? 'Active' : 'Idle', trend: callStatus === 'connected' ? 'up' : 'neutral' },
    { label: 'Hot Leads', value: hotLeads, icon: Flame, change: '+24.1%', trend: 'up' },
    { label: 'Average Latency', value: '480ms', icon: Cpu, change: '-40ms', trend: 'up' },
    { label: 'Unique Callers', value: '118', icon: Users, change: '+12%', trend: 'up' },
  ];

  // Recharts Chart Data (Monochrome & Minimalist)
  const lineChartData = [
    { name: 'Mon', calls: 35 },
    { name: 'Tue', calls: 48 },
    { name: 'Wed', calls: 62 },
    { name: 'Thu', calls: 55 },
    { name: 'Fri', calls: 80 },
    { name: 'Sat', calls: 40 },
    { name: 'Sun', calls: 45 },
  ];

  const leadConversionData = [
    { name: 'Mon', conversion: 72 },
    { name: 'Tue', conversion: 78 },
    { name: 'Wed', conversion: 84 },
    { name: 'Thu', conversion: 80 },
    { name: 'Fri', conversion: 89 },
    { name: 'Sat', conversion: 75 },
    { name: 'Sun', conversion: 82 },
  ];

  const intentData = [
    { name: 'Admissions', value: 48 },
    { name: 'Sales Inquiries', value: 28 },
    { name: 'Support', value: 14 },
    { name: 'Billing', value: 10 },
  ];

  const agentPerformanceData = [
    { name: 'Agent 1', success: 94 },
    { name: 'Agent 2', success: 88 },
    { name: 'Agent 3', success: 91 },
    { name: 'Agent 4', success: 85 },
  ];

  const COLORS = ['#ffffff', '#a3a3a3', '#525252', '#262626'];

  return (
    <div className="min-w-0 bg-black p-8 font-sans text-white">
      <div className="max-w-7xl mx-auto w-full space-y-8 pb-16">
        
        {/* Command Center Title Section */}
        <div className="flex justify-between items-start border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase italic font-display text-white">Executive Command Center</h1>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mt-1">Real-time AI Voice Infrastructure Monitoring</p>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-1.5 bg-[#0a0a0a] rounded-xl border border-white/10">
            <Server className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Gateway Status:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-emerald-400">Active</span>
            </div>
          </div>
        </div>

        {/* Executive Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.15)' }}
              className="p-5 border border-white/5 rounded-2xl bg-[#0a0a0a] transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-black border border-white/10 text-white shadow-sm">
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                  stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-neutral-400 border border-white/10'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 leading-none mb-1.5">{stat.label}</p>
                <h3 className="text-xl font-black tracking-tight text-white leading-none font-display">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Command Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Charts & Systems Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Audio Streaming Monitor */}
            <div className="border border-white/5 rounded-3xl p-6 bg-[#0a0a0a] shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${callStatus === 'connected' ? 'animate-ping bg-emerald-400' : 'bg-neutral-600'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${callStatus === 'connected' ? 'bg-emerald-500' : 'bg-neutral-500'}`}></span>
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 font-display">Live Voice Pipeline Streams</h3>
                </div>
                <div className="px-2.5 py-1 bg-black rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 text-neutral-400">
                  {callStatus === 'connected' ? 'STREAMING ACTIVE' : 'TELEPHONY GUARD ACTIVE'}
                </div>
              </div>

              {callStatus === 'connected' && transcripts.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-black px-4 py-3 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-black text-xs">
                        LIVE
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Active Customer Session</p>
                        <p className="text-[8.5px] text-neutral-500 font-bold uppercase mt-0.5">SIP Gateway: Twilio Audio Stream</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Processing...</span>
                  </div>

                  <div className="bg-black border border-white/10 rounded-2xl p-4 max-h-[160px] overflow-y-auto scrollbar-hide space-y-3">
                    {transcripts.slice(-3).map((t, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded h-fit ${
                          t.speaker === 'user' ? 'bg-white/10 text-neutral-300' : 'bg-white text-black'
                        }`}>
                          {t.speaker === 'user' ? 'User' : 'Agent'}
                        </span>
                        <p className="text-xs text-neutral-300">{t.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Waveform visual */}
                  <div className="flex gap-1 h-8 items-center justify-start overflow-hidden pt-2 border-t border-white/5">
                    {[15, 30, 45, 25, 12, 38, 20, 28, 40, 15, 30, 45, 25, 12, 38, 20, 28, 40].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-[3px] bg-white rounded-full"
                        animate={{ height: [4, h, 4] }}
                        transition={{ duration: 1 + (i % 3) * 0.15, repeat: Infinity, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-12 h-12 rounded-full border border-white/10 bg-black flex items-center justify-center text-neutral-500 mb-4"
                  >
                    <Activity className="w-5 h-5" />
                  </motion.div>
                  <p className="text-xs font-bold text-white">No active calls currently running</p>
                  <p className="text-[9.5px] text-neutral-500 uppercase tracking-widest mt-1">Initiate outbound calls via the Calls module</p>
                </div>
              )}
            </div>

            {/* Recharts Analytics: Call Volume */}
            <div className="border border-white/5 rounded-3xl p-6 bg-[#0a0a0a] shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 font-display">Call Volume</h3>
                <p className="text-[9px] text-neutral-500 font-semibold uppercase mt-0.5">Daily voice minute logs</p>
              </div>
              <div className="h-64 w-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#171717" strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#737373' }} stroke="#262626" />
                      <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#737373' }} stroke="#262626" />
                      <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, backgroundColor: '#0d0d0d', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }} />
                      <Line type="monotone" dataKey="calls" stroke="#ffffff" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-black/50 animate-pulse rounded-2xl" />
                )}
              </div>
            </div>

          </div>

          {/* Column 3: Telemetry Matrix & Distributions */}
          <div className="space-y-6">
            
            {/* System Node & API Gateways Latency Panel */}
            <div className="border border-white/5 rounded-3xl p-6 bg-[#0a0a0a] space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 font-display">Latency Panel</h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Twilio Stream Connection', latency: '42ms', status: 'Optimal' },
                  { name: 'Groq Whisper API (STT)', latency: '210ms', status: 'Optimal' },
                  { name: 'Groq Llama (LLM Core)', latency: '190ms', status: 'Optimal' },
                  { name: 'TTS Engine (hi-IN Accent)', latency: '85ms', status: 'Optimal' },
                ].map((gate, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-black border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-white leading-none">{gate.name}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[7.5px] text-neutral-500 font-bold uppercase tracking-wider block leading-none">{gate.status}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-white font-mono">{gate.latency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recharts Analytics: Lead Conversion Rate */}
            <div className="border border-white/5 rounded-3xl p-6 bg-[#0a0a0a] shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 font-display">Lead Conversion</h3>
                <p className="text-[9px] text-neutral-500 font-semibold uppercase mt-0.5">CRM Pipeline Scoring</p>
              </div>
              <div className="h-48 w-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leadConversionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid stroke="#171717" strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#737373' }} stroke="#262626" />
                      <YAxis tick={{ fontSize: 9, fill: '#737373' }} stroke="#262626" />
                      <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, backgroundColor: '#0d0d0d', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }} />
                      <Bar dataKey="conversion" fill="#ffffff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-black/50 animate-pulse rounded-2xl" />
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Recharts Pie: Intent Distribution */}
          <div className="border border-white/5 rounded-3xl p-6 bg-[#0a0a0a] shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 font-display">Intent Distribution</h3>
              <p className="text-[9px] text-neutral-500 font-semibold uppercase mt-0.5">Top speech classifications</p>
            </div>
            <div className="h-64 flex items-center justify-between">
              <div className="w-[50%] h-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={intentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {intentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-black/50 animate-pulse rounded-full" />
                )}
              </div>
              <div className="w-[45%] space-y-2">
                {intentData.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="text-[10px] font-black text-white leading-none">{item.name}</span>
                    </div>
                    <span className="text-[9.5px] font-black text-neutral-500 font-mono ml-4">{item.value}% representation</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recharts Bar: Agent Performance */}
          <div className="border border-white/5 rounded-3xl p-6 bg-[#0a0a0a] shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 font-display">Agent Performance</h3>
              <p className="text-[9px] text-neutral-500 font-semibold uppercase mt-0.5">AI logic resolution rates</p>
            </div>
            <div className="h-64 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={agentPerformanceData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                  >
                    <CartesianGrid stroke="#171717" strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#737373' }} stroke="#262626" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#737373' }} stroke="#262626" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, backgroundColor: '#0d0d0d', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }} />
                    <Bar dataKey="success" fill="#a3a3a3" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-black/50 animate-pulse rounded-2xl" />
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TabOverview;
