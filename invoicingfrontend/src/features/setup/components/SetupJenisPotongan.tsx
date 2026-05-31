import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { setupApi, JenisPotonganData, PerkiraanData } from '../api';

const SetupJenisPotongan: React.FC = () => {
  const [list, setList] = useState<JenisPotonganData[]>([]);
  const [perkiraans, setPerkiraans] = useState<PerkiraanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<JenisPotonganData>({
    kode: '',
    nama: '',
    perkiraan_id: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [data, perkiransData] = await Promise.all([
        setupApi.getJenisPotongan(),
        setupApi.getPerkiraan()
      ]);
      setList(data || []);
      setPerkiraans(perkiransData || []);
    } catch (error) {
      showMessage('Gagal memuat data jenis potongan.', 'error');
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
      kode: '',
      nama: '',
      perkiraan_id: null
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: JenisPotonganData) => {
    setEditForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editForm.kode || !editForm.nama) {
      showMessage('Kode dan Jenis Potongan harus diisi!', 'error');
      return;
    }

    try {
      await setupApi.saveJenisPotongan(editForm);
      showMessage('Data Jenis Potongan berhasil disimpan!', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus jenis potongan ini?')) return;
    
    try {
      await setupApi.deleteJenisPotongan(id);
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
          <h2 className="text-lg font-semibold text-white">Setup Jenis Potongan</h2>
          <p className="text-xs text-slate-300 mt-1">Daftar jenis potongan biaya yang dikenakan pada invoice.</p>
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
                  <th className="px-4 py-3 w-16 text-center">No</th>
                  <th className="px-4 py-3 w-32">Kode</th>
                  <th className="px-4 py-3">Jenis Potongan</th>
                  <th className="px-4 py-3 w-64">No Perkiraan</th>
                  <th className="px-4 py-3 w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {list.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.kode}</td>
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3 text-slate-600">{item.perkiraan_nama || '-'}</td>
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
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                      Belum ada data jenis potongan. Klik "Tambah Baru" untuk memulai.
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
                {editForm.id ? 'Edit Jenis Potongan' : 'Tambah Jenis Potongan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode</label>
                  <input 
                    type="text" 
                    value={editForm.kode} 
                    onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} 
                    className={inputClass}
                    placeholder="Contoh: ADM"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Potongan</label>
                  <input 
                    type="text" 
                    value={editForm.nama} 
                    onChange={e => setEditForm({...editForm, nama: e.target.value})} 
                    className={inputClass}
                    placeholder="Contoh: Biaya admin bank"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No Perkiraan</label>
                  <select 
                    value={editForm.perkiraan_id || ''} 
                    onChange={e => setEditForm({...editForm, perkiraan_id: e.target.value ? Number(e.target.value) : null})} 
                    className={inputClass}
                  >
                    <option value="">-- Pilih Perkiraan --</option>
                    {perkiraans.map(p => <option key={p.id} value={p.id}>{p.no_perkiraan} - {p.nama_perkiraan}</option>)}
                  </select>
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

export default SetupJenisPotongan;
