import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import Pagination from '../../../components/ui/Pagination';
import { setupApi, PerkiraanData } from '../api';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';

const SetupPerkiraan: React.FC = () => {
  const [filterNo, setFilterNo] = useState('');
  const [filterNama, setFilterNama] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const fetchPerkiraan = () => {
    return setupApi.getPerkiraan(); // Ambil semua data di awal
  };

  const {
    list, isLoading, isModalOpen, setIsModalOpen,
    editForm, setEditForm, handleAddNew, handleEdit, handleSave, handleDelete, fetchData
  } = useMasterDataCRUD<PerkiraanData>({
    fetchApi: fetchPerkiraan,
    saveApi: setupApi.savePerkiraan,
    deleteApi: setupApi.deletePerkiraan,
    initialForm: { no_perkiraan: '', nama_perkiraan: '', kas_bank: false },
    validate: (form) => (!form.no_perkiraan || !form.nama_perkiraan) ? 'No Perkiraan dan Nama Perkiraan harus diisi!' : null
  });

  const filteredData = list.filter((item) => {
    const matchesNo = item.no_perkiraan?.toLowerCase().includes(filterNo.toLowerCase());
    const matchesNama = item.nama_perkiraan?.toLowerCase().includes(filterNama.toLowerCase());
    return matchesNo && matchesNama;
  });

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 max-w-5xl mx-auto mt-8">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Perkiraan</h2>
          <p className="text-xs text-slate-300 mt-1">Daftar akun perkiraan (Chart of Accounts) perusahaan.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
        >
          <Plus size={14} />
          <span>TAMBAH BARU</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-6">
        <div className="flex-1 max-w-sm flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">No Perkiraan:</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </div>
            <input
              type="text"
              value={filterNo}
              onChange={(e) => {
                setFilterNo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors"
              placeholder="Ketik nomor untuk live search..."
            />
          </div>
        </div>
        <div className="flex-1 max-w-md flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Nama Perkiraan:</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </div>
            <input
              type="text"
              value={filterNama}
              onChange={(e) => {
                setFilterNama(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors"
              placeholder="Ketik nama untuk live search..."
            />
          </div>
        </div>
      </div>

      <div className="p-6">

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
                  <th className="px-4 py-3 w-48">No Perkiraan</th>
                  <th className="px-4 py-3">Nama Perkiraan</th>
                  <th className="px-4 py-3 w-28 text-center">Kas/Bank</th>
                  <th className="px-4 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-500">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.no_perkiraan}</td>
                    <td className="px-4 py-3">{item.nama_perkiraan}</td>
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={item.kas_bank} readOnly className="w-4 h-4 text-slate-400 border-slate-300 rounded opacity-70 cursor-not-allowed" />
                    </td>
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

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                      Belum ada data perkiraan yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredData.length / rowsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={filteredData.length}
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
                {editForm.id ? 'UBAH Perkiraan' : 'Tambah Perkiraan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No Perkiraan</label>
                  <input
                    type="text"
                    value={editForm.no_perkiraan}
                    onChange={e => setEditForm({ ...editForm, no_perkiraan: e.target.value })}
                    className={inputClass}
                    placeholder="Contoh: 1101001"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Perkiraan</label>
                  <input
                    type="text"
                    value={editForm.nama_perkiraan}
                    onChange={e => setEditForm({ ...editForm, nama_perkiraan: e.target.value })}
                    className={inputClass}
                    placeholder="Contoh: Kas Kecil"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    checked={editForm.kas_bank}
                    onChange={e => setEditForm({ ...editForm, kas_bank: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    id="kas_bank"
                  />
                  <label htmlFor="kas_bank" className="text-sm font-semibold text-slate-700 cursor-pointer">Kas / Bank</label>
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

export default SetupPerkiraan;
