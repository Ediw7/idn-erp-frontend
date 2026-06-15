import React, { useState } from 'react';
import { X, FileText, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Laporan: React.FC = () => {
  const location = useLocation();
  const searchParams = TAMBAH BARU URLSearchParams(location.search);
  const initialReport = searchParams.get('reportName') || location.state?.initialReport || 'Sales Order (A4 / Kwarto / 1/2 Kwarto)';
  const soNumber = searchParams.get('so_number') || '';
  const sjNumber = searchParams.get('sj_number') || '';

  const [activeReportItem, setActiveReportItem] = useState(initialReport);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header Info */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <h1 className="text-xl font-bold text-slate-800">Menu Laporan</h1>
        <p className="text-sm text-slate-500 mt-1">Cetak dan tinjau berbagai laporan dokumen transaksi.</p>
      </div>

      <div className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="bg-white rounded-md shadow-sm border border-slate-200 w-full h-full flex flex-col overflow-hidden">
          
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar List Laporan */}
            <div className="w-1/3 bg-slate-800 text-slate-300 overflow-y-auto border-r border-slate-700 text-sm">
              {[
                'Sales Order (A4 / Kwarto / 1/2 Kwarto)',
                'Surat Jalan (A4 / Kwarto / 1/2 Kwarto)',
                'Surat Jalan (A4 / Kwarto / 1/2 Kwarto) - Font 10',
                'Daftar Outstanding Invoice Per Pelanggan (A4)',
                'Daftar Penjualan Per Kode Barang',
                'Rangkumana Penjualan Per Kode Barang',
                'Daftar Penjualan Per Pelanggan - Barang',
                'Kartu Piutang (A4)',
                'Laporan Piutang Per Invoice (A4)',
                'Rangkuman Piutang Dagang',
                'Rangkuman Piutang Dagang Per Proyek',
                'Analisa Umur Piutang Berdasarkan Tgl Invoice',
                'Analisa Umur Piutang Berdasarkan Tgl JT',
                'Rangkuman Analisa Umur Piutang Berdasarkan Tgl JT',
                'Daftar Pembayaran Invoice',
                'Daftar Pembayaran Invoice Per Pelanggan',
                'Daftar Cek/Giro Diterima',
                'Kartu Stock Barang',
                'Kartu HPP Barang',
                'Quantity Akhir Per Gudang - Kode Barang',
                'Invoice (A4 / Kwarto)',
                'Invoice Kop Surat (A4)',
                'Invoice Sederhana - Tanpa Disc & DP',
                'Kwitansi (1/2 Kwarto)',
                'Nota Kredit (1/2 Kwarto)'
              ].map(item => (
                <div 
                  key={item}
                  onClick={() => setActiveReportItem(item)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${activeReportItem === item ? 'bg-yellow-100 text-slate-800 font-semibold border-l-4 border-yellow-500' : 'hover:bg-slate-700'}`}
                >
                  - {item}
                </div>
              ))}
              
              <div className="mt-4 px-4 py-2 font-bold text-white border-b border-t border-slate-700 bg-slate-900">Faktur Pajak</div>
              {['Faktur Pajak Hal 1 & 2 (A4)', 'Faktur Pajak (Continuous Paper)'].map(item => (
                <div 
                  key={item}
                  onClick={() => setActiveReportItem(item)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${activeReportItem === item ? 'bg-yellow-100 text-slate-800 font-semibold border-l-4 border-yellow-500' : 'hover:bg-slate-700'}`}
                >
                  - {item}
                </div>
              ))}
              
              <div className="mt-4 px-4 py-2 font-bold text-white border-b border-t border-slate-700 bg-slate-900">SPT Masa</div>
              {['SPT Masa PPN 1111 (Legal)', 'SPT Masa PPN 1111 AB (Legal/Folio)'].map(item => (
                <div 
                  key={item}
                  onClick={() => setActiveReportItem(item)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${activeReportItem === item ? 'bg-yellow-100 text-slate-800 font-semibold border-l-4 border-yellow-500' : 'hover:bg-slate-700'}`}
                >
                  - {item}
                </div>
              ))}
            </div>

            {/* Filter Content */}
            <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">Filter Pencarian Data Laporan</h2>
              <div className="max-w-2xl flex flex-col gap-2">
                <div className="flex items-center">
                  <label className="w-48 text-sm text-slate-700">Tahun:</label>
                  <input type="text" className={`${inputClass} w-32`} defaultValue="2020" />
                </div>
                <div className="flex items-center">
                  <label className="w-48 text-sm text-slate-700">Bulan:</label>
                  <select className={`${inputClass} w-32`} defaultValue="Desember">
                    <option>Desember</option>
                  </select>
                </div>
                <div className="flex items-center opacity-50">
                  <label className="w-48 text-sm text-slate-700">Pembetulan Ke:</label>
                  <input type="text" className={`${inputClass} w-32`} disabled />
                </div>
                
                <div className={`flex items-center ${activeReportItem.includes('Sales Order') ? '' : 'opacity-50'}`}>
                  <label className={`w-48 text-sm ${activeReportItem.includes('Sales Order') ? 'font-bold text-slate-800' : 'text-slate-700'}`}>Dari No. Sales Order</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Sales Order')} defaultValue={soNumber} />
                    <span className="text-sm font-medium text-slate-500">s/d</span>
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Sales Order')} defaultValue={soNumber} />
                  </div>
                </div>
                <div className={`flex items-center ${activeReportItem.includes('Surat Jalan') ? '' : 'opacity-50'}`}>
                  <label className={`w-48 text-sm ${activeReportItem.includes('Surat Jalan') ? 'font-bold text-slate-800' : 'text-slate-700'}`}>Dari No. Surat Jalan</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Surat Jalan')} defaultValue={sjNumber || "SJ/005/12/2020"} />
                    <span className="text-sm font-medium text-slate-500">s/d</span>
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Surat Jalan')} defaultValue={sjNumber || "SJ/005/12/2020"} />
                  </div>
                </div>
                <div className={`flex items-center ${activeReportItem.includes('Invoice') ? '' : 'opacity-50'}`}>
                  <label className={`w-48 text-sm ${activeReportItem.includes('Invoice') ? 'font-bold text-slate-800' : 'text-slate-700'}`}>Dari No. Invoice:</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Invoice')} />
                    <span className="text-sm font-medium text-slate-500">s/d</span>
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Invoice')} />
                  </div>
                </div>
                <div className={`flex items-center ${activeReportItem.includes('Kwitansi') ? '' : 'opacity-50'}`}>
                  <label className={`w-48 text-sm ${activeReportItem.includes('Kwitansi') ? 'font-bold text-slate-800' : 'text-slate-700'}`}>Dari No. Kwitansi:</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Kwitansi')} defaultValue="KT/002/12/2026" />
                    <span className="text-sm font-medium text-slate-500">s/d</span>
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Kwitansi')} defaultValue="KT/002/12/2026" />
                  </div>
                </div>
                <div className={`flex items-center ${activeReportItem.includes('Faktur Pajak') ? '' : 'opacity-50'}`}>
                  <label className={`w-48 text-sm ${activeReportItem.includes('Faktur Pajak') ? 'font-bold text-slate-800' : 'text-slate-700'}`}>Dari No Faktur Pajak</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Faktur Pajak')} />
                    <span className="text-sm font-medium text-slate-500">s/d</span>
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Faktur Pajak')} />
                  </div>
                </div>
                <div className={`flex items-center ${activeReportItem.includes('Nota Kredit') ? '' : 'opacity-50'}`}>
                  <label className={`w-48 text-sm ${activeReportItem.includes('Nota Kredit') ? 'font-bold text-slate-800' : 'text-slate-700'}`}>Dari No NK:</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Nota Kredit')} />
                    <span className="text-sm font-medium text-slate-500">s/d</span>
                    <input type="text" className={inputClass} disabled={!activeReportItem.includes('Nota Kredit')} />
                  </div>
                </div>
                <div className="flex items-center opacity-50">
                  <label className="w-48 text-sm text-slate-700">Dari No PO</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <input type="text" className={inputClass} disabled />
                    <span className="text-sm font-medium text-slate-500">s/d</span>
                    <input type="text" className={inputClass} disabled />
                  </div>
                </div>
                <div className="flex items-center opacity-50">
                  <label className="w-48 text-sm text-slate-700">No. Retur Penjualan:</label>
                  <input type="text" className={inputClass} disabled />
                </div>
                <div className="flex items-center opacity-50">
                  <label className="w-48 text-sm text-slate-700">No. Retur Pembelian</label>
                  <input type="text" className={inputClass} disabled />
                </div>
                
                <div className={`flex items-center mt-2 ${!activeReportItem.includes('Kartu Piutang') ? 'opacity-50' : ''}`}>
                  <label className={`w-48 text-sm ${activeReportItem.includes('Kartu Piutang') ? 'font-bold text-slate-800' : 'text-slate-700'}`}>Dari Tanggal</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <input type="date" className={inputClass} disabled={!activeReportItem.includes('Kartu Piutang')} defaultValue={activeReportItem.includes('Kartu Piutang') ? "2026-01-01" : undefined} />
                    <span className="text-sm font-medium text-slate-500">s/d Tanggal</span>
                    <input type="date" className={inputClass} disabled={!activeReportItem.includes('Kartu Piutang')} defaultValue={activeReportItem.includes('Kartu Piutang') ? "2026-12-31" : undefined} />
                  </div>
                </div>
                <div className={`flex items-center ${!activeReportItem.includes('Kartu Piutang') ? 'opacity-50' : ''}`}>
                  <label className={`w-48 text-sm ${activeReportItem.includes('Kartu Piutang') ? 'font-bold text-slate-800' : 'text-slate-700'}`}>Nama Pelanggan:</label>
                  <select className={inputClass} disabled={!activeReportItem.includes('Kartu Piutang')}></select>
                </div>
                <div className="flex items-center opacity-50">
                  <label className="w-48 text-sm text-slate-700">Nama Proyek</label>
                  <select className={inputClass} disabled></select>
                </div>
                <div className="flex items-center opacity-50">
                  <label className="w-48 text-sm text-slate-700">Metode Pembayaran:</label>
                  <select className={`${inputClass} w-32`} disabled></select>
                </div>
                <div className="flex items-center">
                  <label className="w-48 text-sm text-slate-700">Gudang:</label>
                  <select className={`${inputClass} w-48`} defaultValue="Kapuk">
                    <option>Kapuk</option>
                  </select>
                </div>
                <div className="flex items-center mt-2">
                  <label className="w-48 text-sm text-slate-700">Dari Kode Barang</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <div className="flex flex-1 gap-1">
                      <input type="text" className={`${inputClass} bg-cyan-50`} />
                      <button className="px-2 border border-slate-300 bg-slate-100 rounded-sm"><Search size={14}/></button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="w-48 text-sm text-slate-700">s/d Kode Barang</label>
                  <div className="flex gap-2 flex-1 items-center">
                    <div className="flex flex-1 gap-1">
                      <input type="text" className={`${inputClass} bg-cyan-50`} />
                      <button className="px-2 border border-slate-300 bg-slate-100 rounded-sm"><Search size={14}/></button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center opacity-50">
                  <label className="w-48 text-sm text-slate-700">Salesman</label>
                  <select className={`${inputClass} w-48`} disabled></select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-slate-100 px-8 py-5 border-t border-slate-200 flex justify-end gap-4 shrink-0">
            <button onClick={() => setIsPreviewOpen(true)} className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-sm hover:bg-blue-500 shadow-sm transition-colors">Preview Laporan</button>
            <button className="px-8 py-2.5 bg-slate-700 text-white text-sm font-bold rounded-sm hover:bg-slate-600 shadow-sm transition-colors">CETAK Data</button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-200 rounded-sm shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col overflow-hidden">
            <div className="bg-slate-800 px-4 py-2 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span className="text-sm font-semibold">Preview Laporan: {activeReportItem}</span>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="hover:bg-red-500 px-2 py-1 rounded transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center bg-slate-300 p-8 overflow-y-auto">
              <div className="bg-white w-full max-w-4xl min-h-[900px] shadow-lg p-14 text-slate-800 flex flex-col shrink-0">
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold uppercase underline decoration-2 underline-offset-4 mb-2">{activeReportItem.split('(')[0].trim()}</h1>
                  <p className="text-sm">Periode: Juni 2026</p>
                </div>
                
                <div className="flex justify-between mb-10 text-sm">
                  <div>
                    <p className="font-bold text-base mb-1">PT. EDI Accounting INDONESIA</p>
                    <p>Jl. Jendral Sudirman Kav. 21</p>
                    <p>Jakarta Selatan, 12920</p>
                  </div>
                  <div className="text-right">
                    <p><span className="font-semibold">No Referensi:</span> SO/005/12/2026</p>
                    <p><span className="font-semibold">Tanggal Cetak:</span> 06 Juni 2026</p>
                  </div>
                </div>

                <table className="w-full text-sm border-collapse mb-10">
                  <thead>
                    <tr className="border-b-2 border-t-2 border-slate-800 bg-slate-50">
                      <th className="py-3 px-2 text-left w-12 font-bold">No</th>
                      <th className="py-3 px-2 text-left font-bold">Deskripsi Barang/Jasa</th>
                      <th className="py-3 px-2 text-center w-24 font-bold">Qty</th>
                      <th className="py-3 px-2 text-right w-32 font-bold">Harga Satuan</th>
                      <th className="py-3 px-2 text-right w-40 font-bold">Total Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-3 px-2">1</td>
                      <td className="py-3 px-2">Baju Blazer</td>
                      <td className="py-3 px-2 text-center">1</td>
                      <td className="py-3 px-2 text-right">400,000</td>
                      <td className="py-3 px-2 text-right">400,000</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="py-3 px-2 text-right font-semibold pt-6">Sub Total:</td>
                      <td className="py-3 px-2 text-right font-semibold pt-6">400,000</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="py-2 px-2 text-right font-semibold">PPN 10%:</td>
                      <td className="py-2 px-2 text-right font-semibold">38,000</td>
                    </tr>
                    <tr className="border-t-2 border-slate-800">
                      <td colSpan={4} className="py-3 px-2 text-right font-bold text-lg">Grand Total:</td>
                      <td className="py-3 px-2 text-right font-bold text-lg">418,000</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="mt-auto pt-20 flex justify-between text-sm">
                  <div className="text-center w-48">
                    <p className="mb-20">Dibuat Oleh,</p>
                    <p className="border-t border-slate-800 pt-2 font-semibold">( Admin )</p>
                  </div>
                  <div className="text-center w-48">
                    <p className="mb-20">Disetujui Oleh,</p>
                    <p className="border-t border-slate-800 pt-2 font-semibold">( Manager )</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-200 px-6 py-3 flex justify-end gap-3 shrink-0 border-t border-slate-300">
              <button className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-sm hover:bg-blue-500 shadow-sm flex items-center gap-2">CETAK Document</button>
              <button className="px-6 py-2 bg-slate-700 text-white text-sm font-bold rounded-sm hover:bg-slate-600 shadow-sm flex items-center gap-2">Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laporan;
