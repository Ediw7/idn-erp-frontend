import React from 'react';
import { Search, FileText, X, FileStack } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KartuPiutang: React.FC = () => {
  const navigate = useNavigate();

  const inputClass = "px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm text-sm";
  const labelClass = "text-xs font-semibold text-slate-700 w-36";

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <FileStack size={20} className="text-blue-400" />
          <span className="tracking-wide uppercase">Browse Kartu Piutang</span>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button 
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white"
          >
            <X size={14} /> Close
          </button>
          <button 
            onClick={() => navigate('/laporan', { state: { initialReport: 'Kartu Piutang (A4)' } })}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white"
          >
            <FileText size={14} /> Report
          </button>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white">
            <Search size={14} /> Search
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="p-4 shrink-0 pb-0">
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
          <div className="flex items-center">
            <label className={labelClass}>Pilih Nama Pelanggan</label>
            <select className={`${inputClass} w-96`}>
              <option></option>
            </select>
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Pilih Mata Uang</label>
            <select className={`${inputClass} w-32`} defaultValue="IDR">
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Grid Section */}
      <div className="flex-1 overflow-auto p-4 flex flex-col">
        <div className="bg-white border border-slate-300 shadow-sm rounded-md flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2 text-center border-r border-blue-800 font-semibold w-24">Tanggal</th>
                  <th className="px-3 py-2 text-left border-r border-blue-800 font-semibold w-32">No. Invoice</th>
                  <th className="px-3 py-2 text-left border-r border-blue-800 font-semibold w-32">No. Ref</th>
                  <th className="px-3 py-2 text-left border-r border-blue-800 font-semibold min-w-[300px]">Keterangan</th>
                  <th className="px-3 py-2 text-right border-r border-blue-800 font-semibold w-32">Debet</th>
                  <th className="px-3 py-2 text-right border-blue-800 font-semibold w-32">Kredit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">Belum ada data kartu piutang</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Footer Navigation */}
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
        
        {/* Info Box Bottom */}
        <div className="mt-4 flex justify-between items-end">
          <div className="text-xs text-blue-600 max-w-lg leading-relaxed font-medium">
            Untuk melihat secara detail transaksi di atas, letakkan kursor pada baris transaksi yang diinginkan, lalu dobel klik pada bagian record pointer (kiri layar bergambar segitiga hitam)
          </div>
          
          <div className="flex bg-slate-900 rounded-sm overflow-hidden border border-slate-800">
            <div className="flex flex-col border-r border-slate-700">
              <div className="text-[10px] text-white text-center font-semibold py-1 bg-black">Total Debet</div>
              <div className="px-4 py-1 text-xs text-right bg-cyan-50 font-semibold min-w-[120px]">0.00</div>
            </div>
            <div className="flex flex-col border-r border-slate-700">
              <div className="text-[10px] text-white text-center font-semibold py-1 bg-black">Total Kredit</div>
              <div className="px-4 py-1 text-xs text-right bg-cyan-50 font-semibold min-w-[120px]">0.00</div>
            </div>
            <div className="flex flex-col">
              <div className="text-[10px] text-white text-center font-semibold py-1 bg-black">Saldo</div>
              <div className="px-4 py-1 text-xs text-right bg-cyan-50 font-semibold min-w-[120px]">0.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KartuPiutang;
