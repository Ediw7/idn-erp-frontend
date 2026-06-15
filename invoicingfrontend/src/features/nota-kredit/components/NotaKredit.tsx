import React, { useState, useEffect } from 'react';
import { Search, Save, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setupApi, TandaTanganData } from '../../setup/api';

const NotaKredit: React.FC = () => {
  const navigate = useNavigate();

  const [ttdList, setTtdList] = useState<TandaTanganData[]>([]);
  const [selectedTtdId, setSelectedTtdId] = useState<number | ''>('');

  useEffect(() => {
    const fetchTtd = async () => {
      try {
        const data = await setupApi.getTandaTangan();
        const nkTtd = data.filter(d => d.jenis_formulir === 'Nota Kredit');
        setTtdList(nkTtd.length > 0 ? nkTtd : data);
        if (nkTtd.length > 0 && nkTtd[0].id) {
          setSelectedTtdId(nkTtd[0].id);
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
            <h2 className="text-lg font-semibold text-white">Nota Kredit</h2>
            <p className="text-xs text-slate-300 mt-1">Kelola data transaksi Nota Kredit pelanggan.</p>
          </div>
          <div className="h-8 w-px bg-slate-600"></div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="whitespace-nowrap">Pilih Periode:</span>
            <select className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option></option>
            </select>
            <button className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white hover:bg-slate-600">+</button>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0 ml-4">
          <button 
            onClick={() => navigate('/laporan', { state: { initialReport: 'Nota Kredit (1/2 Kwarto)' } })}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            <FileText size={14} /> LAPORAN </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Main Header Area */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-4 mb-4 shrink-0">
          <div className="flex gap-12">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClass}>No. Nota Kredit</label>
                <div className="flex gap-1 flex-1">
                  <input type="text" className={`${inputClass} font-semibold`}  />
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={16}/></button>
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap">Auto No</button>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Tgl Nota Kredit</label>
                <input type="date" className={`${inputClass} w-40`}  />
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClass}>Nama Pelanggan</label>
                <select className={inputClass}>
                  <option></option>
                </select>
              </div>
              <div className="flex items-start">
                <label className={labelClass}>Alamat</label>
                <textarea className={`${inputClass} bg-cyan-50 h-16 resize-none`}  readOnly />
              </div>
              
              <div className="flex items-center mt-2">
                <label className={labelClass}>Nilai Nota Kredit</label>
                <div className="flex gap-1 w-64 items-center">
                  <input type="text" className={`${inputClass} w-16 bg-cyan-50 text-center font-semibold`}  readOnly />
                  <input type="text" className={`${inputClass} flex-1 text-right bg-cyan-50 font-semibold`}  readOnly />
                </div>
              </div>

              {/* Record Info Box */}
              <div className="flex gap-4 mt-4">
                <div className="border border-slate-300 rounded-sm p-2 bg-slate-50 flex-1">
                  <div className="text-[10px] text-slate-500 font-semibold mb-1 border-b border-slate-200 pb-1">Record Created</div>
                  <div className="h-4 bg-white border border-slate-300 mb-1 px-1 text-[10px]"></div>
                  <div className="h-4 bg-white border border-slate-300 px-1 text-[10px]"></div>
                </div>
                <div className="border border-slate-300 rounded-sm p-2 bg-slate-50 flex-1">
                  <div className="text-[10px] text-slate-500 font-semibold mb-1 border-b border-slate-200 pb-1">Record Modified</div>
                  <div className="h-4 bg-white border border-slate-300 mb-1 px-1 text-[10px]"></div>
                  <div className="h-4 bg-white border border-slate-300 px-1 text-[10px]"></div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClass}>Atas No. Invoice</label>
                <div className="flex gap-1 flex-1">
                  <input type="text" className={inputClass} />
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={16}/></button>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>No. Referensi</label>
                <input type="text" className={inputClass} />
              </div>
              
              <div className="flex items-center mt-4">
                <label className={labelClass}>Tanda Tangan</label>
                <select 
                  className={inputClass}
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
                <input type="text" className={`${inputClass} bg-slate-100 text-slate-500`} value={selectedTtd?.jabatan || ''} readOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[250px] overflow-hidden mb-4">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="w-10 px-2 py-2 text-center border-r border-blue-800">No.</th>
                  <th className="px-3 py-2 text-left border-r border-blue-800 min-w-[300px]">Keterangan</th>
                  <th className="w-48 px-3 py-2 text-right border-r border-blue-800">Jumlah</th>
                  <th className="w-48 px-3 py-2 text-center">No Perkiraan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-2 py-1 text-center border-r border-slate-200">▶</td>
                  <td className="px-2 py-1 border-r border-slate-200">
                    <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs" />
                  </td>
                  <td className="px-2 py-1 border-r border-slate-200 text-right">
                    <input type="text" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right"  />
                  </td>
                  <td className="px-2 py-1">
                    <select className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs"><option></option></select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 shrink-0">
          <button className={btnSecondary} onClick={() => navigate(-1)}><X size={16} /> Batal</button>
          <button className={btnPrimary}><Save size={16} /> Simpan Nota Kredit</button>
        </div>
      </div>
    </div>
  );
};

export default NotaKredit;
