import React from 'react';
import { Settings as SettingsIcon, ChevronDown, Sparkles } from 'lucide-react';
import TabOverview from './TabOverview';
import TabDataRoom from './TabDataRoom';
import TabCalls from './TabCalls';
import TabAnalytics from './TabAnalytics';
import TabLeads from './TabLeads';
import TabSettings from './TabSettings';
import TabAdminUsers from './TabAdminUsers';
import TabAdminGeneral from './TabAdminGeneral';
import TabIntegrations from './TabIntegrations';
import TabTelephony from './TabTelephony';

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
  const tabs = ['Dashboard', 'Agents', 'Data Room', 'Calls', 'Analytics', 'Leads', 'Integrations', 'Telephony', 'Settings'];
  const adminTabs = ['System Users', 'Global Entities', 'Global Calls', 'Global Analytics', 'Global Leads'];
  
  const isAdminTab = adminTabs.includes(activeTab);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Header - Hide on Admin Global Tabs */}
      {!isAdminTab && (
        <header className="h-14 border-b border-neutral-100 px-8 flex items-center justify-between bg-white shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.005)]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <h2 className="font-black text-[12px] tracking-widest uppercase italic text-neutral-900">
                {activeEntity || 'Select or Deploy Agent'}
              </h2>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            
            <div className="h-4 w-[1px] bg-neutral-200" />
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors text-[10px] font-bold text-neutral-500 hover:text-black">
              <Sparkles className="w-3 h-3 text-neutral-400" />
              <span>Voice Synthesis: Google Poly.Aditi (hi-IN)</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.05)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest leading-none">VANI Gateway Active</span>
            </div>
            <button 
              onClick={() => setActiveTab('Settings')}
              className="p-2 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200/50 transition-all text-neutral-500 hover:text-black shadow-sm bg-transparent"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Tab Bar - SaaS Style */}
      <div className="px-8 border-b border-neutral-100 shrink-0 bg-white">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {(isAdminTab ? adminTabs : tabs).map((tab) => (
            <button
              key={tab}
              className={`py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative shrink-0
                ${activeTab === tab ? 'text-black font-extrabold' : 'text-neutral-400 hover:text-black'}
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

      {/* Workspace Active Views */}
      <div className="flex-1 overflow-hidden relative">
        {/* Core Workspace Modules */}
        {activeTab === 'Dashboard' && (
          <TabOverview 
            analyticsData={analyticsData} 
            callStatus={callStatus} 
            transcripts={transcripts} 
            entities={entities} 
          />
        )}
        {activeTab === 'Agents' && <TabSettings />}
        {activeTab === 'Data Room' && <TabDataRoom activeEntity={activeEntity} />}
        {activeTab === 'Calls' && <TabCalls transcripts={transcripts} callStatus={callStatus} onCall={onCall} />}
        {activeTab === 'Analytics' && <TabAnalytics analyticsData={analyticsData} />}
        {activeTab === 'Leads' && <TabLeads />}
        {activeTab === 'Integrations' && <TabIntegrations activeEntity={activeEntity} entities={entities} />}
        {activeTab === 'Telephony' && <TabTelephony />}
        {activeTab === 'Settings' && <TabSettings />}

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
