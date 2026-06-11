import React, { useEffect, useState } from 'react';
import { Users, ShieldAlert, Activity } from 'lucide-react';
import { authApi } from '../../auth/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await authApi.getUsers();
        setStats({
          total: users.length,
          active: users.filter(u => u.is_active).length,
          admins: users.filter(u => u.is_admin).length
        });
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Memuat dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500">Ringkasan sistem EDI Accounting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pengguna</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pengguna Aktif</p>
            <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-full text-purple-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Administrator</p>
            <p className="text-2xl font-bold text-slate-800">{stats.admins}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm text-center">
        <h3 className="text-lg font-bold text-slate-700 mb-2">Selamat Datang di Portal Admin</h3>
        <p className="text-slate-500">Gunakan menu di sebelah kiri untuk mengelola pengguna dan sistem.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
