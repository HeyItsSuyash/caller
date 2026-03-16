'use client';

import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const WS_URL = BACKEND_URL.replace(/^http/, 'ws');

export default function Home() {
  const [activeTab, setActiveTab] = useState('live');
  const [calls, setCalls] = useState([]);
  const [liveCall, setLiveCall] = useState(null);
  
  // Fetch dashboard data
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetch(`${BACKEND_URL}/calls`)
        .then(res => res.json())
        .then(data => setCalls(data))
        .catch(console.error);
    }
  }, [activeTab]);

  // WebSocket for Live Call view
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/live`);
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === 'turn_added') {
          // Update live call state
          const { callSid, turn } = msg.data;
          setLiveCall(prev => {
            if (!prev || prev.callSid !== callSid) {
              return { callSid, turns: [turn] };
            }
            return { ...prev, turns: [...prev.turns, turn] };
          });
        } else if (msg.event === 'call_updated') {
          const { callSid, updates } = msg.data;
          setLiveCall(prev => {
            if (prev && prev.callSid === callSid) {
              return { ...prev, ...updates };
            }
            return prev;
          });
        }
      } catch (e) {
        console.error('WS parse error', e);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">VaaniAI Agent</h1>
          <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 rounded-md transition-all ${activeTab === 'live' ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-700'}`}
            >
              Live Call
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-700'}`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 py-8">
        {activeTab === 'live' ? (
          <LiveCallView liveCall={liveCall} />
        ) : (
          <DashboardView calls={calls} />
        )}
      </main>
    </div>
  );
}

function LiveCallView({ liveCall }) {
  if (!liveCall) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <div className="animate-pulse w-16 h-16 rounded-full bg-blue-500/20 mb-4 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-500/50"></div>
        </div>
        <p className="text-xl">Waiting for active call...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 flex flex-col h-[70vh] bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Real-time Transcript</h2>
            <p className="text-sm text-gray-400">Call SID: {liveCall.callSid}</p>
          </div>
          <div className="flex items-center space-x-2">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
             </span>
             <span className="text-red-400 font-medium text-sm tracking-widest uppercase">Live</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          {liveCall.turns?.map((turn, i) => (
            <div key={i} className={`flex flex-col max-w-[80%] ${turn.speaker === 'user' ? 'self-end' : 'self-start'}`}>
              <div className="flex items-baseline space-x-2 mb-1 pl-1">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{turn.speaker === 'user' ? 'Caller' : 'VaaniAI'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">{turn.language}</span>
                {turn.intent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-800">{turn.intent}</span>}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${
                turn.speaker === 'user' 
                  ? 'bg-blue-600 rounded-br-none text-white' 
                  : 'bg-gray-800 border border-gray-700 rounded-bl-none text-gray-100'
              }`}>
                {turn.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl leading-relaxed">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Call Context</h3>
          {liveCall.resolution_status && (
            <div className="mb-4 flex justify-between items-center border-b border-gray-800 pb-2">
              <span className="text-gray-400">Status</span>
              <span className="capitalize font-medium text-green-400">{liveCall.resolution_status}</span>
            </div>
          )}
          {liveCall.summary && (
            <div className="mb-4">
              <span className="text-gray-400 block mb-1">Live Summary</span>
              <p className="text-sm text-gray-300 italic">"{liveCall.summary.summary}"</p>
            </div>
          )}
        </div>
        
        {/* Placeholder for waveform animation */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-xl flex-1 flex flex-col items-center justify-center">
           <div className="flex items-center space-x-1 h-12">
             {[...Array(20)].map((_, i) => (
               <div key={i} className="w-1 bg-blue-500 rounded-t-full" style={{
                 height: `${Math.max(10, Math.random() * 100)}%`,
                 opacity: 0.5 + Math.random() * 0.5,
                 transition: 'height 0.2s ease-in-out'
               }}></div>
             ))}
           </div>
           <p className="mt-4 text-sm text-gray-500">Audio Stream Active</p>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ calls }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Calls" value={calls.length} />
        <MetricCard title="Avg Duration" value="2m 14s" />
        <MetricCard title="Resolution Rate" value="85%" trend="+2%" />
        <MetricCard title="Languages" value="HI / EN / Mix" />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900/80 border-b border-gray-800 text-gray-400 text-sm">
              <th className="p-4 font-medium tracking-wider">Call SID</th>
              <th className="p-4 font-medium tracking-wider">Start Time</th>
              <th className="p-4 font-medium tracking-wider">Turns</th>
              <th className="p-4 font-medium tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {calls.map((call, i) => (
              <tr key={i} className="hover:bg-gray-800/50 transition-colors cursor-pointer group">
                <td className="p-4 font-mono text-sm break-all max-w-[150px] truncate text-gray-300 group-hover:text-blue-400">{call.callSid}</td>
                <td className="p-4 text-gray-300">{new Date(call.startTime).toLocaleTimeString()}</td>
                <td className="p-4 text-gray-300">{call.turns?.length || 0}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    call.resolution_status === 'resolved' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                    call.resolution_status === 'pending' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' :
                    'bg-red-900/50 text-red-400 border border-red-800'
                  }`}>
                    {call.resolution_status || 'unknown'}
                  </span>
                </td>
              </tr>
            ))}
            {calls.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No calls recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm flex flex-col justify-between">
      <h3 className="text-gray-400 text-sm font-medium tracking-wider uppercase">{title}</h3>
      <div className="mt-2 flex items-baseline space-x-2">
        <span className="text-3xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">{value}</span>
        {trend && <span className="text-green-400 text-sm font-medium">{trend}</span>}
      </div>
    </div>
  );
}
