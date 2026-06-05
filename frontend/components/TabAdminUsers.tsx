import React, { useState, useEffect } from 'react';
import { User, Eye, Search } from 'lucide-react';
import AdminTable from './AdminTable';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001';

interface TabAdminUsersProps {
  onImpersonate: (user: any) => void;
}

const TabAdminUsers: React.FC<TabAdminUsersProps> = ({ onImpersonate }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch admin users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 h-full bg-black overflow-y-auto text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black tracking-tight mb-1 text-white font-display uppercase italic">System User Management</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-widest">Manage all agencies and individual accounts across the platform.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <AdminTable 
        title="Active Users"
        headers={['User', 'Email', 'Role', 'Agents', 'Actions']}
        data={filteredUsers}
        loading={loading}
        renderRow={(u) => (
          <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-emerald-500/20">
                  {u.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-white">{u.name}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-neutral-400">{u.email}</td>
            <td className="px-6 py-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {u.role}
              </span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm font-bold text-white">{u.entityCount || 0}</span>
                <span className="text-[10px] text-neutral-500 ml-1 uppercase tracking-tight font-semibold">Agents</span>
            </td>
            <td className="px-6 py-4 text-right">
              <button 
                onClick={() => onImpersonate(u)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-100 transition-all shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>View Workspace</span>
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default TabAdminUsers;
