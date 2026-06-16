import React, { useState, useEffect, useMemo } from 'react';
import { setupApi, GudangData, ItemData } from '../../setup/api';
import toast from 'react-hot-toast';
import { Search, Printer } from 'lucide-react';
// Assuming you have an axiosClient or similar. Using standard fetch for demonstration
// import axiosClient from '../../../utils/axios';

interface MutasiDetail {
  id: number;
  tgl_bukti: string;
  no_bukti: string;
  keterangan: string;
  qty_masuk: number;
  qty_keluar: number;
}

interface SaldoGudang {
  gudang_id: number;
  kode_gudang: string;
  nama_gudang: string;
  qty_akhir: number;
}

interface StockCardResponse {
  mutasi: MutasiDetail[];
  rangkuman: SaldoGudang[];
  ringkasan: {
    qty_masuk: number;
    qty_keluar: number;
    qty_akhir: number;
  };
}

const KartuStock: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Master Data States
  const [items, setItems] = useState<ItemData[]>([]);
  const [gudangs, setGudangs] = useState<GudangData[]>([]);

  // Filter States
  const [filter, setFilter] = useState({
    item_id: '' as number | '',
    gudang_id: '' as number | ''
  });

  // Table Data States
  const [mutasiList, setMutasiList] = useState<MutasiDetail[]>([]);
  const [saldoList, setSaldoList] = useState<SaldoGudang[]>([]);
  const [ringkasan, setRingkasan] = useState({ qty_masuk: 0, qty_keluar: 0, qty_akhir: 0 });

  // Fetch Master Data on Mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [itemRes, gudRes] = await Promise.all([
          setupApi.getItem(),
          setupApi.getGudang()
        ]);
        setItems(itemRes);
        setGudangs(gudRes);
      } catch (error: any) {
        toast.error('Gagal memuat data master: ' + error.message);
      }
    };
    fetchMasterData();
  }, []);

  // Fetch Stock Card Data
  const fetchStockCardData = async () => {
    if (filter.item_id === '') {
      toast.error('Pilih Kode Barang terlebih dahulu!');
      return;
    }

    setIsSearching(true);
    try {
      // Menggunakan fetch sebagai representasi pemanggilan API ke backend
      // const response = await axiosClient.get('/api/inventory/stock-card', { params: filter });
      
      // Simulasi panggilan API karena endpoint belum dipastikan ada di backend
      const response = await new Promise<StockCardResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            mutasi: [],
            rangkuman: [],
            ringkasan: { qty_masuk: 0, qty_keluar: 0, qty_akhir: 0 }
          });
        }, 800);
      });

      // Mapping data hasil response API ke state
      setMutasiList(response.mutasi);
      setSaldoList(response.rangkuman);
      setRingkasan(response.ringkasan);
      
      if (response.mutasi.length === 0) {
        toast.success('Data mutasi kosong untuk filter tersebut.');
      } else {
        toast.success('Data mutasi berhasil dimuat.');
      }
      
    } catch (error: any) {
      toast.error('Gagal menarik data stock card: ' + error.message);
      // Fallback empty state
      setMutasiList([]);
      setSaldoList([]);
      setRingkasan({ qty_masuk: 0, qty_keluar: 0, qty_akhir: 0 });
    } finally {
      setIsSearching(false);
    }
  };

  // Trigger fetch when item_id changes
  useEffect(() => {
    if (filter.item_id !== '') {
      fetchStockCardData();
    } else {
      // Clear data if no item selected
      setMutasiList([]);
      setSaldoList([]);
      setRingkasan({ qty_masuk: 0, qty_keluar: 0, qty_akhir: 0 });
    }
  }, [filter.item_id]);

  const handleCetakLaporan = () => {
    if (filter.item_id === '') {
      toast.error('Tidak ada data yang bisa dicetak. Pilih Kode Barang!');
      return;
    }
    toast.success('Menyiapkan dokumen cetak...');
  };

  const totalQtyRangkuman = useMemo(() => {
    return saldoList.reduce((sum, item) => sum + (item.qty_akhir || 0), 0);
  }, [saldoList]);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] p-8">
      {/* 1. Outer Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full">
        
        {/* 2. Header Banner Gelap */}
        <div className="p-6 bg-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Kartu Stock Barang</h2>
            <p className="text-sm text-slate-300 mt-1">Laporan detail mutasi masuk dan keluar per item inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCetakLaporan} 
              disabled={isSearching}
              className="px-5 py-2 bg-slate-100 border border-slate-300 rounded-sm text-sm font-bold text-slate-800 hover:bg-white transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Printer size={16} />
              CETAK LAPORAN
            </button>
            <button 
              onClick={fetchStockCardData} 
              disabled={isSearching}
              className="px-5 py-2 bg-blue-600 border border-blue-700 rounded-sm text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              CARI DATA
            </button>
          </div>
        </div>

        {/* 3. Body Form / Filter Block */}
        <div className="p-6 bg-white border-b border-slate-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            
            {/* Sisi Kiri (Filter) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Kode Barang</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={filter.item_id}
                  onChange={e => setFilter({...filter, item_id: e.target.value ? Number(e.target.value) : ''})}
                >
                  <option value="">-- Semua Barang (Pilih Salah Satu) --</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.kode} - {item.nama}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Gudang (Opsional)</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={filter.gudang_id}
                  onChange={e => setFilter({...filter, gudang_id: e.target.value ? Number(e.target.value) : ''})}
                >
                  <option value="">-- Semua Gudang --</option>
                  {gudangs.map(g => (
                    <option key={g.id} value={g.id}>{g.nama_gudang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sisi Kanan (Widget Ringkasan) */}
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="bg-gray-50 border border-slate-200 px-4 py-2 rounded-md shadow-sm min-w-[120px]">
                <p className="text-xs text-slate-500 font-semibold mb-1">Qty Masuk</p>
                <p className="text-lg font-black text-blue-600">{new Intl.NumberFormat('id-ID').format(ringkasan.qty_masuk)}</p>
              </div>
              <div className="bg-gray-50 border border-slate-200 px-4 py-2 rounded-md shadow-sm min-w-[120px]">
                <p className="text-xs text-slate-500 font-semibold mb-1">Qty Keluar</p>
                <p className="text-lg font-black text-red-600">{new Intl.NumberFormat('id-ID').format(ringkasan.qty_keluar)}</p>
              </div>
              <div className="bg-slate-100 border border-slate-300 px-4 py-2 rounded-md shadow-sm min-w-[120px]">
                <p className="text-xs text-slate-600 font-bold mb-1">Qty Akhir</p>
                <p className="text-xl font-black text-slate-900">{new Intl.NumberFormat('id-ID').format(ringkasan.qty_akhir)}</p>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Tata Letak Dua Kolom (Main Content Layout) */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Kolom Kiri: Detail Mutasi Stock */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <div className="p-3 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800">Detail Mutasi Stock</h3>
                  {isSearching && <span className="text-xs text-blue-600 font-semibold animate-pulse">Memuat data...</span>}
                </div>
                <div className="overflow-x-auto h-[400px] custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 whitespace-nowrap">Tgl Bukti</th>
                        <th className="px-4 py-3 whitespace-nowrap">No Bukti</th>
                        <th className="px-4 py-3 min-w-[200px]">Keterangan</th>
                        <th className="px-4 py-3 text-right whitespace-nowrap">Qty Masuk</th>
                        <th className="px-4 py-3 text-right whitespace-nowrap">Qty Keluar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mutasiList.length > 0 ? (
                        mutasiList.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap">{row.tgl_bukti}</td>
                            <td className="px-4 py-2 font-mono text-xs">{row.no_bukti}</td>
                            <td className="px-4 py-2">{row.keterangan}</td>
                            <td className="px-4 py-2 text-right font-medium text-blue-600">{new Intl.NumberFormat('id-ID').format(row.qty_masuk)}</td>
                            <td className="px-4 py-2 text-right font-medium text-red-600">{new Intl.NumberFormat('id-ID').format(row.qty_keluar)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center text-slate-400 font-medium">
                            {filter.item_id === '' ? 'Pilih Kode Barang untuk melihat mutasi' : 'Tidak ada mutasi untuk kriteria ini.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Rangkuman Saldo per Gudang */}
            <div className="lg:col-span-1 flex flex-col h-[400px]">
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-3 bg-slate-100 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800">Rangkuman Saldo Barang</h3>
                </div>
                <div className="flex-1 overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-slate-200 sticky top-0 shadow-sm">
                      <tr>
                        <th className="px-3 py-3">Kode Gudang</th>
                        <th className="px-3 py-3">Gudang</th>
                        <th className="px-3 py-3 text-right">Qty Akhir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {saldoList.length > 0 ? (
                        saldoList.map((row) => (
                          <tr key={row.gudang_id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-2 font-mono text-xs">{row.kode_gudang}</td>
                            <td className="px-3 py-2">{row.nama_gudang}</td>
                            <td className="px-3 py-2 text-right font-bold text-slate-800">{new Intl.NumberFormat('id-ID').format(row.qty_akhir)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-3 py-8 text-center text-slate-400 font-medium">
                            Data kosong
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Total Quantity Footer */}
                <div className="bg-slate-800 p-3 flex justify-between items-center border-t border-slate-200 text-white shadow-inner">
                  <span className="text-sm font-bold">Total Quantity</span>
                  <span className="text-lg font-black">{new Intl.NumberFormat('id-ID').format(totalQtyRangkuman)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default KartuStock;
