import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { setupApi, ItemData, GroupBarangData, PerkiraanData } from '../api';

const SetupItem: React.FC = () => {
  const [list, setList] = useState<ItemData[]>([]);
  const [groupBarangs, setGroupBarangs] = useState<GroupBarangData[]>([]);
  const [perkiraans, setPerkiraans] = useState<PerkiraanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Filters
  const [filterKode, setFilterKode] = useState('');
  const [filterNama, setFilterNama] = useState('');
  const [filterGroup, setFilterGroup] = useState('');

  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<ItemData>({
    kode: '',
    nama: '',
    group_barang_id: null,
    satuan: 'Pcs',
    harga_jual_1: 0,
    harga_jual_2: 0,
    harga_jual_3: 0,
    supplier_utama: '',
    perk_penjualan_id: null,
    perk_hpp_id: null,
    is_inventory: true
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [groupsData, perkiransData] = await Promise.all([
        setupApi.getGroupBarang(),
        setupApi.getPerkiraan()
      ]);
      setGroupBarangs(groupsData || []);
      setPerkiraans(perkiransData || []);
      await fetchItems();
    } catch (error) {
      showMessage('Gagal memuat data pendukung.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await setupApi.getItem({
        kode: filterKode,
        nama: filterNama,
        group_barang_id: filterGroup || undefined
      });
      setList(data || []);
    } catch (error) {
      showMessage('Gagal memuat data item.', 'error');
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
      kode: '',
      nama: '',
      group_barang_id: groupBarangs.length > 0 ? groupBarangs[0].id : null,
      satuan: 'Pcs',
      harga_jual_1: 0,
      harga_jual_2: 0,
      harga_jual_3: 0,
      supplier_utama: '',
      perk_penjualan_id: null,
      perk_hpp_id: null,
      is_inventory: true
    });
  };

  const handleEdit = (item: ItemData) => {
    setEditingId(item.id!);
    setEditForm({ ...item });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!editForm.kode || !editForm.nama) {
      showMessage('Kode dan Nama Item harus diisi!', 'error');
      return;
    }

    try {
      await setupApi.saveItem(editForm);
      showMessage('Data item berhasil disimpan!', 'success');
      setEditingId(null);
      fetchItems();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
    
    try {
      await setupApi.deleteItem(id);
      showMessage('Data berhasil dihapus!', 'success');
      fetchItems();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menghapus data.', 'error');
    }
  };

  const inputClass = "w-full px-1.5 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-xs transition-colors";

  // Format currency helper
  const formatCurrency = (val: number) => {
    if (!val) return '0.00';
    return val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white shadow-sm border border-slate-300 w-full mx-auto mt-8">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Item (Master Produk)</h2>
          <p className="text-xs text-slate-300 mt-1">Kelola data barang/jasa yang dijual atau dibeli perusahaan.</p>
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

      {/* Filter Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Kode:</label>
          <input 
            type="text" 
            value={filterKode} 
            onChange={(e) => setFilterKode(e.target.value)} 
            className="w-24 px-2 py-1 border border-slate-300 text-xs focus:outline-none focus:border-slate-500" 
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Nama Item:</label>
          <input 
            type="text" 
            value={filterNama} 
            onChange={(e) => setFilterNama(e.target.value)} 
            className="w-48 px-2 py-1 border border-slate-300 text-xs focus:outline-none focus:border-slate-500" 
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Group Item:</label>
          <select 
            value={filterGroup} 
            onChange={(e) => setFilterGroup(e.target.value)} 
            className="w-36 px-2 py-1 border border-slate-300 text-xs focus:outline-none focus:border-slate-500"
          >
            <option value="">(Semua Group)</option>
            {groupBarangs.map(g => (
              <option key={g.id} value={g.id}>{g.nama}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={fetchItems}
          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-2"
        >
          <Search size={14} /> Filter
        </button>
      </div>

      <div className="p-4 overflow-x-auto">
        {message && (
          <div className={`mb-4 p-3 rounded-sm flex items-start gap-3 shadow-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
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
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700"></div>
          </div>
        ) : (
          <div className="border border-slate-300 min-w-max">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-200 border-b border-slate-300 text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                  <th className="px-2 py-2 border-r border-slate-300 w-24">Kode</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-48">Nama Item</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-28">Group Item</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-16 text-center">Satuan</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-24 text-right">Harga Jual 1</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-24 text-right">Harga Jual 2</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-24 text-right">Harga Jual 3</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-32">Supplier Utama</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-24">Perk Penjualan</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-24">Perk HPP</th>
                  <th className="px-2 py-2 border-r border-slate-300 w-16 text-center">Inventory</th>
                  <th className="px-2 py-2 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-[11px] text-slate-800 divide-y divide-slate-200">
                {editingId === 'new' && (
                  <tr className="bg-yellow-50">
                    <td className="px-1 py-1 border-r border-slate-200">
                      <input type="text" value={editForm.kode} onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} className={inputClass} autoFocus />
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200">
                      <input type="text" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className={inputClass} />
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200">
                      <select value={editForm.group_barang_id || ''} onChange={e => setEditForm({...editForm, group_barang_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                        <option value=""></option>
                        {groupBarangs.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                      </select>
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200">
                      <input type="text" value={editForm.satuan} onChange={e => setEditForm({...editForm, satuan: e.target.value})} className={inputClass} />
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200">
                      <input type="number" value={editForm.harga_jual_1} onChange={e => setEditForm({...editForm, harga_jual_1: Number(e.target.value)})} className={`${inputClass} text-right`} />
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200">
                      <input type="number" value={editForm.harga_jual_2} onChange={e => setEditForm({...editForm, harga_jual_2: Number(e.target.value)})} className={`${inputClass} text-right`} />
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200">
                      <input type="number" value={editForm.harga_jual_3} onChange={e => setEditForm({...editForm, harga_jual_3: Number(e.target.value)})} className={`${inputClass} text-right`} />
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200">
                      <input type="text" value={editForm.supplier_utama} onChange={e => setEditForm({...editForm, supplier_utama: e.target.value})} className={inputClass} />
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200">
                      <select value={editForm.perk_penjualan_id || ''} onChange={e => setEditForm({...editForm, perk_penjualan_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                        <option value=""></option>
                        {perkiraans.map(p => <option key={p.id} value={p.id}>{p.no_perkiraan}</option>)}
                      </select>
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200">
                      <select value={editForm.perk_hpp_id || ''} onChange={e => setEditForm({...editForm, perk_hpp_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                        <option value=""></option>
                        {perkiraans.map(p => <option key={p.id} value={p.id}>{p.no_perkiraan}</option>)}
                      </select>
                    </td>
                    <td className="px-1 py-1 border-r border-slate-200 text-center">
                      <input type="checkbox" checked={editForm.is_inventory} onChange={e => setEditForm({...editForm, is_inventory: e.target.checked})} className="w-3.5 h-3.5" />
                    </td>
                    <td className="px-1 py-1 flex justify-center gap-1">
                      <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="Simpan"><Save size={14} /></button>
                      <button onClick={handleCancel} className="p-1 text-slate-500 hover:bg-slate-200 rounded" title="Batal"><X size={14} /></button>
                    </td>
                  </tr>
                )}

                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                    {editingId === item.id ? (
                      // Edit Mode
                      <>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <input type="text" value={editForm.kode} onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} className={inputClass} />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <input type="text" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className={inputClass} />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <select value={editForm.group_barang_id || ''} onChange={e => setEditForm({...editForm, group_barang_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                            <option value=""></option>
                            {groupBarangs.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                          </select>
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <input type="text" value={editForm.satuan} onChange={e => setEditForm({...editForm, satuan: e.target.value})} className={inputClass} />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <input type="number" value={editForm.harga_jual_1} onChange={e => setEditForm({...editForm, harga_jual_1: Number(e.target.value)})} className={`${inputClass} text-right`} />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <input type="number" value={editForm.harga_jual_2} onChange={e => setEditForm({...editForm, harga_jual_2: Number(e.target.value)})} className={`${inputClass} text-right`} />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <input type="number" value={editForm.harga_jual_3} onChange={e => setEditForm({...editForm, harga_jual_3: Number(e.target.value)})} className={`${inputClass} text-right`} />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <input type="text" value={editForm.supplier_utama} onChange={e => setEditForm({...editForm, supplier_utama: e.target.value})} className={inputClass} />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <select value={editForm.perk_penjualan_id || ''} onChange={e => setEditForm({...editForm, perk_penjualan_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                            <option value=""></option>
                            {perkiraans.map(p => <option key={p.id} value={p.id}>{p.no_perkiraan}</option>)}
                          </select>
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200">
                          <select value={editForm.perk_hpp_id || ''} onChange={e => setEditForm({...editForm, perk_hpp_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                            <option value=""></option>
                            {perkiraans.map(p => <option key={p.id} value={p.id}>{p.no_perkiraan}</option>)}
                          </select>
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200 text-center">
                          <input type="checkbox" checked={editForm.is_inventory} onChange={e => setEditForm({...editForm, is_inventory: e.target.checked})} className="w-3.5 h-3.5" />
                        </td>
                        <td className="px-1 py-1 flex justify-center gap-1">
                          <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="Simpan"><Save size={14} /></button>
                          <button onClick={handleCancel} className="p-1 text-slate-500 hover:bg-slate-200 rounded" title="Batal"><X size={14} /></button>
                        </td>
                      </>
                    ) : (
                      // View Mode
                      <>
                        <td className="px-2 py-1.5 border-r border-slate-200">{item.kode}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200 font-medium">{item.nama}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200">{item.group_barang_nama || '-'}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200 text-center">{item.satuan}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200 text-right">{formatCurrency(item.harga_jual_1)}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200 text-right">{formatCurrency(item.harga_jual_2)}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200 text-right">{formatCurrency(item.harga_jual_3)}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200">{item.supplier_utama || '-'}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200">{item.perk_penjualan_nama || '-'}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200">{item.perk_hpp_nama || '-'}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200 text-center">
                          <input type="checkbox" checked={item.is_inventory} readOnly className="w-3.5 h-3.5 opacity-60 cursor-not-allowed" />
                        </td>
                        <td className="px-2 py-1.5 flex justify-center gap-1">
                          <button onClick={() => handleEdit(item)} className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Edit"><Edit2 size={13} /></button>
                          <button onClick={() => handleDelete(item.id!)} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Hapus"><Trash2 size={13} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                
                {list.length === 0 && editingId !== 'new' && (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-slate-500">
                      Belum ada data item. Klik "Tambah Baru" untuk memulai.
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

export default SetupItem;
