import React, { useState, useEffect, useMemo } from 'react';
import { Printer, Search, RefreshCw } from 'lucide-react';
import { setupApi, PelangganData, ProyekData, SalesmanData } from '../../setup/api';
import toast from 'react-hot-toast';

interface OutstandingData {
  id: string;
  tanggal: string;
  no_invoice: string;
  nama_pelanggan: string;
  alamat: string;
  no_telp: string;
  tgl_jt: string;
  mata_uang: string;
  jumlah: number;
  saldo: number;
  sales: string;
  proyek: string;
  no_so: string;
  no_po: string;
  catatan: string;
}

const OutstandingInvoice: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Master Data
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [proyeks, setProyeks] = useState<ProyekData[]>([]);
  const [salesmen, setSalesmen] = useState<SalesmanData[]>([]);

  // Filter State
  const initialFilter = {
    pelanggan_id: '',
    mata_uang: 'IDR',
    proyek_id: '',
    sales_id: ''
  };
  const [filter, setFilter] = useState(initialFilter);

  // Data State
  const [dataList, setDataList] = useState<OutstandingData[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [pelangganRes, proyekRes, salesRes] = await Promise.all([
          setupApi.getPelanggan(),
          setupApi.getProyek(),
          setupApi.getSalesman()
        ]);
        setPelanggans(pelangganRes);
        setProyeks(proyekRes);
        setSalesmen(salesRes);
      } catch (error: any) {
        toast.error('Gagal memuat master data: ' + error.message);
      }
    };
    fetchMasterData();
  }, []);

  const fetchData = async () => {
    setIsSearching(true);
    try {
      // Simulasi API call dengan delay
      const response = await new Promise<OutstandingData[]>((resolve) => {
        setTimeout(() => {
          resolve([]); // Kosong sebagai simulasi standar
        }, 800);
      });
      setDataList(response);
      if (response.length === 0) {
        // toast.success('Data kosong.');
      }
    } catch (error: any) {
      toast.error('Gagal memuat data outstanding: ' + error.message);
      setDataList([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetFilter = () => {
    setFilter(initialFilter);
    setDataList([]);
  };

  const handleCetak = () => {
    toast.success('Menyiapkan dokumen PDF...');
  };

  // Kalkulasi Footer
  const totals = useMemo(() => {
    const totalInvoice = dataList.reduce((sum, item) => sum + (item.jumlah || 0), 0);
    const totalSaldo = dataList.reduce((sum, item) => sum + (item.saldo || 0), 0);
    return { totalInvoice, totalSaldo };
  }, [dataList]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(val);

  return (
    <div className="w-full h-full bg-white rounded-none flex flex-col shadow-sm border border-slate-300">
      
      {/* 1. Header Banner Gelap */}
      <div className="p-6 bg-slate-900 w-full rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Daftar Outstanding Invoice</h1>
          <p className="text-sm text-slate-300 mt-1">Pantau dan kelola seluruh invoice yang belum lunas atau masih berstatus outstanding.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCetak}
            className="px-5 py-2 bg-transparent border border-white/50 rounded-sm text-sm font-bold text-white hover:bg-white/10 transition-colors shadow-sm flex items-center gap-2"
          >
            <Printer size={16} />
            CETAK LAPORAN
          </button>
          <button 
            onClick={fetchData}
            disabled={isSearching}
            className="px-5 py-2 bg-blue-600 border border-blue-700 rounded-sm text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Terapkan Filter
          </button>
        </div>
      </div>

      {/* 2. Bagian Filter (Area Putih) */}
      <div className="p-6 bg-white w-full rounded-none border-b border-slate-200 shrink-0">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pilih Pelanggan</label>
            <select 
              className="w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              value={filter.pelanggan_id}
              onChange={e => setFilter({...filter, pelanggan_id: e.target.value})}
            >
              <option value="">-- Semua Pelanggan --</option>
              {pelanggans.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>
          
          <div className="w-32">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mata Uang</label>
            <select 
              className="w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              value={filter.mata_uang}
              onChange={e => setFilter({...filter, mata_uang: e.target.value})}
            >
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div className="w-48">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Proyek</label>
            <select 
              className="w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              value={filter.proyek_id}
              onChange={e => setFilter({...filter, proyek_id: e.target.value})}
            >
              <option value="">-- Semua Proyek --</option>
              {proyeks.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>

          <div className="w-48">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sales</label>
            <select 
              className="w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              value={filter.sales_id}
              onChange={e => setFilter({...filter, sales_id: e.target.value})}
            >
              <option value="">-- Semua Sales --</option>
              {salesmen.map(s => (
                <option key={s.id} value={s.id}>{s.nama}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleResetFilter}
            className="px-4 py-1.5 bg-transparent border border-slate-300 rounded-sm text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 h-[34px]"
            title="Reset Filter"
          >
            <RefreshCw size={14} />
            Show All
          </button>
        </div>
      </div>

      {/* 3. Tabel Outstanding Invoice */}
      <div className="flex-1 overflow-auto bg-white custom-scrollbar relative">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-y border-slate-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap border-r border-slate-200">Tanggal</th>
              <th className="px-4 py-3 whitespace-nowrap border-r border-slate-200">No. Invoice</th>
              <th className="px-4 py-3 min-w-[200px] border-r border-slate-200">Nama Pelanggan</th>
              <th className="px-4 py-3 min-w-[250px] border-r border-slate-200">Alamat Lengkap</th>
              <th className="px-4 py-3 whitespace-nowrap border-r border-slate-200">No. Telp</th>
              <th className="px-4 py-3 whitespace-nowrap text-center border-r border-slate-200">Tgl JT</th>
              <th className="px-4 py-3 whitespace-nowrap text-center border-r border-slate-200">Ccy</th>
              <th className="px-4 py-3 whitespace-nowrap text-right border-r border-slate-200">Jumlah</th>
              <th className="px-4 py-3 whitespace-nowrap text-right border-r border-slate-200">Saldo</th>
              <th className="px-4 py-3 whitespace-nowrap border-r border-slate-200">Sales</th>
              <th className="px-4 py-3 whitespace-nowrap border-r border-slate-200">Proyek</th>
              <th className="px-4 py-3 whitespace-nowrap border-r border-slate-200">No SO</th>
              <th className="px-4 py-3 whitespace-nowrap border-r border-slate-200">No PO</th>
              <th className="px-4 py-3 min-w-[150px]">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isSearching ? (
              <tr>
                <td colSpan={14} className="px-4 py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="font-medium text-sm">Menarik data outstanding...</span>
                  </div>
                </td>
              </tr>
            ) : dataList.length > 0 ? (
              dataList.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-4 py-2 whitespace-nowrap">{row.tanggal}</td>
                  <td className="px-4 py-2 font-mono text-xs text-blue-600 font-semibold">{row.no_invoice}</td>
                  <td className="px-4 py-2 font-medium">{row.nama_pelanggan}</td>
                  <td className="px-4 py-2 text-xs text-slate-600 truncate max-w-[250px]" title={row.alamat}>{row.alamat}</td>
                  <td className="px-4 py-2 text-xs">{row.no_telp}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-center text-xs">{row.tgl_jt}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-center text-xs">{row.mata_uang}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-right font-medium">{formatCurrency(row.jumlah)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-right font-bold text-red-600">{formatCurrency(row.saldo)}</td>
                  <td className="px-4 py-2 text-xs">{row.sales}</td>
                  <td className="px-4 py-2 text-xs">{row.proyek}</td>
                  <td className="px-4 py-2 font-mono text-xs">{row.no_so}</td>
                  <td className="px-4 py-2 font-mono text-xs">{row.no_po}</td>
                  <td className="px-4 py-2 text-xs text-slate-500">{row.catatan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={14} className="px-4 py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <span className="font-medium text-sm">Tidak ada data outstanding invoice.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Footer Kalkulasi */}
      <div className="bg-white border-t border-slate-300 p-4 shrink-0 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="text-sm text-blue-600 font-medium">
          * Catatan: Untuk melihat secara detail transaksi di atas, letakkan kursor pada baris transaksi yang diinginkan, lalu dobel klik.
        </div>
        
        <div className="flex items-center bg-gray-50 border border-slate-300 rounded-sm overflow-hidden shadow-sm">
          <div className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-200 border-r border-slate-300">TOTAL INVOICE</div>
          <div className="px-4 py-2 text-sm font-bold text-slate-900 text-right min-w-[150px] border-r border-slate-300">
            {formatCurrency(totals.totalInvoice)}
          </div>
          
          <div className="px-4 py-2 text-xs font-bold text-blue-800 bg-blue-100 border-r border-slate-300">SALDO PIUTANG</div>
          <div className="px-4 py-2 text-sm font-bold text-blue-700 text-right min-w-[150px]">
            {formatCurrency(totals.totalSaldo)}
          </div>
        </div>
      </div>

    </div>
  );
};

export default OutstandingInvoice;
