import React from 'react';
import { Phone, Clock, FileText, ChevronRight, Activity } from 'lucide-react';

interface TabCallsProps {
  transcripts: any[];
  callStatus: string;
  onCall: (number: string) => void;
}

const TabCalls: React.FC<TabCallsProps> = ({ transcripts, callStatus, onCall }) => {
  const [selectedCall, setSelectedCall] = React.useState<number | null>(0);
  const [phoneNumber, setPhoneNumber] = React.useState('+916306987592');

  const calls = [
    { id: 0, number: phoneNumber, time: 'Just now', duration: '--:--', status: callStatus === 'connected' ? 'Active' : 'Ended' },
    { id: 1, number: '+1 339 201 6440', time: '2 hours ago', duration: '5:24', status: 'Completed' },
    { id: 2, number: '+91 99887 76655', time: 'Yesterday', duration: '3:12', status: 'Completed' },
    { id: 3, number: '+44 20 7946 0958', time: '2 days ago', duration: '1:45', status: 'Completed' },
  ];

  return (
    <div className="flex h-full divide-x divide-border">
      {/* Left Panel: Call List */}
      <div className="w-1/3 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Call History</h2>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter number..."
              className="flex-1 px-3 py-2 bg-accent/30 border border-border rounded-md text-xs font-medium focus:outline-none focus:border-black transition-colors"
            />
            <button 
              onClick={() => onCall(phoneNumber)}
              disabled={callStatus === 'calling' || callStatus === 'connected'}
              className={`flex items-center gap-2 py-2 px-4 rounded-md text-xs font-semibold whitespace-nowrap
                ${callStatus === 'idle' || callStatus === 'error' ? 'bg-black text-white hover:bg-black/90' : 'bg-accent text-secondary'}
              `}
            >
              <Phone className="w-3 h-3" />
              <span>{callStatus === 'connected' ? 'Connected' : callStatus === 'calling' ? 'Calling...' : 'Call'}</span>
            </button>
          </div>
          {callStatus === 'idle' && transcripts.length > 0 && (
            <div className="px-3 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded border border-rose-100 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Call Ended
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {calls.map((call) => (
            <div 
              key={call.id}
              onClick={() => setSelectedCall(call.id)}
              className={`p-6 border-b border-border cursor-pointer transition-colors ${
                selectedCall === call.id ? 'bg-accent/50' : 'hover:bg-accent/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold tracking-tight">{call.number}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    call.status === 'Active' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-secondary bg-accent border-border'
                }`}>
                    {call.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-secondary font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {call.time}
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {call.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Call Details */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {!transcripts.length && selectedCall !== 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-secondary">
             <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-6">
                <FileText className="w-8 h-8" />
             </div>
             <p className="text-sm">Select a call to view transcripts and analysis</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Transcript Stream */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#fdfdfd] scrollbar-hide">
                <div className="max-w-2xl mx-auto space-y-8">
                    {transcripts.length === 0 ? (
                        <div className="py-24 flex flex-col items-center justify-center">
                             <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center mb-6 animate-pulse">
                                <Activity className="w-8 h-8 text-secondary" />
                             </div>
                             <h3 className="text-xl font-bold tracking-tight mb-2">Awaiting Connection</h3>
                             <p className="text-sm text-secondary">Initiate a call or wait for incoming stream data.</p>
                        </div>
                    ) : (
                        transcripts.map((t, idx) => (
                            <div key={idx} className={`flex flex-col ${t.speaker === 'user' ? 'items-start' : 'items-end'} space-y-2`}>
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-50">
                                        {t.speaker === 'user' ? 'Caller' : 'Assistant'}
                                    </span>
                                    <div className={`w-1 h-1 rounded-full ${t.speaker === 'user' ? 'bg-secondary' : 'bg-black'}`} />
                                </div>
                                <div className={`max-w-[85%] p-5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm transition-all hover:shadow-md ${
                                  t.speaker === 'user' 
                                    ? 'bg-white border border-border text-primary rounded-tl-none' 
                                    : 'bg-black text-white rounded-tr-none'
                                }`}>
                                    {t.text}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Analysis Drawer */}
            <div className="h-40 border-t border-border bg-white px-10 flex items-center">
               <div className="max-w-5xl mx-auto w-full grid grid-cols-4 gap-12">
                  <div className="space-y-3 col-span-2">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">AI Summary</h4>
                     <p className="text-xs font-medium text-secondary leading-relaxed line-clamp-3 italic">
                        {transcripts.length > 5 
                          ? '"The caller is interested in MBA Finance but has concerns about the eligibility for a non-commerce background. AI successfully addressed the concern and marked as Warm lead."'
                          : 'Summary will be generated once the conversation reaches minimum depth.'}
                     </p>
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Lead Context</h4>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500" />
                           <span className="text-[11px] font-bold">Interested in MBA</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-amber-500" />
                           <span className="text-[11px] font-bold">Eligibility Pending</span>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Sentiment</h4>
                     <div className="px-3 py-1.5 bg-accent/50 rounded-xl border border-border w-fit text-[10px] font-bold uppercase tracking-widest">
                        Neutral / Inquisitive
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabCalls;
