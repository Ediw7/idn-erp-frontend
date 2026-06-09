import React from 'react';
import { Search, Plus, Save, FileText, X, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pembayaran: React.FC = () => {
  const navigate = useNavigate();

  const inputClass = "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1 shrink-0 w-36";
  const labelClassSmall = "block text-xs font-semibold text-slate-700 mb-1 shrink-0 w-32";
  const btnPrimary = "px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-sm hover:bg-slate-700 shadow-sm flex items-center gap-2 transition-colors";
  const btnSecondary = "px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-bold rounded-sm hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0 overflow-x-auto">
        <div className="flex items-center gap-6 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">Pembayaran Piutang Dagang</h2>
            <p className="text-xs text-slate-300 mt-1">Catat penerimaan pembayaran faktur dari pelanggan.</p>
          </div>
          <div className="h-8 w-px bg-slate-600"></div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="whitespace-nowrap">Pilih Periode:</span>
            <select className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>202606</option>
            </select>
            <button className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white hover:bg-slate-600">+</button>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0 ml-4">
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            <FileText size={14} /> Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Main Header Area */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-4 mb-4 shrink-0">
          <div className="flex gap-8">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClass}>No. Bukti</label>
                <div className="flex gap-1 flex-1">
                  <input type="text" className={`${inputClass} font-semibold`} defaultValue="BM/001/01/2026" />
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={16}/></button>
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap">Auto No</button>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Tanggal</label>
                <input type="date" className={`${inputClass} w-40`} defaultValue="2026-06-06" />
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClass}>Nama Pembeli</label>
                <div className="flex gap-1 flex-1">
                  <select className={inputClass} defaultValue="PT ISM Bogasari Flour">
                    <option>PT ISM Bogasari Flour</option>
                  </select>
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Plus size={16}/></button>
                </div>
              </div>
              <div className="flex items-start">
                <label className={labelClass}>Alamat</label>
                <textarea className={`${inputClass} bg-cyan-50 h-16 resize-none`} defaultValue="Jl. Raya Cilincing, Tanjung Priok&#10;Jakarta Utara - 14110" readOnly />
              </div>
              
              <div className="flex items-center mt-2">
                <label className={labelClass}>Metode Pembayaran</label>
                <select className={`${inputClass} w-32`} defaultValue="Cash">
                  <option>Cash</option>
                  <option>Transfer</option>
                  <option>Giro</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>No. Cek/Giro</label>
                <input type="text" className={inputClass} />
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Tanggal Cair</label>
                <input type="date" className={`${inputClass} w-40`} />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClassSmall}>Perkiraan Kas/Bank</label>
                <select className={`${inputClass} w-32`} defaultValue="1102001">
                  <option>1102001</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className={labelClassSmall}>Mata Uang</label>
                <input type="text" className={`${inputClass} w-32 bg-cyan-50`} defaultValue="IDR" readOnly />
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClassSmall}>Jumlah Penerimaan</label>
                <input type="text" className={`${inputClass} w-48 text-right font-semibold bg-white`} defaultValue="43,500,000.00" />
              </div>
              <div className="flex items-center">
                <label className={labelClassSmall}>Kurs Pembayaran</label>
                <input type="text" className={`${inputClass} w-32 text-right`} defaultValue="1.00" />
              </div>
              <div className="flex items-start mt-2">
                <label className={labelClassSmall}>Keterangan</label>
                <textarea className={`${inputClass} h-16 resize-none`} />
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-700 mb-1">Rincian Pembayaran</div>
        {/* Data Grid Section */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[200px] overflow-hidden mb-4">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="w-8 px-2 py-2 text-center border-r border-blue-800"></th>
                  <th className="w-48 px-3 py-2 text-left border-r border-blue-800">No Invoice</th>
                  <th className="w-48 px-3 py-2 text-left border-r border-blue-800">No. Faktur Pajak</th>
                  <th className="w-24 px-3 py-2 text-center border-r border-blue-800">Tgl JT</th>
                  <th className="w-16 px-3 py-2 text-center border-r border-blue-800">Ccy</th>
                  <th className="w-32 px-3 py-2 text-right border-r border-blue-800">Saldo Piutang</th>
                  <th className="w-32 px-3 py-2 text-right border-r border-blue-800">Pembayaran</th>
                  <th className="w-28 px-3 py-2 text-right border-r border-blue-800">Potongan</th>
                  <th className="w-32 px-3 py-2 text-right border-r border-blue-800">Saldo Akhir</th>
                  <th className="px-3 py-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-2 py-1 text-center border-r border-slate-200">▶</td>
                  <td className="px-2 py-1 border-r border-slate-200">
                    <div className="flex gap-1">
                      <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs" defaultValue="FT/123/12/2025" />
                      <button className="px-1.5 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={12} /></button>
                    </div>
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50"></td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-center">12/26/2025</td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-center">IDR</td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-right">27,500,000.00</td>
                  <td className="px-2 py-1 border-r border-slate-200 text-right">
                    <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right" defaultValue="27,500,000.00" />
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200">
                    <div className="flex gap-1">
                      <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right bg-cyan-50" defaultValue="0.00" readOnly />
                      <button className="px-1.5 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200 text-[10px] font-bold">...</button>
                    </div>
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-right">0.00</td>
                  <td className="px-2 py-1">
                    <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs" />
                  </td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-2 py-1 text-center border-r border-slate-200"></td>
                  <td className="px-2 py-1 border-r border-slate-200">
                    <div className="flex gap-1">
                      <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs" defaultValue="FT/124/12/2025" />
                      <button className="px-1.5 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={12} /></button>
                    </div>
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50"></td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-center">12/29/2025</td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-center">IDR</td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-right">11,000,000.00</td>
                  <td className="px-2 py-1 border-r border-slate-200 text-right">
                    <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right" defaultValue="11,000,000.00" />
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200">
                    <div className="flex gap-1">
                      <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right bg-cyan-50" defaultValue="0.00" readOnly />
                      <button className="px-1.5 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200 text-[10px] font-bold">...</button>
                    </div>
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-right">0.00</td>
                  <td className="px-2 py-1">
                    <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs" />
                  </td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-2 py-1 text-center border-r border-slate-200"></td>
                  <td className="px-2 py-1 border-r border-slate-200">
                    <div className="flex gap-1">
                      <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs" defaultValue="FT/001/01/2026" />
                      <button className="px-1.5 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={12} /></button>
                    </div>
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50">010.000-26.00000001</td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-center">1/21/2026</td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-center">IDR</td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-right">11,450,400.00</td>
                  <td className="px-2 py-1 border-r border-slate-200 text-right">
                    <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right" defaultValue="5,000,000.00" />
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200">
                    <div className="flex gap-1">
                      <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right bg-cyan-50" defaultValue="0.00" readOnly />
                      <button className="px-1.5 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200 text-[10px] font-bold">...</button>
                    </div>
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-right">6,450,400.00</td>
                  <td className="px-2 py-1">
                    <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs" />
                  </td>
                </tr>
                {/* Empty new row */}
                <tr className="border-b border-slate-200">
                  <td className="px-2 py-1 text-center border-r border-slate-200 font-bold">*</td>
                  <td className="px-2 py-1 border-r border-slate-200">
                    <div className="flex gap-1">
                      <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs" />
                      <button className="px-1.5 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={12} /></button>
                    </div>
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50"></td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-center"></td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-center"></td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-right"></td>
                  <td className="px-2 py-1 border-r border-slate-200 text-right"></td>
                  <td className="px-2 py-1 border-r border-slate-200">
                    <div className="flex justify-end">
                      <button className="px-1.5 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200 text-[10px] font-bold">...</button>
                    </div>
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200 bg-cyan-50 text-right"></td>
                  <td className="px-2 py-1"></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Internal Footer totals */}
          <div className="bg-slate-100 border-t border-slate-300 p-2 flex justify-center text-xs font-bold text-slate-800">
            Pembayaran : IDR 43,500,000.00 | Potongan : IDR 0.00
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 shrink-0">
          <button className={btnSecondary} onClick={() => navigate(-1)}><X size={16} /> Batal</button>
          <button className={btnPrimary}><Save size={16} /> Simpan Pembayaran</button>
        </div>
      </div>
    </div>
  );
};

export default Pembayaran;
