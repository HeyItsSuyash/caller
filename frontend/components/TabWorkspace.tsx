import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  CreditCard, 
  Plus, 
  UserPlus, 
  TrendingUp, 
  ChevronRight, 
  Settings2,
  FileText,
  Activity
} from 'lucide-react';

const TabWorkspace: React.FC = () => {
  const [team, setTeam] = useState([
    { name: 'Suyash', email: 'suyash@caller.os', role: 'Owner', status: 'Active' },
    { name: 'Vanshika', email: 'vanshika@caller.os', role: 'Developer', status: 'Active' },
    { name: 'Ayush', email: 'ayush@caller.os', role: 'Admin', status: 'Active' },
    { name: 'Praveen', email: 'praveen@caller.os', role: 'Agent', status: 'Pending' }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setTeam(prev => [
      ...prev,
      { name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, status: 'Pending' }
    ]);
    setInviteEmail('');
  };

  const usageStats = [
    { label: 'Voice Minutes Deployed', value: '4,850 mins', limit: '10,000 mins', percent: 48.5 },
    { label: 'API Call Volumes', value: '82,410', limit: '200,000', percent: 41.2 },
    { label: 'Agent Seats provisioned', value: '4 agents', limit: '10 agents', percent: 40.0 }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent p-8 overflow-y-auto scrollbar-hide text-white">
      <div className="max-w-6xl mx-auto w-full space-y-8 pb-16 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-30" />

        {/* Title */}
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-white font-display">Workspace Hub</h1>
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mt-1">Manage team directories, review telephony usages, and configure subscription billing</p>
          </div>
        </div>

        {/* Subscription / Plan overview card */}
        <div className="p-8 border border-white/[0.05] rounded-lg bg-white/[0.015] backdrop-blur-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">Pro Tier Active</span>
            </div>
            <h2 className="text-lg font-black text-white font-display">CALLER OS Enterprise Subscription</h2>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-xl">
              Equipped with ElevenLabs advanced dialects, custom Twilio webhooks, Sarvam AI synthesis, and direct CRM integrations.
            </p>
          </div>

          <div className="p-6 bg-black/40 border border-white/[0.05] rounded-lg flex flex-col justify-between w-full md:w-64 shrink-0">
            <span className="text-[8px] text-neutral-500 uppercase font-bold">Next Renewal Date</span>
            <span className="text-sm font-black text-white mt-1 font-mono">July 1, 2026</span>
            <button className="w-full mt-4 py-2.5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-all cursor-pointer">
              Manage Billing
            </button>
          </div>
        </div>

        {/* Split screen: Team management + Usage quotas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left/Col 1-2: Team List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 font-display">Workspace Directory</h3>
              <span className="text-[9px] font-black uppercase text-neutral-400 bg-white/10 px-2 py-0.5 rounded-full">{team.length} Users</span>
            </div>

            <div className="bg-white/[0.015] border border-white/[0.05] backdrop-blur-2xl rounded-lg overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/50 border-b border-white/5 text-[8.5px] font-black uppercase tracking-widest text-neutral-500">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">System Role</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-semibold">
                  {team.map((member, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-neutral-300 text-[9px] font-display">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-white font-display">{member.name}</span>
                      </td>
                      <td className="px-6 py-4 text-neutral-400 font-mono">{member.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-black/40 border border-white/[0.05] rounded-md text-[8.5px] font-black text-neutral-400 uppercase tracking-tight">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          member.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-500 bg-white/5'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Invite Form */}
            <form onSubmit={handleInvite} className="p-6 bg-white/[0.015] border border-white/[0.05] backdrop-blur-2xl rounded-lg flex flex-col md:flex-row gap-4 items-end shadow-md">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Invite new team member</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] text-white rounded-lg text-xs font-semibold focus:border-white/20 focus:ring-0"
                />
              </div>

              <div className="w-full md:w-40 space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Role</label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-3 bg-[#0a0a0a] border border-white/[0.05] text-xs font-semibold rounded-lg text-white focus:border-white/20"
                >
                  <option>Agent</option>
                  <option>Developer</option>
                  <option>Admin</option>
                </select>
              </div>

              <button 
                type="submit"
                className="py-3 px-6 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 font-display shrink-0 w-full md:w-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            </form>
          </div>

          {/* Right/Col 3: Usage Quotas & Metrics */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-2 font-display">Quota Allocations</h3>
            
            <div className="p-6 bg-white/[0.015] border border-white/[0.05] backdrop-blur-2xl rounded-lg shadow-xl space-y-6">
              {usageStats.map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-400">
                    <span>{stat.label}</span>
                    <span className="text-white font-mono">{stat.value} / {stat.limit}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 border border-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Billing history invoice block */}
            <div className="p-6 border border-white/[0.05] rounded-lg bg-white/[0.015] backdrop-blur-2xl space-y-4 shadow-lg">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 font-display">Invoice History</h4>
              <div className="space-y-3.5 text-[10px] font-bold text-neutral-400 font-mono">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <span className="text-white block font-display">June 1, 2026</span>
                    <span className="text-neutral-500 text-[8.5px]">Pro Tier Subscription</span>
                  </div>
                  <span>$299.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-white block font-display">May 1, 2026</span>
                    <span className="text-neutral-500 text-[8.5px]">Pro Tier Subscription</span>
                  </div>
                  <span>$299.00</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TabWorkspace;
