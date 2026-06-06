import React, { useState } from 'react';
import { Plus, Trash2, X, FileText, Search, Save, FileBox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuratJalan: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1";
  const btnPrimary = "px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-sm hover:bg-slate-700 transition-colors flex items-center justify-center gap-2";
  const btnSecondary = "px-4 py-2 bg-white text-slate-700 border border-slate-300 text-xs font-semibold rounded-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2";

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header Info */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <h1 className="text-xl font-bold text-slate-800">Surat Jalan</h1>
        <p className="text-sm text-slate-500 mt-1">Buat dan kelola data Surat Jalan (Delivery Order).</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden mb-6">
          
          {/* Card Header & Toolbar */}
          <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center text-white">
            <div>
              <h2 className="text-lg font-bold">Form Surat Jalan</h2>
              <p className="text-xs text-slate-300">Isi kelengkapan data dokumen pengiriman barang</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/laporan', { state: { initialReport: 'Surat Jalan (A4 / Kwarto / 1/2 Kwarto) - Font 10' } })}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors">
                <FileText size={14} /> Report
              </button>
              <div className="w-px h-6 bg-slate-600 mx-1 self-center"></div>
              <button 
                onClick={() => setIsCreateInvoiceModalOpen(true)}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 border border-green-500 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors">
                Create Invoice
              </button>
            </div>
          </div>

          <div className="p-6 bg-white">
            {/* Top Toolbar Info */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-700">Periode:</label>
                <select className={`${inputClass} w-32`}>
                  <option>202606</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {/* Kolom 1 */}
              <div>
                <label className={labelClass}>No. Surat Jalan</label>
                <div className="flex gap-2">
                  <input type="text" className={inputClass} defaultValue="SJ/004/12/2026" />
                  <button className="px-3 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-sm"><Search size={16}/></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tanggal</label>
                <input type="date" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Nama Pelanggan</label>
                <div className="flex gap-2">
                  <select className={inputClass}>
                    <option>PT Sari Wangi</option>
                  </select>
                  <button className="px-3 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-sm text-slate-700 font-bold">+</button>
                </div>
              </div>
              <div className="lg:col-span-3">
                <label className={labelClass}>Alamat Kirim</label>
                <textarea className={`${inputClass} h-16 resize-none`} defaultValue="Jl. Sukabumi No. 123, Menteng&#10;Jakarta Pusat" />
              </div>

              {/* Kolom 2 */}
              <div className="mt-2">
                <label className={labelClass}>Gudang</label>
                <select className={inputClass}><option>Kapuk</option></select>
              </div>
              <div className="mt-2">
                <label className={labelClass}>No. Sales Order</label>
                <div className="flex gap-2">
                  <input type="text" className={inputClass} defaultValue="SO/005/12/2026" />
                  <button className="px-3 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-sm"><Search size={16}/></button>
                </div>
              </div>
              <div className="mt-2">
                <label className={labelClass}>No. PO</label>
                <input type="text" className={inputClass} />
              </div>

              {/* Kolom 3 */}
              <div>
                <label className={labelClass}>No. Kendaraan</label>
                <input type="text" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>No. Invoice</label>
                <input type="text" className={inputClass} defaultValue="FT/001/12/2026" />
              </div>
              <div className="lg:col-span-3">
                <label className={labelClass}>Keterangan</label>
                <input type="text" className={inputClass} />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 px-6 pt-4 border-t border-slate-200">
            <div className="flex border-b border-slate-300">
              <button 
                className="px-6 py-2.5 text-sm font-semibold rounded-t-md transition-colors bg-white border-t border-l border-r border-slate-300 text-slate-800 -mb-px flex items-center gap-2"
              ><FileBox size={16}/> Item Terkirim</button>
            </div>
          </div>

          <div className="bg-white overflow-x-auto border-b border-slate-200">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center w-12">No</th>
                  <th className="px-4 py-3 font-semibold">Kode Barang</th>
                  <th className="px-4 py-3 font-semibold w-1/3">Nama Barang</th>
                  <th className="px-4 py-3 font-semibold text-center">Satuan</th>
                  <th className="px-4 py-3 font-semibold text-right">Kuantum</th>
                  <th className="px-4 py-3 font-semibold w-1/3">Keterangan</th>
                  <th className="px-4 py-3 font-semibold text-center w-12">Act</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 group">
                  <td className="px-4 py-2 text-center text-slate-500">1</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <input type="text" className="w-32 px-2 py-1 border border-slate-200 rounded-sm text-xs focus:outline-none focus:border-slate-400" />
                      <button className="px-2 border border-slate-200 bg-slate-100 hover:bg-slate-200 rounded-sm"><Search size={12}/></button>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-slate-700 font-medium"></td>
                  <td className="px-4 py-2 text-center text-slate-600"></td>
                  <td className="px-4 py-2 text-right"><input type="number" className="w-20 px-2 py-1 border border-slate-200 rounded-sm text-xs text-right focus:outline-none" /></td>
                  <td className="px-4 py-2"><input type="text" className="w-full px-2 py-1 border border-slate-200 rounded-sm text-xs focus:outline-none" /></td>
                  <td className="px-4 py-2 text-center">
                    <button className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                  </td>
                </tr>
                <tr>
                  <td colSpan={7} className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><Plus size={14} /> New Item (Cari Barang)</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Area */}
          <div className="p-6 bg-slate-50 flex justify-end">
            <div className="flex items-center gap-4 border border-slate-200 bg-white px-4 py-2 rounded-sm shadow-sm">
              <span className="text-slate-600 font-bold">Total Kuantum</span>
              <span className="font-bold text-slate-800 text-lg">0.00</span>
            </div>
          </div>
        </div>
        
        {/* Main Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <button className={btnSecondary}><X size={16} /> Batal</button>
          <button className={btnPrimary}><Save size={16} /> Simpan Surat Jalan</button>
        </div>
      </div>

      {/* Auto Create Invoice Modal */}
      {isCreateInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-xl w-full max-w-lg flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-800 px-4 py-3 flex justify-between items-center text-white">
              <h2 className="text-sm font-bold">Create Invoice</h2>
              <button onClick={() => setIsCreateInvoiceModalOpen(false)} className="hover:text-slate-300 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 bg-slate-50 flex flex-col gap-4">
              <div className="flex items-center">
                <label className="w-36 text-sm font-semibold text-slate-700">Nama Pelanggan</label>
                <select className={`${inputClass} flex-1`} defaultValue="PT Sari Wangi">
                  <option>PT Sari Wangi</option>
                </select>
              </div>
              <div className="flex items-start">
                <label className="w-36 text-sm font-semibold text-slate-700 mt-2">Alamat Kirim</label>
                <textarea className={`${inputClass} flex-1 h-16 resize-none`} defaultValue="Jl. Sukabumi No. 123, Menteng&#10;Jakarta Pusat" />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-sm font-semibold text-slate-700">No. Surat Jalan</label>
                <select className={`${inputClass} flex-1`} defaultValue="SJ/005/12/2026">
                  <option>SJ/005/12/2026</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-sm font-semibold text-slate-700">Gudang</label>
                <select className={`${inputClass} flex-1`} defaultValue="Kapuk">
                  <option>Kapuk</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-sm font-semibold text-slate-700">Tanggal</label>
                <input type="date" className={`${inputClass} flex-1`} />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-sm font-semibold text-slate-700">Jenis Invoice</label>
                <select className={`${inputClass} flex-1`} defaultValue="Dengan PPN">
                  <option>Dengan PPN</option>
                  <option>Tanpa PPN</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-center gap-4">
              <button 
                onClick={() => navigate('/invoice')}
                className="px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-sm hover:bg-blue-500 shadow-sm transition-colors">
                Create
              </button>
              <button 
                onClick={() => setIsCreateInvoiceModalOpen(false)}
                className="px-8 py-2 bg-slate-700 text-white text-sm font-bold rounded-sm hover:bg-slate-600 shadow-sm transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuratJalan;
