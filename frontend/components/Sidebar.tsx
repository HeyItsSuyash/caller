import React from 'react';
import { 
  BarChart3, 
  Settings2, 
  LayoutDashboard, 
  PhoneCall, 
  Users2, 
  Plus,
  Binary,
  Activity,
  LogOut,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  Settings,
  TrendingUp,
  Building2
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
  
  const menuConfig = [
    { 
      name: 'Overview', 
      icon: LayoutDashboard, 
      desc: 'Executive command center'
    },
    { 
      name: 'Calls', 
      icon: PhoneCall, 
      desc: 'Operations queue',
      subpages: ['Live Calls', 'Recent Calls', 'Scheduled Calls', 'Recordings']
    },
    { 
      name: 'AI Agents', 
      icon: Sparkles, 
      desc: 'Virtual agents builder',
      subpages: ['My Agents', 'Agent Builder', 'Voice Library']
    },
    { 
      name: 'Contacts', 
      icon: Users2, 
      desc: 'CRM lead database'
    },
    { 
      name: 'Campaigns', 
      icon: TrendingUp, 
      desc: 'Outbound calling dialer'
    },
    { 
      name: 'Analytics', 
      icon: BarChart3, 
      desc: 'Business intelligence'
    },
    { 
      name: 'Automations', 
      icon: Activity, 
      desc: 'Trigger actions & webhooks'
    },
    { 
      name: 'Integrations', 
      icon: Binary, 
      desc: 'Connect CRM & API tools'
    },
    { 
      name: 'Workspace', 
      icon: Building2, 
      desc: 'Manage team and billing'
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      desc: 'Central configuration'
    }
  ];

  const handleParentClick = (item: any) => {
    if (item.subpages && item.subpages.length > 0) {
      // Set to first subpage
      setActiveTab(`${item.name} - ${item.subpages[0]}`);
    } else {
      setActiveTab(item.name);
    }
  };

  const isItemActive = (item: any) => {
    if (activeTab === item.name) return true;
    if (activeTab.startsWith(`${item.name} - `)) return true;
    return false;
  };

  return (
    <aside className="w-60 border-r border-white/5 h-screen flex flex-col bg-[#070708] shrink-0 font-sans text-white">
      
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between shrink-0 border-b border-white/5">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="font-extrabold text-[15px] tracking-tight text-white font-display">caller.work</span>
          <span className="text-[15px] font-black text-emerald-400 leading-none">•</span>
        </div>
      </div>

      {/* Main Nav Items (Scrollable when overflow) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-hide">
        <nav className="space-y-1">
          {menuConfig.map((item) => {
            const active = isItemActive(item);
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => handleParentClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    active 
                      ? 'bg-white/10 text-white font-bold' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4.5 h-4.5 ${active ? 'text-white' : 'text-neutral-500'}`} />
                    <span className="text-[12px] font-semibold tracking-tight">{item.name}</span>
                  </div>
                  {active && <ArrowUpRight className="w-3 h-3 text-neutral-500" />}
                </button>

                {/* Render nested sub-items if parent is active */}
                {active && item.subpages && (
                  <div className="pl-10 pr-2 py-1 space-y-1.5">
                    {item.subpages.map((sub) => {
                      const subTabKey = `${item.name} - ${sub}`;
                      const isSubActive = activeTab === subTabKey;
                      return (
                        <button
                          key={sub}
                          onClick={() => setActiveTab(subTabKey)}
                          className={`w-full text-left py-1 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer block ${
                            isSubActive 
                              ? 'text-white font-semibold' 
                              : 'text-neutral-500 hover:text-white'
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* AI System Status Widget placed inside the scroll area pushed to bottom */}
        <div className="p-4 border border-white/5 rounded-2xl bg-[#0c0c0e]/80 space-y-2.5 mt-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest leading-none">AI System Status</span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-wider leading-none">All systems operational</span>
            </div>
          </div>
          <div className="h-6 w-full pt-1">
            <svg viewBox="0 0 100 20" className="w-full h-full text-emerald-500/30" preserveAspectRatio="none">
              <path 
                d="M 0 12 Q 15 5, 30 14 T 60 8 T 90 15 L 100 10" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="1.2" 
              />
            </svg>
          </div>
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;
