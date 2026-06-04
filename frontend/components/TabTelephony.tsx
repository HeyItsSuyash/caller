import React from 'react';
import { 
  PhoneCall, 
  Settings, 
  Layers, 
  Cpu, 
  HelpCircle, 
  CheckCircle2, 
  Plus, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';

const TabTelephony = () => {
  const activeNumbers = [
    { number: '+1 662 481 8479', label: 'Primary Twilio Line', status: 'Active', rate: '₹0.85/min', region: 'United States' },
    { number: '+91 80 4719 3982', label: 'Inbound FAQ Support', status: 'Routing Inactive', rate: '₹1.20/min', region: 'India (Bangalore)' }
  ];

  const providers = [
    { name: 'Twilio', logo: 'TW', status: 'Connected', desc: 'Standard Telephony & WebSockets Stream Protocol.', active: true },
    { name: 'Exotel', logo: 'EX', status: 'Coming Soon', desc: 'Enterprise localized Indian numbers and SIP trunks.', active: false },
    { name: 'Plivo', logo: 'PL', status: 'Coming Soon', desc: 'High-availability global SMS and Voice interfaces.', active: false },
    { name: 'Knowlarity', logo: 'KN', status: 'Coming Soon', desc: 'Virtual cloud telephony routing and IVR services.', active: false },
    { name: 'Custom SIP Trunk', logo: 'SIP', status: 'Coming Soon', desc: 'Direct connection to local office PBX hardware.', active: false }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white p-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-5xl mx-auto w-full space-y-8 pb-16">
        
        {/* Telephony Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Telephony & Carriers</h1>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-1">Configure active numbers and abstract carrier routing protocols</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/90 transition-all shadow-lg hover:shadow-black/10">
            <Plus className="w-3.5 h-3.5" />
            <span>Provision Number</span>
          </button>
        </div>

        {/* Dynamic Provider Selection Grid */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Integrated Providers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p, i) => (
              <div 
                key={i} 
                className={`p-6 border rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between ${
                  p.active 
                    ? 'border-neutral-900 bg-white shadow-md' 
                    : 'border-neutral-100 bg-neutral-50/50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                      p.active ? 'bg-neutral-950 text-white shadow-lg' : 'bg-neutral-200 text-neutral-500'
                    }`}>
                      {p.logo}
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      p.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-neutral-200 text-neutral-500'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-neutral-900 mb-1.5">{p.name}</h4>
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-6">{p.desc}</p>
                </div>

                {p.active ? (
                  <button className="w-full py-2.5 bg-neutral-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-900 transition-all flex items-center justify-center gap-2">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Manage Carrier</span>
                  </button>
                ) : (
                  <div className="w-full py-2 bg-neutral-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-neutral-400 text-center select-none">
                    Abstraction Unlocked soon
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Numbers Table */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Attached Phone Numbers</h3>

          <div className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Phone Number</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Label / Name</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Provider</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Billing Rates</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Region</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {activeNumbers.map((num, i) => (
                  <tr key={i} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-xs font-bold text-neutral-900">{num.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500 font-semibold">{num.label}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase bg-neutral-900 text-white px-2 py-0.5 rounded">Twilio</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-neutral-900">{num.rate}</td>
                    <td className="px-6 py-4 text-xs text-neutral-400 font-medium">{num.region}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                        num.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {num.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Telecom Latency Warnings */}
        <div className="p-6 border border-neutral-100 rounded-[2rem] bg-neutral-50/50 flex gap-4 items-center">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-0.5">Telemetry Auto-Routing</h4>
            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
              VANI Gateway manages binary speech packets at $\leq$ 32kbps to prevent buffering jitter. If local ISP latencies climb over 120ms, the system automatically redirects packets over redundant backup trunks to keep the call responsive.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TabTelephony;
