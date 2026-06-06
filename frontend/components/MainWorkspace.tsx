import React from 'react';
import { Settings as SettingsIcon, ChevronDown, Sparkles, Search, Bell, PhoneCall } from 'lucide-react';
import TabOverview from './TabOverview';
import TabCalls from './TabCalls';
import TabAgents from './TabAgents';
import TabContacts from './TabContacts';
import TabCampaigns from './TabCampaigns';
import TabAnalytics from './TabAnalytics';
import TabAutomations from './TabAutomations';
import TabIntegrations from './TabIntegrations';
import TabWorkspace from './TabWorkspace';
import TabSettings from './TabSettings';
import TabAdminUsers from './TabAdminUsers';
import TabAdminGeneral from './TabAdminGeneral';

interface MainWorkspaceProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeEntity: string;
  setActiveEntity: (entity: string) => void;
  transcripts: any[];
  callStatus: string;
  onCall: (number: string) => void;
  onHangup: () => void;
  analyticsData: any[];
  onImpersonate?: (user: any) => void;
  entities: any[];
  fetchEntities: () => void;
}

const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  activeTab,
  setActiveTab,
  activeEntity,
  setActiveEntity,
  transcripts,
  callStatus,
  onCall,
  onHangup,
  analyticsData,
  onImpersonate,
  entities,
  fetchEntities
}) => {
  const adminTabs = ['System Users', 'Global Entities', 'Global Calls', 'Global Analytics', 'Global Leads'];
  const isAdminTab = adminTabs.includes(activeTab);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Parse parent active page and inner subpage from Active Tab
  const parts = activeTab.split(' - ');
  const mainPage = parts[0];
  const subpage = parts[1] || '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white/[0.015] border border-white/30 backdrop-blur-2xl rounded-lg font-sans text-white shadow-2xl relative">
      {/* Internal Grid Background inside Main Workspace Container */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Top Header - Hide on Admin Global Tabs */}
      {!isAdminTab && (
        <header className="h-16 border-b border-white/30 px-8 flex items-center justify-between bg-transparent shrink-0 z-10 relative">
          <div className="flex items-center gap-6 flex-1">
            {/* Search anything input */}
            <div className="relative w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-9 pr-4 py-1.5 bg-transparent border border-white/30 rounded-lg text-[11px] text-white placeholder-neutral-600 focus:outline-none focus:border-white/45 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* AI System Online Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/30 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider leading-none">AI System Online</span>
            </div>

            {/* Notification Bell */}
            <div className="relative p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-all border border-transparent hover:border-white/30">
              <Bell className="w-3.5 h-3.5 text-neutral-400" />
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-rose-500 rounded-full flex items-center justify-center text-[7.5px] font-black text-white font-mono border border-black">3</span>
            </div>

            {/* Company selector */}
            <div className="flex items-center gap-1.5 cursor-pointer bg-white/[0.02] backdrop-blur-xl border border-white/30 px-3 py-2 rounded-lg hover:border-white/45 transition-all shadow-sm">
              <span className="text-xs font-bold text-white leading-none">Acme Corp</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </div>

            <div className="h-5 w-[1px] bg-white/10" />

            {/* User Profile Avatar block */}
            <div className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md flex items-center justify-center font-bold text-neutral-300 text-[10px] border border-white/30 font-display">
                  AR
                </div>
                <div className="text-left leading-none">
                  <p className="text-xs font-bold text-white">Aryan Raj</p>
                  <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Admin</p>
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </div>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#0d0d0f] border border-white/30 rounded-lg shadow-xl py-1 z-50 text-xs font-bold font-sans">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-rose-400 hover:bg-white/5 transition-all flex items-center gap-2"
                  >
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Launch Call Button */}
            <button 
              onClick={() => setActiveTab('Calls - Live Calls')}
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-black text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-sm font-display cursor-pointer"
            >
              <span>Launch Call</span>
              <span className="text-xs">↗</span>
            </button>
          </div>
        </header>
      )}

      {/* Tab Bar - SaaS Style (Only for Global System Admin Panels to keep consistent navigation switchers) */}
      {isAdminTab && (
        <div className="px-8 border-b border-white/30 shrink-0 bg-black">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {adminTabs.map((tab) => (
              <button
                key={tab}
                className={`py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative shrink-0 cursor-pointer
                  ${activeTab === tab ? 'text-white font-extrabold font-display' : 'text-neutral-500 hover:text-white'}
                `}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Workspace Active Views */}
      <div className="flex-1 overflow-y-auto relative bg-transparent">
        {/* Core Workspace Modules */}
        {(mainPage === 'Dashboard' || mainPage === 'Overview') && (
          <TabOverview 
            analyticsData={analyticsData} 
            callStatus={callStatus} 
            transcripts={transcripts} 
            entities={entities} 
            setActiveTab={setActiveTab}
          />
        )}
        {mainPage === 'Calls' && (
          <TabCalls 
            transcripts={transcripts} 
            callStatus={callStatus} 
            onCall={onCall} 
            onHangup={onHangup}
            activeSubpage={subpage}
          />
        )}
        {mainPage === 'AI Agents' && (
          <TabAgents 
            activeSubpage={subpage}
            entities={entities}
            fetchEntities={fetchEntities}
            activeEntity={activeEntity}
            setActiveEntity={setActiveEntity}
          />
        )}
        {mainPage === 'Contacts' && <TabContacts />}
        {mainPage === 'Campaigns' && <TabCampaigns />}
        {mainPage === 'Analytics' && (
          <TabAnalytics 
            analyticsData={analyticsData} 
            activeSubpage={subpage}
          />
        )}
        {mainPage === 'Automations' && <TabAutomations />}
        {mainPage === 'Integrations' && (
          <TabIntegrations 
            activeEntity={activeEntity} 
            entities={entities} 
          />
        )}
        {mainPage === 'Workspace' && <TabWorkspace />}
        {mainPage === 'Settings' && (
          <TabSettings 
            activeSubpage={subpage}
          />
        )}

        {/* Global System Admin Panels */}
        {activeTab === 'System Users' && <TabAdminUsers onImpersonate={onImpersonate || (() => {})} />}
        {activeTab === 'Global Entities' && <TabAdminGeneral type="entities" title="Global Entity Explorer" />}
        {activeTab === 'Global Calls' && <TabAdminGeneral type="calls" title="Global Call Logs" />}
        {activeTab === 'Global Analytics' && <TabAnalytics analyticsData={analyticsData} isGlobal />}
        {activeTab === 'Global Leads' && <TabAdminGeneral type="leads" title="Platform Leads" />}
      </div>
    </div>
  );
};

export default MainWorkspace;
