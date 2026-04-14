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
  LogOut,
  ShieldCheck,
  Layout
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
                key={entity._id || entity.name}
                onClick={() => setActiveEntity(entity.name)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeEntity === entity.name ? 'sidebar-item-active shadow-sm' : 'text-secondary hover:text-primary hover:bg-accent'
                }`}
              >
                {entity.name}
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

        {user?.role === 'admin' && (
          <div className="mt-8 space-y-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-4 px-2 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" />
              <span>System Admin</span>
            </h3>
            {[
              { name: 'System Users', icon: Users },
              { name: 'Global Entities', icon: Box },
              { name: 'Global Calls', icon: PhoneCall },
              { name: 'Global Analytics', icon: BarChart2 },
              { name: 'Global Leads', icon: Users },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeTab === item.name ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-secondary hover:text-emerald-600 hover:bg-emerald-50/50'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.name ? 'text-emerald-600' : ''}`} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        )}
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
        {user?.role === 'admin' && (
          <Link 
            href="/admin"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-secondary hover:text-black hover:bg-accent transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold uppercase tracking-wider text-[10px]">Admin Portal</span>
          </Link>
        )}
        <button 
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold border border-border">
            {user?.name?.substring(0, 2).toUpperCase() || 'AI'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{user?.name || 'Guest User'}</p>
            <p className="text-[10px] text-secondary capitalize">{user?.accountType || 'Trial'} Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
