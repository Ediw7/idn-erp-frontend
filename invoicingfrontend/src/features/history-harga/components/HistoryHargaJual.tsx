import React from 'react';
import { Search, X, History, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryHargaJual: React.FC = () => {
  const navigate = useNavigate();

  const inputClass = "px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm text-sm";
  const labelClass = "text-xs font-semibold text-slate-700 w-28";
  const btnPrimary = "px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-sm hover:bg-blue-500 shadow-sm transition-colors";
  const btnSecondary = "px-4 py-1.5 bg-white text-slate-700 text-xs font-bold rounded-sm hover:bg-slate-50 border border-slate-300 transition-colors shadow-sm";

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <History size={20} className="text-blue-400" />
          <span className="tracking-wide">CEK HISTORY HARGA JUAL</span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white"
        >
          <X size={14} /> Close
        </button>
      </div>

      {/* Filter Section */}
      <div className="p-4 shrink-0 pb-0">
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-4 flex gap-12">
          <div className="flex flex-col gap-3 flex-1 max-w-md">
            <div className="flex items-center">
              <label className={labelClass}>Kode Barang</label>
              <div className="flex gap-1 flex-1">
                <input type="text" className={`${inputClass} w-full`} />
                <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200">
                  <Search size={14} className="text-slate-600" />
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <label className={labelClass}>Nama Barang</label>
              <input type="text" className={`${inputClass} flex-1 bg-slate-50 text-slate-500`} readOnly />
            </div>
            <div className="flex items-center">
              <label className={labelClass}>Nama Pelanggan</label>
              <select className={`${inputClass} flex-1`}>
                <option></option>
                <option>PT Sari Wangi</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Tampilkan</span>
              <input type="text" className={`${inputClass} w-16 text-center`} defaultValue="25" />
              <span className="text-xs font-semibold text-slate-700">record terakhir</span>
            </div>
            <div className="flex gap-2 items-start">
              <button className={btnPrimary} style={{ width: '100px' }}>
                <div className="flex items-center justify-center gap-1">
                  <Filter size={12} /> Filter
                </div>
              </button>
              <button className={btnSecondary} style={{ width: '100px' }}>
                Show All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Grid Section */}
      <div className="flex-1 overflow-auto p-4 flex flex-col">
        <div className="bg-white border border-slate-300 shadow-sm rounded-md flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-200 text-slate-700 border-b border-slate-300 sticky top-0 z-10">
                  <th className="px-3 py-2 text-center border-r border-slate-300 w-10 font-semibold">No</th>
                  <th className="px-3 py-2 text-center border-r border-slate-300 font-semibold w-24">Tgl</th>
                  <th className="px-3 py-2 text-left border-r border-slate-300 font-semibold w-32">No. Invoice</th>
                  <th className="px-3 py-2 text-left border-r border-slate-300 font-semibold min-w-[200px]">Nama Pelanggan</th>
                  <th className="px-3 py-2 text-center border-r border-slate-300 font-semibold w-20">Terms</th>
                  <th className="px-3 py-2 text-center border-r border-slate-300 font-semibold w-16">Curr</th>
                  <th className="px-3 py-2 text-left border-r border-slate-300 font-semibold w-24">Kode Item</th>
                  <th className="px-3 py-2 text-left border-r border-slate-300 font-semibold min-w-[200px]">Nama Item</th>
                  <th className="px-3 py-2 text-right border-r border-slate-300 font-semibold w-20">Qty</th>
                  <th className="px-3 py-2 text-right border-r border-slate-300 font-semibold w-28">Harga Satuan</th>
                  <th className="px-3 py-2 text-right border-slate-300 font-semibold w-32">Harga Jual</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty state for now since data needs to be populated */}
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400 italic">Belum ada data history harga jual</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Footer Pagination */}
          <div className="bg-slate-100 border-t border-slate-300 p-2 flex items-center justify-start text-xs text-slate-600 gap-2 shrink-0">
            <span>Record:</span>
            <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden">
              <button className="px-2 py-1 hover:bg-slate-100 border-r border-slate-300">{'|<'}</button>
              <button className="px-2 py-1 hover:bg-slate-100 border-r border-slate-300">{'<'}</button>
              <div className="px-3 py-1 bg-white min-w-[40px] text-center font-medium">0</div>
              <button className="px-2 py-1 hover:bg-slate-100 border-l border-slate-300">{'>'}</button>
              <button className="px-2 py-1 hover:bg-slate-100 border-l border-slate-300">{'>|'}</button>
            </div>
            <span>of 0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryHargaJual;
