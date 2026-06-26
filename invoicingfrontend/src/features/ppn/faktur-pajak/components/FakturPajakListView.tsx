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
              <span className="text-xs text-slate-300 font-medium">No FP:</span>
              <input type="text" className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-32" value={filterNoFaktur} onChange={e => setFilterNoFaktur(e.target.value)} />
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Pembeli:</span>
              <input type="text" className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-32" value={filterNamaPembeli} onChange={e => setFilterNamaPembeli(e.target.value)} />
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Tgl:</span>
              <input type="date" className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400" value={filterTglMulai} onChange={e => setFilterTglMulai(e.target.value)} />
              <span className="text-xs text-slate-300 font-medium">s/d</span>
              <input type="date" className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400" value={filterTglAkhir} onChange={e => setFilterTglAkhir(e.target.value)} />
            </div>

          </div>
        </div>
        <button onClick={onOpenForm} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
           <FilePlus size={14} /> + BUKA FORM
        </button>
      </div>

      {/* Grid Table */}
      <div className="flex-1 overflow-auto bg-white p-6">
        <table className="w-full text-xs whitespace-nowrap border-collapse border border-slate-200 shadow-sm rounded-sm overflow-hidden">
          <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-left">Penomoran</th>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-left">No. Faktur Pajak</th>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-left">Tgl</th>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-left">Nama Pembeli</th>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-left">NPWP</th>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-left">No. Invoice</th>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-center">Curr</th>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-right">DPP</th>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-right">DPP Rp</th>
              <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-right">PPN Rp</th>
            </tr>
          </thead>
          <tbody>
            {loadingData ? (
              <tr><td colSpan={10} className="text-center p-6 italic text-slate-500">Memuat data...</td></tr>
            ) : dataList.length === 0 ? (
              <tr><td colSpan={10} className="text-center p-6 italic text-slate-500">Tidak ada data Faktur Pajak. Klik Buka Form untuk membuat data baru.</td></tr>
            ) : (
              dataList.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => onEdit(item, idx)}>
                  <td className="px-3 py-2 border border-slate-200 text-slate-600">{item.penomoran || ''}</td>
                  <td className="px-3 py-2 border border-slate-200 font-semibold text-blue-600">{item.no_fp}</td>
                  <td className="px-3 py-2 border border-slate-200 text-slate-700">{item.tgl_fp}</td>
                  <td className="px-3 py-2 border border-slate-200 text-slate-700 truncate max-w-[200px]">{item.pembeli_nama || ''}</td>
                  <td className="px-3 py-2 border border-slate-200 text-slate-700 font-mono text-[10px]">{item.pembeli_npwp || item.npwp || ''}</td>
                  <td className="px-3 py-2 border border-slate-200 text-slate-700">{item.no_invoice || ''}</td>
                  <td className="px-3 py-2 border border-slate-200 text-center text-slate-700">{item.mata_uang}</td>
                  <td className="px-3 py-2 border border-slate-200 text-right text-slate-700 font-medium">{(item.dpp_rp || item.dpp || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="px-3 py-2 border border-slate-200 text-right text-slate-700 font-medium">{(item.dpp_rp || item.dpp || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="px-3 py-2 border border-slate-200 text-right text-slate-700 font-medium">{(item.ppn_rp || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
