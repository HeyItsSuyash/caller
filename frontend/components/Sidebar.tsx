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
  ArrowUpRight,
  Settings
} from 'lucide-react';

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
    { name: 'Dashboard', icon: LayoutDashboard, desc: 'Command center' },
    { name: 'Agents', icon: Sparkles, desc: 'Voice AI configuration' },
    { name: 'Knowledge', icon: Database, desc: 'Context vectors' },
    { name: 'Calls', icon: MessageSquareCode, desc: 'Logs and streams' },
    { name: 'Leads', icon: Users2, desc: 'Conversions and CRM' },
    { name: 'Analytics', icon: BarChart3, desc: 'Pipeline performance' },
    { name: 'Telephony', icon: PhoneForwarded, desc: 'SIP trunk gateways' },
    { name: 'Integrations', icon: Binary, desc: 'API webhook setups' },
    { name: 'Settings', icon: Settings, desc: 'Workspace details' }
  ];

  return (
    <aside className="w-64 border-r border-white/10 h-screen flex flex-col bg-black shrink-0 shadow-sm font-sans text-white">
      
      {/* Brand Header */}
      <div className="p-6 pb-2 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md shadow-white/10">
          <Activity className="text-black w-4.5 h-4.5 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="font-black tracking-tight text-[14px] uppercase leading-none font-display text-white">CALLER OS</span>
          <span className="text-[8px] font-black text-neutral-500 tracking-[0.2em] uppercase mt-0.5">Voice Operations</span>
        </div>
      </div>

      {/* Deploy Agent quick action */}
      <div className="px-6 py-4 shrink-0">
        <button 
          onClick={onNewEntity}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-white/10 rounded-xl hover:border-white hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-wider transition-all bg-transparent cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Deploy Agent</span>
        </button>
      </div>

      {/* Main Nav Items (Scrollable when overflow) */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 scrollbar-hide">
        
        <div>
          <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2.5 px-2">Voice Workspace</h3>
          <nav className="space-y-1">
            {mainWorkspaceItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (item.name === 'Agents' && entities.length > 0 && !activeEntity) {
                      setActiveEntity(entities[0].name);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white/10 text-white font-extrabold' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[11px] font-bold tracking-tight">{item.name}</span>
                      <span className="text-[7.5px] text-neutral-500 mt-0.5">{item.desc}</span>
                    </div>
                  </div>
                  {isActive && <ArrowUpRight className="w-3 h-3 text-neutral-500" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Impersonation controller (SaaS only) */}
        {user?.role === 'admin' && (
          <div>
            <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2.5 px-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-emerald-500" />
              <span>SaaS Controller</span>
            </h3>
            <nav className="space-y-1">
              {[
                { name: 'System Users', icon: Users2, label: 'Manage platform users' },
                { name: 'Global Entities', icon: Sparkles, label: 'Virtual voice agents' },
                { name: 'Global Calls', icon: PhoneCall, label: 'Telephony sessions' },
                { name: 'Global Analytics', icon: BarChart3, label: 'System status charts' },
                { name: 'Global Leads', icon: Users2, label: 'Platform CRM leads' },
              ].map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-900/50' 
                        : 'text-neutral-500 hover:text-emerald-400 hover:bg-emerald-900/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-600'}`} />
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
                        <span className="text-[7px] text-neutral-500 mt-0.5">{item.label}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

      </div>

      {/* Footer Area (Preferences, Logout, Current User) */}
      <div className="p-6 border-t border-white/10 bg-neutral-900/30 space-y-3 shrink-0">
        
        <button 
          onClick={() => setActiveTab('Settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'Settings' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings2 className="w-4 h-4 text-neutral-500" />
          <span>Preferences</span>
        </button>

        <button 
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        <div className="flex items-center gap-3 pt-3 border-t border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center text-[10px] font-black">
            {user?.name?.substring(0, 2).toUpperCase() || 'OS'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold truncate leading-none text-white">{user?.name || 'Dev Operator'}</p>
            <p className="text-[7.5px] text-neutral-500 font-bold uppercase tracking-widest mt-1">{user?.accountType || 'Pro Tier'} Plan</p>
          </div>
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;
