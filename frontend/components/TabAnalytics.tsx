import React from 'react';
import { TrendingUp, Users, PhoneIncoming, Clock, ArrowUpRight, ChevronRight, MessageSquare } from 'lucide-react';

interface TabAnalyticsProps {
  analyticsData: any[];
  isGlobal?: boolean;
}

const TabAnalytics: React.FC<TabAnalyticsProps> = ({ analyticsData, isGlobal }) => {
  // If global, we might have a single summary object. If specific, we might have an array
  const globalData = isGlobal && analyticsData.length > 0 ? analyticsData[0] : null;

  const stats = [
    { 
      label: isGlobal ? 'Total System Calls' : 'Total Interaction', 
      value: globalData ? globalData.totalCalls : (analyticsData.length || '2,841'), 
      change: '+12.5%', 
      icon: PhoneIncoming, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: isGlobal ? 'Total Users' : 'Avg Duration', 
      value: globalData ? globalData.totalUsers : '4m 32s', 
      change: '+2.1%', 
      icon: Users, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: isGlobal ? 'System Intent' : 'Top Intent', 
      value: globalData ? (globalData.topIntents?.[0]?.intent || 'N/A') : 'Inquiry', 
      change: '+5.0%', 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: isGlobal ? 'Total Entities' : 'Unique Callers', 
      value: globalData ? globalData.totalEntities : '1,104', 
      change: '+18.2%', 
      icon: Clock, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
  ];

  const recentSummaries = [
    { id: 1, phone: '+91 987xx xxxx', text: 'Caller asked about B.Tech fee structure and scholarship options. Interested in CS.', intent: 'Admission Inquiry', time: '12m ago' },
    { id: 2, phone: '+91 876xx xxxx', text: 'Brief inquiry regarding MBA eligibility for non-technical graduates. Satisfied with details.', intent: 'Eligibility Check', time: '1h ago' },
    { id: 3, phone: '+91 765xx xxxx', text: 'Frustrated about previous call disconnection. Re-explained hostel facilities.', intent: 'Support/Complaint', time: '3h ago' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white p-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 border border-border rounded-2xl bg-white hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  stat.change.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                }`}>
                  {stat.change}
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">{stat.label}</p>
              <h2 className="text-2xl font-bold tracking-tight text-primary">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-3 gap-8">
          {/* Recent Summaries List */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold tracking-tight">Recent Interactions</h3>
              <button className="text-xs font-semibold text-secondary hover:text-black transition-colors flex items-center gap-1 group">
                Full History <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentSummaries.map((s) => (
                <div key={s.id} className="p-6 border border-border rounded-2xl hover:border-black transition-all bg-white shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center border border-border">
                        <MessageSquare className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{s.phone}</p>
                        <p className="text-[10px] text-secondary font-medium uppercase tracking-widest">{s.intent}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-secondary">{s.time}</span>
                  </div>
                  
                  <div className="bg-accent/30 p-4 rounded-xl border border-border/50">
                    <p className="text-xs font-medium leading-relaxed text-secondary italic">"{s.text}"</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Transcript Attached</span>
                    <span className="px-2 py-0.5 bg-emerald-100 rounded text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Resolved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Performance Indicators */}
          <div className="space-y-8">
            <div className="p-8 bg-black rounded-[2.5rem] shadow-xl text-white space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">Top Intents</h3>
              <div className="space-y-4">
                {(isGlobal && globalData?.topIntents ? globalData.topIntents : [
                  { label: 'Fees Inquiry', percent: 78, color: 'bg-emerald-500' },
                  { label: 'Eligibility', percent: 45, color: 'bg-blue-500' },
                  { label: 'Hostel Info', percent: 22, color: 'bg-indigo-500' },
                ]).map((item: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span>{item.intent || item.label}</span>
                      <span>{item.count ? `${item.count} Calls` : `${item.percent}%`}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color || 'bg-emerald-500'}`} style={{ width: `${item.percent || (item.count ? (item.count / globalData.totalCalls * 100) : 0)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 mt-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all">
                Download Detailed CSV
              </button>
            </div>

            <div className="p-8 border border-border rounded-[2.5rem] bg-accent/20 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Growth Pulse</h3>
              </div>
              <p className="text-[11px] font-medium text-secondary leading-relaxed">
                Interaction depth has increased by **24%** this month. Most active time for callers: **11AM - 2PM**.
              </p>
              <div className="pt-2">
                <button className="text-[10px] font-bold text-primary underline underline-offset-4 decoration-border hover:decoration-black transition-all">
                   Optimize Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabAnalytics;
