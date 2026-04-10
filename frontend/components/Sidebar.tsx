import React from 'react';
import { 
  BarChart2, 
  Settings, 
  LayoutDashboard, 
  PhoneCall, 
  Users, 
  Plus,
  Box,
  MessageSquare,
  Activity,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  entities: string[];
  activeEntity: string;
  setActiveEntity: (entity: string) => void;
  onNewEntity: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  entities, 
  activeEntity, 
  setActiveEntity,
  onNewEntity 
}) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Calls', icon: MessageSquare },
    { name: 'Analytics', icon: BarChart2 },
    { name: 'Leads', icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-border h-screen flex flex-col bg-sidebar overflow-y-auto shrink-0">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center">
            <Activity className="text-white w-5 h-5 shadow-sm" />
          </div>
          <span className="font-bold tracking-tight text-lg">Caller AI</span>
        </div>

        <button 
          onClick={onNewEntity}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-border rounded-xl hover:bg-white hover:shadow-sm text-sm font-semibold transition-all mb-8 bg-transparent"
        >
          <Plus className="w-4 h-4" />
          <span>New Entity</span>
        </button>

        <div className="mb-8">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4 px-2">Entities</h3>
          <div className="space-y-1">
            {entities.map((entity) => (
              <button
                key={entity}
                onClick={() => setActiveEntity(entity)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeEntity === entity ? 'sidebar-item-active shadow-sm' : 'text-secondary hover:text-primary hover:bg-accent'
                }`}
              >
                {entity}
              </button>
            ))}
          </div>
        </div>

        <nav className="space-y-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4 px-2">Workspace</h3>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === item.name ? 'sidebar-item-active shadow-sm' : 'text-secondary hover:text-primary hover:bg-accent'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6 border-t border-border space-y-4">
        <button 
          onClick={() => setActiveTab('Settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
            activeTab === 'Settings' ? 'sidebar-item-active shadow-sm' : 'text-secondary hover:text-primary hover:bg-accent'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button 
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
          onClick={() => window.location.href = '/login'}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold border border-border">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">Admin User</p>
            <p className="text-[10px] text-secondary">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
