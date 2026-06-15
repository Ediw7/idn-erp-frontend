import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import Pagination from '../../../components/ui/Pagination';
import { setupApi, ItemData, GroupBarangData, PerkiraanData, SupplierData } from '../api';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';

const SetupItem: React.FC = () => {
  const [groupBarangs, setGroupBarangs] = useState<GroupBarangData[]>([]);
  const [perkiraans, setPerkiraans] = useState<PerkiraanData[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [filterKode, setFilterKode] = useState('');
  const [filterNama, setFilterNama] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const fetchItems = async () => {
    if (groupBarangs.length === 0) {
      try {
        const [groupsData, perkiransData, suppliersData] = await Promise.all([
          setupApi.getGroupBarang(), setupApi.getPerkiraan(), setupApi.getSupplier()
        ]);
        setGroupBarangs(groupsData || []);
        setPerkiraans(perkiransData || []);
        setSuppliers(suppliersData || []);
      } catch (error) {
        // ignore or toast
      }
    }
    const data = await setupApi.getItem({ kode: filterKode, nama: filterNama, group_barang_id: filterGroup || undefined });
    return data || [];
  };

  const {
    list, isLoading, isModalOpen, setIsModalOpen,
    editForm, setEditForm, handleEdit, handleSave, handleDelete, fetchData
  } = useMasterDataCRUD<ItemData>({
    fetchApi: fetchItems,
    saveApi: setupApi.saveItem,
    deleteApi: setupApi.deleteItem,
    initialForm: {
      kode: '', nama: '', group_barang_id: null, satuan: 'Pcs',
      harga_jual_1: 0, harga_jual_2: 0, harga_jual_3: 0,
      supplier_utama: '', perk_penjualan_id: null, perk_hpp_id: null, is_inventory: true
    },
    validate: (form) => (!form.kode || !form.nama) ? 'Kode dan Nama Item harus diisi!' : null
  });

  const handleAddNew = () => {
    setEditForm({
      kode: '', nama: '', group_barang_id: groupBarangs.length > 0 ? groupBarangs[0].id! : null, satuan: 'Pcs',
      harga_jual_1: 0, harga_jual_2: 0, harga_jual_3: 0,
      supplier_utama: '', perk_penjualan_id: null, perk_hpp_id: null, is_inventory: true
    });
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const ic = "w-full px-2 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs transition-colors rounded-sm";
  const fmtCur = (val: number) => val ? val.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '0.00';

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)] relative">
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Item (Master Produk)</h2>
          <p className="text-xs text-slate-300 mt-1">Kelola data barang/jasa yang dijual atau dibeli perusahaan.</p>
        </div>
        <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 transition-colors">
          <Plus size={14} /><span>TAMBAH BARU</span>
        </button>
      </div>

      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Kode:</label>
          <input type="text" value={filterKode} onChange={e => setFilterKode(e.target.value)} className="w-24 px-2 py-1 border border-slate-300 text-xs focus:outline-none focus:border-slate-500" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Nama Item:</label>
          <input type="text" value={filterNama} onChange={e => setFilterNama(e.target.value)} className="w-48 px-2 py-1 border border-slate-300 text-xs focus:outline-none focus:border-slate-500" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Group:</label>
          <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)} className="w-36 px-2 py-1 border border-slate-300 text-xs focus:outline-none focus:border-slate-500">
            <option value="">(Semua Group)</option>
            {groupBarangs.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
          </select>
        </div>
        <button onClick={handleSearch} className="px-4 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors">
          <Search size={14} /> Filter
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        <div className="p-4 overflow-x-auto flex-1">

        {isLoading ? (
          <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700"></div></div>
        ) : (
          <div className="border border-slate-300 min-w-max">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-200 border-b border-slate-300 text-xs font-bold text-slate-800 uppercase tracking-wide">
                  <th className="px-2 py-2 border-r border-slate-300 w-24">Kode</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-48">Nama Item</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-28">Group Item</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-16 text-center">Satuan</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-32 text-right">Harga Jual 1</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-32 text-right">Harga Jual 2</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-32 text-right">Harga Jual 3</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-36">Supplier Utama</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-16 text-center">Inventory</th>
                  <th className="px-2 py-2 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-800 divide-y divide-slate-200">
                {list.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map(item => (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-2 py-1.5 border-r border-slate-200 font-mono">{item.kode}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200 font-medium">{item.nama}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200">{item.group_barang_nama || '-'}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200 text-center">{item.satuan}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200 text-right">{fmtCur(item.harga_jual_1)}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200 text-right">{fmtCur(item.harga_jual_2)}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200 text-right">{fmtCur(item.harga_jual_3)}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200">{item.supplier_utama || '-'}</td>
                    <td className="px-2 py-1.5 border-r border-slate-200 text-center">
                      <input type="checkbox" checked={item.is_inventory} readOnly className="w-3.5 h-3.5 opacity-60 cursor-not-allowed" />
                    </td>
                    <td className="px-2 py-1.5 flex justify-center gap-1">
                      <button onClick={() => handleEdit(item)} className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="UBAH"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(item.id!)} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Hapus"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-8 text-center text-slate-500">Belum ada data item. Klik "Tambah Baru" untuk memulai.</td></tr>
                )}
              </tbody>
            </table>
            <Pagination currentPage={currentPage} totalPages={Math.ceil(list.length / rowsPerPage)} onPageChange={setCurrentPage} totalItems={list.length} itemsPerPage={rowsPerPage} />
          </div>
        )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
          <div className="bg-white shadow-xl max-w-4xl w-full flex flex-col my-auto rounded-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-800">
              <h3 className="font-bold text-white">{editForm.id ? 'UBAH Item' : 'Tambah Item Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Item <span className="text-red-500">*</span></label>
                    <input type="text" value={editForm.kode} onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} className={ic} placeholder="Contoh: B-011" autoFocus />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Item <span className="text-red-500">*</span></label>
                    <input type="text" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className={ic} placeholder="Nama lengkap barang" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Group Item</label>
                    <select value={editForm.group_barang_id || ''} onChange={e => setEditForm({...editForm, group_barang_id: e.target.value ? Number(e.target.value) : null})} className={ic}>
                      <option value=""></option>
                      {groupBarangs.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Satuan</label>
                    <input type="text" value={editForm.satuan} onChange={e => setEditForm({...editForm, satuan: e.target.value})} className={ic} placeholder="Pcs / Unit / Kg" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Utama</label>
                    <select value={editForm.supplier_utama || ''} onChange={e => setEditForm({...editForm, supplier_utama: e.target.value})} className={ic}>
                      <option value="">-- Pilih Supplier --</option>
                      {suppliers.map(s => <option key={s.id} value={s.nama}>{s.kode} - {s.nama}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" id="is_inventory" checked={editForm.is_inventory} onChange={e => setEditForm({...editForm, is_inventory: e.target.checked})} className="w-4 h-4 text-blue-600 border-slate-300 rounded" />
                    <label htmlFor="is_inventory" className="text-xs font-semibold text-slate-700 cursor-pointer">Status Inventory (Lacak Stok)</label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Jual 1</label>
                      <input type="number" value={editForm.harga_jual_1} onChange={e => setEditForm({...editForm, harga_jual_1: Number(e.target.value)})} className={`${ic} text-right`} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Jual 2</label>
                      <input type="number" value={editForm.harga_jual_2} onChange={e => setEditForm({...editForm, harga_jual_2: Number(e.target.value)})} className={`${ic} text-right`} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Jual 3</label>
                      <input type="number" value={editForm.harga_jual_3} onChange={e => setEditForm({...editForm, harga_jual_3: Number(e.target.value)})} className={`${ic} text-right`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Perkiraan Penjualan</label>
                    <select value={editForm.perk_penjualan_id || ''} onChange={e => setEditForm({...editForm, perk_penjualan_id: e.target.value ? Number(e.target.value) : null})} className={ic}>
                      <option value=""></option>
                      {perkiraans.map(p => <option key={p.id} value={p.id}>{p.no_perkiraan} - {p.nama_perkiraan}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Perkiraan HPP</label>
                    <select value={editForm.perk_hpp_id || ''} onChange={e => setEditForm({...editForm, perk_hpp_id: e.target.value ? Number(e.target.value) : null})} className={ic}>
                      <option value=""></option>
                      {perkiraans.map(p => <option key={p.id} value={p.id}>{p.no_perkiraan} - {p.nama_perkiraan}</option>)}
                    </select>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 mt-2">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Info</p>
                    <p className="text-xs text-slate-600">Harga Jual 1 adalah harga standar. Harga 2 & 3 untuk level harga pelanggan khusus.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors">Batal</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-700 hover:bg-blue-700 transition-colors flex items-center gap-2"><Save size={16} /> Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupItem;
