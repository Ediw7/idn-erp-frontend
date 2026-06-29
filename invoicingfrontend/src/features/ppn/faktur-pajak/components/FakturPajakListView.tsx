import React from 'react';
import { FilePlus } from 'lucide-react';
import { FakturPajakData } from '../api';

interface ListViewProps {
  dataList: FakturPajakData[];
  loadingData: boolean;
  
  filterTglMulai: string;
  setFilterTglMulai: (v: string) => void;
  filterTglAkhir: string;
  setFilterTglAkhir: (v: string) => void;
  filterNoFaktur: string;
  setFilterNoFaktur: (v: string) => void;
  filterMataUang: string;
  setFilterMataUang: (v: string) => void;
  filterNamaPembeli: string;
  setFilterNamaPembeli: (v: string) => void;
  filterNoInvoice: string;
  setFilterNoInvoice: (v: string) => void;
  
  onFilter: () => void;
  onShowAll: () => void;
  onOpenForm: () => void;
  onEdit: (item: FakturPajakData, idx: number) => void;
  onDelete: (id: number) => void;
}

export const FakturPajakListView: React.FC<ListViewProps> = ({
  dataList, loadingData,
  filterTglMulai, setFilterTglMulai,
  filterTglAkhir, setFilterTglAkhir,
  filterNoFaktur, setFilterNoFaktur,
  filterMataUang, setFilterMataUang,
  filterNamaPembeli, setFilterNamaPembeli,
  filterNoInvoice, setFilterNoInvoice,
  onFilter, onShowAll, onOpenForm, onEdit
}) => {
  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Faktur Pajak</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Bulan:</span>
              <select 
                value={filterTglMulai.split('-')[1] || '01'} 
                onChange={e => {
                  const currentYear = filterTglMulai.split('-')[0] || new Date().getFullYear().toString();
                  const lastDay = new Date(parseInt(currentYear), parseInt(e.target.value), 0).getDate();
                  setFilterTglMulai(`${currentYear}-${e.target.value}-01`);
                  setFilterTglAkhir(`${currentYear}-${e.target.value}-${lastDay}`);
                }}
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
                value={filterTglMulai.split('-')[0] || new Date().getFullYear().toString()} 
                onChange={e => {
                  const currentMonth = filterTglMulai.split('-')[1] || '01';
                  const lastDay = new Date(parseInt(e.target.value), parseInt(currentMonth), 0).getDate();
                  setFilterTglMulai(`${e.target.value}-${currentMonth}-01`);
                  setFilterTglAkhir(`${e.target.value}-${currentMonth}-${lastDay}`);
                }}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">No FP:</span>
              <input type="text" className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-28" value={filterNoFaktur} onChange={e => setFilterNoFaktur(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Pembeli:</span>
              <input type="text" className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-28" value={filterNamaPembeli} onChange={e => setFilterNamaPembeli(e.target.value)} />
            </div>
          </div>
        </div>
        <button onClick={onOpenForm} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
           <FilePlus size={14} /> + BUKA FORM
        </button>
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-700">Penomoran</th>
                <th className="px-3 py-2 font-semibold text-slate-700">No. Faktur Pajak</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Tgl</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Nama Pembeli</th>
                <th className="px-3 py-2 font-semibold text-slate-700">NPWP</th>
                <th className="px-3 py-2 font-semibold text-slate-700">No. Invoice</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">Curr</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">DPP</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">DPP Rp</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">PPN Rp</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingData ? (
                <tr><td colSpan={11} className="text-center p-6 italic text-slate-500">Memuat data...</td></tr>
              ) : dataList.length === 0 ? (
                <tr><td colSpan={11} className="text-center p-6 italic text-slate-500">Tidak ada data Faktur Pajak. Klik Buka Form untuk membuat data baru.</td></tr>
              ) : (
                dataList.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-slate-800">{item.penomoran || ''}</td>
                    <td className="px-3 py-2 font-mono text-slate-800 font-medium">{item.no_fp}</td>
                    <td className="px-3 py-2 text-slate-600">{item.tgl_fp}</td>
                    <td className="px-3 py-2 text-slate-800 truncate max-w-[200px]">{item.pembeli_nama || ''}</td>
                    <td className="px-3 py-2 text-slate-600 font-mono text-[10px]">{item.pembeli_npwp || item.npwp || ''}</td>
                    <td className="px-3 py-2 text-slate-600">{item.no_invoice || ''}</td>
                    <td className="px-3 py-2 text-center text-slate-600 font-medium">{item.mata_uang}</td>
                    <td className="px-3 py-2 text-right font-mono text-slate-800">{(item.dpp_rp || item.dpp || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-2 text-right font-mono text-slate-800">{(item.dpp_rp || item.dpp || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-2 text-right font-mono text-slate-800">{(item.ppn_rp || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(item, idx)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button
                          onClick={() => {
                             if(item.id && window.confirm('Yakin ingin menghapus Faktur Pajak ini?')) onDelete(item.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                          title="Hapus"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
           <span className="text-xs font-semibold text-slate-600">Total Records: {dataList.length}</span>
         </div>
         
         <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-sm border border-slate-200 shadow-sm">
           <span className="text-xs font-bold text-slate-700 uppercase">Total PPN:</span>
           <span className="text-sm font-bold text-blue-700 font-mono">
             {dataList.reduce((acc, curr) => acc + (curr.ppn_rp || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
           </span>
         </div>
      </div>
    </div>
  );
};
