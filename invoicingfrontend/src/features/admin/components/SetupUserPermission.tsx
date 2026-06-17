import React, { useEffect, useState } from 'react';
import { Save, Shield, CheckSquare, Copy, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi, UserData } from '../../auth/api';

interface PermissionData {
  id: string;
  type: string;
  task: string;
  open: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
}

const SetupUserPermission: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [objectType, setObjectType] = useState('Form');
  
  const initialPermissions: PermissionData[] = [
    // Forms
    { id: '1', type: 'Form', task: 'Setup Preferensi', open: false, insert: false, update: false, delete: false },
    { id: '2', type: 'Form', task: 'Setup Perusahaan', open: false, insert: false, update: false, delete: false },
    { id: '3', type: 'Form', task: 'Setup Mata Uang', open: false, insert: false, update: false, delete: false },
    { id: '4', type: 'Form', task: 'Setup Kurs Pajak', open: false, insert: false, update: false, delete: false },
    { id: '5', type: 'Form', task: 'Setup Tanda Tangan', open: false, insert: false, update: false, delete: false },
    { id: '6', type: 'Form', task: 'Setup Perkiraan', open: false, insert: false, update: false, delete: false },
    { id: '7', type: 'Form', task: 'Setup Gudang', open: false, insert: false, update: false, delete: false },
    { id: '8', type: 'Form', task: 'Setup Group Barang', open: false, insert: false, update: false, delete: false },
    { id: '9', type: 'Form', task: 'Setup Item', open: false, insert: false, update: false, delete: false },
    { id: '10', type: 'Form', task: 'Setup Cara Pembayaran', open: false, insert: false, update: false, delete: false },
    { id: '11', type: 'Form', task: 'Setup Salesman', open: false, insert: false, update: false, delete: false },
    { id: '12', type: 'Form', task: 'Setup Proyek', open: false, insert: false, update: false, delete: false },
    { id: '13', type: 'Form', task: 'Setup Pelanggan', open: false, insert: false, update: false, delete: false },
    { id: '14', type: 'Form', task: 'Setup Supplier', open: false, insert: false, update: false, delete: false },
    { id: '15', type: 'Form', task: 'Setup Jenis Potongan', open: false, insert: false, update: false, delete: false },
    
    // Reports
    { id: '16', type: 'Report', task: 'Laporan Penjualan', open: false, insert: false, update: false, delete: false },
    { id: '17', type: 'Report', task: 'Laporan Piutang', open: false, insert: false, update: false, delete: false },
    { id: '18', type: 'Report', task: 'Laporan Kartu Stok', open: false, insert: false, update: false, delete: false },
    { id: '19', type: 'Report', task: 'Laporan PPN Keluaran', open: false, insert: false, update: false, delete: false },
    { id: '20', type: 'Report', task: 'Daftar Harga Barang', open: false, insert: false, update: false, delete: false },

    // Processes
    { id: '21', type: 'Process', task: 'Proses Tutup Tahun', open: false, insert: false, update: false, delete: false },
    { id: '22', type: 'Process', task: 'Proses HPP', open: false, insert: false, update: false, delete: false },
    { id: '23', type: 'Process', task: 'Backup Database', open: false, insert: false, update: false, delete: false },
    { id: '24', type: 'Process', task: 'Restore Database', open: false, insert: false, update: false, delete: false },
  ];

  const [permissions, setPermissions] = useState<PermissionData[]>(initialPermissions);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await authApi.getUsers();
      setUsers(data);
      if (data.length > 0) {
        setSelectedUser(data[0].id);
      }
    } catch (err) {
      toast.error('Gagal memuat daftar pengguna');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUser(userId);
    // Reset state permission untuk me-load ulang data sesuai user yang diklik
    // Di aplikasi nyata, Anda akan melakukan fetch perizinan dari backend di sini.
    setPermissions(initialPermissions);
  };

  const selectedUserData = users.find(u => u.id === selectedUser);
  const isAdminSelected = selectedUserData?.is_admin === true;

  const handleCheckboxChange = (id: string, field: keyof PermissionData, isChecked: boolean) => {
    if (isAdminSelected) return;
    setPermissions(permissions.map(p => {
      if (p.id === id) {
        return { ...p, [field]: isChecked };
      }
      return p;
    }));
  };

  const handleGrantFullAccess = () => {
    if (isAdminSelected) return;
    // Berikan akses penuh untuk SEMUA tipe objek (Form, Report, Process)
    setPermissions(permissions.map(p => ({
      ...p,
      open: true,
      insert: true,
      update: true,
      delete: true
    })));
    toast.success('Akses penuh diberikan ke seluruh sistem! (Tekan Simpan untuk memperbarui database)');
  };

  const handleSimpan = async () => {
    if (isAdminSelected) {
      toast.error('Admin tidak perlu menyimpan perizinan granular.');
      return;
    }
    console.log('--- MENYIMPAN PERMISSIONS ---');
    console.log('User ID Terpilih:', selectedUser);
    console.log('Payload Permissions:', permissions);
    // TODO: Implementasi integrasi API yang sebenarnya:
    // await axiosClient.post('/api/permissions', { userId: selectedUser, permissions });
    
    toast.success('Hak akses pengguna berhasil disimpan!');
  };

  const filteredPermissions = permissions.filter(p => p.type === objectType);

  return (
    <div className="flex flex-col w-full h-full bg-white font-sans text-slate-800">
      
      {/* Header Banner & Action Toolbar (Full Width) */}
      <div className="bg-slate-900 w-full rounded-none p-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">

            Setup User Permission
          </h1>
          <p className="text-sm text-slate-300 mt-1">Atur hak akses tiap pengguna secara detail</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            disabled={isAdminSelected}
            className="flex items-center gap-2 px-4 py-2 border border-slate-400 text-slate-300 hover:text-white hover:border-white hover:bg-slate-800 text-sm font-semibold rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy size={16} /> Copy Permission
          </button>
          <button 
            onClick={handleGrantFullAccess}
            disabled={isAdminSelected}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-sm transition-colors shadow-sm disabled:opacity-50 disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            <CheckSquare size={16} /> Grant Full Access
          </button>
          <button 
            onClick={handleSimpan}
            disabled={isAdminSelected}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-sm transition-colors shadow-sm disabled:opacity-50 disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            <Save size={16} /> Simpan
          </button>
        </div>
      </div>

      {/* Layout Split-Pane Modern */}
      <div className="flex flex-row w-full flex-1 overflow-hidden">
        
        {/* Kolom Kiri: Daftar User */}
        <div className="w-1/4 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="bg-white px-5 py-3 border-b border-gray-200 text-sm font-bold text-gray-800 uppercase tracking-wide">
            User Name
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingUsers ? (
              <div className="p-4 text-sm text-gray-500 italic">Memuat data user...</div>
            ) : users.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 italic">Belum ada user.</div>
            ) : (
              users.map(u => (
                <div 
                  key={u.id}
                  onClick={() => handleUserSelection(u.id)}
                  className={`px-5 py-3 text-sm cursor-pointer border-b border-gray-100 transition-colors flex justify-between items-center ${
                    selectedUser === u.id 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-l-blue-600 font-semibold' 
                      : 'text-gray-700 border-l-4 border-l-transparent hover:bg-gray-100'
                  }`}
                >
                  <span>{u.login || u.name}</span>
                  {u.is_admin && <Shield size={14} className={selectedUser === u.id ? 'text-blue-600' : 'text-gray-400'} />}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kolom Kanan: Tabel Hak Akses */}
        <div className="w-3/4 p-6 overflow-y-auto bg-white">
          {isAdminSelected && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-5 py-4 rounded-sm mb-6 flex items-start gap-3 shadow-sm">
              <Info className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
              <div className="text-sm">
                <strong className="block text-base mb-1">Akses Administrator Aktif</strong>
                <p>Pengguna ini adalah Administrator dan otomatis memiliki akses penuh ke seluruh fitur dan pengaturan sistem. Konfigurasi hak akses granular (seperti form, laporan, dan proses) tidak diperlukan dan telah dinonaktifkan.</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <label className="text-sm font-bold text-gray-700">Object Type:</label>
            <select 
              value={objectType}
              onChange={(e) => setObjectType(e.target.value)}
              disabled={isAdminSelected}
              className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <option value="Form">Form</option>
              <option value="Report">Report</option>
              <option value="Process">Process</option>
            </select>
          </div>

          <div className={`border border-gray-200 rounded-sm overflow-hidden shadow-sm ${isAdminSelected ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 border-r border-gray-200 w-12 text-center">No</th>
                  <th className="px-5 py-3 border-r border-gray-200">Task</th>
                  <th className="px-5 py-3 border-r border-gray-200 text-center w-24">Open</th>
                  <th className="px-5 py-3 border-r border-gray-200 text-center w-24">Insert</th>
                  <th className="px-5 py-3 border-r border-gray-200 text-center w-24">Update</th>
                  <th className="px-5 py-3 text-center w-24">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredPermissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500 italic">
                      Tidak ada task untuk object type ini.
                    </td>
                  </tr>
                ) : (
                  filteredPermissions.map((p, idx) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                      <td className="px-5 py-2.5 border-r border-gray-100 bg-gray-50 text-center text-xs text-gray-500">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-2.5 border-r border-gray-100 text-gray-800 font-medium">
                        {p.task}
                      </td>
                      <td className="px-5 py-2.5 border-r border-gray-100 text-center">
                        <input 
                          type="checkbox" 
                          checked={isAdminSelected ? true : p.open} 
                          onChange={(e) => handleCheckboxChange(p.id, 'open', e.target.checked)}
                          disabled={isAdminSelected}
                          className="w-4 h-4 cursor-pointer text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200"
                        />
                      </td>
                      <td className="px-5 py-2.5 border-r border-gray-100 text-center">
                        <input 
                          type="checkbox" 
                          checked={isAdminSelected ? true : p.insert} 
                          onChange={(e) => handleCheckboxChange(p.id, 'insert', e.target.checked)}
                          disabled={isAdminSelected}
                          className="w-4 h-4 cursor-pointer text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200"
                        />
                      </td>
                      <td className="px-5 py-2.5 border-r border-gray-100 text-center">
                        <input 
                          type="checkbox" 
                          checked={isAdminSelected ? true : p.update} 
                          onChange={(e) => handleCheckboxChange(p.id, 'update', e.target.checked)}
                          disabled={isAdminSelected}
                          className="w-4 h-4 cursor-pointer text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200"
                        />
                      </td>
                      <td className="px-5 py-2.5 text-center">
                        <input 
                          type="checkbox" 
                          checked={isAdminSelected ? true : p.delete} 
                          onChange={(e) => handleCheckboxChange(p.id, 'delete', e.target.checked)}
                          disabled={isAdminSelected}
                          className="w-4 h-4 cursor-pointer text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupUserPermission;
