import React, { useState } from 'react';
import { Plus, Trash2, X, FileText, Search, Save, FileBox, RefreshCcw, DollarSign, Copy, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Invoice: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('detail');

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1";
  const btnPrimary = "px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-sm hover:bg-slate-700 shadow-sm flex items-center gap-2 transition-colors";
  const btnSecondary = "px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-bold rounded-sm hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors";

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center shrink-0 overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-white font-bold text-lg flex items-center gap-2">
            <FileBox size={20} className="text-blue-400" />
            <span className="tracking-wide">INVOICE</span>
          </div>
          <div className="h-5 w-px bg-slate-600"></div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="whitespace-nowrap">Pilih Periode:</span>
            <select className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>202606</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="whitespace-nowrap">Jenis Invoice:</span>
            <select className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Dengan PPN</option>
              <option>Tanpa PPN</option>
            </select>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0 ml-4">
          <button 
            onClick={() => navigate('/laporan', { state: { initialReport: 'Invoice (A4 / Kwarto)' } })}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            <FileText size={14} /> Report
          </button>
          <div className="w-px h-6 bg-slate-600 mx-0.5 self-center"></div>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            Create FP
          </button>
          <button className="px-3 py-1.5 bg-green-600 hover:bg-green-500 border border-green-500 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            Create Kwitansi
          </button>
          <div className="w-px h-6 bg-slate-600 mx-0.5 self-center"></div>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            <DollarSign size={14} /> Pay
          </button>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            <Copy size={14} /> Copy
          </button>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            <Filter size={14} /> Filter Data
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Form Area */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 mb-4">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="col-span-4 flex flex-col gap-3">
              <div>
                <label className={labelClass}>No. Invoice</label>
                <div className="flex gap-2">
                  <input type="text" className={`${inputClass} font-bold text-blue-900 bg-blue-50`} defaultValue="FT/002/12/2026" />
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200 transition-colors"><Search size={16} className="text-slate-600" /></button>
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap">Auto No</button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tgl Invoice</label>
                <input type="date" className={inputClass} defaultValue="2026-06-06" />
              </div>
              <div>
                <label className={labelClass}>Nama Pembeli</label>
                <div className="flex gap-2">
                  <select className={inputClass} defaultValue="PT Sari Wangi">
                    <option>PT Sari Wangi</option>
                  </select>
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200 transition-colors"><Plus size={16} className="text-slate-600" /></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Alamat</label>
                <textarea className={`${inputClass} h-20 resize-none text-xs`} defaultValue="Jl. Sukabumi No. 123, Menteng&#10;Jakarta Pusat" />
              </div>
              <div>
                <label className={labelClass}>NPWP</label>
                <input type="text" className={`${inputClass} bg-cyan-50`} defaultValue="01.234.478.3-032.000" />
              </div>
              <div>
                <label className={labelClass}>Proyek</label>
                <select className={inputClass}>
                  <option></option>
                </select>
              </div>
            </div>

            {/* Middle Column */}
            <div className="col-span-4 flex flex-col gap-3">
              <div>
                <label className={labelClass}>Mata Uang</label>
                <select className={inputClass} defaultValue="IDR">
                  <option>IDR</option>
                  <option>USD</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>No. SO</label>
                <div className="flex gap-2">
                  <input type="text" className={inputClass} defaultValue="SO/005/12/2026" />
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200 transition-colors"><Search size={16} className="text-slate-600" /></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>No. PO</label>
                <input type="text" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Cara Pembayaran</label>
                <select className={inputClass} defaultValue="Kredit 7 Hari">
                  <option>Kredit 7 Hari</option>
                  <option>Cash</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Salesman</label>
                <select className={inputClass}>
                  <option></option>
                </select>
              </div>
              <div>
                <label className={labelClass}>No. Faktur Pajak</label>
                <div className="flex gap-2">
                  <input type="text" className={`${inputClass} bg-cyan-50`} />
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200 transition-colors"><RefreshCcw size={16} className="text-slate-600" /></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>No. Kwitansi</label>
                <div className="flex gap-2">
                  <input type="text" className={`${inputClass} bg-cyan-50`} />
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200 transition-colors"><RefreshCcw size={16} className="text-slate-600" /></button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Kurs Jual</label>
                  <input type="text" className={`${inputClass} text-right`} defaultValue="1.00" />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Tgl JT</label>
                  <input type="date" className={inputClass} defaultValue="2026-06-13" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Tgl PO</label>
                  <input type="date" className={inputClass} />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Gudang</label>
                  <input type="text" className={`${inputClass} bg-slate-100 text-slate-500`} defaultValue="Kapuk" disabled />
                </div>
              </div>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                  <label className="text-xs font-semibold text-slate-700">Jasa?</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                  <label className="text-xs font-semibold text-slate-700">Paid?</label>
                </div>
              </div>
              <div className="mt-2">
                <label className={labelClass}>Catatan Internal</label>
                <textarea className={`${inputClass} h-20 resize-none`} />
              </div>
              
              <div className="mt-auto">
                <div className="text-[10px] text-slate-500 border border-slate-200 rounded p-2 bg-slate-50 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">Record Created:</span>
                    <span>6/6/2026 2:34:44 PM (System - Admin)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Record Modified:</span>
                    <span>-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 flex flex-col overflow-hidden mb-4">
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button 
              onClick={() => setActiveTab('detail')}
              className={`px-6 py-2.5 text-xs font-bold transition-colors ${activeTab === 'detail' ? 'bg-white text-blue-700 border-t-2 border-t-blue-600 border-r border-slate-200' : 'text-slate-600 hover:bg-slate-100 border-t-2 border-t-transparent border-r border-transparent'}`}>
              Detail Barang/Jasa
            </button>
            <button 
              onClick={() => setActiveTab('surat-jalan')}
              className={`px-6 py-2.5 text-xs font-bold transition-colors ${activeTab === 'surat-jalan' ? 'bg-white text-blue-700 border-t-2 border-t-blue-600 border-x border-slate-200' : 'text-slate-600 hover:bg-slate-100 border-t-2 border-t-transparent border-x border-transparent'}`}>
              Surat Jalan
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 text-xs font-bold transition-colors ${activeTab === 'history' ? 'bg-white text-blue-700 border-t-2 border-t-blue-600 border-x border-slate-200' : 'text-slate-600 hover:bg-slate-100 border-t-2 border-t-transparent border-x border-transparent'}`}>
              History Pembayaran
            </button>
          </div>
          
          <div className="p-0 overflow-x-auto min-h-[250px]">
            {activeTab === 'detail' && (
              <table className="w-full text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="w-10 px-3 py-2 text-center border-r border-slate-700">No.</th>
                    <th className="w-48 px-3 py-2 text-left border-r border-slate-700">Kode Barang</th>
                    <th className="px-3 py-2 text-left border-r border-slate-700">Nama Barang</th>
                    <th className="w-24 px-3 py-2 text-center border-r border-slate-700">Satuan</th>
                    <th className="w-24 px-3 py-2 text-center border-r border-slate-700">Kuantum</th>
                    <th className="w-32 px-3 py-2 text-right border-r border-slate-700">Harga @</th>
                    <th className="w-20 px-3 py-2 text-center border-r border-slate-700">% Disc</th>
                    <th className="w-32 px-3 py-2 text-right border-r border-slate-700">Discount Harga</th>
                    <th className="w-32 px-3 py-2 text-right">Harga Jual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-center border-r border-slate-200">
                      <button className="p-1 hover:bg-slate-200 rounded text-slate-500"><Trash2 size={14} /></button>
                    </td>
                    <td className="px-3 py-1 border-r border-slate-200">
                      <div className="flex gap-1">
                        <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm" />
                        <button className="px-1.5 border border-slate-300 bg-slate-100 rounded-sm"><Search size={12}/></button>
                      </div>
                    </td>
                    <td className="px-3 py-1 border-r border-slate-200">
                      <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm" />
                    </td>
                    <td className="px-3 py-1 border-r border-slate-200">
                      <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm text-center" />
                    </td>
                    <td className="px-3 py-1 border-r border-slate-200">
                      <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm text-right" defaultValue="0" />
                    </td>
                    <td className="px-3 py-1 border-r border-slate-200">
                      <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm text-right" defaultValue="0" />
                    </td>
                    <td className="px-3 py-1 border-r border-slate-200">
                      <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm text-right" defaultValue="0.00" />
                    </td>
                    <td className="px-3 py-1 border-r border-slate-200">
                      <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm text-right" defaultValue="0" />
                    </td>
                    <td className="px-3 py-1">
                      <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm text-right bg-slate-100" defaultValue="0" disabled />
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            {activeTab !== 'detail' && (
              <div className="p-8 text-center text-slate-500 text-sm">
                Tidak ada data.
              </div>
            )}
          </div>
        </div>

        {/* Footer Summary Section */}
        <div className="grid grid-cols-12 gap-6 bg-white rounded-md shadow-sm border border-slate-200 p-5 mb-6">
          {/* Signatures & Notes */}
          <div className="col-span-5 flex flex-col gap-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClass}>Tanda Tangan</label>
                <input type="text" className={inputClass} defaultValue="Vonny Kusuma" />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Jabatan</label>
                <input type="text" className={inputClass} defaultValue="Manager Accounting" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Keterangan</label>
              <textarea className={`${inputClass} h-24 resize-none text-xs leading-relaxed`} defaultValue="Pembayaran untuk invoice ini mohon ditransfer ke rekening :&#10;Bank BCA Cab. Sudirman&#10;No. Rekening : 035-0123456&#10;Atas Nama PT Krishand Indonesia" />
            </div>
          </div>

          {/* Left Totals */}
          <div className="col-span-3 flex flex-col gap-2 pt-5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700 w-32">Nilai Invoice</span>
              <input type="text" className={`${inputClass} w-32 text-right bg-cyan-50 font-semibold`} defaultValue="-22,000.00" readOnly />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700 w-32">Pembayaran</span>
              <input type="text" className={`${inputClass} w-32 text-right bg-cyan-50`} defaultValue="0.00" readOnly />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700 w-32">Potongan</span>
              <input type="text" className={`${inputClass} w-32 text-right bg-cyan-50`} defaultValue="0.00" readOnly />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700 w-32">Nota Kredit</span>
              <input type="text" className={`${inputClass} w-32 text-right bg-cyan-50`} defaultValue="0.00" readOnly />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700 w-32">Sisa Piutang</span>
              <input type="text" className={`${inputClass} w-32 text-right bg-cyan-50 font-bold`} defaultValue="-22,000.00" readOnly />
            </div>
          </div>

          {/* Right Totals */}
          <div className="col-span-4 flex flex-col gap-2 pt-5">
            <div className="flex justify-end items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Jlh Harga Jual</span>
              <input type="text" className={`${inputClass} w-40 text-right bg-cyan-50`} defaultValue="0.00" readOnly />
            </div>
            <div className="flex justify-end items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Disc.</span>
              <div className="flex items-center gap-1 w-40">
                <input type="text" className={`${inputClass} w-full text-right`} defaultValue="" />
                <span className="text-xs font-bold">%</span>
              </div>
            </div>
            <div className="flex justify-end items-center gap-3">
              <span className="text-xs font-semibold text-slate-700"></span>
              <input type="text" className={`${inputClass} w-40 text-right font-semibold`} defaultValue="20,000.00" />
            </div>
            <div className="flex justify-end items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Uang Muka</span>
              <input type="text" className={`${inputClass} w-40 text-right bg-cyan-50`} defaultValue="0.00" readOnly />
            </div>
            <div className="flex justify-end items-center gap-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <span className="text-xs font-semibold text-slate-700">Include PPN</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 ml-2">PPN</span>
              <div className="flex gap-1 w-40">
                <input type="text" className={`${inputClass} w-16 text-right`} defaultValue="10.00 %" />
                <input type="text" className={`${inputClass} flex-1 text-right bg-cyan-50 font-semibold`} defaultValue="-2,000.00" readOnly />
              </div>
            </div>
            <div className="flex justify-end items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">PPh 22</span>
              <div className="flex gap-1 w-40">
                <input type="text" className={`${inputClass} w-16 text-right`} defaultValue="0.00 %" />
                <input type="text" className={`${inputClass} flex-1 text-right bg-cyan-50`} defaultValue="0.00" readOnly />
              </div>
            </div>
            <div className="flex justify-end items-center gap-3 mt-1 pt-2 border-t border-slate-200">
              <span className="text-sm font-bold text-slate-800">Total</span>
              <input type="text" className={`${inputClass} w-40 text-right bg-cyan-50 font-bold text-base py-3`} defaultValue="-22,000.00" readOnly />
            </div>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <button className={btnSecondary}><X size={16} /> Batal</button>
          <button className={btnPrimary}><Save size={16} /> Simpan Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
