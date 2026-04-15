import React, { useState } from 'react';

/**
 * CallerWidget React Component
 * 
 * Usage:
 * <CallerWidget agentId="YOUR_AGENT_ID" />
 */
export const CallerWidget = ({ agentId, backendUrl = 'https://caller-24ie.onrender.com' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleStartCall = async () => {
    if (!phoneNumber) {
      setStatus({ message: 'Please enter a phone number', type: 'error' });
      return;
    }

    setLoading(true);
    setStatus({ message: 'Connecting to AI agent...', type: '' });

    try {
      const response = await fetch(`${backendUrl}/api/widget/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, phoneNumber })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ message: 'Success! You will receive a call shortly.', type: 'success' });
        setPhoneNumber('');
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        setStatus({ message: data.error || 'Failed to start call', type: 'error' });
      }
    } catch (err) {
      setStatus({ message: 'Connection error. Try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          background: '#000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          border: 'none',
          transition: 'transform 0.2s'
        }}
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '28px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '340px',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 10000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ background: '#000', padding: '24px 20px', color: '#fff', position: 'relative' }}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px', opacity: 0.6 }}
            >
              ×
            </button>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Start AI Call</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.7 }}>Speak with our AI assistant immediately.</p>
          </div>
          <div style={{ padding: '24px 20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px', textTransform: 'uppercase' }}>
                Your Phone Number
              </label>
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #eee', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              onClick={handleStartCall}
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Initiating...' : 'Start Call'}
            </button>
            {status.message && (
              <div style={{ marginTop: '12px', fontSize: '12px', textAlign: 'center', color: status.type === 'error' ? '#ef4444' : '#10b981' }}>
                {status.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
