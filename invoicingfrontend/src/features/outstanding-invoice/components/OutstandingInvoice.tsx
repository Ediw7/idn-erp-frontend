import React, { useState, useEffect, useMemo } from 'react';
import { Printer, RefreshCw } from 'lucide-react';
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

const mockData: OutstandingData[] = [
  { id: '1', tanggal: '1/7/2020', no_invoice: 'FT/001/01/2020', nama_pelanggan: 'PT ISM Bogasari Flour', alamat: 'Jl. Raya Cilincing, Tanjung Priok', no_telp: '021-4301048', tgl_jt: '1/21/2020', mata_uang: 'IDR', jumlah: 11450400.00, saldo: 6450400.00, sales: 'Windi', proyek: '', no_so: '', no_po: '', catatan: '' },
  { id: '2', tanggal: '6/1/2020', no_invoice: 'FT/001/06/2020', nama_pelanggan: 'PT Sari Wangi', alamat: 'Jl. Sukabumi No. 123, Menteng', no_telp: '', tgl_jt: '6/8/2020', mata_uang: 'IDR', jumlah: 1127500.00, saldo: 1127500.00, sales: 'Andi', proyek: '', no_so: 'SO/001/05/2020', no_po: 'PO-001', catatan: '' },
  { id: '3', tanggal: '1/15/2020', no_invoice: 'FT/002/01/2020', nama_pelanggan: 'PT Sari Wangi', alamat: 'Jl. Sukabumi No. 123, Menteng', no_telp: '', tgl_jt: '1/22/2020', mata_uang: 'IDR', jumlah: 3413100.00, saldo: 3413100.00, sales: 'Andi', proyek: '', no_so: '', no_po: '', catatan: '' },
  { id: '4', tanggal: '6/1/2020', no_invoice: 'FT/002/06/2020', nama_pelanggan: 'PT ISM Bogasari Flour', alamat: 'Jl. Raya Cilincing, Tanjung Priok', no_telp: '021-4301048', tgl_jt: '6/15/2020', mata_uang: 'IDR', jumlah: 1390400.00, saldo: 1390400.00, sales: '', proyek: '', no_so: 'SO/001/06/2020', no_po: 'PO-001', catatan: '' },
  { id: '5', tanggal: '12/30/2020', no_invoice: 'FT/002/12/2020', nama_pelanggan: 'Toko Maju Jaya', alamat: 'Jl. Perhubungan Raya, Jakarta', no_telp: '', tgl_jt: '1/13/2021', mata_uang: 'IDR', jumlah: 418000.00, saldo: 418000.00, sales: '', proyek: '', no_so: 'SO/005/12/2020', no_po: '', catatan: '' },
  { id: '6', tanggal: '1/15/2020', no_invoice: 'FT/003/01/2020', nama_pelanggan: 'PT ISM Bogasari Flour', alamat: 'Jl. Raya Cilincing, Tanjung Priok', no_telp: '021-4301048', tgl_jt: '1/29/2020', mata_uang: 'IDR', jumlah: 2530000.00, saldo: 2530000.00, sales: 'Windi', proyek: '', no_so: '', no_po: '', catatan: '' },
  { id: '7', tanggal: '12/30/2020', no_invoice: 'FT/003/12/2020', nama_pelanggan: 'PT Sari Wangi', alamat: 'Jl. Sukabumi No. 123, Menteng', no_telp: '', tgl_jt: '1/6/2021', mata_uang: 'IDR', jumlah: 1100000.00, saldo: 1100000.00, sales: '', proyek: '', no_so: 'SO/003/01/2020', no_po: 'PO-005', catatan: '' },
  { id: '8', tanggal: '12/12/2019', no_invoice: 'FT/124/12/2029', nama_pelanggan: 'PT ISM Bogasari Flour', alamat: 'Jl. Raya Cilincing, Tanjung Priok', no_telp: '021-4301048', tgl_jt: '12/26/2019', mata_uang: 'IDR', jumlah: 23000000.00, saldo: 23000000.00, sales: '', proyek: 'Proyek Kuningan', no_so: '', no_po: '', catatan: '' },
];

const OutstandingInvoice: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Master Data
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [proyeks, setProyeks] = useState<ProyekData[]>([]);
  const [salesmen, setSalesmen] = useState<SalesmanData[]>([]);

  // Filter State
  const initialFilter = {
    pelanggan_nama: '',
    periode: '2026-06',
  };
  const [filter, setFilter] = useState(initialFilter);

  // Data State
  const [dataList, setDataList] = useState<OutstandingData[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [pelangganRes, proyekRes, salesRes] = await Promise.all([
          setupApi.getPelanggan().catch(() => []),
          setupApi.getProyek().catch(() => []),
          setupApi.getSalesman().catch(() => [])
        ]);
        setPelanggans(pelangganRes);
        setProyeks(proyekRes);
        setSalesmen(salesRes);
      } catch (error: any) {
        toast.error('Gagal memuat master data');
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    // Fetch live data from localStorage instead of mockData
    if (pelanggans.length > 0) {
      const savedInvoices = localStorage.getItem('edi_invoices');
      const invoices = savedInvoices ? JSON.parse(savedInvoices) : [];
      
      const outstanding: OutstandingData[] = invoices.map((inv: any) => {
        // Hitung total invoice dengan benar (memasukkan disc_persen dan disc_harga)
        const subtotal = (inv.lines || []).reduce((acc: number, line: any) => {
          const base = (line.kuantum || 0) * (line.harga_satuan || 0);
          const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
          return acc + (base - disc);
        }, 0);
        
        const dpp = subtotal - (inv.potongan_harga || 0);
        const ppn = dpp * (inv.ppn_persen || 0) / 100;
        const totalInvoice = dpp + ppn + (inv.ongkos_angkut || 0);

        // Simulasi saldo
        // Dikurangi total pembayaran dan potongan dari edi_pembayaran
        const pembayaranSaved = localStorage.getItem('edi_pembayaran');
        const pembayaranList = pembayaranSaved ? JSON.parse(pembayaranSaved) : [];
        const totalDibayar = pembayaranList.reduce((acc: number, bayar: any) => {
          // Cari apakah invoice ini dibayar di dokumen pembayaran ini
          const details = (bayar.lines || []).filter((l: any) => l.no_invoice === inv.no_invoice);
          // Jumlahkan pembayaran + potongan yang diberikan untuk invoice ini
          const sumPerBukti = details.reduce((sum: number, l: any) => sum + Number(l.pembayaran || 0) + Number(l.potongan || 0), 0);
          return acc + sumPerBukti;
        }, 0);

        const saldo = totalInvoice - totalDibayar;

        const pelanggan = pelanggans.find(p => p.id === inv.pembeli_id);
        const proyekName = proyeks.find(p => p.kode === inv.proyek)?.nama || '';
        const salesName = salesmen.find(s => s.id === inv.salesman_id)?.nama || '';

        return {
          id: inv.id || inv.no_invoice,
          tanggal: inv.tgl_invoice,
          no_invoice: inv.no_invoice,
          nama_pelanggan: pelanggan ? pelanggan.nama : 'Unknown',
          alamat: inv.alamat || '',
          no_telp: pelanggan ? pelanggan.telepon : '',
          tgl_jt: inv.tgl_jt,
          mata_uang: inv.mata_uang || 'IDR',
          jumlah: totalInvoice,
          saldo: saldo,
          sales: salesName,
          proyek: proyekName,
          no_so: inv.no_so || '',
          no_po: inv.no_po || '',
          catatan: inv.catatan || ''
        };
      });

      // Filter yang benar-benar outstanding (saldo > 0)
      setDataList(outstanding.filter(item => item.saldo > 0));
    }
  }, [pelanggans, proyeks, salesmen]);

  const handleResetFilter = () => {
    setFilter({
      pelanggan_nama: '',
      periode: '2026-06',
    });
  };

  const handleCetak = () => {
    toast.success('Menyiapkan dokumen PDF...');
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return dataList.filter(item => {
      if (filter.pelanggan_nama && item.nama_pelanggan !== filter.pelanggan_nama) return false;
      if (filter.periode && !item.tanggal.startsWith(filter.periode)) return false;
      return true;
    });
  }, [dataList, filter]);

  // Kalkulasi Footer
  const totals = useMemo(() => {
    const totalInvoice = filteredData.reduce((sum, item) => sum + (item.jumlah || 0), 0);
    const totalSaldo = filteredData.reduce((sum, item) => sum + (item.saldo || 0), 0);
    return { totalInvoice, totalSaldo };
  }, [filteredData]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val);

  return (
    <div className="bg-slate-50 flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Daftar Outstanding Invoice</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Bulan:</span>
              <select 
                value={filter.periode.split('-')[1]} 
                onChange={e => setFilter({...filter, periode: `${filter.periode.split('-')[0]}-${e.target.value}`})}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
              <span className="text-xs text-slate-300 font-medium ml-1">Tahun:</span>
              <select 
                value={filter.periode.split('-')[0]} 
                onChange={e => setFilter({...filter, periode: `${e.target.value}-${filter.periode.split('-')[1]}`})}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Pelanggan:</span>
              <select 
                value={filter.pelanggan_nama} 
                onChange={e => setFilter({...filter, pelanggan_nama: e.target.value})}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-48"
              >
                <option value="">-- Semua Pelanggan --</option>
                {pelanggans.map(p => (
                  <option key={p.id} value={p.nama}>{p.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCetak} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
             <Printer size={14} /> CETAK LAPORAN
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">Tanggal</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">No. Invoice</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Nama Pelanggan</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Alamat</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">No. Telp</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">Tgl JT</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">Mata Uang</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">Jumlah</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">Saldo</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">Sales</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">Proyek</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">No SO</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">No PO</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="px-3 py-2 text-slate-600 text-center">{row.tanggal}</td>
                      <td className="px-3 py-2 font-mono text-slate-800 font-medium text-center">{row.no_invoice}</td>
                      <td className="px-3 py-2 text-slate-800">{row.nama_pelanggan}</td>
                      <td className="px-3 py-2 text-slate-600 truncate max-w-[250px]" title={row.alamat}>{row.alamat}</td>
                      <td className="px-3 py-2 text-slate-600 text-center">{row.no_telp || '-'}</td>
                      <td className="px-3 py-2 text-slate-600 text-center">{row.tgl_jt}</td>
                      <td className="px-3 py-2 text-slate-600 font-medium text-center">{row.mata_uang}</td>
                      <td className="px-3 py-2 font-mono text-slate-800 text-right">{formatCurrency(row.jumlah)}</td>
                      <td className="px-3 py-2 font-mono text-slate-800 text-right font-bold">{formatCurrency(row.saldo)}</td>
                      <td className="px-3 py-2 text-slate-600 text-center">{row.sales || '-'}</td>
                      <td className="px-3 py-2 text-slate-600 text-center">{row.proyek || '-'}</td>
                      <td className="px-3 py-2 font-mono text-slate-600 text-center">{row.no_so || '-'}</td>
                      <td className="px-3 py-2 font-mono text-slate-600 text-center">{row.no_po || '-'}</td>
                      <td className="px-3 py-2 text-slate-500">{row.catatan || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={14} className="px-4 py-8 text-center text-slate-500 italic">
                      Tidak ada data outstanding invoice.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Totals */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 flex justify-end gap-6">
            <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm">
              <span className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300 uppercase tracking-wide flex-1">Total Invoice</span>
              <span className="px-4 py-2 text-sm font-bold text-slate-900 text-right min-w-[160px] font-mono">
                {formatCurrency(totals.totalInvoice)}
              </span>
            </div>
            <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm">
              <span className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300 uppercase tracking-wide flex-1">Total Saldo Piutang</span>
              <span className="px-4 py-2 text-sm font-bold text-blue-800 text-right min-w-[160px] font-mono">
                {formatCurrency(totals.totalSaldo)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutstandingInvoice;
