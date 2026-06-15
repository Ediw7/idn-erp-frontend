import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { setupApi, MataUangData, KursPajakData } from '../api';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import toast from 'react-hot-toast';

const SetupKursPajak: React.FC = () => {
  const [mataUangList, setMataUangList] = useState<MataUangData[]>([]);
  const [selectedMataUangId, setSelectedMataUangId] = useState<number | ''>('');

  const fetchKursPajak = () => {
    if (selectedMataUangId) return setupApi.getKursPajak(Number(selectedMataUangId));
    return Promise.resolve([]);
  };

  const {
    list: kursPajakList, isLoading, isModalOpen, setIsModalOpen,
    editForm, setEditForm, handleEdit, handleSave, handleDelete, fetchData
  } = useMasterDataCRUD<KursPajakData>({
    fetchApi: fetchKursPajak,
    saveApi: setupApi.saveKursPajak,
    deleteApi: setupApi.deleteKursPajak,
    initialForm: { mata_uang_id: 0, tgl_dari: '', tgl_sd: '', kurs: '', no_kmk: '', tgl_kmk: '' },
    validate: (form) => (!form.tgl_dari || !form.tgl_sd || !form.kurs) ? 'Tanggal Dari, Tanggal s/d, dan Kurs harus diisi!' : null
  });

  useEffect(() => {
    fetchMataUang();
  }, []);

  useEffect(() => {
    if (selectedMataUangId) {
      fetchData();
    }
    setIsModalOpen(false);
  }, [selectedMataUangId]);

  const fetchMataUang = async () => {
    try {
      const data = await setupApi.getMataUang();
      setMataUangList(data || []);
      if (data && data.length > 0) {
        setSelectedMataUangId(data[0].id!);
      }
    } catch (error) {
      toast.error('Gagal memuat daftar mata uang.');
    }
  };

  const handleAddNew = () => {
    if (!selectedMataUangId) {
      toast.error('Pilih Mata Uang terlebih dahulu.');
      return;
    }
    setEditForm({
      mata_uang_id: Number(selectedMataUangId),
      tgl_dari: '',
      tgl_sd: '',
      kurs: '',
      no_kmk: '',
      tgl_kmk: ''
    });
    setIsModalOpen(true);
  };

  const selectedCurrencyInfo = mataUangList.find(m => m.id === Number(selectedMataUangId));
  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 max-w-5xl mx-auto mt-8">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Kurs Pajak</h2>
          <p className="text-xs text-slate-300 mt-1">Kelola data kurs pajak per mata uang dan rentang waktu.</p>
        </div>
        <button 
          onClick={handleAddNew}
          disabled={!selectedMataUangId}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
          <span>TAMBAH BARU</span>
        </button>
      </div>

      {/* Currency Filter Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <label className="text-sm font-semibold text-slate-700">Pilih Mata Uang:</label>
        <select 
          className="px-3 py-1.5 border border-slate-300 bg-white text-sm min-w-[150px] focus:outline-none focus:ring-1 focus:ring-slate-500"
          value={selectedMataUangId}
          onChange={(e) => setSelectedMataUangId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="" disabled>-- Pilih Mata Uang --</option>
          {mataUangList.map(m => (
            <option key={m.id} value={m.id}>{m.kode} - {m.nama}</option>
          ))}
        </select>
        {selectedCurrencyInfo && (
          <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1.5 border border-slate-200">
            Per: {selectedCurrencyInfo.per}
          </span>
        )}
      </div>

      <div className="p-6">

        {!selectedMataUangId ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center">
            <Search size={48} className="text-slate-300 mb-4" />
            <p>Silakan pilih Mata Uang terlebih dahulu di atas.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700"></div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 w-36">Tgl Dari</th>
                  <th className="px-4 py-3 w-36">Tgl s/d</th>
                  <th className="px-4 py-3 w-40 text-right">Kurs</th>
                  <th className="px-4 py-3">No KMK</th>
                  <th className="px-4 py-3 w-36">Tgl KMK</th>
                  <th className="px-4 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {kursPajakList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3">{item.tgl_dari}</td>
                    <td className="px-4 py-3">{item.tgl_sd}</td>
                    <td className="px-4 py-3 text-right font-medium">{Number(item.kurs).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                    <td className="px-4 py-3">{item.no_kmk || '-'}</td>
                    <td className="px-4 py-3">{item.tgl_kmk || '-'}</td>
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
                
                {kursPajakList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-sm">
                      Belum ada data kurs pajak. Klik "Tambah Baru" untuk memulai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20">
          <div className="bg-white rounded shadow-xl max-w-md w-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editForm.id ? 'UBAH Kurs Pajak' : 'Tambah Kurs Pajak'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Dari</label>
                    <input type="date" value={editForm.tgl_dari} onChange={e => setEditForm({...editForm, tgl_dari: e.target.value})} className={inputClass} autoFocus={!editForm.id} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal s/d</label>
                    <input type="date" value={editForm.tgl_sd} onChange={e => setEditForm({...editForm, tgl_sd: e.target.value})} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kurs</label>
                  <input type="number" step="0.01" value={editForm.kurs} onChange={e => setEditForm({...editForm, kurs: e.target.value})} className={`${inputClass} text-right`} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor KMK</label>
                  <input type="text" value={editForm.no_kmk} onChange={e => setEditForm({...editForm, no_kmk: e.target.value})} className={inputClass} placeholder="Nomor KMK" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal KMK</label>
                  <input type="date" value={editForm.tgl_kmk} onChange={e => setEditForm({...editForm, tgl_kmk: e.target.value})} className={inputClass} />
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

export default SetupKursPajak;
