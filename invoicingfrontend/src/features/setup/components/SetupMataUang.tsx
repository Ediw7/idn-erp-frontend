import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { setupApi, MataUangData } from '../api';

const SetupMataUang: React.FC = () => {
  const [mataUangList, setMataUangList] = useState<MataUangData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<MataUangData>({ kode: '', nama: '', per: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await setupApi.getMataUang();
      setMataUangList(data || []);
    } catch (error) {
      setMessage({ text: 'Gagal memuat data mata uang dari server.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId('new');
    setEditForm({ kode: '', nama: '', per: '' });
  };

  const handleEdit = (item: MataUangData) => {
    setEditingId(item.id!);
    setEditForm({ ...item });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ kode: '', nama: '', per: '' });
  };

  const handleSave = async () => {
    if (!editForm.kode || !editForm.nama) {
      setMessage({ text: 'Kode dan Mata Uang harus diisi!', type: 'error' });
      return;
    }

    try {
      await setupApi.saveMataUang(editForm);
      setMessage({ text: 'Data mata uang berhasil disimpan!', type: 'success' });
      setEditingId(null);
      fetchData();
      
      // Auto-hide message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan saat menyimpan data.', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus mata uang ini?')) return;
    
    try {
      await setupApi.deleteMataUang(id);
      setMessage({ text: 'Data mata uang berhasil dihapus!', type: 'success' });
      fetchData();
      
      // Auto-hide message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan saat menghapus data.', type: 'error' });
    }
  };

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 max-w-4xl mx-auto mt-8">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Mata Uang</h2>
          <p className="text-xs text-slate-300 mt-1">Konfigurasi jenis mata uang yang digunakan dalam sistem.</p>
        </div>
        <button 
          onClick={handleAddNew}
          disabled={editingId !== null}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <th className="px-4 py-3 w-32">Kode</th>
                  <th className="px-4 py-3">Mata Uang</th>
                  <th className="px-4 py-3 w-32">Per</th>
                  <th className="px-4 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {editingId === 'new' && (
                  <tr className="bg-blue-50/50">
                    <td className="px-4 py-3 text-center text-slate-400">*</td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={editForm.kode} 
                        onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} 
                        className={inputClass}
                        placeholder="IDR"
                        autoFocus
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={editForm.nama} 
                        onChange={e => setEditForm({...editForm, nama: e.target.value})} 
                        className={inputClass}
                        placeholder="Indonesia Rupiah"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={editForm.per} 
                        onChange={e => setEditForm({...editForm, per: e.target.value.toUpperCase()})} 
                        className={inputClass}
                        placeholder="1 RP"
                      />
                    </td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="Simpan"><Save size={16} /></button>
                      <button onClick={handleCancel} className="p-1 text-slate-500 hover:bg-slate-200 rounded" title="Batal"><X size={16} /></button>
                    </td>
                  </tr>
                )}

                {mataUangList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {editingId === item.id ? (
                      // Edit Mode
                      <>
                        <td className="px-4 py-3 text-center">{index + 1}</td>
                        <td className="px-4 py-2">
                          <input type="text" value={editForm.kode} onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} className={inputClass} />
                        </td>
                        <td className="px-4 py-2">
                          <input type="text" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className={inputClass} />
                        </td>
                        <td className="px-4 py-2">
                          <input type="text" value={editForm.per} onChange={e => setEditForm({...editForm, per: e.target.value.toUpperCase()})} className={inputClass} />
                        </td>
                        <td className="px-4 py-2 flex justify-center gap-2">
                          <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="Simpan"><Save size={16} /></button>
                          <button onClick={handleCancel} className="p-1 text-slate-500 hover:bg-slate-200 rounded" title="Batal"><X size={16} /></button>
                        </td>
                      </>
                    ) : (
                      // View Mode
                      <>
                        <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{item.kode}</td>
                        <td className="px-4 py-3">{item.nama}</td>
                        <td className="px-4 py-3">{item.per}</td>
                        <td className="px-4 py-3 flex justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(item.id!)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Hapus">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                
                {mataUangList.length === 0 && editingId !== 'new' && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                      Belum ada data mata uang. Klik "Tambah Baru" untuk memulai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupMataUang;
