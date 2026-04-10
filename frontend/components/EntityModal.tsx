import React from 'react';
import { X } from 'lucide-react';

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EntityModal: React.FC<EntityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md border border-border rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Create New Entity</h2>
            <p className="text-xs text-secondary">Set up a new AI voice agent</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-md text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold">Entity Name</label>
            <input type="text" placeholder="e.g. Sales Representative" className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold">Use-case</label>
            <select className="w-full">
              <option>Admission Counseling</option>
              <option>Customer Support</option>
              <option>Outbound Sales</option>
              <option>Survey Collector</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold">Base Voice Model</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 px-4 border border-border rounded-xl text-xs font-medium hover:border-black transition-all">Google Standard</button>
              <button className="py-3 px-4 border border-border rounded-xl text-xs font-medium hover:border-black transition-all">ElevenLabs</button>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-md text-xs font-semibold hover:bg-accent transition-all"
            >
              Cancel
            </button>
            <button className="flex-1 py-3 bg-black text-white rounded-md text-sm font-semibold hover:bg-black/90 transition-all">
              Create Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityModal;
