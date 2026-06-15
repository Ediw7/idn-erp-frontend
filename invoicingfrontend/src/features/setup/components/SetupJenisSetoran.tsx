import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { setupApi, JenisSetoranData, JenisPajakData } from '../api';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';

const SetupJenisSetoran: React.FC = () => {
  const [pajaks, setPajaks] = useState<JenisPajakData[]>([]);

  const fetchJenisSetoran = async () => {
    const [data, pajaksData] = await Promise.all([
      setupApi.getJenisSetoran(),
      setupApi.getJenisPajak()
    ]);
    setPajaks(pajaksData || []);
    return data || [];
  };

  const {
    list, isLoading, isModalOpen, setIsModalOpen,
    editForm, setEditForm, handleAddNew, handleEdit, handleSave, handleDelete
  } = useMasterDataCRUD<JenisSetoranData>({
    fetchApi: fetchJenisSetoran,
    saveApi: setupApi.saveJenisSetoran,
    deleteApi: setupApi.deleteJenisSetoran,
    initialForm: { jenis_pajak_id: null, kode: '', nama: '' },
    validate: (form) => (!form.jenis_pajak_id || !form.kode || !form.nama) ? 'MAP, Kode, dan Jenis Setoran harus diisi!' : null
  });

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm transition-colors";

  // Derive selected pajak name for display in UBAH row

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
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
        >
          <Plus size={14} />
          <span>TAMBAH BARU</span>
        </button>
      </div>

      <div className="p-6 flex-1 overflow-hidden flex flex-col">

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
                {list.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold">{item.jenis_pajak_kode}</td>
                    <td className="px-4 py-3 text-slate-600">{item.jenis_pajak_nama}</td>
                    <td className="px-4 py-3 font-medium">{item.kode}</td>
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="UBAH">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded shadow-xl max-w-md w-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editForm.id ? 'UBAH Jenis Setoran' : 'Tambah Jenis Setoran'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">MAP (Kode Pajak)</label>
                  <select 
                    value={editForm.jenis_pajak_id || ''} 
                    onChange={e => setEditForm({...editForm, jenis_pajak_id: e.target.value ? Number(e.target.value) : null})} 
                    className={inputClass}
                  >
                    <option value="">-- Pilih MAP --</option>
                    {pajaks.map(p => <option key={p.id} value={p.id}>{p.kode} - {p.nama}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Setoran</label>
                  <input 
                    type="text" 
                    value={editForm.kode} 
                    onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} 
                    className={inputClass}
                    placeholder="Contoh: 100"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Setoran</label>
                  <input 
                    type="text" 
                    value={editForm.nama} 
                    onChange={e => setEditForm({...editForm, nama: e.target.value})} 
                    className={inputClass}
                    placeholder="Contoh: PPh Minyak Bumi"
                  />
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

export default SetupJenisSetoran;
