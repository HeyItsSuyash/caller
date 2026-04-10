import React from 'react';
import { Search, Filter, ArrowUpRight, CheckCircle2, Clock, Flame } from 'lucide-react';

const TabLeads = () => {
  const leads = [
    { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', interest: 'B.Tech CS', status: 'Hot', priority: 'high', time: '12m ago' },
    { id: 2, name: 'Aman Verma', phone: '+91 87654 32109', interest: 'MBA Finance', status: 'Warm', priority: 'medium', time: '2h ago' },
    { id: 3, name: 'Priya Das', phone: '+91 76543 21098', interest: 'M.Tech AI', status: 'Cold', priority: 'low', time: '5h ago' },
    { id: 4, name: 'Siddharth Singh', phone: '+91 65432 10987', interest: 'Ph.D Physics', status: 'Hot', priority: 'high', time: 'Yesterday' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white p-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Leads Explorer</h1>
            <p className="text-sm text-secondary">Track and manage potential candidates from voice interactions.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="pl-10 pr-4 py-2 bg-accent/50 border-none rounded-xl text-xs focus:ring-1 focus:ring-black w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-xs font-semibold hover:bg-accent transition-all">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-accent/30 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Interest Area</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Last Active</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-accent/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold border border-border group-hover:bg-white transition-colors">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-semibold">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-medium text-secondary">{lead.phone}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-accent border border-border rounded-md text-[10px] font-bold text-secondary uppercase tracking-tight">
                      {lead.interest}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {lead.status === 'Hot' ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-100 rounded-full w-fit">
                        <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                        <span className="text-[10px] font-bold text-rose-700 uppercase tracking-tight">Hot 🔥</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit border ${
                        lead.status === 'Warm' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'Warm' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{lead.status}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-secondary">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium">{lead.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-accent rounded-lg text-secondary hover:text-primary transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sales Stats for verification */}
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 border border-border rounded-2xl bg-white shadow-sm space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Total Leads</p>
            <p className="text-3xl font-bold tracking-tight">1,284</p>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
              <ArrowUpRight className="w-3 h-3" />
              <span>12% from last week</span>
            </div>
          </div>
          <div className="p-6 border border-border rounded-2xl bg-white shadow-sm space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Hot Conversions</p>
            <p className="text-3xl font-bold tracking-tight">84%</p>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Target Achieved</span>
            </div>
          </div>
          <div className="p-6 bg-black rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-start text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Revenue Impact</p>
              <div className="px-2 py-0.5 bg-white/20 rounded-md text-[8px] font-bold uppercase tracking-widest border border-white/10">Estimated</div>
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">₹12.4L</p>
            <button className="w-full py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/90 transition-all">
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabLeads;
