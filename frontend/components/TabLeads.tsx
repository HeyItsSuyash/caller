import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  KanbanSquare, 
  ListFilter,
  UserCheck,
  BookOpen,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const TabLeads = () => {
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('pipeline');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const leads = [
    { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', interest: 'B.Tech CS', status: 'Hot', priority: 'high', time: '12m ago', stage: 'New' },
    { id: 2, name: 'Aman Verma', phone: '+91 87654 32109', interest: 'MBA Finance', status: 'Warm', priority: 'medium', time: '2h ago', stage: 'Qualified' },
    { id: 3, name: 'Priya Das', phone: '+91 76543 21098', interest: 'M.Tech AI', status: 'Cold', priority: 'low', time: '5h ago', stage: 'Interested' },
    { id: 4, name: 'Siddharth Singh', phone: '+91 65432 10987', interest: 'Ph.D Physics', status: 'Hot', priority: 'high', time: 'Yesterday', stage: 'Meeting Scheduled' },
    { id: 5, name: 'Karan Malhotra', phone: '+91 90123 45678', interest: 'B.Tech IT', status: 'Hot', priority: 'high', time: '3 days ago', stage: 'Converted' },
    { id: 6, name: 'Ananya Roy', phone: '+91 89012 34567', interest: 'MBA Marketing', status: 'Warm', priority: 'medium', time: '4 days ago', stage: 'Qualified' }
  ];

  const stages = ['New', 'Qualified', 'Interested', 'Meeting Scheduled', 'Converted'];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white p-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl mx-auto w-full space-y-8 pb-16">
        
        {/* Title & View Switchers */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">CRM Lead Center</h1>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-1">Evolved CRM telemetry and automated lead ingestion pipelines</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* View Mode Selectors */}
            <div className="flex bg-neutral-100 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === 'list' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button 
                onClick={() => setViewMode('pipeline')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === 'pipeline' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
                }`}
              >
                <KanbanSquare className="w-3.5 h-3.5" />
                <span>Pipeline</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200/50 rounded-xl text-[10px] focus:ring-1 focus:ring-black w-48 transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Workspace Rendering */}
        {viewMode === 'list' ? (
          /* LIST VIEW */
          <div className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Prospect Name</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Phone Contact</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Intent Domain</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Lead Stage</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Conversion Quality</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Call Date</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400 text-right">Explore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50/30 transition-colors group">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[9px] font-black border border-neutral-200/50">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-neutral-900">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-xs text-neutral-400 font-semibold">{lead.phone}</td>
                    <td className="px-6 py-4.5">
                      <span className="px-2 py-0.5 bg-neutral-50 border border-neutral-200/50 rounded-md text-[9px] font-black text-neutral-500 uppercase tracking-tight">
                        {lead.interest}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded">
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      {lead.status === 'Hot' ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-full w-fit">
                          <Flame className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                          <span className="text-[9px] font-black text-rose-700 uppercase tracking-tight">High Hot 🔥</span>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit border ${
                          lead.status === 'Warm' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${lead.status === 'Warm' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                          <span className="text-[9px] font-black uppercase tracking-tight">{lead.status}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{lead.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 hover:bg-neutral-50 border border-transparent hover:border-neutral-200/50 rounded-lg text-neutral-400 hover:text-black transition-all bg-transparent shadow-none"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* PIPELINE KANBAN VIEW */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
            {stages.map((stage) => {
              const stageLeads = leads.filter(l => l.stage === stage);
              return (
                <div key={stage} className="bg-neutral-50/50 border border-neutral-100 rounded-3xl p-4 flex flex-col h-fit">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-neutral-400">{stage}</span>
                    <span className="text-[9px] font-black uppercase bg-neutral-200/50 text-neutral-600 px-2 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stageLeads.map(lead => (
                      <div 
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="p-4 bg-white border border-neutral-200/40 hover:border-black rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-black text-neutral-900 group-hover:underline leading-none">{lead.name}</span>
                          {lead.status === 'Hot' && <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />}
                        </div>
                        
                        <p className="text-[9px] font-bold text-neutral-400">{lead.phone}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="px-1.5 py-0.5 bg-neutral-50 border border-neutral-100 rounded text-[8px] font-bold text-neutral-500 uppercase">
                            {lead.interest}
                          </span>
                          <span className="text-[8px] font-bold text-neutral-400">{lead.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lead CRM Metrics Verification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-neutral-100 rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">CRM Total Leads</p>
            <p className="text-3xl font-black tracking-tight leading-none text-neutral-950">1,284</p>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold pt-1">
              <TrendingUp className="w-3 h-3" />
              <span>12.5% increase this month</span>
            </div>
          </div>

          <div className="p-6 border border-neutral-100 rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1">Hot Intent Conversions</p>
            <p className="text-3xl font-black tracking-tight leading-none text-neutral-950">84.2%</p>
            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold pt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Target conversion reached</span>
            </div>
          </div>

          <div className="p-6 bg-neutral-900 rounded-3xl shadow-lg shadow-neutral-900/10 space-y-4 text-white">
            <div className="flex justify-between items-start">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Revenue Impact</p>
              <div className="px-2 py-0.5 bg-white/10 rounded-md text-[8px] font-black uppercase tracking-widest border border-white/5">Estimated</div>
            </div>
            <p className="text-3xl font-black tracking-tight text-white leading-none">₹12.4L</p>
            <button className="w-full py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/95 transition-all">
              Export Segment CSV
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Detail Modal Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end p-0">
          <div className="bg-white h-screen w-full max-w-md shadow-2xl p-8 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black">
                    {selectedLead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-md font-black text-neutral-900">{selectedLead.name}</h3>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{selectedLead.phone}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-1 hover:bg-neutral-50 rounded-full border border-neutral-100"
                >
                  ✕
                </button>
              </div>

              <div className="h-[1px] w-full bg-neutral-100" />

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Interaction History</h4>
                
                <div className="space-y-3">
                  <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl">
                    <p className="text-[10px] font-black text-neutral-950 flex items-center gap-2 mb-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Initial Inbound Query</span>
                    </p>
                    <p className="text-xs text-neutral-500 font-medium">
                      AI identified strong interest in {selectedLead.interest}. Conversation duration was 3 minutes 12 seconds with positive sentiment.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl">
                    <p className="text-[10px] font-black text-neutral-950 flex items-center gap-2 mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Context Grounded (Data Room)</span>
                    </p>
                    <p className="text-xs text-neutral-500 font-medium">
                      Student queried hostel facilities. AI responded strictly using current Data Room guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-neutral-50 border border-neutral-200 hover:border-black text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                  Schedule Call
                </button>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-900 transition-all"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TabLeads;
