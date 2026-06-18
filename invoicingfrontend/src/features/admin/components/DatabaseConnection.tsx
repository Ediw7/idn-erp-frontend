import React, { useEffect, useState } from 'react';
import { Database, Save, Activity, Edit3, ShieldAlert, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosClient from '../../../lib/axiosClient';
import { useConfirm } from '../../../contexts/ConfirmContext';

const DatabaseConnection: React.FC = () => {
  const confirm = useConfirm();
  const [isEditing, setIsEditing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error' | 'idle'>('idle');
  
  const [config, setConfig] = useState({
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(true);

  // 1. Fetch Current Config
  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const fetchCurrentConfig = async () => {
    try {
      setLoading(true);
      // Simulasi Fetch API GET /api/settings/database
      // const response = await axiosClient.get('/api/settings/database');
      // setConfig(response.data.data);
      
      // Fallback Data untuk Simulasi
      setTimeout(() => {
        setConfig({
          host: '127.0.0.1',
          port: '5432',
          database: 'idn_erp_production',
          username: 'postgres',
          password: 'supersecretpassword123'
        });
        setDbStatus('connected');
        setLoading(false);
      }, 800);
    } catch (err) {
      toast.error('Gagal memuat konfigurasi database dari server.');
      setLoading(false);
    }
  };

  // 2. Test Connection
  const handleTestConnection = async () => {
    setDbStatus('checking');
    try {
      // Simulasi tembak API POST /api/settings/test-db
      // await axiosClient.post('/api/settings/test-db', config);
      
      setTimeout(() => {
        setDbStatus('connected');
        toast.success('Koneksi ke PostgreSQL berhasil!');
      }, 1500);
    } catch (err) {
      setDbStatus('error');
      toast.error('Gagal terhubung ke database. Periksa kredensial Anda.');
    }
  };

  // 3. Save Configuration
  const handleSave = async () => {
    const isConfirmed = await confirm("Peringatan Keamanan: Menyimpan konfigurasi baru akan merestart koneksi server backend Anda secara otomatis. Lanjutkan?");
    
    if (!isConfirmed) return;

    try {
      // Simulasi API POST /api/settings/database
      // await axiosClient.post('/api/settings/database', config);
      
      toast.success('Konfigurasi berhasil disimpan! Server sedang direstart...');
      setIsEditing(false);
      handleTestConnection();
    } catch (err) {
      toast.error('Gagal menyimpan konfigurasi.');
    }
  };

  const inputClass = isEditing 
    ? "w-full px-3 py-2 border border-blue-400 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-800" 
    : "w-full px-3 py-2 border border-gray-200 rounded-sm text-sm bg-gray-50 text-gray-500 cursor-not-allowed select-none";

  return (
    <div className="flex flex-col w-full h-full bg-white font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-slate-900 w-full rounded-none p-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
            Database Connection
          </h1>
          <p className="text-sm text-slate-300 mt-1">Konfigurasi aman koneksi ke PostgreSQL server</p>
        </div>
      </div>

      <div className="p-8 flex-1 overflow-auto bg-gray-50">
        <div className="max-w-2xl bg-white border border-gray-200 shadow-sm rounded-sm p-8">
          
          {/* Panel Status Koneksi */}
          <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Status Server</p>
                <div>
                  {dbStatus === 'checking' && (
                    <span className="text-sm font-bold text-yellow-600">
                      Sedang memeriksa koneksi...
                    </span>
                  )}
                  {dbStatus === 'connected' && (
                    <span className="text-sm font-bold text-green-600">
                      Terhubung ke Database
                    </span>
                  )}
                  {dbStatus === 'error' && (
                    <span className="text-sm font-bold text-red-600">
                      Gagal Terhubung
                    </span>
                  )}
                  {dbStatus === 'idle' && (
                    <span className="text-sm font-bold text-gray-600">Menunggu pengecekan...</span>
                  )}
                </div>
              </div>
            </div>
            
            {!isEditing && (
              <div className="text-xs font-semibold px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-sm">
                Read-Only Mode (Safe)
              </div>
            )}
            {isEditing && (
              <div className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-sm animate-pulse">
                Edit Mode (Danger)
              </div>
            )}
          </div>

          {/* Form Konfigurasi */}
          {loading ? (
            <div className="py-12 flex justify-center text-gray-400">Memuat konfigurasi rahasia...</div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Host / IP Server</label>
                  <input 
                    type="text" 
                    value={config.host}
                    onChange={e => setConfig({...config, host: e.target.value})}
                    readOnly={!isEditing}
                    className={inputClass}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Port</label>
                  <input 
                    type="text" 
                    value={config.port}
                    onChange={e => setConfig({...config, port: e.target.value})}
                    readOnly={!isEditing}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Database Name</label>
                <input 
                  type="text" 
                  value={config.database}
                  onChange={e => setConfig({...config, database: e.target.value})}
                  readOnly={!isEditing}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">PostgreSQL Username</label>
                <input 
                  type="text" 
                  value={config.username}
                  onChange={e => setConfig({...config, username: e.target.value})}
                  readOnly={!isEditing}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Master Password</label>
                <input 
                  type="password" 
                  value={config.password}
                  onChange={e => setConfig({...config, password: e.target.value})}
                  readOnly={!isEditing}
                  className={inputClass}
                  placeholder="••••••••••••"
                />
                {!isEditing && (
                  <p className="text-[11px] text-gray-400 mt-1 italic">Password disensor untuk alasan keamanan arsitektur.</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons Toolbar */}
          <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-end gap-3">
            {!isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-sm transition-colors shadow-sm"
                >
                  <Edit3 size={16} /> Edit Konfigurasi
                </button>
                <button 
                  onClick={handleTestConnection}
                  disabled={dbStatus === 'checking'}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-wait"
                >
                  {dbStatus === 'checking' ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />} 
                  Test Connection
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-sm transition-colors shadow-sm"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-sm transition-colors shadow-sm"
                >
                  <Save size={16} /> Simpan & Restart Server
                </button>
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnection;
