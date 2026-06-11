import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import Pagination from '../../../components/ui/Pagination';
import { setupApi, BahasaData } from '../api';
import { useConfirm } from '../../../contexts/ConfirmContext';

const SetupBahasa: React.FC = () => {
  const confirm = useConfirm();
  const [list, setList] = useState<BahasaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<BahasaData>({
    jenis_objek: 'Report',
    nama_objek: 'Invoice',
    default_sistem: '',
    judul_kustom: ''
  });

  const [filterJenis, setFilterJenis] = useState('Report');
  const [filterNama, setFilterNama] = useState('Invoice');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await setupApi.getBahasa();
      setList(data || []);
    } catch (error) {
      showMessage('Gagal memuat data setup bahasa.', 'error');
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
      jenis_objek: filterJenis || 'Report',
      nama_objek: filterNama || 'Invoice',
      default_sistem: '',
      judul_kustom: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: BahasaData) => {
    setEditForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editForm.jenis_objek || !editForm.nama_objek || !editForm.default_sistem) {
      showMessage('Jenis, Nama Objek, dan Default Sistem harus diisi!', 'error');
      return;
    }

    try {
      await setupApi.saveBahasa(editForm);
      showMessage('Data berhasil disimpan!', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus bahasa ini?');
    if (!isConfirmed) return;
    
    try {
      await setupApi.deleteBahasa(id);
      showMessage('Data berhasil dihapus!', 'success');
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menghapus data.', 'error');
    }
  };

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm transition-colors";

  // Filter functionality
  const filteredList = useMemo(() => {
    return list.filter(item => {
      const matchJenis = filterJenis ? item.jenis_objek.toLowerCase().includes(filterJenis.toLowerCase()) : true;
      const matchNama = filterNama ? item.nama_objek.toLowerCase().includes(filterNama.toLowerCase()) : true;
      return matchJenis && matchNama;
    });
  }, [list, filterJenis, filterNama]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterJenis, filterNama]);

  const totalPages = Math.ceil(filteredList.length / rowsPerPage);
  const paginatedList = filteredList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Extract unique Jenis and Nama for dropdowns
  const uniqueJenis = Array.from(new Set(list.map(item => item.jenis_objek)));
  const uniqueNama = Array.from(new Set(list.filter(item => !filterJenis || item.jenis_objek === filterJenis).map(item => item.nama_objek)));
  
  if (!uniqueJenis.includes('Report')) uniqueJenis.push('Report');
  if (!uniqueJenis.includes('Form')) uniqueJenis.push('Form');
  if (!uniqueNama.includes('Invoice')) uniqueNama.push('Invoice');
  if (!uniqueNama.includes('Kwitansi')) uniqueNama.push('Kwitansi');

  return (
    <div className="bg-white shadow-sm border border-slate-300 max-w-7xl mx-auto mt-4 flex flex-col h-[90vh]">
      {/* Header and Toolbar */}
      <div className="bg-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Bahasa</h2>
          <p className="text-xs text-slate-300 mt-1">Konfigurasi penerjemahan/perubahan judul label standar sistem.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
        >
          <Plus size={14} />
          <span>TAMBAH LABEL</span>
        </button>
      </div>
      
      {/* Search Filters */}
      <div className="bg-blue-50/50 p-4 border-b border-slate-200 shrink-0 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-blue-900 w-32">Cari Jenis Objek</label>
          <div className="relative">
            <select 
              value={filterJenis}
              onChange={e => {
                setFilterJenis(e.target.value);
                setFilterNama(''); // Reset nama when jenis changes
              }}
              className="pl-3 pr-8 py-1.5 border border-blue-200 rounded text-sm min-w-48 bg-white focus:outline-none focus:border-blue-400"
            >
              <option value="">-- Semua Jenis --</option>
              {uniqueJenis.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-blue-900 w-32">Cari Nama Objek</label>
          <div className="relative">
            <select 
              value={filterNama}
              onChange={e => setFilterNama(e.target.value)}
              className="pl-3 pr-8 py-1.5 border border-blue-200 rounded text-sm min-w-48 bg-white focus:outline-none focus:border-blue-400"
            >
              <option value="">-- Semua Nama --</option>
              {uniqueNama.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        {message && (
          <div className={`mb-4 p-3 rounded-sm flex items-start gap-3 shadow-sm border shrink-0 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{message.text}</p>
              </div>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-32 flex-1">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700"></div>
          </div>
        ) : (
          <div className="overflow-y-auto border border-slate-200 flex-1 relative">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100 shadow-sm z-10">
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 w-32">Jenis</th>
                  <th className="px-4 py-3 w-40">Nama Objek</th>
                  <th className="px-4 py-3 w-1/3">Default dari Sistem</th>
                  <th className="px-4 py-3 w-1/3">Judul yang Diinginkan</th>
                  <th className="px-4 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {paginatedList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-500">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="px-4 py-3">{item.jenis_objek}</td>
                    <td className="px-4 py-3">{item.nama_objek}</td>
                    <td className="px-4 py-3 text-slate-500">{item.default_sistem}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.judul_kustom || '-'}</td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Edit Terjemahan">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id!)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Hapus Label">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm bg-slate-50">
                      {list.length === 0 
                        ? 'Belum ada data setup bahasa. Klik "Tambah Label" untuk mulai membuat daftar penerjemahan.'
                        : 'Tidak ada label yang cocok dengan filter pencarian.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
              totalItems={filteredList.length} 
              itemsPerPage={rowsPerPage} 
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded shadow-xl max-w-md w-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editForm.id ? 'Edit Setup Bahasa' : 'Tambah Setup Bahasa'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Objek</label>
                  <input 
                    type="text" 
                    value={editForm.jenis_objek} 
                    onChange={e => setEditForm({...editForm, jenis_objek: e.target.value})} 
                    className={inputClass}
                    placeholder="Report / Form"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Objek</label>
                  <input 
                    type="text" 
                    value={editForm.nama_objek} 
                    onChange={e => setEditForm({...editForm, nama_objek: e.target.value})} 
                    className={inputClass}
                    placeholder="Invoice / SJ"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default dari Sistem</label>
                  <input 
                    type="text" 
                    value={editForm.default_sistem} 
                    onChange={e => setEditForm({...editForm, default_sistem: e.target.value})} 
                    className={inputClass}
                    placeholder="Label Asli Sistem"
                    autoFocus={!editForm.id}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul yang Diinginkan</label>
                  <input 
                    type="text" 
                    value={editForm.judul_kustom} 
                    onChange={e => setEditForm({...editForm, judul_kustom: e.target.value})} 
                    className={inputClass}
                    placeholder="Terjemahan / Alias Baru"
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

export default SetupBahasa;
