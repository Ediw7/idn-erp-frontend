import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { setupApi, GudangData } from '../api';

const SetupGudang: React.FC = () => {
  const [list, setList] = useState<GudangData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<GudangData>({
    kode_gudang: '',
    nama_gudang: '',
    lokasi: '',
    is_default: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await setupApi.getGudang();
      setList(data || []);
    } catch (error) {
      showMessage('Gagal memuat data gudang.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddNew = () => {
    setEditForm({
      kode_gudang: '',
      nama_gudang: '',
      lokasi: '',
      is_default: false
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: GudangData) => {
    setEditForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editForm.kode_gudang || !editForm.nama_gudang) {
      showMessage('Kode Gudang dan Nama Gudang harus diisi!', 'error');
      return;
    }

    try {
      await setupApi.saveGudang(editForm);
      showMessage('Data gudang berhasil disimpan!', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus gudang ini?')) return;
    
    try {
      await setupApi.deleteGudang(id);
      showMessage('Data berhasil dihapus!', 'success');
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menghapus data.', 'error');
    }
  };

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 max-w-5xl mx-auto mt-8">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Gudang</h2>
          <p className="text-xs text-slate-300 mt-1">Kelola data gudang (warehouse) penyimpanan barang.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
        >
          <Plus size={14} />
          <span>TAMBAH BARU</span>
        </button>
      </div>

      <div className="p-6">
        {message && (
          <div className={`mb-6 p-4 rounded-sm flex items-start gap-3 shadow-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold ${message.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
                  {message.type === 'success' ? 'Berhasil' : 'Peringatan'}
                </h3>
                <p className="text-sm mt-1">{message.text}</p>
              </div>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700"></div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 w-32">Kode Gudang</th>
                  <th className="px-4 py-3">Nama Gudang</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3 w-24 text-center">Default</th>
                  <th className="px-4 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {list.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.kode_gudang}</td>
                    <td className="px-4 py-3">{item.nama_gudang}</td>
                    <td className="px-4 py-3">{item.lokasi || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={item.is_default} readOnly className="w-4 h-4 text-slate-400 border-slate-300 rounded opacity-70 cursor-not-allowed" />
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id!)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {list.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                      Belum ada data gudang. Klik "Tambah Baru" untuk memulai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded shadow-xl max-w-md w-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editForm.id ? 'Edit Gudang' : 'Tambah Gudang'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Gudang</label>
                  <input 
                    type="text" 
                    value={editForm.kode_gudang} 
                    onChange={e => setEditForm({...editForm, kode_gudang: e.target.value.toUpperCase()})} 
                    className={inputClass}
                    placeholder="Contoh: KP"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Gudang</label>
                  <input 
                    type="text" 
                    value={editForm.nama_gudang} 
                    onChange={e => setEditForm({...editForm, nama_gudang: e.target.value})} 
                    className={inputClass}
                    placeholder="Contoh: Kapuk"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi</label>
                  <input 
                    type="text" 
                    value={editForm.lokasi} 
                    onChange={e => setEditForm({...editForm, lokasi: e.target.value})} 
                    className={inputClass}
                    placeholder="Contoh: Jakarta"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    checked={editForm.is_default} 
                    onChange={e => setEditForm({...editForm, is_default: e.target.checked})} 
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    id="is_default"
                  />
                  <label htmlFor="is_default" className="text-sm font-semibold text-slate-700 cursor-pointer">Set sebagai Default Gudang</label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors flex items-center gap-2"
              >
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupGudang;
