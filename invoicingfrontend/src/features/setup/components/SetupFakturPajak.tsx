import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { setupApi, FakturPajakData } from '../api';
import { format, parseISO } from 'date-fns';

const SetupFakturPajak: React.FC = () => {
  const [list, setList] = useState<FakturPajakData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<FakturPajakData>({
    no_surat: '',
    tgl_surat: '',
    tgl_awal: '',
    tgl_akhir: '',
    no_seri_awal: '',
    no_seri_akhir: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await setupApi.getFakturPajak();
      setList(data || []);
    } catch (error) {
      showMessage('Gagal memuat data faktur pajak.', 'error');
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
      no_surat: '',
      tgl_surat: '',
      tgl_awal: '',
      tgl_akhir: '',
      no_seri_awal: '',
      no_seri_akhir: ''
    });
  };

  const handleEdit = (item: FakturPajakData) => {
    setEditingId(item.id!);
    setEditForm({ ...item });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!editForm.no_surat || !editForm.tgl_surat || !editForm.tgl_awal || !editForm.tgl_akhir || !editForm.no_seri_awal || !editForm.no_seri_akhir) {
      showMessage('Semua kolom wajib diisi!', 'error');
      return;
    }

    try {
      await setupApi.saveFakturPajak(editForm);
      showMessage('Data berhasil disimpan!', 'success');
      setEditingId(null);
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      await setupApi.deleteFakturPajak(id);
      showMessage('Data berhasil dihapus!', 'success');
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menghapus data.', 'error');
    }
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 mx-auto mt-8 w-[95%]">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Penjatahan No Seri Faktur Pajak</h2>
          <p className="text-xs text-slate-300 mt-1">Konfigurasi jatah nomor seri faktur pajak yang diberikan oleh KPP.</p>
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
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <th className="px-4 py-3 w-16 text-center">No</th>
                  <th className="px-4 py-3">Nomor Surat dari KPP</th>
                  <th className="px-4 py-3 w-36">Tgl Surat</th>
                  <th className="px-4 py-3 w-36">Tgl FP Awal</th>
                  <th className="px-4 py-3 w-36">Tgl FP Akhir</th>
                  <th className="px-4 py-3 w-48">No Seri FP Awal</th>
                  <th className="px-4 py-3 w-48">No Seri FP Akhir</th>
                  <th className="px-4 py-3 w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {editingId === 'new' && (
                  <tr className="bg-blue-50/50">
                    <td className="px-4 py-3 text-center text-slate-400">*</td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={editForm.no_surat} 
                        onChange={e => setEditForm({...editForm, no_surat: e.target.value.toUpperCase()})} 
                        className={inputClass}
                        placeholder="Contoh: S-260/..."
                        autoFocus
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="date" 
                        value={editForm.tgl_surat} 
                        onChange={e => setEditForm({...editForm, tgl_surat: e.target.value})} 
                        className={inputClass}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="date" 
                        value={editForm.tgl_awal} 
                        onChange={e => setEditForm({...editForm, tgl_awal: e.target.value})} 
                        className={inputClass}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="date" 
                        value={editForm.tgl_akhir} 
                        onChange={e => setEditForm({...editForm, tgl_akhir: e.target.value})} 
                        className={inputClass}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={editForm.no_seri_awal} 
                        onChange={e => setEditForm({...editForm, no_seri_awal: e.target.value})} 
                        className={inputClass}
                        placeholder="Contoh: 000-20.00000001"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={editForm.no_seri_akhir} 
                        onChange={e => setEditForm({...editForm, no_seri_akhir: e.target.value})} 
                        className={inputClass}
                        placeholder="Contoh: 000-20.00099999"
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
                          <input 
                            type="text" 
                            value={editForm.no_surat} 
                            onChange={e => setEditForm({...editForm, no_surat: e.target.value.toUpperCase()})} 
                            className={inputClass} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="date" 
                            value={editForm.tgl_surat} 
                            onChange={e => setEditForm({...editForm, tgl_surat: e.target.value})} 
                            className={inputClass} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="date" 
                            value={editForm.tgl_awal} 
                            onChange={e => setEditForm({...editForm, tgl_awal: e.target.value})} 
                            className={inputClass} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="date" 
                            value={editForm.tgl_akhir} 
                            onChange={e => setEditForm({...editForm, tgl_akhir: e.target.value})} 
                            className={inputClass} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={editForm.no_seri_awal} 
                            onChange={e => setEditForm({...editForm, no_seri_awal: e.target.value})} 
                            className={inputClass} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={editForm.no_seri_akhir} 
                            onChange={e => setEditForm({...editForm, no_seri_akhir: e.target.value})} 
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
                        <td className="px-4 py-3 font-medium">{item.no_surat}</td>
                        <td className="px-4 py-3">{formatDateDisplay(item.tgl_surat)}</td>
                        <td className="px-4 py-3">{formatDateDisplay(item.tgl_awal)}</td>
                        <td className="px-4 py-3">{formatDateDisplay(item.tgl_akhir)}</td>
                        <td className="px-4 py-3 font-mono">{item.no_seri_awal}</td>
                        <td className="px-4 py-3 font-mono">{item.no_seri_akhir}</td>
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
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-sm">
                      Belum ada data jatah nomor seri faktur pajak. Klik "Tambah Baru".
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

export default SetupFakturPajak;
