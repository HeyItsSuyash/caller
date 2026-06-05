import React from 'react';
import { 
  ArrowUpRight,
  ChevronRight,
  AlertTriangle,
  Flame,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  Award,
  Clock,
  MessageSquare
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
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
  setActiveTab?: (tab: string) => void;
}

const TabOverview: React.FC<TabOverviewProps> = ({ analyticsData, callStatus, transcripts, entities, setActiveTab }) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: 'CALLS TODAY', value: '1,248', change: '↑ 12.5%', trend: 'up', sub: 'vs yesterday' },
    { label: 'ACTIVE CALLS', value: '42', change: 'Live right now', trend: 'sparkline', sub: '' },
    { label: 'MEETINGS BOOKED', value: '38', change: '↑ 18.3%', trend: 'up', sub: 'vs yesterday' },
    { label: 'AI SUCCESS RATE', value: '84.2%', change: '↑ 6.8%', trend: 'up', sub: 'vs yesterday' },
    { label: 'REVENUE INFLUENCED', value: '₹12.4M', change: '↑ 22.1%', trend: 'up', sub: 'vs yesterday' },
    { label: 'ESCALATIONS', value: '7', change: '↓ 3.2%', trend: 'down', sub: 'vs yesterday' },
  ];

  // Performance Overview (Line chart)
  const lineChartData = [
    { name: 'Mon', calls: 500, connected: 400, meetings: 120 },
    { name: 'Tue', calls: 800, connected: 620, meetings: 210 },
    { name: 'Wed', calls: 1000, connected: 780, meetings: 250 },
    { name: 'Thu', calls: 950, connected: 720, meetings: 190 },
    { name: 'Fri', calls: 1248, connected: 980, meetings: 320 },
    { name: 'Sat', calls: 400, connected: 310, meetings: 90 },
    { name: 'Sun', calls: 550, connected: 420, meetings: 110 },
  ];

  const topAgents = [
    { name: 'Sales Closer', role: 'Sales', calls: '532', success: '88.1%', trendPath: 'M0,10 Q12,2 25,8 T50,2' },
    { name: 'Lead Qualifier', role: 'Sales', calls: '412', success: '82.3%', trendPath: 'M0,12 Q12,6 25,10 T50,4' },
    { name: 'Recruiter Pro', role: 'Recruiting', calls: '298', success: '85.6%', trendPath: 'M0,8 Q12,12 25,4 T50,6' },
    { name: 'Support Ace', role: 'Support', calls: '264', success: '80.2%', trendPath: 'M0,10 Q12,4 25,12 T50,8' },
  ];

  const aiInsights = [
    { text: 'High conversion on pricing page leads', sub: '↑ 24% more meetings this week', icon: Target },
    { text: 'Objection rate increased for Product X', sub: 'Price objections up by 18%', icon: TrendingUp },
    { text: 'Best performing agent: Sales Closer', sub: '88.1% success rate this week', icon: Award },
    { text: 'Most active time: 10AM - 1PM', sub: '↑ 32% higher connect rate', icon: Clock }
  ];

  const liveSystemFeed = [
    { time: '10:32 AM', event: 'Demo booked with Acme Corp', agent: 'Sales Agent' },
    { time: '10:35 AM', event: 'Candidate screening completed', agent: 'Recruiter Agent' },
    { time: '10:37 AM', event: 'Payment issue resolved', agent: 'Support Agent' },
    { time: '10:42 AM', event: 'Lead escalated to human', agent: 'Sales Agent' },
    { time: '10:45 AM', event: 'Follow-up scheduled', agent: 'Success Agent' }
  ];

  const attentionRequired = [
    { title: '3 Escalated Calls', desc: 'Requires human intervention', icon: AlertTriangle, color: 'text-rose-500 bg-rose-500/5 border-rose-500/10' },
    { title: '5 Hot Leads', desc: 'High intent, awaiting response', icon: Flame, color: 'text-amber-500 bg-amber-500/5 border-amber-500/10' },
    { title: '2 Unhappy Customers', desc: 'Negative sentiment detected', icon: AlertCircle, color: 'text-orange-500 bg-orange-500/5 border-orange-500/10' },
    { title: '1 Follow-up Overdue', desc: 'Immediate action needed', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' }
  ];

  // Revenue graph data matching the reference image's visual trend
  const revenueChartData = [
    { day: 1, amount: 600000 }, { day: 2, amount: 750000 }, { day: 3, amount: 700000 }, { day: 4, amount: 900000 },
    { day: 5, amount: 800000 }, { day: 6, amount: 950000 }, { day: 7, amount: 1100000 }, { day: 8, amount: 1050000 },
    { day: 9, amount: 1200000 }, { day: 10, amount: 1300000 }, { day: 11, amount: 1250000 }, { day: 12, amount: 1400000 },
    { day: 13, amount: 1500000 }, { day: 14, amount: 1350000 }, { day: 15, amount: 1600000 }, { day: 16, amount: 1550000 },
    { day: 17, amount: 1700000 }, { day: 18, amount: 1800000 }, { day: 19, amount: 1650000 }, { day: 20, amount: 1750000 },
    { day: 21, amount: 1900000 }, { day: 22, amount: 1850000 }, { day: 23, amount: 1700000 }, { day: 24, amount: 1800000 },
    { day: 25, amount: 1950000 }, { day: 26, amount: 2000000 }, { day: 27, amount: 1850000 }, { day: 28, amount: 1900000 },
    { day: 29, amount: 2100000 }
  ];

  return (
    <div className="min-w-0 bg-[#070708] p-8 font-sans text-white relative overflow-y-auto h-full scrollbar-hide">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-60" />

      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        
        {/* Title and stats area */}
        <div className="pb-1">
          <h1 className="text-2xl font-black tracking-tight uppercase text-white font-display">Overview</h1>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Real-time performance and insights</p>
        </div>

        {/* Layout: Main contents left, feed panel right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
          
          {/* CENTER AREA: KPIs, charts, and metrics tables (Col 1-9) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 6 KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="p-4 border border-white/5 rounded-2xl bg-[#0c0c0e] flex flex-col justify-between hover:border-white/10 transition-all shadow-sm"
                >
                  <div className="space-y-1.5">
                    <p className="text-[8px] font-black uppercase tracking-wider text-neutral-500">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold tracking-tight text-white leading-none">{stat.value}</h3>
                      {stat.trend === 'sparkline' && (
                        <div className="h-3.5 w-10 flex items-center">
                          <svg viewBox="0 0 50 15" className="w-full h-full text-emerald-400 overflow-visible">
                            <path d="M0,8 Q8,1 16,8 T32,2 T48,6" fill="none" stroke="#10b981" strokeWidth="1.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Delta / trend indicator */}
                  <div className="flex items-center gap-1.5 mt-3">
                    {stat.trend === 'sparkline' ? (
                      <span className="text-[9px] font-bold text-neutral-500">Live right now</span>
                    ) : (
                      <>
                        <span className={`text-[9px] font-black tracking-tight ${
                          stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-500'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-[9px] font-bold text-neutral-500 leading-none">{stat.sub}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Overview (Line chart) & Funnel block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Performance LineChart Card */}
              <div className="border border-white/5 rounded-3xl p-5 bg-[#0c0c0e] flex flex-col justify-between h-[280px]">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-display">Performance Overview</h3>
                    <p className="text-[8.5px] text-neutral-500 font-bold uppercase mt-0.5">This week vs last week</p>
                  </div>
                  <div className="flex gap-3 text-[9px] font-semibold text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span>Calls</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                      <span>Connected</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                      <span>Meetings</span>
                    </div>
                  </div>
                </div>

                <div className="h-44 w-full">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid stroke="#1c1c1f" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#737373', fontWeight: 'bold' }} stroke="#262626" />
                        <YAxis 
                          ticks={[0, 500, 1000, 1500, 2000]} 
                          domain={[0, 2000]} 
                          tick={{ fontSize: 9, fill: '#737373', fontWeight: 'bold' }} 
                          stroke="#262626" 
                          tickFormatter={(val) => val === 0 ? '0' : val >= 1000 ? `${val/1000}K` : val}
                        />
                        <Tooltip contentStyle={{ fontSize: 9, borderRadius: 10, backgroundColor: '#0d0d0f', borderColor: 'rgba(255, 255, 255, 0.05)', color: '#ffffff' }} />
                        <Line type="monotone" dataKey="calls" stroke="#10b981" strokeWidth={1.8} dot={{ r: 3.5, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="connected" stroke="#3b82f6" strokeWidth={1.8} dot={{ r: 3.5, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="meetings" stroke="#8b5cf6" strokeWidth={1.8} dot={{ r: 3.5, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-black/50 animate-pulse rounded-2xl" />
                  )}
                </div>
              </div>

              {/* Conversion Funnel Card */}
              <div className="border border-white/5 rounded-3xl p-5 bg-[#0c0c0e] flex flex-col justify-between h-[280px]">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-display">Conversion Funnel</h3>
                  <p className="text-[8.5px] text-neutral-500 font-bold uppercase mt-0.5">This week</p>
                </div>

                {/* Symmetrical funnel layout matching reference exactly */}
                <div className="space-y-2 py-2 flex flex-col justify-center">
                  {/* Row 1: Calls Started */}
                  <div className="flex justify-between items-center h-[20px]">
                    <span className="w-24 text-[10px] font-bold text-neutral-400 text-left leading-none">Calls Started</span>
                    <div className="flex-1 flex justify-center px-4">
                      <svg width="180" height="18" className="overflow-visible">
                        <polygon points="0,0 180,0 160,18 20,18" fill="#43D094" />
                      </svg>
                    </div>
                    <span className="w-24 text-[10px] font-bold text-neutral-300 text-right leading-none">2,480</span>
                  </div>

                  {/* Row 2: Connected */}
                  <div className="flex justify-between items-center h-[20px]">
                    <span className="w-24 text-[10px] font-bold text-neutral-400 text-left leading-none">Connected</span>
                    <div className="flex-1 flex justify-center px-4">
                      <svg width="180" height="18" className="overflow-visible">
                        <polygon points="20,0 160,0 140,18 40,18" fill="#38A783" />
                      </svg>
                    </div>
                    <span className="w-24 text-[10px] font-bold text-neutral-300 text-right leading-none">1,826 (73.6%)</span>
                  </div>

                  {/* Row 3: Interested */}
                  <div className="flex justify-between items-center h-[20px]">
                    <span className="w-24 text-[10px] font-bold text-neutral-400 text-left leading-none">Interested</span>
                    <div className="flex-1 flex justify-center px-4">
                      <svg width="180" height="18" className="overflow-visible">
                        <polygon points="40,0 140,0 120,18 60,18" fill="#2B768D" />
                      </svg>
                    </div>
                    <span className="w-24 text-[10px] font-bold text-neutral-300 text-right leading-none">752 (40.1%)</span>
                  </div>

                  {/* Row 4: Meetings Booked */}
                  <div className="flex justify-between items-center h-[20px]">
                    <span className="w-24 text-[10px] font-bold text-neutral-400 text-left leading-none">Meetings Booked</span>
                    <div className="flex-1 flex justify-center px-4">
                      <svg width="180" height="18" className="overflow-visible">
                        <polygon points="60,0 120,0 100,18 80,18" fill="#284E8B" />
                      </svg>
                    </div>
                    <span className="w-24 text-[10px] font-bold text-neutral-300 text-right leading-none">142 (18.9%)</span>
                  </div>

                  {/* Row 5: Deals Closed */}
                  <div className="flex justify-between items-center h-[20px]">
                    <span className="w-24 text-[10px] font-bold text-neutral-400 text-left leading-none">Deals Closed</span>
                    <div className="flex-1 flex justify-center px-4">
                      <svg width="180" height="18" className="overflow-visible">
                        <polygon points="80,0 100,0 95,18 85,18" fill="#373C84" />
                      </svg>
                    </div>
                    <span className="w-24 text-[10px] font-bold text-neutral-300 text-right leading-none">48 (33.8%)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Top AI Agents + AI Insights + Revenue Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Top AI Agents Table Card */}
              <div className="border border-white/5 rounded-3xl p-5 bg-[#0c0c0e] flex flex-col justify-between min-h-[290px]">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-display mb-1">Top AI Agents</h3>
                  <p className="text-[8px] text-neutral-500 font-bold uppercase mb-3.5">By performance</p>
                  
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-[10.5px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[8.5px] font-bold text-neutral-500 uppercase tracking-wider">
                          <th className="pb-2">Agent</th>
                          <th className="pb-2">Role</th>
                          <th className="pb-2">Calls</th>
                          <th className="pb-2">Success Rate</th>
                          <th className="pb-2">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {topAgents.map((agent, i) => (
                          <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-2.5 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-neutral-300">
                                {agent.name.substring(0,2).toUpperCase()}
                              </div>
                              <span className="font-semibold text-white leading-none">{agent.name}</span>
                            </td>
                            <td className="py-2.5 text-neutral-400 font-medium">{agent.role}</td>
                            <td className="py-2.5 font-mono font-semibold text-white">{agent.calls}</td>
                            <td className="py-2.5 font-mono font-semibold text-emerald-400">{agent.success}</td>
                            <td className="py-2.5">
                              <div className="h-3 w-10">
                                <svg viewBox="0 0 50 15" className="w-full h-full text-emerald-400 overflow-visible">
                                  <path d={agent.trendPath} fill="none" stroke="#10b981" strokeWidth="1.2" />
                                </svg>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* AI Insights Card */}
              <div className="border border-white/5 rounded-3xl p-5 bg-[#0c0c0e] flex flex-col justify-between min-h-[290px]">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-display mb-1">AI Insights</h3>
                  <p className="text-[8px] text-neutral-500 font-bold uppercase mb-4">What's happening with your conversations</p>
                  
                  <div className="space-y-3">
                    {aiInsights.map((insight, i) => {
                      const IconComp = insight.icon;
                      return (
                        <div key={i} className="flex items-center justify-between hover:bg-white/[0.01] p-1.5 rounded-xl transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                              <IconComp className="w-4.5 h-4.5" />
                            </div>
                            <div className="leading-tight">
                              <p className="text-[10.5px] font-semibold text-white">{insight.text}</p>
                              <p className="text-[8.5px] text-neutral-500 font-medium mt-0.5">{insight.sub}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Revenue Impact (Bar Chart) */}
              <div className="border border-white/5 rounded-3xl p-5 bg-[#0c0c0e] flex flex-col justify-between min-h-[290px]">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-display">Revenue Impact</h3>
                  <p className="text-[8.5px] text-neutral-500 font-bold uppercase mt-0.5">This month</p>
                </div>

                <div className="my-2.5">
                  <h2 className="text-2xl font-black text-white leading-none tracking-tight">₹12,40,000</h2>
                  <p className="text-[8px] text-neutral-500 font-bold uppercase mt-1">Total revenue influenced</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/5 text-[9.5px]">
                  <div>
                    <span className="text-[7.5px] text-neutral-500 font-bold uppercase block">Deals Influenced</span>
                    <span className="font-extrabold text-white font-mono">18</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] text-neutral-500 font-bold uppercase block">Pipeline Generated</span>
                    <span className="font-extrabold text-white font-mono">₹32.5M</span>
                  </div>
                </div>

                <div className="h-16 w-full pt-2">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueChartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                        <XAxis dataKey="day" ticks={[1, 8, 15, 22, 29]} tick={{ fontSize: 7, fill: '#737373', fontWeight: 'bold' }} stroke="#262626" />
                        <YAxis 
                          ticks={[0, 500000, 1000000, 1500000, 2000000]} 
                          domain={[0, 2000000]} 
                          tick={{ fontSize: 7, fill: '#737373', fontWeight: 'bold' }} 
                          stroke="#262626"
                          tickFormatter={(val) => val === 0 ? '0' : val >= 1000000 ? `${val/1000000}M` : `${val/1000}K`}
                        />
                        <Bar dataKey="amount" fill="#10b981" radius={[1, 1, 0, 0]} maxBarSize={3} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-black/50 animate-pulse rounded-xl" />
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR PANEL: System Feed & Attention Center (Col 10-12) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Live System Feed */}
            <div className="border border-white/5 rounded-3xl p-5 bg-[#0c0c0e] shadow-lg flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-display">Live System Feed</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[8px] text-neutral-500 font-bold uppercase mb-4">Everything happening in real-time</p>
                
                <div className="space-y-4 max-h-[220px] overflow-y-auto scrollbar-hide pr-1">
                  {liveSystemFeed.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="w-16 text-[9.5px] font-bold text-neutral-500 shrink-0">{item.time}</span>
                      <div className="flex-1 leading-tight">
                        <p className="text-[10px] font-bold text-white">{item.event}</p>
                        <p className="text-[8.5px] text-neutral-500 font-medium mt-0.5">{item.agent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setActiveTab && setActiveTab('Calls - Live Calls')}
                className="w-full py-2 bg-[#070708] border border-white/5 hover:border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all mt-4 cursor-pointer flex items-center justify-between px-3"
              >
                <span>View all activity</span>
                <span>→</span>
              </button>
            </div>

            {/* Attention Required Action Center */}
            <div className="border border-white/5 rounded-3xl p-5 bg-[#0c0c0e] shadow-lg flex flex-col justify-between min-h-[320px]">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-display mb-1">Attention Required</h3>
                <p className="text-[8px] text-neutral-500 font-bold uppercase mb-4">Critical actions</p>
                
                <div className="space-y-2.5">
                  {attentionRequired.map((item, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-3 p-3 rounded-2xl border ${item.color} cursor-pointer hover:scale-[1.01] transition-all`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <div>
                        <h4 className="text-[10px] font-bold leading-none text-white">{item.title}</h4>
                        <p className="text-[8px] opacity-75 font-semibold mt-1 leading-none text-neutral-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setActiveTab && setActiveTab('Contacts')}
                className="w-full py-2 bg-[#070708] border border-white/5 hover:border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all mt-4 cursor-pointer flex items-center justify-between px-3"
              >
                <span>View all</span>
                <span>→</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TabOverview;
