import React, { useState, useEffect } from 'react';
import { Search, Filter, PhoneCall, Box, Users } from 'lucide-react';
import AdminTable from './AdminTable';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001';

interface TabAdminGeneralProps {
  type: 'entities' | 'calls' | 'leads';
  title: string;
}

const TabAdminGeneral: React.FC<TabAdminGeneralProps> = ({ type, title }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const endpoint = `/admin/${type}`;
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(`Failed to fetch ${type}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  const headers = {
    entities: ['Agent Name', 'Voice Model', 'Owner (User ID)', 'System Instructions'],
    calls: ['Phone', 'Agent', 'Intent', 'Summary', 'Time'],
    leads: ['Name', 'Phone', 'Interest', 'Status', 'Captured']
  };

  const icons = {
    entities: Box,
    calls: PhoneCall,
    leads: Users
  };

  const Icon = icons[type];

  return (
    <div className="p-8 h-full bg-[#fafafa] overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-1 text-black">{title}</h2>
          <p className="text-xs text-secondary italic">System-wide directory of all {type} registered on the platform.</p>
        </div>
        <Icon className="w-8 h-8 text-emerald-100" />
      </div>

      <AdminTable 
        title={`All ${type}`}
        headers={headers[type]}
        data={data}
        loading={loading}
        renderRow={(item, idx) => {
          if (type === 'entities') {
            return (
              <tr key={item._id || idx}>
                <td className="px-6 py-4 text-sm font-semibold">{item.name}</td>
                <td className="px-6 py-4 text-xs font-medium text-secondary">{item.voice_model}</td>
                <td className="px-6 py-4 text-[10px] font-mono text-secondary truncate max-w-[120px]">{item.userId}</td>
                <td className="px-6 py-4 text-[10px] text-secondary line-clamp-1 italic">{item.instructions}</td>
              </tr>
            );
          }
          if (type === 'calls') {
            return (
              <tr key={item._id || idx}>
                <td className="px-6 py-4 text-sm font-medium">{item.phone}</td>
                <td className="px-6 py-4 text-xs font-semibold">{item.entity_name || 'Agent'}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                    item.intent === 'high_interest' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-700'
                  }`}>{item.intent}</span>
                </td>
                <td className="px-6 py-4 text-xs text-secondary max-w-[200px] truncate">{item.summary}</td>
                <td className="px-6 py-4 text-[10px] text-secondary font-mono">{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            );
          }
           if (type === 'leads') {
            return (
              <tr key={item._id || idx}>
                <td className="px-6 py-4 text-sm font-semibold">{item.name || 'Anonymous'}</td>
                <td className="px-6 py-4 text-sm text-secondary">{item.phone}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 italic">
                    {item.interest}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-blue-700 font-bold uppercase tracking-widest">{item.status || 'New'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] text-secondary">{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          }
          return null;
        }}
      />
    </div>
  );
};

export default TabAdminGeneral;
