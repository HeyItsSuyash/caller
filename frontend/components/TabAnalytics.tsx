import React from 'react';
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
}

const TabAnalytics: React.FC<TabAnalyticsProps> = ({ analyticsData, isGlobal }) => {
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
    <div className="flex-1 flex flex-col min-w-0 bg-white p-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto w-full space-y-12 pb-16">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Telemetric Analytics</h1>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-1">Grounded call analysis, package latency indicators, and intent indexes</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 border border-neutral-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                  stat.change.startsWith('+') || stat.change.startsWith('-') ? 'text-emerald-600 bg-emerald-50' : 'text-neutral-500 bg-neutral-50'
                }`}>
                  {stat.change}
                </div>
              </div>
              <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400 mb-1">{stat.label}</p>
              <h2 className="text-xl font-black tracking-tight text-neutral-900 leading-none">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Split Screen Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Transcripts & Grounded Interactions */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 px-2">Telemetric Insights</h3>
            
            <div className="space-y-4">
              {recentSummaries.map((s) => (
                <div key={s.id} className="p-6 border border-neutral-100 rounded-3xl hover:border-neutral-900 transition-all bg-white shadow-sm space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100">
                        <MessageSquare className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-neutral-900">{s.phone}</p>
                        <p className="text-[8px] text-neutral-400 font-black uppercase tracking-widest mt-0.5">{s.intent}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400">{s.time}</span>
                  </div>
                  
                  <div className="bg-neutral-50/50 p-4 rounded-2xl border border-neutral-200/30">
                    <p className="text-xs font-semibold leading-relaxed text-neutral-500 italic">"{s.text}"</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-neutral-100 rounded text-[8px] font-black text-neutral-500 uppercase tracking-widest">Grounded Fact Ingest</span>
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[8px] font-black text-emerald-600 uppercase tracking-widest">Lead Created</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Charts & Audio Latencies */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 px-2">Voice Gateway Telemetry</h3>
            
            <div className="p-6 bg-neutral-900 rounded-[2rem] shadow-xl text-white space-y-6 relative overflow-hidden">
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
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                      <span>{item.intent}</span>
                      <span>{item.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality assurance latency tracker */}
            <div className="p-6 border border-neutral-100 rounded-[2rem] bg-neutral-50/50 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-900 leading-none">Response Speed Benchmarks</h3>
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
