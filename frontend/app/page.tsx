'use client';

import { useState } from 'react';

// Replace localhost fallback with the Render backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://caller-24ie.onrender.com';

export default function Home() {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCall = async () => {
    setCallStatus('calling');
    setErrorMsg('');
    
    try {
      console.log(`[Frontend] Initiating call via ${BACKEND_URL}/call/outbound`);
      const response = await fetch(`${BACKEND_URL}/call/outbound`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ to: '+917390900769' })
      });

      console.log(`[Frontend] Response Status: ${response.status} ${response.statusText}`);
      
      const responseText = await response.text();
      console.log(`[Frontend] Raw Response:`, responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('[Frontend] Failed to parse JSON response');
        throw new Error(`Invalid response from server: ${response.status}`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      setCallStatus('connected');
    } catch (err: any) {
      console.error('[Frontend] Call failed with details:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        url: BACKEND_URL
      });
      setCallStatus('error');
      setErrorMsg(`Connection error: ${err.message}. Check console for details.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center font-sans text-white">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">VaaniAI</h1>
          <p className="text-gray-400">One-click AI caller demo</p>
        </div>

        <div className="py-8">
          <button
            onClick={handleCall}
            disabled={callStatus === 'calling'}
            className={`
              relative group overflow-hidden rounded-full w-40 h-40 mx-auto flex flex-col items-center justify-center transition-all duration-300
              ${callStatus === 'idle' ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)]' : ''}
              ${callStatus === 'calling' ? 'bg-yellow-600 cursor-not-allowed animate-pulse shadow-[0_0_30px_rgba(202,138,4,0.3)]' : ''}
              ${callStatus === 'connected' ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_30px_rgba(22,163,74,0.3)]' : ''}
              ${callStatus === 'error' ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : ''}
            `}
          >
            <div className="text-4xl mb-2">
              {callStatus === 'idle' && '📞'}
              {callStatus === 'calling' && '⏳'}
              {callStatus === 'connected' && '✅'}
              {callStatus === 'error' && '❌'}
            </div>
            <span className="font-semibold tracking-wider uppercase text-sm">
              {callStatus === 'idle' && 'Call Now'}
              {callStatus === 'calling' && 'Calling...'}
              {callStatus === 'connected' && 'Call Started'}
              {callStatus === 'error' && 'Retry'}
            </span>
          </button>
        </div>

        <div className="bg-gray-950 rounded-xl p-4 border border-gray-800">
          <p className="text-sm text-gray-400">Target Number</p>
          <p className="text-lg font-mono text-gray-200">+91 73909 00769</p>
        </div>

        {errorMsg && (
          <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
