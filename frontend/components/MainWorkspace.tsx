import React from 'react';
import { Settings as SettingsIcon, ChevronDown, Activity, Phone } from 'lucide-react';
import TabDataRoom from './TabDataRoom';
import TabCalls from './TabCalls';
import TabAnalytics from './TabAnalytics';
import TabLeads from './TabLeads';
import TabSettings from './TabSettings';

interface MainWorkspaceProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeEntity: string;
  transcripts: any[];
  callStatus: string;
  onCall: (number: string) => void;
  analyticsData: any[];
}

const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  activeTab,
  setActiveTab,
  activeEntity,
  transcripts,
  callStatus,
  onCall,
  analyticsData
}) => {
  const tabs = ['Data Room', 'Calls', 'Analytics', 'Leads', 'Settings'];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Header */}
      <header className="h-14 border-b border-border px-8 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm tracking-tight">{activeEntity}</h2>
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

      {/* Tab bar */}
      <div className="px-8 border-b border-border shrink-0 bg-white">
        <div className="flex gap-8">
          {tabs.map((tab) => (
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
        {activeTab === 'Data Room' && <TabDataRoom />}
        {activeTab === 'Calls' && <TabCalls transcripts={transcripts} callStatus={callStatus} onCall={onCall} />}
        {activeTab === 'Analytics' && <TabAnalytics analyticsData={analyticsData} />}
        {activeTab === 'Leads' && <TabLeads />}
        {activeTab === 'Settings' && <TabSettings />}
      </div>
    </div>
  );
};

export default MainWorkspace;
