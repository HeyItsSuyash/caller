import React from 'react';
import { 
  BarChart3, 
  Settings2, 
  LayoutDashboard, 
  PhoneCall, 
  Users2, 
  Plus,
  Binary,
  MessageSquareCode,
  Activity,
  LogOut,
  ShieldAlert,
  Database,
  PhoneForwarded,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  entities: any[];
  activeEntity: string;
  setActiveEntity: (entity: string) => void;
  onNewEntity: () => void;
  user?: {
    name: string;
    email: string;
    accountType: string;
    role: string;
  } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  entities, 
  activeEntity, 
  setActiveEntity,
  onNewEntity,
  user
}) => {
  
  const mainWorkspaceItems = [
    { name: 'Dashboard', icon: LayoutDashboard, desc: 'Executive Center' },
    { name: 'Agents', icon: Sparkles, desc: 'Voice AI Agents' },
    { name: 'Knowledge', icon: Database, desc: 'Context Data Room' },
    { name: 'Calls', icon: MessageSquareCode, desc: 'Live Stream & Logs' },
    { name: 'Leads', icon: Users2, desc: 'CRM & Pipelines' },
    { name: 'Analytics', icon: BarChart3, desc: 'System Quality' },
    { name: 'Telephony', icon: PhoneForwarded, desc: 'Carrier Integration' },
  ];

  return (
    <aside className="w-64 border-r border-neutral-100 h-screen flex flex-col bg-white shrink-0 shadow-[1px_0_10px_rgba(0,0,0,0.01)]">
      <div className="p-6 flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/10">
            <Activity className="text-white w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tight text-[15px] uppercase italic leading-none">CALLER OS</span>
            <span className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase mt-0.5">Enterprise Portal</span>
          </div>
        </div>

        {/* Action Button: Quick Agent Creation */}
        <button 
          onClick={onNewEntity}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-neutral-200 rounded-xl hover:border-black hover:bg-neutral-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] text-[11px] font-bold uppercase tracking-widest transition-all mb-6 bg-transparent"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy Agent</span>
        </button>

        {/* Evolved Modules Section */}
        <div className="mb-6">
          <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-3 px-2">Workspace Modules</h3>
          <nav className="space-y-1">
            {mainWorkspaceItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    // Automatically fallback entity context if none is loaded
                    if (item.name === 'Agents' && entities.length > 0 && !activeEntity) {
                      setActiveEntity(entities[0].name);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-neutral-900 text-white shadow-md shadow-neutral-900/10' 
                      : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[11px] font-bold tracking-tight">{item.name}</span>
                      <span className={`text-[8px] mt-0.5 ${isActive ? 'text-neutral-400' : 'text-neutral-400/70'}`}>{item.desc}</span>
                    </div>
                  </div>
                  {isActive && <ArrowUpRight className="w-3 h-3 text-neutral-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Agents / Entities Selector */}
        {entities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-3 px-2">Active Targets</h3>
            <div className="space-y-1 border-l border-neutral-100 pl-2 ml-2">
              {entities.map((entity) => {
                const isActive = activeEntity === entity.name;
                return (
                  <button
                    key={entity._id || entity.name}
                    onClick={() => {
                      setActiveEntity(entity.name);
                      // Jump to Agents view if in settings/dashboard to inspect it
                      if (activeTab !== 'Agents' && activeTab !== 'Knowledge') {
                        setActiveTab('Agents');
                      }
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                      isActive 
                        ? 'bg-neutral-50 text-black border border-neutral-200/50 shadow-sm' 
                        : 'text-neutral-400 hover:text-black hover:bg-neutral-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{entity.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Enterprise System Admin Controls */}
        {user?.role === 'admin' && (
          <div className="mt-2 mb-6">
            <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-3 px-2 flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-emerald-500" />
              <span>SaaS Controller</span>
            </h3>
            <nav className="space-y-1">
              {[
                { name: 'System Users', icon: Users2, label: 'Organization users' },
                { name: 'Global Entities', icon: Sparkles, label: 'Platform bots' },
                { name: 'Global Calls', icon: PhoneCall, label: 'Voice statistics' },
                { name: 'Global Analytics', icon: BarChart3, label: 'Aggregate metrics' },
                { name: 'Global Leads', icon: Users2, label: 'Aggregate conversions' },
              ].map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm' 
                        : 'text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-neutral-400'}`} />
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-[11px] font-bold tracking-tight">{item.name}</span>
                        <span className="text-[7.5px] text-neutral-400 mt-0.5">{item.label}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
      
      {/* Account Settings & User Footnotes */}
      <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 space-y-3 shrink-0">
        <button 
          onClick={() => setActiveTab('Settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
            activeTab === 'Settings' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-black hover:bg-neutral-100/50'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Preferences</span>
        </button>

        <button 
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-rose-600 hover:bg-rose-50/50 transition-colors"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Workspace</span>
        </button>

        <div className="flex items-center gap-3 pt-3 border-t border-neutral-200/50">
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center text-[10px] font-black border border-neutral-800 shadow-md">
            {user?.name?.substring(0, 2).toUpperCase() || 'OS'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold truncate leading-none text-black">{user?.name || 'Dev Operator'}</p>
            <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest mt-1">{user?.accountType || 'Pro Tier'} Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
