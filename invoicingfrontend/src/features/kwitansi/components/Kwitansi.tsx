import React, { useState, useEffect } from 'react';
import { Plus, X, FileText, Search, Save, HandCoins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setupApi, TandaTanganData } from '../../setup/api';

const Kwitansi: React.FC = () => {
  const navigate = useNavigate();
  
  const [ttdList, setTtdList] = useState<TandaTanganData[]>([]);
  const [selectedTtdId, setSelectedTtdId] = useState<number | ''>('');

  useEffect(() => {
    const fetchTtd = async () => {
      try {
        const data = await setupApi.getTandaTangan();
        const kwiTtd = data.filter(d => d.jenis_formulir === 'Kwitansi');
        setTtdList(kwiTtd.length > 0 ? kwiTtd : data);
        if (kwiTtd.length > 0 && kwiTtd[0].id) {
          setSelectedTtdId(kwiTtd[0].id);
        } else if (data.length > 0 && data[0].id) {
          setSelectedTtdId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch tanda tangan:', error);
      }
    };
    fetchTtd();
  }, []);

  const selectedTtd = ttdList.find(t => t.id === selectedTtdId);

  const inputClass = "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1 shrink-0 w-32";
  const btnPrimary = "px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-sm hover:bg-slate-700 shadow-sm flex items-center gap-2 transition-colors";
  const btnSecondary = "px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-bold rounded-sm hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0 overflow-x-auto">
        <div className="flex items-center gap-6 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">Kwitansi</h2>
            <p className="text-xs text-slate-300 mt-1">Kelola pembuatan dan pencetakan data kwitansi.</p>
          </div>
          <div className="h-8 w-px bg-slate-600"></div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="whitespace-nowrap">Pilih Periode:</span>
            <select className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>202606</option>
            </select>
            <button className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white hover:bg-slate-600">+</button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-200 ml-4">
            <span className="whitespace-nowrap">Jenis Kwitansi:</span>
            <select className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>VAT</option>
              <option>Non-VAT</option>
            </select>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0 ml-4">
          <button 
            onClick={() => navigate('/laporan', { state: { initialReport: 'Kwitansi (1/2 Kwarto)' } })}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            <FileText size={14} /> Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Main Form Area */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 mb-4 max-w-4xl self-start w-full">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <label className={labelClass}>No. Kwitansi</label>
              <div className="flex gap-2 w-72">
                <input type="text" className={`${inputClass} font-semibold`} defaultValue="KT/002/12/2026" />
                <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={16}/></button>
                <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap">Auto No</button>
              </div>
            </div>
            
            <div className="flex items-center">
              <label className={labelClass}>Tgl Kwitansi</label>
              <input type="date" className={`${inputClass} w-48`} defaultValue="2026-06-06" />
            </div>

            <div className="flex items-center">
              <label className={labelClass}>No. Invoice</label>
              <input type="text" className={`${inputClass} w-72`} defaultValue="FT/002/12/2026" />
            </div>

            <div className="flex items-start mt-2">
              <label className={labelClass}>Sudah Terima Dari</label>
              <div className="flex flex-col gap-1 w-[400px]">
                <div className="flex gap-1">
                  <select className={inputClass} defaultValue="PT Sari Wangi">
                    <option>PT Sari Wangi</option>
                  </select>
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Plus size={16}/></button>
                </div>
                <textarea className={`${inputClass} bg-cyan-50 h-16 resize-none`} defaultValue="Jl. Sukabumi No. 123, Menteng&#10;Jakarta Pusat" readOnly />
              </div>
            </div>

            <div className="flex items-center mt-2">
              <label className={labelClass}>Jumlah</label>
              <div className="flex gap-2 w-72 items-center">
                <select className={`${inputClass} w-24`} defaultValue="IDR"><option>IDR</option></select>
                <input type="text" className={`${inputClass} text-right font-semibold bg-cyan-50`} defaultValue="-22,000.00" readOnly />
              </div>
            </div>

            <div className="flex items-start">
              <label className={labelClass}>Terbilang</label>
              <div className="flex flex-col gap-1 w-full">
                <input type="text" className={`${inputClass} bg-cyan-50`} readOnly />
                <input type="text" className={`${inputClass} bg-cyan-50`} readOnly />
              </div>
            </div>

            <div className="flex items-start mt-2">
              <label className={labelClass}>Untuk Pembayaran</label>
              <textarea className={`${inputClass} h-24 resize-none`} defaultValue="Invoice No. FT/002/12/2026" />
            </div>

            <div className="flex items-start mt-2">
              <label className={labelClass}>Keterangan Footer</label>
              <textarea className={`${inputClass} h-32 resize-none text-xs leading-relaxed`} defaultValue="Catatan :&#10;1. Pembayaran untuk invoice ini mohon ditransfer ke rekening :&#10;   Bank BCA Cab. Sudirman&#10;   No. Rekening : 035-0123456&#10;   Atas Nama PT Krishand Indonesia&#10;&#10;2. Pembayaran dengan cek/giro baru dianggap sah setelah dicairkan." />
            </div>

            <div className="flex items-center mt-2">
              <label className={labelClass}>Tanda Tangan</label>
              <select 
                className={`${inputClass} w-72`}
                value={selectedTtdId}
                onChange={(e) => setSelectedTtdId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="" disabled>Pilih Tanda Tangan...</option>
                {ttdList.map(ttd => (
                  <option key={ttd.id} value={ttd.id}>{ttd.nama}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className={labelClass}>Jabatan</label>
              <input type="text" className={`${inputClass} w-72 bg-slate-100 text-slate-500`} value={selectedTtd?.jabatan || ''} readOnly />
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-start gap-3 mt-4 shrink-0 max-w-4xl self-start w-full">
          <button 
            onClick={() => navigate('/invoice')}
            className={btnSecondary}
          >
            <X size={16} /> Batal
          </button>
          <button className={btnPrimary}><Save size={16} /> Simpan Kwitansi</button>
        </div>
      </div>
    </div>
  );
};

export default Kwitansi;
