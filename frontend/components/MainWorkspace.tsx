import React from 'react';
import { Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import TabDataRoom from './TabDataRoom';
import TabCalls from './TabCalls';
import TabAnalytics from './TabAnalytics';
import TabLeads from './TabLeads';
import TabSettings from './TabSettings';
import TabAdminUsers from './TabAdminUsers';
import TabAdminGeneral from './TabAdminGeneral';
import TabIntegrations from './TabIntegrations';

interface MainWorkspaceProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeEntity: string;
  transcripts: any[];
  callStatus: string;
  onCall: (number: string) => void;
  analyticsData: any[];
  onImpersonate?: (user: any) => void;
  entities: any[];
}

const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  activeTab,
  setActiveTab,
  activeEntity,
  transcripts,
  callStatus,
  onCall,
  analyticsData,
  onImpersonate,
  entities
}) => {
  const tabs = ['Data Room', 'Calls', 'Analytics', 'Leads', 'Integrations', 'Settings'];
  const adminTabs = ['System Users', 'Global Entities', 'Global Calls', 'Global Analytics', 'Global Leads'];
  
  const isAdminTab = adminTabs.includes(activeTab);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Header - Hide on Admin Global Tabs */}
      {!isAdminTab && (
        <header className="h-14 border-b border-border px-8 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm tracking-tight">
                {activeEntity || 'Select or Create Agent'}
              </h2>
              <ChevronDown className="w-3.5 h-3.5 text-secondary" />
            </div>
            
            <div className="h-4 w-[1px] bg-border" />
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent cursor-pointer transition-colors text-[11px] font-semibold text-secondary hover:text-primary">
              <span>Voice Model: Google Standard</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Active</span>
            </div>
            <button 
              onClick={() => setActiveTab('Settings')}
              className="p-1.5 rounded-md hover:bg-accent transition-colors text-secondary hover:text-primary"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Tab bar - Only show relevant tabs */}
      <div className="px-8 border-b border-border shrink-0 bg-white">
        <div className="flex gap-8">
          {(isAdminTab ? adminTabs : tabs).map((tab) => (
            <button
              key={tab}
              className={`py-4 text-xs font-bold uppercase tracking-widest transition-all relative
                ${activeTab === tab ? 'text-black' : 'text-secondary hover:text-black'}
              `}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'Data Room' && <TabDataRoom activeEntity={activeEntity} />}
        {activeTab === 'Calls' && <TabCalls transcripts={transcripts} callStatus={callStatus} onCall={onCall} />}
        {activeTab === 'Analytics' && <TabAnalytics analyticsData={analyticsData} />}
        {activeTab === 'Leads' && <TabLeads />}
        {activeTab === 'Integrations' && <TabIntegrations activeEntity={activeEntity} entities={entities} />}
        {activeTab === 'Settings' && <TabSettings />}

        {/* Admin Tabs */}
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
