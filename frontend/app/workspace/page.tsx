'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import MainWorkspace from '../../components/MainWorkspace';
import EntityModal from '../../components/EntityModal';

const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('caller.work')) {
      return 'https://caller-24ie.onrender.com';
    }
  }
  return 'http://127.0.0.1:3001';
};

const BACKEND_URL = getBackendUrl();

export default function WorkspacePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeEntity, setActiveEntity] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'error'>('idle');
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [entities, setEntities] = useState<any[]>([]);

  // Stable component-level entity fetcher
  const fetchEntities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const userIdQuery = targetUser ? `?userId=${targetUser._id}` : '';
      const response = await fetch(`${BACKEND_URL}/entities${userIdQuery}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setEntities(data);
        if (data.length > 0 && !activeEntity) {
          setActiveEntity(data[0].name);
        }
      }
    } catch (err) {
      console.error('Error fetching entities:', err);
    }
  };

  // Stable component-level analytics fetcher
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const userIdQuery = targetUser ? `?userId=${targetUser._id}` : '';
      const endpoint = targetUser ? `/analytics` : '/analytics';
      const response = await fetch(`${BACKEND_URL}${endpoint}${userIdQuery}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAnalyticsData(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchEntities();
    fetchAnalytics();

    // Build the live WebSocket URL
    const protocol = BACKEND_URL.startsWith('https') ? 'wss' : 'ws';
    const cleanUrl = BACKEND_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const wsUrl = `${protocol}://${cleanUrl}/live`;
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWS = () => {
      console.log(`[WebSocket] Connecting to: ${wsUrl}...`);
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('[WebSocket] Connected to live transcript stream');
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === 'transcript') {
            setTranscripts(prev => [...prev.slice(-15), payload.data]);
          } else if (payload.event === 'call_ended') {
            console.log('[WebSocket] Call ended notification received');
            setCallStatus('idle');
            fetchAnalytics();
          }
        } catch (err) {
          console.error('[WebSocket] Message processing error:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('[WebSocket] Connection error. Detailed event:', err);
      };

      socket.onclose = (event) => {
        console.warn(`[WebSocket] Disconnected (Code: ${event.code}). Retrying in 3s...`);
        reconnectTimeout = setTimeout(connectWS, 3000);
      };
    };

    connectWS();

    return () => {
      if (socket) socket.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [targetUser, router]);

  const handleImpersonate = (u: any) => {
    setTargetUser(u);
    setActiveTab('Dashboard');
    setActiveEntity('');
  };

  const stopImpersonating = () => {
    setTargetUser(null);
    setActiveTab('Dashboard');
    setActiveEntity('');
  };

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
        body: JSON.stringify({ 
          to: number,
          entity: activeEntity 
        })
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

  const handleHangup = () => {
    setCallStatus('idle');
  };

  const handleNewEntity = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-black relative">
      {/* Decorative vertical & horizontal background grid - slightly more visible */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      
      {/* Static white glows matching referenceimage.jpeg */}
      <div className="absolute top-[10%] left-[25%] w-[800px] h-[600px] bg-white/[0.025] blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Admin Impersonation Banner */}
      {targetUser && (
        <div className="bg-emerald-600 px-4 py-1.5 flex items-center justify-between text-white text-[11px] font-bold uppercase tracking-widest z-50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Viewing Workspace as: {targetUser.name} ({targetUser.email})</span>
          </div>
          <button 
            onClick={stopImpersonating}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm transition-colors"
          >
            Exit Admin Mode
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden p-4 gap-4 relative z-10 bg-transparent">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          entities={entities}
          activeEntity={activeEntity}
          setActiveEntity={setActiveEntity}
          onNewEntity={handleNewEntity}
          user={user}
        />
        <MainWorkspace 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeEntity={activeEntity}
          setActiveEntity={setActiveEntity}
          transcripts={transcripts}
          callStatus={callStatus}
          onCall={handleCall}
          onHangup={handleHangup}
          analyticsData={analyticsData}
          onImpersonate={handleImpersonate}
          entities={entities}
          fetchEntities={fetchEntities}
        />
      </div>

      <EntityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={(newEntity) => {
          setEntities(prev => [...prev, newEntity]);
          setActiveEntity(newEntity.name);
          setIsModalOpen(false);
        }}
      />
      
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
