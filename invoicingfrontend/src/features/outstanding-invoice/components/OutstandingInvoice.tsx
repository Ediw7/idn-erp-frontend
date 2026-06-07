import React from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OutstandingInvoice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Modern Top Header Banner */}
      <div className="bg-slate-800 px-6 py-5 flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Daftar Outstanding Invoice</h1>
          <p className="text-slate-400 text-sm mt-1">Pantau dan kelola seluruh invoice yang belum lunas atau masih berstatus outstanding.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold text-white transition-colors"
          >
            <X size={14} /> CLOSE
          </button>
        </div>
      </div>

      {/* Clean Filter Section */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-end gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Filter Pelanggan</label>
            <div className="relative">
              <input 
                type="text" 
                className="pl-3 pr-8 py-1.5 border border-slate-300 rounded-sm text-sm w-64 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-slate-50" 
                placeholder="Semua Pelanggan..."
              />
              <Search size={14} className="absolute right-2.5 top-2 text-slate-400" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Mata Uang</label>
            <select className="px-3 py-1.5 border border-slate-300 rounded-sm text-sm w-28 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-slate-50">
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Proyek</label>
            <select className="px-3 py-1.5 border border-slate-300 rounded-sm text-sm w-48 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-slate-50">
              <option value="">Semua Proyek</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Sales</label>
            <select className="px-3 py-1.5 border border-slate-300 rounded-sm text-sm w-40 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-slate-50">
              <option value="">Semua Sales</option>
            </select>
          </div>
          
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 border border-blue-600 rounded-sm text-xs font-semibold text-white transition-colors h-[34px]">
            Terapkan Filter
          </button>
        </div>
      </div>

      {/* Data Grid Section */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
              <tr>
                <th className="px-3 py-2 border-r border-slate-300 w-10 text-center"></th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center">Tanggal</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">No. Invoice</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">Nama Pelanggan</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold max-w-[200px]">Alamat Lengkap</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">No. Telp</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center">Tgl JT</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center">Ccy</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-right">Jumlah</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-right">Saldo</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">Sales</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">Proyek</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">No SO</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">No PO</th>
                <th className="px-3 py-2 font-semibold">Catatan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-400">1</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">1/7/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 font-medium text-slate-800">FT/001/01/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200">PT ISM Bogasari Flour</td>
                <td className="px-3 py-1.5 border-r border-slate-200 truncate max-w-[200px]" title="Jl. Raya Cilincing, Tanjung Priok">Jl. Raya Cilincing, Tanjung Priok</td>
                <td className="px-3 py-1.5 border-r border-slate-200">021-4301048</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">1/21/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">IDR</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium">11,450,400.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium text-blue-600">6,450,400.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Windi</td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5"></td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-400">2</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">3/1/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 font-medium text-slate-800">FT/001/03/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200">PT ISM Bogasari Flour</td>
                <td className="px-3 py-1.5 border-r border-slate-200 truncate max-w-[200px]" title="Jl. Raya Cilincing, Tanjung Priok">Jl. Raya Cilincing, Tanjung Priok</td>
                <td className="px-3 py-1.5 border-r border-slate-200">021-4301048</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">3/15/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">IDR</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium">3,630,000.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium text-blue-600">3,630,000.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Windi</td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5"></td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-400">3</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">6/1/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 font-medium text-slate-800">FT/001/06/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200">PT Sari Wangi</td>
                <td className="px-3 py-1.5 border-r border-slate-200 truncate max-w-[200px]" title="Jl. Sukabumi No. 123, Menteng">Jl. Sukabumi No. 123, Menteng</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-slate-400">-</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">6/8/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">IDR</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium">1,127,500.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium text-blue-600">1,127,500.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Andi</td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200">SO/001/05/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200">PO-001</td>
                <td className="px-3 py-1.5"></td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-400">4</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">1/15/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 font-medium text-slate-800">FT/002/01/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200">PT Sari Wangi</td>
                <td className="px-3 py-1.5 border-r border-slate-200 truncate max-w-[200px]" title="Jl. Sukabumi No. 123, Menteng">Jl. Sukabumi No. 123, Menteng</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-slate-400">-</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">1/22/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">IDR</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium">3,413,100.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium text-blue-600">3,413,100.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Andi</td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5"></td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-400">5</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">6/1/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 font-medium text-slate-800">FT/002/06/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200">PT ISM Bogasari Flour</td>
                <td className="px-3 py-1.5 border-r border-slate-200 truncate max-w-[200px]" title="Jl. Raya Cilincing, Tanjung Priok">Jl. Raya Cilincing, Tanjung Priok</td>
                <td className="px-3 py-1.5 border-r border-slate-200">021-4301048</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">6/15/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">IDR</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium">1,390,400.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium text-blue-600">1,390,400.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Windi</td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200">SO/001/06/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200">PO-001</td>
                <td className="px-3 py-1.5"></td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-400">6</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">1/15/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 font-medium text-slate-800">FT/003/01/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200">PT ISM Bogasari Flour</td>
                <td className="px-3 py-1.5 border-r border-slate-200 truncate max-w-[200px]" title="Jl. Raya Cilincing, Tanjung Priok">Jl. Raya Cilincing, Tanjung Priok</td>
                <td className="px-3 py-1.5 border-r border-slate-200">021-4301048</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">1/29/2026</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-500">IDR</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium">2,530,000.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-medium text-blue-600">2,530,000.00</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Windi</td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5 border-r border-slate-200"></td>
                <td className="px-3 py-1.5"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Modern Clean Footer Totals */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 shrink-0 flex justify-end">
          <div className="flex bg-white border border-slate-300 rounded-sm overflow-hidden shadow-sm">
            <div className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300">TOTAL INVOICE</div>
            <div className="px-4 py-2 text-sm font-bold text-slate-800 text-right min-w-[150px] border-r border-slate-300">23,541,400.00</div>
            
            <div className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 border-r border-slate-300">SALDO PIUTANG</div>
            <div className="px-4 py-2 text-sm font-bold text-blue-700 text-right min-w-[150px]">18,541,400.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutstandingInvoice;
