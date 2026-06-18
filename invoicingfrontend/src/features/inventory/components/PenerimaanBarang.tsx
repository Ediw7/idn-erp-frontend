import React, { useState, useEffect, useMemo } from 'react';
import { setupApi, SupplierData, GudangData, ItemData } from '../../setup/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useConfirm } from '../../../contexts/ConfirmContext';

interface PenerimaanDetail {
  id: string;
  item_id: number | '';
  kode_barang: string;
  nama_barang: string;
  satuan: string;
  qty: number;
  harga: number;
  keterangan: string;
}

const PenerimaanBarang: React.FC = () => {
  const confirm = useConfirm();
  const [isLoading, setIsLoading] = useState(false);
  
  // Master Data States
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [gudangs, setGudangs] = useState<GudangData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);

  // Form State
  const [form, setForm] = useState({
    no_bukti: '',
    tanggal: new Date().toISOString().split('T')[0],
    supplier_id: '' as number | '',
    alamat_supplier: '',
    gudang_id: '' as number | '',
    no_po: '',
    no_sj: '',
    no_faktur: '',
    keterangan: ''
  });

  // Details State
  const [details, setDetails] = useState<PenerimaanDetail[]>([
    { id: Date.now().toString(), item_id: '', kode_barang: '', nama_barang: '', satuan: '', qty: 0, harga: 0, keterangan: '' }
  ]);

  // Fetch Master Data on Mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [suppRes, gudRes, itemRes] = await Promise.all([
          setupApi.getSupplier(),
          setupApi.getGudang(),
          setupApi.getItem()
        ]);
        setSuppliers(suppRes);
        setGudangs(gudRes);
        setItems(itemRes);
      } catch (error: any) {
        toast.error('Gagal memuat data master: ' + error.message);
      }
    };
    fetchMasterData();
  }, []);

  // Handle Supplier Change (Auto-fill address)
  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const suppId = e.target.value ? Number(e.target.value) : '';
    const selectedSupp = suppliers.find(s => s.id === suppId);
    setForm({
      ...form,
      supplier_id: suppId,
      alamat_supplier: selectedSupp?.alamat || ''
    });
  };

  // Detail Row Handlers
  const handleAddRow = () => {
    setDetails([
      ...details,
      { id: Date.now().toString(), item_id: '', kode_barang: '', nama_barang: '', satuan: '', qty: 0, harga: 0, keterangan: '' }
    ]);
  };

  const handleRemoveRow = (idToRemove: string) => {
    if (details.length === 1) {
      // Clear the row instead of removing if it's the last one
      setDetails([{ id: Date.now().toString(), item_id: '', kode_barang: '', nama_barang: '', satuan: '', qty: 0, harga: 0, keterangan: '' }]);
      return;
    }
    setDetails(details.filter(d => d.id !== idToRemove));
  };

  const handleDetailChange = (id: string, field: keyof PenerimaanDetail, value: any) => {
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
            // Optional: Auto-fill price from setup if applicable, for now set to 0 to force user input
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
    // In a real app, this would call an API. Simulating for now.
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    setForm({ ...form, no_bukti: `PB-${year}${month}-0001` });
    toast.success('Auto No berhasil digenerate');
  };

  const handleBaru = () => {
    setForm({
      no_bukti: '',
      tanggal: new Date().toISOString().split('T')[0],
      supplier_id: '',
      alamat_supplier: '',
      gudang_id: '',
      no_po: '',
      no_sj: '',
      no_faktur: '',
      keterangan: ''
    });
    setDetails([{ id: Date.now().toString(), item_id: '', kode_barang: '', nama_barang: '', satuan: '', qty: 0, harga: 0, keterangan: '' }]);
  };

  const handleSimpan = async () => {
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Data Bukti Penerimaan Barang berhasil disimpan!');
    }, 1000);
  };

  const handleHapus = async () => {
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus dokumen ini?');
    if (isConfirmed) {
      toast.success('Dokumen berhasil dihapus');
      handleBaru();
    }
  };

  // Kalkulasi Total
  const grandTotal = useMemo(() => {
    return details.reduce((sum, row) => sum + (row.qty * row.harga), 0);
  }, [details]);

  // Styling Constants
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";
  const inputClass = "w-full px-3 py-2 border border-slate-300 bg-white rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50";
  const readOnlyClass = "w-full px-3 py-2 border border-slate-200 bg-gray-50 text-gray-500 rounded-sm text-sm font-semibold focus:outline-none";

  return (
    <div className="w-full h-full bg-white rounded-none flex flex-col shadow-sm border border-slate-300">
        
        {/* 2. Header Banner Gelap */}
        <div className="p-6 bg-slate-900 w-full rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Bukti Penerimaan Barang</h2>
            <p className="text-sm text-slate-300 mt-1">Form input penerimaan barang dari supplier ke gudang</p>
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
        <div className="p-6 bg-white w-full rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            
            {/* Kolom Kiri */}
            <div className="space-y-4">
              <div>
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
                    className="px-4 bg-slate-100 border border-slate-300 rounded-sm text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap"
                  >
                    Auto No
                  </button>
                </div>
              </div>
              
              <div>
                <label className={labelClass}>Tanggal</label>
                <input 
                  type="date" 
                  className={inputClass} 
                  value={form.tanggal}
                  onChange={e => setForm({...form, tanggal: e.target.value})}
                />
              </div>

              <div>
                <label className={labelClass}>Nama Supplier</label>
                <select 
                  className={inputClass} 
                  value={form.supplier_id}
                  onChange={handleSupplierChange}
                >
                  <option value="">-- Pilih Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Alamat</label>
                <textarea 
                  rows={3}
                  readOnly
                  className={readOnlyClass}
                  value={form.alamat_supplier}
                />
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-4">
              <div>
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

              <div>
                <label className={labelClass}>No. PO</label>
                <input 
                  type="text" 
                  className={inputClass} 
                  value={form.no_po}
                  onChange={e => setForm({...form, no_po: e.target.value})}
                />
              </div>

              <div>
                <label className={labelClass}>No. Surat Jalan</label>
                <input 
                  type="text" 
                  className={inputClass} 
                  value={form.no_sj}
                  onChange={e => setForm({...form, no_sj: e.target.value})}
                />
              </div>

              <div>
                <label className={labelClass}>No. Faktur</label>
                <input 
                  type="text" 
                  className={inputClass} 
                  value={form.no_faktur}
                  onChange={e => setForm({...form, no_faktur: e.target.value})}
                />
              </div>
            </div>

          </div>

          {/* Keterangan Bawah Grid */}
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
                  <th className="px-4 py-3 font-semibold w-[20%]">Kode Barang</th>
                  <th className="px-4 py-3 font-semibold w-[20%]">Nama Barang</th>
                  <th className="px-4 py-3 font-semibold w-[10%]">Satuan</th>
                  <th className="px-4 py-3 font-semibold w-[10%] text-right">Qty</th>
                  <th className="px-4 py-3 font-semibold w-[15%] text-right">Harga @</th>
                  <th className="px-4 py-3 font-semibold w-[15%] text-right">Total Harga</th>
                  <th className="px-4 py-3 font-semibold">Keterangan</th>
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
                      <input type="text" readOnly className="w-full px-2 py-1.5 bg-gray-50 border border-slate-200 text-slate-500 rounded text-sm" value={row.nama_barang} />
                    </td>
                    <td className="p-2">
                      <input type="text" readOnly className="w-full px-2 py-1.5 bg-gray-50 border border-slate-200 text-slate-500 rounded text-sm" value={row.satuan} />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        min={0}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        value={row.qty || ''}
                        onChange={(e) => handleDetailChange(row.id, 'qty', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        min={0}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        value={row.harga || ''}
                        onChange={(e) => handleDetailChange(row.id, 'harga', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="text" 
                        readOnly 
                        className="w-full px-2 py-1.5 bg-gray-50 border border-slate-200 text-slate-900 font-semibold rounded text-sm text-right" 
                        value={new Intl.NumberFormat('id-ID').format(row.qty * row.harga)} 
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="text" 
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        value={row.keterangan}
                        onChange={(e) => handleDetailChange(row.id, 'keterangan', e.target.value)}
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

          {/* 5. Footer Kalkulasi */}
          <div className="flex justify-end mt-4">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-slate-200 w-full md:w-1/3 shadow-sm">
              <label className="text-sm font-bold text-slate-700 flex-1">TOTAL KESELURUHAN</label>
              <div className="w-1/2">
                <input 
                  type="text" 
                  readOnly 
                  className="w-full px-3 py-2 bg-transparent text-slate-900 text-lg font-extrabold text-right focus:outline-none" 
                  value={`Rp ${new Intl.NumberFormat('id-ID').format(grandTotal)}`}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
  );
};

export default PenerimaanBarang;
