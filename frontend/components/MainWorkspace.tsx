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
  const tabs = ['Dashboard', 'Agents', 'Knowledge', 'Calls', 'Analytics', 'Leads', 'Integrations', 'Telephony', 'Settings'];
  const adminTabs = ['System Users', 'Global Entities', 'Global Calls', 'Global Analytics', 'Global Leads'];
  
  const isAdminTab = adminTabs.includes(activeTab);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-black font-sans text-white">
      {/* Top Header - Hide on Admin Global Tabs */}
      {!isAdminTab && (
        <header className="h-14 border-b border-white/10 px-8 flex items-center justify-between bg-black shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1.5 rounded-xl border border-transparent hover:border-white/10 transition-all">
              <h2 className="font-black text-[11px] tracking-wider uppercase text-white font-display">
                {activeEntity || 'Select or Deploy Agent'}
              </h2>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            
            <div className="h-4 w-[1px] bg-white/10" />
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/10 text-[10px] font-bold text-neutral-400 hover:text-white">
              <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
              <span>Voice: Google Poly / Sarvam / ElevenLabs</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none">Gateway Active</span>
            </div>
            <button 
              onClick={() => setActiveTab('Settings')}
              className="p-2 rounded-xl hover:bg-white/5 border border-white/10 hover:text-white transition-all bg-transparent cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 text-neutral-500 hover:text-white" />
            </button>
          </div>
        </header>
      )}

      {/* Tab Bar - SaaS Style */}
      <div className="px-8 border-b border-white/10 shrink-0 bg-black">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {(isAdminTab ? adminTabs : tabs).map((tab) => (
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

      {/* Workspace Active Views */}
      <div className="flex-1 overflow-y-auto relative bg-black">
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
        {activeTab === 'Knowledge' && <TabDataRoom activeEntity={activeEntity} />}
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
