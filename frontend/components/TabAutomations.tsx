import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Plus, 
  ArrowRight, 
  Zap, 
  Webhook, 
  Bell, 
  Database, 
  PhoneCall, 
  Play, 
  CheckCircle2, 
  Code,
  Trash2
} from 'lucide-react';

const TabAutomations: React.FC = () => {
  const [flows, setFlows] = useState([
    { id: 1, name: 'Hot Lead Slack Alert', trigger: 'Call Sentiment Positive', action: 'Send Slack Notification', active: true, runs: 142 },
    { id: 2, name: 'Google Sheets CRM Sync', trigger: 'Call Completed', action: 'Append to Google Sheet', active: true, runs: 1248 },
    { id: 3, name: 'Immediate Outbound Redial', trigger: 'Call Dropped/No Answer', action: 'Schedule Callback in 15m', active: false, runs: 89 },
    { id: 4, name: 'Webhook Ingestion Pipeline', trigger: 'Meeting Booked by Agent', action: 'Post to Custom Webhook URL', active: true, runs: 38 }
  ]);

  const [triggerSelect, setTriggerSelect] = useState('Call Sentiment Positive');
  const [actionSelect, setActionSelect] = useState('Send Slack Notification');
  const [flowName, setFlowName] = useState('New Custom Flow');

  const handleCreateFlow = () => {
    setFlows(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: flowName,
        trigger: triggerSelect,
        action: actionSelect,
        active: true,
        runs: 0
      }
    ]);
    setFlowName('New Custom Flow');
  };

  const toggleFlow = (id: number) => {
    setFlows(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const deleteFlow = (id: number) => {
    setFlows(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent p-8 overflow-y-auto scrollbar-hide text-white">
      <div className="max-w-6xl mx-auto w-full space-y-8 pb-16 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-30" />

        {/* Title */}
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-white font-display">Trigger-Action Flows</h1>
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mt-1">Design automated rules linking live telephony sessions to external CRM tools</p>
          </div>
        </div>

        {/* Split screen: Builder panel + Deployed rules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left/Col 1: Flow Builder */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-2 font-display">Create Flow</h3>
            
            <div className="p-6 bg-white/[0.015] border border-white/[0.05] backdrop-blur-2xl rounded-lg shadow-xl space-y-6">
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Flow Name</label>
                <input 
                  type="text" 
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] text-white rounded-lg focus:border-white/20 focus:ring-0 text-xs font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500">When Event Occurs (Trigger)</label>
                <select 
                  value={triggerSelect}
                  onChange={(e) => setTriggerSelect(e.target.value)}
                  className="w-full p-3 bg-[#0a0a0a] border border-white/[0.05] text-xs font-semibold rounded-lg text-white focus:border-white/20"
                >
                  <option>Call Sentiment Positive</option>
                  <option>Call Completed</option>
                  <option>Call Dropped/No Answer</option>
                  <option>Meeting Booked by Agent</option>
                  <option>Escalation Flag Triggered</option>
                </select>
              </div>

              <div className="flex justify-center py-1">
                <ArrowRight className="w-5 h-5 text-neutral-600 rotate-90 lg:rotate-0" />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Then Execute Operation (Action)</label>
                <select 
                  value={actionSelect}
                  onChange={(e) => setActionSelect(e.target.value)}
                  className="w-full p-3 bg-[#0a0a0a] border border-white/[0.05] text-xs font-semibold rounded-lg text-white focus:border-white/20"
                >
                  <option>Send Slack Notification</option>
                  <option>Append to Google Sheet</option>
                  <option>Schedule Callback in 15m</option>
                  <option>Post to Custom Webhook URL</option>
                  <option>Email Lead Transcript</option>
                </select>
              </div>

              <button 
                onClick={handleCreateFlow}
                className="w-full py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 font-display"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Deploy Automation</span>
              </button>
            </div>
          </div>

          {/* Right/Col 2-3: Deployed Automations */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-2 font-display">Active Workspace Automations</h3>
            
            <div className="space-y-4">
              {flows.map((flow) => (
                <div 
                  key={flow.id} 
                  className={`p-6 border rounded-lg bg-white/[0.015] backdrop-blur-2xl shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    flow.active ? 'border-white/[0.05]' : 'border-white/[0.03] opacity-50'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Zap className={`w-4 h-4 ${flow.active ? 'text-emerald-400' : 'text-neutral-500'}`} />
                      <h4 className="text-xs font-black text-white font-display">{flow.name}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[9px] text-neutral-400 font-semibold uppercase">
                      <span className="px-2 py-0.5 bg-black/40 border border-white/[0.05] rounded text-neutral-300">{flow.trigger}</span>
                      <ArrowRight className="w-3 h-3 text-neutral-600" />
                      <span className="px-2 py-0.5 bg-black/40 border border-white/[0.05] rounded text-neutral-300">{flow.action}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[8px] text-neutral-500 uppercase block font-bold leading-none mb-0.5">Executions</span>
                      <span className="text-xs font-black text-white font-mono">{flow.runs} runs</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleFlow(flow.id)}
                        className={`text-[8px] font-black uppercase px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          flow.active 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                            : 'bg-white/5 text-neutral-500 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {flow.active ? 'Active' : 'Disabled'}
                      </button>

                      <button 
                        onClick={() => deleteFlow(flow.id)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-rose-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ingest logs */}
            <div className="p-6 bg-white/[0.015] border border-white/[0.05] backdrop-blur-2xl rounded-lg space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 font-display">Real-Time Ingestion Logs</h4>
              <div className="font-mono text-[9px] text-neutral-500 space-y-2 leading-relaxed">
                <p>[10:48:12] Webhook successfully triggered for Rahul Sharma (B.Tech CS) - status 200 OK</p>
                <p>[10:45:00] Slack notification sent: Channel #leads - Aman Verma conversation summary synced</p>
                <p>[10:30:15] Sheets record appended for Priya Das - 14 cols written</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TabAutomations;
