import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import axiosClient from '../../../lib/axiosClient';

const GantiPassword: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    username: '', 
    oldPassword: '',
    newPassword: '',
    verifyPassword: ''
  });

  // Sync username with actual logged in user
  useEffect(() => {
    if (user) {
      setPasswordForm(prev => ({ ...prev, username: user.email || user.name || '' }));
    }
  }, [user]);

  const handleSimpan = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.verifyPassword) {
      toast.error('Mohon isi semua field password.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.verifyPassword) {
      toast.error('Password baru dan verifikasi tidak cocok.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Memproses perubahan password...');

    try {
      // Hit actual DB endpoint via Axios Client
      const response = await axiosClient.post('/api/auth/change-password', {
        old_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword
      });

      if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }

      toast.success('Password berhasil diubah!', { id: toastId });
      
      // Reset form
      setPasswordForm(prev => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        verifyPassword: ''
      }));

    } catch (error: any) {
      console.error('Password Change Error:', error);
      toast.error(error.response?.data?.error || error.message || 'Gagal mengubah password.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatal = () => {
    setPasswordForm(prev => ({
      ...prev,
      oldPassword: '',
      newPassword: '',
      verifyPassword: ''
    }));
  };

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white";

  return (
    <div className="w-full h-full rounded-none flex flex-col bg-slate-100 border border-slate-300">
      {/* Header Banner Gelap dengan Action Buttons */}
      <div className="bg-slate-900 w-full rounded-none p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Ganti Password</h1>
          <p className="text-sm text-slate-300 mt-1">Ubah kata sandi untuk akun Anda saat ini</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBatal}
            disabled={isLoading}
            className="px-5 py-2 bg-transparent border border-slate-600 rounded-sm text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            onClick={handleSimpan}
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 border border-blue-700 rounded-sm text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Lock size={16} />}
            Simpan Password
          </button>
        </div>
      </div>

      {/* Content Area (Putih Bersih) */}
      <div className="bg-white w-full h-[calc(100vh-100px)] overflow-y-auto p-6 space-y-4">
        
        <div className="grid grid-cols-12 gap-4 items-center">
          <label className="col-span-3 text-sm font-medium text-gray-700">User Name</label>
          <div className="col-span-9">
            <input 
              type="text" 
              value={passwordForm.username} 
              readOnly 
              className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed w-full md:w-1/2 lg:w-1/3 font-semibold`}
            />
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 my-2"></div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <label className="col-span-3 text-sm font-medium text-gray-700">Old Password</label>
          <div className="col-span-9">
            <input 
              type="password" 
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
              disabled={isLoading}
              className={`${inputClass} w-full md:w-1/2 lg:w-1/3`}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <label className="col-span-3 text-sm font-medium text-gray-700">New Password</label>
          <div className="col-span-9">
            <input 
              type="password" 
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              disabled={isLoading}
              className={`${inputClass} w-full md:w-1/2 lg:w-1/3`}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <label className="col-span-3 text-sm font-medium text-gray-700">Verify</label>
          <div className="col-span-9">
            <input 
              type="password" 
              value={passwordForm.verifyPassword}
              onChange={(e) => setPasswordForm({...passwordForm, verifyPassword: e.target.value})}
              disabled={isLoading}
              className={`${inputClass} w-full md:w-1/2 lg:w-1/3`}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default GantiPassword;
