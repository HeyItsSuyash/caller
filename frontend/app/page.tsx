'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainWorkspace from '../components/MainWorkspace';
import EntityModal from '../components/EntityModal';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://caller-24ie.onrender.com';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Calls');
  const [activeEntity, setActiveEntity] = useState('Admission Bot');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'error'>('idle');
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const entities = ['Admission Bot', 'Support Bot', 'Sales Bot'];

  useEffect(() => {
    // 1. Fetch Initial Analytics
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/analytics`);
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };
    fetchAnalytics();

    // 2. Build the live WebSocket URL
    const wsUrl = BACKEND_URL.replace(/^http/, 'ws') + '/live';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log('Connected to live transcript stream');
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.event === 'transcript') {
          setTranscripts(prev => [...prev.slice(-15), payload.data]);
        } else if (payload.event === 'call_ended') {
          console.log('Call ended notification received');
          setCallStatus('idle');
          fetchAnalytics(); // Refresh history/analytics when call ends
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    ws.onerror = (err) => console.error('WebSocket Error:', err);
    ws.onclose = () => console.log('Disconnected from live stream');

    return () => ws.close();
  }, []);

  const handleCall = async (number: string) => {
    setCallStatus('calling');
    setTranscripts([]);
    setErrorMsg('');
    setActiveTab('Calls'); 

    try {
      const response = await fetch(`${BACKEND_URL}/call/outbound`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ to: number })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Server error');
      setCallStatus('connected');
    } catch (err: any) {
      setCallStatus('error');
      setErrorMsg(err.message);
      console.error('Call initialization failed:', err);
    }
  };

  const handleNewEntity = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex bg-white h-screen w-full overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        entities={entities}
        activeEntity={activeEntity}
        setActiveEntity={setActiveEntity}
        onNewEntity={handleNewEntity}
      />
      <MainWorkspace 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeEntity={activeEntity}
        transcripts={transcripts}
        callStatus={callStatus}
        onCall={handleCall}
        analyticsData={analyticsData}
      />

      <EntityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Absolute Error Notification */}
      {errorMsg && (
        <div className="fixed bottom-8 right-8 bg-rose-50 border border-rose-200 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-8 duration-300">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <p className="text-xs font-semibold text-rose-700">{errorMsg}</p>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-rose-600 ml-4 font-bold">×</button>
        </div>
      )}
    </div>
  );
}
