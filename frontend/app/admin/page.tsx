'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Box, 
  PhoneCall, 
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';
import AdminTable from '../../components/AdminTable';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    setAdminUser(user);

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [uRes, eRes, cRes] = await Promise.all([
          fetch(`${BACKEND_URL}/admin/users`, { headers }),
          fetch(`${BACKEND_URL}/admin/entities`, { headers }),
          fetch(`${BACKEND_URL}/admin/calls`, { headers })
        ]);

        const [uData, eData, cData] = await Promise.all([
          uRes.json(),
          eRes.json(),
          cRes.json()
        ]);

        setUsers(uData);
        setEntities(eData);
        setCalls(cData);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (!adminUser) return null;

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Global Agents', value: entities.length, icon: Box, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Calls', value: calls.length, icon: PhoneCall, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-accent rounded-full transition-colors group">
            <ArrowLeft className="w-5 h-5 text-secondary group-hover:text-primary" />
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h1 className="font-bold text-lg tracking-tight">Admin Portal</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-2 hidden sm:block">
            <p className="text-xs font-bold">{adminUser.name}</p>
            <p className="text-[10px] text-secondary uppercase tracking-widest">System Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold border border-border outline outline-2 outline-emerald-100">
            {adminUser.name.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <AdminTable 
          title="User Management"
          headers={['User', 'Email', 'Role', 'Status', 'Joined']}
          data={users}
          loading={loading}
          renderRow={(u) => (
            <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold">
                    {u.name.substring(0,2).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold">{u.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-secondary">{u.email}</td>
              <td className="px-6 py-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                  u.role === 'admin' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-emerald-700 font-medium">Active</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-secondary">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
            </tr>
          )}
        />

        {/* Entities Table */}
        <AdminTable 
          title="Global Agents"
          headers={['Agent ID', 'Name', 'Voice', 'System Instructions']}
          data={entities}
          loading={loading}
          renderRow={(e) => (
            <tr key={e._id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-xs font-mono text-secondary truncate max-w-[120px]">{e._id}</td>
              <td className="px-6 py-4 text-sm font-semibold">{e.name}</td>
              <td className="px-6 py-4">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-secondary font-medium">
                  {e.voice_model || 'Standard'}
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="text-xs text-secondary truncate max-w-[300px] italic">
                  "{e.instructions || 'No instructions provided'}"
                </p>
              </td>
            </tr>
          )}
        />

        {/* Global Calls Table */}
        <AdminTable 
          title="System-Wide Call Logs"
          headers={['Phone', 'Agent Name', 'Summary', 'Intent', 'Created At']}
          data={calls}
          loading={loading}
          renderRow={(c) => (
            <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium">{c.phone}</td>
              <td className="px-6 py-4">
                <span className="text-xs font-semibold px-2 py-1 bg-accent rounded">
                  {entities.find(e => e._id === c.entity_id)?.name || 'Unknown Agent'}
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="text-xs text-secondary truncate max-w-[250px]">{c.summary}</p>
              </td>
              <td className="px-6 py-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                   c.intent === 'high_interest' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-700'
                }`}>
                  {c.intent}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-secondary">
                {new Date(c.createdAt).toLocaleString()}
              </td>
            </tr>
          )}
        />
      </main>
    </div>
  );
}
