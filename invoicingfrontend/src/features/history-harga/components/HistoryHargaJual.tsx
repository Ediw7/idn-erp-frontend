import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setupApi, ItemData, PelangganData } from '../../setup/api';
import { salesOrderApi } from '../../sales-order/api';
import toast from 'react-hot-toast';

interface HistoryRecord {
  id: string;
  tgl: string;
  no_invoice: string;
  pelanggan_id: number | null;
  pelanggan_nama: string;
  terms: string;
  curr: string;
  item_id: number | null;
  kode_item: string;
  nama_item: string;
  qty: number;
  harga_satuan: number;
  harga_jual: number;
}

const HistoryHargaJual: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<ItemData[]>([]);
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);

  const [filterItemId, setFilterItemId] = useState<number | null>(null);
  const [filterPelangganId, setFilterPelangganId] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(100);

  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Searchable Dropdown State
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const itemDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMasterData();
    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target as Node)) {
        setIsItemDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMasterData = async () => {
    try {
      const [i, p] = await Promise.all([
        setupApi.getItem(),
        setupApi.getPelanggan()
      ]);
      setItems(i || []);
      setPelanggans(p || []);
    } catch (e) {
      console.error(e);
      toast.error('Gagal memuat data master.');
    }
  };

  const fetchHistoryData = async (itemId: number | null, pelangganId: number | null, currentLimit: number) => {
    setIsLoading(true);
    try {
      // Panggil API dengan parameter pelanggan jika ada (backend mungkin mendukung pelanggan_id)
      const filters: any = {};
      if (pelangganId) filters.pelanggan_id = pelangganId;
      
      const salesOrders = await salesOrderApi.getAll(filters);
      
      let allLines: HistoryRecord[] = [];
      salesOrders.forEach(so => {
        (so.lines || []).forEach(line => {
          allLines.push({
            id: `${so.id}-${line.id || Math.random()}`,
            tgl: so.tgl_so || '',
            no_invoice: so.no_so || '',
            pelanggan_id: so.pelanggan_id,
            pelanggan_nama: so.pelanggan_nama || '',
            terms: so.pembayaran_nama || 'Kredit 14 Hari',
            curr: so.mata_uang_kode || 'IDR',
            item_id: line.item_id,
            kode_item: line.kode_barang || items.find(i => i.id === line.item_id)?.kode || '',
            nama_item: line.nama_barang || items.find(i => i.id === line.item_id)?.nama || '',
            qty: line.kuantum || 0,
            harga_satuan: line.harga_satuan || 0,
            harga_jual: line.harga_jual || ((line.kuantum * line.harga_satuan) - (((line.kuantum * line.harga_satuan) * line.disc_persen / 100) + line.disc_harga))
          });
        });
      });

      // Filter by Item ID di sisi klien jika ada
      if (itemId) {
        allLines = allLines.filter(x => x.item_id === itemId);
      }
      
      // Filter by Pelanggan ID di sisi klien untuk berjaga-jaga jika backend tidak filter
      if (pelangganId) {
        allLines = allLines.filter(x => x.pelanggan_id === pelangganId);
      }

      // Urutkan berdasarkan tanggal terbaru
      allLines.sort((a, b) => new Date(b.tgl).getTime() - new Date(a.tgl).getTime());

      // Terapkan limit
      if (currentLimit > 0) {
        allLines = allLines.slice(0, currentLimit);
      }

      setHistoryData(allLines);
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengambil data riwayat harga jual.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    fetchHistoryData(filterItemId, filterPelangganId, limit);
  };

  const handleShowAll = () => {
    setFilterItemId(null);
    setFilterPelangganId(null);
    setItemSearchTerm('');
    fetchHistoryData(null, null, limit);
  };

  const selectedItem = items.find(i => i.id === filterItemId);
  
  // Filter items for searchable dropdown
  const filteredItems = items.filter(i => 
    i.kode.toLowerCase().includes(itemSearchTerm.toLowerCase()) || 
    i.nama.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Cek History Harga Jual</h2>
          <p className="text-xs text-slate-300 mt-1">Pemantauan riwayat harga jual per pelanggan atau per barang.</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white"
        >
          <X size={14} /> TUTUP
        </button>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-8 shrink-0">
        <div className="flex flex-col gap-3 flex-1 min-w-[300px] max-w-md">
          {/* Searchable Dropdown for Kode Barang */}
          <div className="flex items-center relative" ref={itemDropdownRef}>
            <label className="text-sm font-semibold text-slate-700 w-32 shrink-0">Kode Barang</label>
            <div className="flex gap-1 flex-1 relative">
              <div 
                className="w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm cursor-text flex justify-between items-center"
                onClick={() => setIsItemDropdownOpen(true)}
              >
                <span className={filterItemId ? "text-slate-900" : "text-slate-400"}>
                  {selectedItem ? selectedItem.kode : 'Ketik/Pilih Barang...'}
                </span>
                <Search size={14} className="text-slate-400" />
              </div>
              
              {isItemDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 shadow-lg rounded-sm z-50 max-h-60 flex flex-col">
                  <div className="p-2 border-b border-slate-100">
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded-sm focus:outline-none focus:border-blue-500"
                      placeholder="Cari kode atau nama barang..."
                      value={itemSearchTerm}
                      onChange={(e) => setItemSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto flex-1">
                    <div 
                      className="px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        setFilterItemId(null);
                        setItemSearchTerm('');
                        setIsItemDropdownOpen(false);
                      }}
                    >
                      -- Semua Barang --
                    </div>
                    {filteredItems.length > 0 ? (
                      filteredItems.map(i => (
                        <div 
                          key={i.id} 
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 border-t border-slate-50 ${filterItemId === i.id ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'}`}
                          onClick={() => {
                            setFilterItemId(i.id || null);
                            setItemSearchTerm('');
                            setIsItemDropdownOpen(false);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span>{i.kode}</span>
                            <span className="text-xs text-slate-400 truncate ml-4 text-right">{i.nama}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-center text-slate-500 italic">Barang tidak ditemukan</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <label className="text-sm font-semibold text-slate-700 w-32 shrink-0">Nama Barang</label>
            <input 
              type="text" 
              className="w-full px-3 py-1.5 bg-slate-200 border border-slate-300 text-slate-600 rounded-sm text-sm" 
              readOnly 
              value={selectedItem?.nama || ''} 
              placeholder="Terisi otomatis..."
            />
          </div>

          <div className="flex items-center">
            <label className="text-sm font-semibold text-slate-700 w-32 shrink-0">Nama Pelanggan</label>
            <select 
              className="w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm" 
              value={filterPelangganId || ''} 
              onChange={e => setFilterPelangganId(Number(e.target.value) || null)}
            >
              <option value="">Semua Pelanggan</option>
              {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 justify-start">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">Tampilkan</span>
            <input 
              type="number" 
              className="w-20 px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm text-center" 
              value={limit} 
              onChange={e => setLimit(Number(e.target.value))} 
              min="1"
            />
            <span className="text-sm font-semibold text-slate-700">record terakhir</span>
          </div>
          <div className="flex gap-2 items-start mt-2">
            <button 
              className="flex items-center justify-center gap-2 px-6 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-transparent transition-colors rounded-sm shadow-sm min-w-[120px]" 
              onClick={handleFilter}
              disabled={isLoading}
            >
              <Filter size={14} /> {isLoading ? 'MEMUAT...' : 'FILTER'}
            </button>
            <button 
              className="flex items-center justify-center gap-2 px-6 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors rounded-sm shadow-sm min-w-[150px]" 
              onClick={handleShowAll}
              disabled={isLoading}
            >
              TAMPILKAN SEMUA
            </button>
          </div>
        </div>
      </div>

      {/* Data Grid Section */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-12">No</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-24">Tanggal</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32">No. Invoice</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold min-w-[200px]">Nama Pelanggan</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-24">Terms</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-16">Ccy</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24">Kode Item</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold min-w-[200px]">Nama Item</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-right w-24">Qty</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-right w-32">Harga Satuan</th>
                <th className="px-3 py-2 border-slate-300 font-semibold text-right w-32">Harga Jual</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 italic">Memuat data riwayat harga...</td>
                </tr>
              ) : historyData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 italic border-b border-slate-100">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="text-slate-300 mb-2" />
                      <p>Klik <strong>'FILTER'</strong> atau <strong>'TAMPILKAN SEMUA'</strong> untuk memuat riwayat harga.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                historyData.map((row, idx) => (
                  <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center">{row.tgl}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 font-medium">{row.no_invoice}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.pelanggan_nama}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center">{row.terms}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center">{row.curr}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.kode_item}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.nama_item}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-right">{row.qty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-right">{row.harga_satuan.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-1.5 text-right font-medium text-slate-800">{row.harga_jual.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Pagination */}
        <div className="bg-slate-50 border-t border-slate-200 p-2 flex items-center justify-start text-xs text-slate-600 gap-2 shrink-0">
          <span className="ml-2 font-semibold">Record:</span>
          <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm mx-1">
            <button className="px-2 py-1 bg-slate-100 hover:bg-white border-r border-slate-300 font-bold">{'|<'}</button>
            <button className="px-2 py-1 bg-slate-100 hover:bg-white border-r border-slate-300 font-bold">{'<'}</button>
            <div className="px-4 py-1 bg-white min-w-[50px] text-center font-mono font-semibold">1</div>
            <button className="px-2 py-1 bg-slate-100 hover:bg-white border-l border-slate-300 font-bold">{'>'}</button>
            <button className="px-2 py-1 bg-slate-100 hover:bg-white border-l border-slate-300 font-bold">{'>|'}</button>
          </div>
          <span className="font-semibold">of {historyData.length}</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryHargaJual;
