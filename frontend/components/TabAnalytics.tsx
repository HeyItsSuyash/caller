import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  PhoneIncoming, 
  Clock, 
  ArrowUpRight, 
  ChevronRight, 
  MessageSquare,
  Activity,
  Cpu,
  Layers,
  Award
} from 'lucide-react';

interface TabAnalyticsProps {
  analyticsData: any[];
  isGlobal?: boolean;
  activeSubpage?: string;
}

const TabAnalytics: React.FC<TabAnalyticsProps> = ({ analyticsData, isGlobal, activeSubpage }) => {
  const [selectedSubpage, setSelectedSubpage] = useState<'Performance' | 'Conversions' | 'Revenue' | 'Agent Analytics' | 'Call Analytics'>('Performance');

  React.useEffect(() => {
    if (activeSubpage) {
      setSelectedSubpage(activeSubpage as any);
    }
  }, [activeSubpage]);

  const globalData = isGlobal && analyticsData.length > 0 ? analyticsData[0] : null;

  const stats = [
    { 
      label: isGlobal ? 'System Calls (Cumulative)' : 'Workspace Calls', 
      value: globalData ? globalData.totalCalls : (analyticsData.length || '24'), 
      change: '+18.4%', 
      icon: PhoneIncoming, 
      color: 'text-neutral-900', 
      bg: 'bg-neutral-50' 
    },
    { 
      label: isGlobal ? 'Platform Tenants' : 'Avg Telephony Latency', 
      value: globalData ? globalData.totalUsers : '480ms', 
      change: '-12%', 
      icon: Cpu, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: isGlobal ? 'Top Intent Sector' : 'Top Intent', 
      value: globalData ? (globalData.topIntents?.[0]?.intent || 'N/A') : 'Admissions', 
      change: 'Steady', 
      icon: TrendingUp, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      label: isGlobal ? 'Configured Agents' : 'Unique Prospects', 
      value: globalData ? globalData.totalEntities : '118', 
      change: '+24.2%', 
      icon: Users, 
      color: 'text-neutral-900', 
      bg: 'bg-neutral-50' 
    },
  ];

  const recentSummaries = [
    { id: 1, phone: '+91 987xx xxxx', text: 'Student queried B.Tech course details, registration fees, and hostel availability. Satisfied with instructions.', intent: 'Admissions Inquiry', time: '12m ago' },
    { id: 2, phone: '+91 876xx xxxx', text: 'Inquired whether non-math background candidates qualify for MBA marketing. Confirmed eligibility criteria.', intent: 'Eligibility Check', time: '1h ago' },
    { id: 3, phone: '+91 765xx xxxx', text: 'Queried direct admission quotas and scholarship benchmarks. Marked as warm lead.', intent: 'Scholarship Details', time: '3h ago' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-black p-8 overflow-y-auto scrollbar-hide text-white">
      <div className="max-w-6xl mx-auto w-full space-y-12 pb-16">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white font-display">Telemetric Analytics</h1>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mt-1">Grounded call analysis, package latency indicators, and intent indexes</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 border border-white/5 rounded-3xl bg-[#0a0a0a] shadow-lg hover:border-white/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl bg-black border border-white/10 text-white group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                  stat.change.startsWith('+') || stat.change.startsWith('-') ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-neutral-400 bg-white/5 border border-white/5'
                }`}>
                  {stat.change}
                </div>
              </div>
              <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500 mb-1">{stat.label}</p>
              <h2 className="text-xl font-black tracking-tight text-white leading-none font-display">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Split Screen Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Transcripts & Grounded Interactions */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 px-2 font-display">Telemetric Insights</h3>
            
            <div className="space-y-4">
              {recentSummaries.map((s) => (
                <div key={s.id} className="p-6 border border-white/5 rounded-3xl hover:border-white/25 transition-all bg-[#0a0a0a] shadow-lg space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center border border-white/10">
                        <MessageSquare className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white font-display">{s.phone}</p>
                        <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest mt-0.5">{s.intent}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-500">{s.time}</span>
                  </div>
                  
                  <div className="bg-black p-4 rounded-2xl border border-white/10">
                    <p className="text-xs font-semibold leading-relaxed text-neutral-300 italic">"{s.text}"</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-white/5 rounded border border-white/5 text-[8px] font-black text-neutral-400 uppercase tracking-widest">Grounded Fact Ingest</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-400 uppercase tracking-widest">Lead Created</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Charts & Audio Latencies */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 px-2 font-display">Voice Gateway Telemetry</h3>
            
            <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-[2rem] shadow-xl text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-center text-white">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">System Intent Split</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="space-y-4">
                {[
                  { intent: 'Admissions Inquiry', count: 48, percent: 48, color: 'bg-emerald-500' },
                  { intent: 'Eligibility & Guidelines', count: 28, percent: 28, color: 'bg-indigo-500' },
                  { intent: 'Fees & Pricing Structure', count: 14, percent: 14, color: 'bg-blue-500' },
                  { intent: 'Miscellaneous/FAQs', count: 10, percent: 10, color: 'bg-neutral-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-neutral-400">
                      <span>{item.intent}</span>
                      <span className="text-white">{item.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality assurance latency tracker */}
            <div className="p-6 border border-white/5 rounded-[2rem] bg-[#0a0a0a] space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white leading-none font-display">Response Speed Benchmarks</h3>
              </div>
              <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
                VANI pipeline converts Twilio streams $\mu$-law binary packets to PCM WAV, feeds Llama-3.3 LLM models, and returns synthesized TTS voice waves in a **480ms** round-trip block.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TabAnalytics;
