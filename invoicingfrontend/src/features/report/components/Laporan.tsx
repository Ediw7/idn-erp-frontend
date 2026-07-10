import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Printer } from 'lucide-react';
import axiosClient from '../../../lib/axiosClient';
import toast from 'react-hot-toast';

const REPORT_TYPES = [
  { id: 'so_1', title: 'Sales Order (A4 / Kwarto / 1/2 Kwarto)', type: 'item' },
  { id: 'sj_1', title: 'Surat Jalan (A4 / Kwarto / 1/2 Kwarto)', type: 'item' },
  { id: 'sj_2', title: 'Surat Jalan (A4 / Kwarto / 1/2 Kwarto) - Font 10', type: 'item' },
  { id: 'sj_3', title: 'Surat Jalan Kop Surat (A4)', type: 'item' },
  { id: 'inv_1', title: 'Invoice (A4 / Kuarto)', type: 'item' },
  { id: 'inv_2', title: 'Invoice (A4 / Kuarto) - Font 10', type: 'item' },
  { id: 'inv_3', title: 'Invoice Kop Surat (A4)', type: 'item' },
  { id: 'inv_4', title: 'Invoice Kop Surat (A4) - Font 10', type: 'item' },
  { id: 'inv_5', title: 'Invoice (1/2 Kuarto)', type: 'item' },
  { id: 'inv_6', title: 'Invoice (1/2 Kuarto) - Font 10', type: 'item' },
  { id: 'inv_7', title: 'Invoice Sederhana - Tanpa Disc & DP (A4 / Letter / Kuarto)', type: 'item' },
  { id: 'inv_8', title: 'Invoice Plus Kwitansi', type: 'item' },
  { id: 'inv_9', title: 'Invoice Plus Surat Jalan (1 SJ / 1 Invoice)', type: 'item' },
  { id: 'inv_10', title: 'Invoice Plus Surat Jalan (1 SJ / 1 Invoice) - Font 10', type: 'item' },
  { id: 'inv_11', title: 'Invoice w/ Disc (A4 / Kuarto)', type: 'item' },
  { id: 'kwi_1', title: 'Kwitansi (1/2 Kwarto)', type: 'item' },
  { id: 'nk_1', title: 'Nota Kredit (1/2 Kwarto)', type: 'item' },
  { id: 'lbl_1', title: 'Label Amplop', type: 'item' },
  { id: 'bpk_1', title: 'Bukti Penerimaan Kas/Bank (1/2 Kwarto)', type: 'item' },

  { id: 'h_fp', title: 'Faktur Pajak', type: 'header' },
  { id: 'fp_1', title: 'Faktur Pajak Hal 1 & 2 (A4)', type: 'item' },
  { id: 'fp_2', title: 'Faktur Pajak Hal 3 (A4)', type: 'item' },
  { id: 'fp_3', title: 'Faktur Pajak Hal 4 (A4)', type: 'item' },
  { id: 'fp_4', title: 'Faktur Pajak (Pre-printed Form)', type: 'item' },
  { id: 'fp_5', title: 'Faktur Pajak (Continuous Paper)', type: 'item' },
  { id: 'fp_6', title: 'Faktur Pajak Multi Pages Hal 1 (A4)', type: 'item' },
  { id: 'fp_7', title: 'Faktur Pajak Multi Pages Hal 2 (A4)', type: 'item' },
  { id: 'fp_8', title: 'Faktur Pajak Multi Pages Hal 3 (A4)', type: 'item' },

  { id: 'h_nr', title: 'Nota Retur', type: 'header' },
  { id: 'nr_1', title: 'Nota Retur Penjualan (A4)', type: 'item' },
  { id: 'nr_2', title: 'Nota Retur Pembelian (A4)', type: 'item' },

  { id: 'h_spt', title: 'SPT Masa', type: 'header' },
  { id: 'spt_1', title: 'SPT Masa PPN 1111 (Legal)', type: 'item' },
  { id: 'spt_2', title: 'SPT Masa PPN 1111 AB (Legal/Folio)', type: 'item' },
  { id: 'spt_3', title: 'SPT Masa PPN 1111 A1 (Legal/Folio)', type: 'item' },
  { id: 'spt_4', title: 'SPT Masa PPN 1111 A2 (Legal/Folio)', type: 'item' },
  { id: 'spt_5', title: 'SPT Masa PPN 1111 B1 (Legal/Folio)', type: 'item' },
  { id: 'spt_6', title: 'SPT Masa PPN 1111 B2 (Legal/Folio)', type: 'item' },
  { id: 'spt_7', title: 'SPT Masa PPN 1111 B3 (Legal/Folio)', type: 'item' },
  { id: 'spt_8', title: 'Lampiran Daftar Faktur Pajak Diganggung - 1111 A (Legal/Folio)', type: 'item' }
];

const Laporan: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState(REPORT_TYPES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Filter States
  const [filter, setFilter] = useState({
    tahun: new Date().getFullYear().toString(),
    bulan: '',
    pembetulan: '0',
    dari_no_so: '', sampai_no_so: '',
    dari_no_sj: '', sampai_no_sj: '',
    dari_no_invoice: '', sampai_no_invoice: '',
    dari_no_kwitansi: '', sampai_no_kwitansi: '',
    dari_no_faktur_pajak: '', sampai_no_faktur_pajak: '',
    dari_no_nk: '', sampai_no_nk: '',
    dari_no_po: '', sampai_no_po: '',
    dari_no_pembayaran: '', sampai_no_pembayaran: '',
    no_retur_penjualan: '',
    no_retur_pembelian: '',
    dari_tanggal: '', sampai_tanggal: '',
    nama_pelanggan: '',
    nama_proyek: '',
    metode_pembayaran: '',
    gudang: '',
    dari_kode_barang: '', sampai_kode_barang: '',
    salesman: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilter(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reportNameParam = params.get('reportName');
    const sjNumberParam = params.get('sj_number');
    const soNumberParam = params.get('so_number');
    const invoiceNumberParam = params.get('invoice_number');
    const pembayaranNumberParam = params.get('pembayaran_number');
    const kwitansiNumberParam = params.get('kwitansi_number');

    if (reportNameParam) {
      const foundReport = REPORT_TYPES.find(r => r.title === reportNameParam);
      if (foundReport) {
        setSelectedReport(foundReport.id);
      }
    }

    if (sjNumberParam || soNumberParam || invoiceNumberParam || pembayaranNumberParam || kwitansiNumberParam) {
      setFilter(prev => ({
        ...prev,
        dari_no_sj: sjNumberParam || prev.dari_no_sj,
        sampai_no_sj: sjNumberParam || prev.sampai_no_sj,
        dari_no_so: soNumberParam || prev.dari_no_so,
        sampai_no_so: soNumberParam || prev.sampai_no_so,
        dari_no_invoice: invoiceNumberParam || prev.dari_no_invoice,
        sampai_no_invoice: invoiceNumberParam || prev.sampai_no_invoice,
        dari_no_pembayaran: pembayaranNumberParam || prev.dari_no_pembayaran,
        sampai_no_pembayaran: pembayaranNumberParam || prev.sampai_no_pembayaran,
        dari_no_kwitansi: kwitansiNumberParam || prev.dari_no_kwitansi,
        sampai_no_kwitansi: kwitansiNumberParam || prev.sampai_no_kwitansi
      }));
    }
  }, [location.search]);

  const handleCetakPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Sedang meng-generate dokumen PDF...');

    try {
      const response = await axiosClient.post('/api/reports/generate', {
        reportType: selectedReport,
        filters: filter
      }, {
        responseType: 'blob',
        timeout: 30000 
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl, '_blank');
      
      toast.success('Laporan berhasil di-generate!', { id: toastId });
    } catch (error: any) {
      console.error('Failed to generate PDF:', error);
      toast.error('Gagal men-generate laporan. Pastikan koneksi server berjalan.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const isSoActive = selectedReport.startsWith('so_');
  const isSjActive = selectedReport.startsWith('sj_');
  const isInvActive = selectedReport.startsWith('inv_');
  const isPembayaranActive = selectedReport.startsWith('bpk_');
  const isKwitansiActive = selectedReport.startsWith('kwi_');

  const rowClass = "grid grid-cols-12 gap-4 items-center mb-3";
  const labelClass = "col-span-4 text-sm font-medium text-gray-700";
  const inputWrapperClass = "col-span-8 flex gap-2 items-center";
  const inputClass = "w-full h-9 px-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      
      {/* Header Banner Gelap */}
      <div className="p-6 bg-slate-900 w-full rounded-none flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Menu Laporan</h1>
          <p className="text-sm text-slate-300 mt-1">Pusat pencetakan dokumen PDF multi-modul</p>
        </div>
      </div>

      {/* Wrapper Kiri-Kanan (Split Pane) */}
      <div className="flex flex-row w-full h-[calc(100vh-100px)] overflow-hidden">
        
        {/* Sisi Kiri (Daftar Laporan) */}
        <div className="w-1/3 md:w-[30%] overflow-y-auto border-r border-gray-200 bg-white">
          <ul className="flex flex-col pb-8">
            {REPORT_TYPES.map((report) => {
              if (report.type === 'header') {
                return (
                  <li key={report.id} className="font-bold text-gray-800 bg-gray-100 py-2 px-4 mt-2">
                    {report.title}
                  </li>
                );
              }

              const isSelected = selectedReport === report.id;
              return (
                <li
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`text-sm py-2 px-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-slate-800 text-white font-medium' 
                      : 'hover:bg-gray-50 text-slate-700'
                  }`}
                >
                  {report.title}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sisi Kanan (Form Filter) */}
        <div className="w-2/3 md:w-[70%] overflow-y-auto bg-white p-8">
          <div className="max-w-4xl">
            <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-gray-200">
              Filter Pencarian Data Laporan
            </h2>

            <div className={rowClass}>
              <label className={labelClass}>Tahun</label>
              <div className={inputWrapperClass}>
                <input type="number" className={`${inputClass} max-w-[120px]`} value={filter.tahun} onChange={e => handleFilterChange('tahun', e.target.value)} />
              </div>
            </div>

            <div className={rowClass}>
              <label className={labelClass}>Bulan</label>
              <div className={inputWrapperClass}>
                <select className={`${inputClass} max-w-[200px]`} value={filter.bulan} onChange={e => handleFilterChange('bulan', e.target.value)}>
                  <option value="">Semua Bulan</option>
                  {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('id-ID', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={labelClass}>Pembetulan Ke</label>
              <div className={inputWrapperClass}>
                <input type="number" className={`${inputClass} max-w-[120px]`} value={filter.pembetulan} onChange={e => handleFilterChange('pembetulan', e.target.value)} />
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} ${!isSoActive && 'text-gray-400'}`}>Dari No. Sales Order</label>
              <div className={inputWrapperClass}>
                <input type="text" className={inputClass} disabled={!isSoActive} value={filter.dari_no_so} onChange={e => handleFilterChange('dari_no_so', e.target.value)} />
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap px-2">s/d</span>
                <input type="text" className={inputClass} disabled={!isSoActive} value={filter.sampai_no_so} onChange={e => handleFilterChange('sampai_no_so', e.target.value)} />
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} ${!isSjActive && 'text-gray-400'}`}>Dari No. Surat Jalan</label>
              <div className={inputWrapperClass}>
                <input type="text" className={inputClass} disabled={!isSjActive} value={filter.dari_no_sj} onChange={e => handleFilterChange('dari_no_sj', e.target.value)} />
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap px-2">s/d</span>
                <input type="text" className={inputClass} disabled={!isSjActive} value={filter.sampai_no_sj} onChange={e => handleFilterChange('sampai_no_sj', e.target.value)} />
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} ${!isInvActive && 'text-gray-400'}`}>Dari No. Invoice</label>
              <div className={inputWrapperClass}>
                <input type="text" className={inputClass} disabled={!isInvActive} value={filter.dari_no_invoice} onChange={e => handleFilterChange('dari_no_invoice', e.target.value)} />
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap px-2">s/d</span>
                <input type="text" className={inputClass} disabled={!isInvActive} value={filter.sampai_no_invoice} onChange={e => handleFilterChange('sampai_no_invoice', e.target.value)} />
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} ${!isPembayaranActive && 'text-gray-400'}`}>Dari No. Pembayaran</label>
              <div className={inputWrapperClass}>
                <input type="text" className={inputClass} disabled={!isPembayaranActive} value={filter.dari_no_pembayaran} onChange={e => handleFilterChange('dari_no_pembayaran', e.target.value)} />
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap px-2">s/d</span>
                <input type="text" className={inputClass} disabled={!isPembayaranActive} value={filter.sampai_no_pembayaran} onChange={e => handleFilterChange('sampai_no_pembayaran', e.target.value)} />
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} ${!isKwitansiActive && 'text-gray-400'}`}>Dari No. Kwitansi</label>
              <div className={inputWrapperClass}>
                <input type="text" className={inputClass} disabled={!isKwitansiActive} value={filter.dari_no_kwitansi} onChange={e => handleFilterChange('dari_no_kwitansi', e.target.value)} />
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap px-2">s/d</span>
                <input type="text" className={inputClass} disabled={!isKwitansiActive} value={filter.sampai_no_kwitansi} onChange={e => handleFilterChange('sampai_no_kwitansi', e.target.value)} />
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Dari No Faktur Pajak</label>
              <div className={inputWrapperClass}>
                <select className={inputClass} disabled></select>
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap px-2">s/d</span>
                <select className={inputClass} disabled></select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Dari No NK</label>
              <div className={inputWrapperClass}>
                <select className={inputClass} disabled></select>
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap px-2">s/d</span>
                <select className={inputClass} disabled></select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Dari No PO</label>
              <div className={inputWrapperClass}>
                <select className={inputClass} disabled></select>
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap px-2">s/d</span>
                <select className={inputClass} disabled></select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>No. Retur Penjualan</label>
              <div className={inputWrapperClass}>
                <select className={`${inputClass} max-w-[50%]`} disabled></select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>No. Retur Pembelian</label>
              <div className={inputWrapperClass}>
                <select className={`${inputClass} max-w-[50%]`} disabled></select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Dari Tanggal</label>
              <div className={inputWrapperClass}>
                <input type="date" className={inputClass} disabled />
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap px-2">s/d Tanggal</span>
                <input type="date" className={inputClass} disabled />
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Nama Pelanggan</label>
              <div className={inputWrapperClass}>
                <select className={inputClass} disabled></select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Nama Proyek</label>
              <div className={inputWrapperClass}>
                <select className={inputClass} disabled></select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Metode Pembayaran</label>
              <div className={inputWrapperClass}>
                <select className={`${inputClass} max-w-[200px]`} disabled></select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Gudang</label>
              <div className={inputWrapperClass}>
                <select className={`${inputClass} max-w-[50%]`} disabled></select>
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Dari Kode Barang</label>
              <div className={inputWrapperClass}>
                <select className={inputClass} disabled></select>
                <input type="text" className={inputClass} readOnly />
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>s/d Kode Barang</label>
              <div className={inputWrapperClass}>
                <select className={inputClass} disabled></select>
                <input type="text" className={inputClass} readOnly />
              </div>
            </div>

            <div className={rowClass}>
              <label className={`${labelClass} text-gray-400`}>Salesman</label>
              <div className={inputWrapperClass}>
                <select className={`${inputClass} max-w-[50%]`} disabled></select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-start gap-4">
              <button 
                type="button"
                disabled={isLoading}
                onClick={() => {
                  const queryParams = new URLSearchParams({
                    reportType: selectedReport,
                    ...(filter.dari_no_sj ? { no_sj: filter.dari_no_sj } : {}),
                    ...(filter.dari_no_so ? { no_so: filter.dari_no_so } : {}),
                    ...(filter.dari_no_invoice ? { no_invoice: filter.dari_no_invoice } : {})
                  });
                  window.open(`/preview-laporan?${queryParams.toString()}`, '_blank');
                }}
                className="px-6 py-2 bg-white border border-gray-400 rounded-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                PREVIEW PDF
              </button>
              <button 
                type="button"
                disabled={isLoading}
                onClick={handleCetakPDF}
                className="px-6 py-2 bg-blue-600 border border-blue-700 rounded-sm text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Printer size={16} />
                )}
                CETAK LAPORAN
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Laporan;
