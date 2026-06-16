import React, { useState, useEffect } from 'react';
import { setupApi, GudangData, ItemData } from '../../setup/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface AdjustmentDetail {
  id: string;
  item_id: number | '';
  kode_barang: string;
  nama_barang: string;
  satuan: string;
  qty: number | '';
  total_hpp: number | '';
}

const AdjustmentInventory: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Master Data States
  const [gudangs, setGudangs] = useState<GudangData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);

  // Form State
  const [form, setForm] = useState({
    no_bukti: '',
    tanggal: new Date().toISOString().split('T')[0],
    gudang_id: '' as number | '',
    keterangan: ''
  });

  // Details State
  const [details, setDetails] = useState<AdjustmentDetail[]>([
    { id: Date.now().toString(), item_id: '', kode_barang: '', nama_barang: '', satuan: '', qty: '', total_hpp: '' }
  ]);

  // Fetch Master Data on Mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [gudRes, itemRes] = await Promise.all([
          setupApi.getGudang(),
          setupApi.getItem()
        ]);
        setGudangs(gudRes);
        setItems(itemRes);
      } catch (error: any) {
        toast.error('Gagal memuat data master: ' + error.message);
      }
    };
    fetchMasterData();
  }, []);

  // Detail Row Handlers
  const handleAddRow = () => {
    setDetails([
      ...details,
      { id: Date.now().toString(), item_id: '', kode_barang: '', nama_barang: '', satuan: '', qty: '', total_hpp: '' }
    ]);
  };

  const handleRemoveRow = (idToRemove: string) => {
    if (details.length === 1) {
      setDetails([{ id: Date.now().toString(), item_id: '', kode_barang: '', nama_barang: '', satuan: '', qty: '', total_hpp: '' }]);
      return;
    }
    setDetails(details.filter(d => d.id !== idToRemove));
  };

  const handleDetailChange = (id: string, field: keyof AdjustmentDetail, value: any) => {
    setDetails(details.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Auto-fill logic when item is selected
        if (field === 'item_id') {
          const selectedItem = items.find(i => i.id === Number(value));
          if (selectedItem) {
            updatedRow.kode_barang = selectedItem.kode;
            updatedRow.nama_barang = selectedItem.nama;
            updatedRow.satuan = selectedItem.satuan;
          } else {
            updatedRow.kode_barang = '';
            updatedRow.nama_barang = '';
            updatedRow.satuan = '';
          }
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const handleAutoNo = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    setForm({ ...form, no_bukti: `ADJ-${year}${month}-0001` });
    toast.success('Auto No berhasil digenerate');
  };

  const handleBaru = () => {
    setForm({
      no_bukti: '',
      tanggal: new Date().toISOString().split('T')[0],
      gudang_id: '',
      keterangan: ''
    });
    setDetails([{ id: Date.now().toString(), item_id: '', kode_barang: '', nama_barang: '', satuan: '', qty: '', total_hpp: '' }]);
  };

  const handleSimpan = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Data Adjustment Inventory berhasil disimpan!');
    }, 1000);
  };

  const handleHapus = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      toast.success('Dokumen berhasil dihapus');
      handleBaru();
    }
  };

  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";
  const inputClass = "w-full px-3 py-2 border border-slate-300 bg-white rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50";
  const readOnlyClass = "w-full px-2 py-1.5 bg-gray-50 border border-slate-200 text-slate-500 rounded text-sm focus:outline-none";

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] p-8">
      {/* 1. Outer Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full">
        
        {/* 2. Header Banner Gelap */}
        <div className="p-6 bg-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Bukti Adjustment Inventory</h2>
            <p className="text-sm text-slate-300 mt-1">Form input koreksi / penyesuaian stok barang di gudang</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBaru}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-50"
            >
              TAMBAH BARU
            </button>
            <button 
              onClick={handleSimpan}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 border border-blue-700 rounded-sm text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              SIMPAN DATA
            </button>
            <button 
              onClick={handleHapus}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 border border-red-700 rounded-sm text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
            >
              HAPUS
            </button>
          </div>
        </div>

        {/* 3. Body Form Utama */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            <div className="lg:col-span-1">
              <label className={labelClass}>No. Bukti</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className={`${inputClass} font-mono`} 
                  value={form.no_bukti}
                  onChange={e => setForm({...form, no_bukti: e.target.value})}
                />
                <button 
                  onClick={handleAutoNo}
                  className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  Auto No
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <label className={labelClass}>Tanggal</label>
              <input 
                type="date" 
                className={inputClass} 
                value={form.tanggal}
                onChange={e => setForm({...form, tanggal: e.target.value})}
              />
            </div>

            <div className="lg:col-span-2">
              <label className={labelClass}>Gudang</label>
              <select 
                className={inputClass} 
                value={form.gudang_id}
                onChange={e => setForm({...form, gudang_id: e.target.value ? Number(e.target.value) : ''})}
              >
                <option value="">-- Pilih Gudang --</option>
                {gudangs.map(g => (
                  <option key={g.id} value={g.id}>{g.nama_gudang}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="mb-8">
            <label className={labelClass}>Keterangan</label>
            <input 
              type="text" 
              className={inputClass} 
              value={form.keterangan}
              onChange={e => setForm({...form, keterangan: e.target.value})}
            />
          </div>

          {/* 4. Tabel Detail Barang Dinamis */}
          <div className="border border-slate-200 rounded-sm overflow-hidden mb-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold w-[25%]">Kode Barang</th>
                  <th className="px-4 py-3 font-semibold w-[30%]">Nama Barang</th>
                  <th className="px-4 py-3 font-semibold w-[10%]">Satuan</th>
                  <th className="px-4 py-3 font-semibold w-[15%] text-right">Quantity</th>
                  <th className="px-4 py-3 font-semibold w-[15%] text-right">Total HPP</th>
                  <th className="px-4 py-3 text-center w-12">#</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {details.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2">
                      <select 
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={row.item_id}
                        onChange={(e) => handleDetailChange(row.id, 'item_id', e.target.value)}
                      >
                        <option value="">- Pilih Item -</option>
                        {items.map(item => (
                          <option key={item.id} value={item.id}>{item.kode} - {item.nama}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input type="text" readOnly className={readOnlyClass} value={row.nama_barang} />
                    </td>
                    <td className="p-2">
                      <input type="text" readOnly className={readOnlyClass} value={row.satuan} />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        className={`w-full px-2 py-1.5 border rounded text-sm text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${row.qty !== '' && row.qty < 0 ? 'text-red-600 border-red-300 bg-red-50' : 'text-slate-900 border-slate-300'}`}
                        value={row.qty}
                        onChange={(e) => handleDetailChange(row.id, 'qty', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900" 
                        value={row.total_hpp}
                        onChange={(e) => handleDetailChange(row.id, 'total_hpp', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button 
                        onClick={() => handleRemoveRow(row.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Hapus Baris"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="bg-slate-50 p-3 border-t border-slate-200">
              <button 
                onClick={handleAddRow}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                + Tambah Baris Barang
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdjustmentInventory;
