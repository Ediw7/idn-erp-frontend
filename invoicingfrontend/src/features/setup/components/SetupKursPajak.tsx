import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { setupApi, MataUangData, KursPajakData } from '../api';
import { useConfirm } from '../../../contexts/ConfirmContext';

const SetupKursPajak: React.FC = () => {
  const confirm = useConfirm();
  const [mataUangList, setMataUangList] = useState<MataUangData[]>([]);
  const [selectedMataUangId, setSelectedMataUangId] = useState<number | ''>('');
  
  const [kursPajakList, setKursPajakList] = useState<KursPajakData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<KursPajakData>({
    mata_uang_id: 0,
    tgl_dari: '',
    tgl_sd: '',
    kurs: '',
    no_kmk: '',
    tgl_kmk: ''
  });

  useEffect(() => {
    fetchMataUang();
  }, []);

  useEffect(() => {
    if (selectedMataUangId) {
      fetchKursPajak(Number(selectedMataUangId));
    } else {
      setKursPajakList([]);
    }
    setIsModalOpen(false);
  }, [selectedMataUangId]);

  const fetchMataUang = async () => {
    try {
      const data = await setupApi.getMataUang();
      setMataUangList(data || []);
      if (data && data.length > 0) {
        // Auto select first currency (usually IDR or USD) if list is not empty
        setSelectedMataUangId(data[0].id!);
      }
    } catch (error) {
      showMessage('Gagal memuat daftar mata uang.', 'error');
    }
  };

  const fetchKursPajak = async (id: number) => {
    setIsLoading(true);
    try {
      const data = await setupApi.getKursPajak(id);
      setKursPajakList(data || []);
    } catch (error) {
      showMessage('Gagal memuat data kurs pajak.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddNew = () => {
    if (!selectedMataUangId) {
      showMessage('Pilih Mata Uang terlebih dahulu.', 'error');
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

  const handleEdit = (item: KursPajakData) => {
    setEditForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editForm.tgl_dari || !editForm.tgl_sd || !editForm.kurs) {
      showMessage('Tanggal Dari, Tanggal s/d, dan Kurs harus diisi!', 'error');
      return;
    }

    try {
      await setupApi.saveKursPajak(editForm);
      showMessage('Data kurs pajak berhasil disimpan!', 'success');
      setIsModalOpen(false);
      if (selectedMataUangId) fetchKursPajak(Number(selectedMataUangId));
    } catch (error) {
      showMessage('Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus kurs pajak ini?');
    if (!isConfirmed) return;
    
    try {
      await setupApi.deleteKursPajak(id);
      showMessage('Data kurs pajak berhasil dihapus!', 'success');
      if (selectedMataUangId) fetchKursPajak(Number(selectedMataUangId));
    } catch (error) {
      showMessage('Terjadi kesalahan saat menghapus data.', 'error');
    }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
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
