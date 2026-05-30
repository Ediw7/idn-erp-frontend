import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { setupApi, JenisSetoranData, JenisPajakData } from '../api';

const SetupJenisSetoran: React.FC = () => {
  const [list, setList] = useState<JenisSetoranData[]>([]);
  const [pajaks, setPajaks] = useState<JenisPajakData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<JenisSetoranData>({
    jenis_pajak_id: null,
    kode: '',
    nama: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [data, pajaksData] = await Promise.all([
        setupApi.getJenisSetoran(),
        setupApi.getJenisPajak()
      ]);
      setList(data || []);
      setPajaks(pajaksData || []);
    } catch (error) {
      showMessage('Gagal memuat data jenis setoran.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddNew = () => {
    setEditingId('new');
    setEditForm({
      jenis_pajak_id: null,
      kode: '',
      nama: ''
    });
  };

  const handleEdit = (item: JenisSetoranData) => {
    setEditingId(item.id!);
    setEditForm({ ...item });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!editForm.jenis_pajak_id || !editForm.kode || !editForm.nama) {
      showMessage('MAP, Kode, dan Jenis Setoran harus diisi!', 'error');
      return;
    }

    try {
      await setupApi.saveJenisSetoran(editForm);
      showMessage('Data Jenis Setoran berhasil disimpan!', 'success');
      setEditingId(null);
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kode setoran ini?')) return;
    
    try {
      await setupApi.deleteJenisSetoran(id);
      showMessage('Data berhasil dihapus!', 'success');
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menghapus data.', 'error');
    }
  };

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm transition-colors";

  // Derive selected pajak name for display in edit row
  const selectedPajakName = pajaks.find(p => p.id === editForm.jenis_pajak_id)?.nama || '';

  return (
    <div className="bg-white shadow-sm border border-slate-300 max-w-6xl mx-auto mt-8 flex flex-col max-h-[85vh]">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Kode Jenis Setoran</h2>
          <p className="text-xs text-slate-300 mt-1">Daftar kode jenis setoran (KJS) yang terhubung dengan MAP (Kode Jenis Pajak).</p>
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

      <div className="p-6 flex-1 overflow-hidden flex flex-col">
        {message && (
          <div className={`mb-6 p-4 rounded-sm flex items-start gap-3 shadow-sm border shrink-0 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
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
          <div className="overflow-y-auto border border-slate-200 flex-1 relative">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100 shadow-sm z-10">
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <th className="px-4 py-3 w-16 text-center">No</th>
                  <th className="px-4 py-3 w-40">MAP (Kode Pajak)</th>
                  <th className="px-4 py-3 w-56">Jenis Pajak</th>
                  <th className="px-4 py-3 w-28">Kode Setoran</th>
                  <th className="px-4 py-3">Jenis Setoran</th>
                  <th className="px-4 py-3 w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {editingId === 'new' && (
                  <tr className="bg-blue-50/50">
                    <td className="px-4 py-3 text-center text-slate-400">*</td>
                    <td className="px-4 py-2">
                      <select 
                        value={editForm.jenis_pajak_id || ''} 
                        onChange={e => setEditForm({...editForm, jenis_pajak_id: e.target.value ? Number(e.target.value) : null})} 
                        className={inputClass}
                      >
                        <option value="">-- Pilih MAP --</option>
                        {pajaks.map(p => <option key={p.id} value={p.id}>{p.kode}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-slate-500 bg-slate-50/50">
                      {selectedPajakName || '-'}
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={editForm.kode} 
                        onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} 
                        className={inputClass}
                        placeholder="Contoh: 100"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={editForm.nama} 
                        onChange={e => setEditForm({...editForm, nama: e.target.value})} 
                        className={inputClass}
                        placeholder="Contoh: PPh Minyak Bumi"
                      />
                    </td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="Simpan"><Save size={16} /></button>
                      <button onClick={handleCancel} className="p-1 text-slate-500 hover:bg-slate-200 rounded" title="Batal"><X size={16} /></button>
                    </td>
                  </tr>
                )}

                {list.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {editingId === item.id ? (
                      // Edit Mode
                      <>
                        <td className="px-4 py-3 text-center">{index + 1}</td>
                        <td className="px-4 py-2">
                          <select 
                            value={editForm.jenis_pajak_id || ''} 
                            onChange={e => setEditForm({...editForm, jenis_pajak_id: e.target.value ? Number(e.target.value) : null})} 
                            className={inputClass}
                          >
                            <option value="">-- Pilih MAP --</option>
                            {pajaks.map(p => <option key={p.id} value={p.id}>{p.kode}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-2 text-slate-500 bg-slate-50">
                          {selectedPajakName}
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={editForm.kode} 
                            onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} 
                            className={inputClass} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={editForm.nama} 
                            onChange={e => setEditForm({...editForm, nama: e.target.value})} 
                            className={inputClass} 
                          />
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
                        <td className="px-4 py-3 font-semibold">{item.jenis_pajak_kode}</td>
                        <td className="px-4 py-3 text-slate-600">{item.jenis_pajak_nama}</td>
                        <td className="px-4 py-3 font-medium">{item.kode}</td>
                        <td className="px-4 py-3">{item.nama}</td>
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
                
                {list.length === 0 && editingId !== 'new' && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm bg-slate-50">
                      Belum ada data jenis setoran. Klik "Tambah Baru".
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

export default SetupJenisSetoran;
