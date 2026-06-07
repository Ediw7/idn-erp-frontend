import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, FileText, Search, Save, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setupApi, TandaTanganData } from '../../setup/api';

const FakturPajak: React.FC = () => {
  const navigate = useNavigate();
  
  const [ttdList, setTtdList] = useState<TandaTanganData[]>([]);
  const [selectedTtdId, setSelectedTtdId] = useState<number | ''>('');

  useEffect(() => {
    const fetchTtd = async () => {
      try {
        const data = await setupApi.getTandaTangan();
        const fpTtd = data.filter(d => d.jenis_formulir === 'Faktur Pajak');
        setTtdList(fpTtd.length > 0 ? fpTtd : data);
        if (fpTtd.length > 0 && fpTtd[0].id) {
          setSelectedTtdId(fpTtd[0].id);
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
  const labelClassSmall = "block text-xs font-semibold text-slate-700 mb-1 shrink-0 w-24";
  const btnPrimary = "px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-sm hover:bg-slate-700 shadow-sm flex items-center gap-2 transition-colors";
  const btnSecondary = "px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-bold rounded-sm hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors";

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center shrink-0 overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-white font-bold text-lg flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-blue-400" />
            <span className="tracking-wide">FAKTUR PAJAK</span>
          </div>
          <div className="h-5 w-px bg-slate-600"></div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="whitespace-nowrap">Pilih Periode:</span>
            <select className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>202606</option>
            </select>
            <button className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white hover:bg-slate-600">+</button>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0 ml-4">
          <button 
            onClick={() => navigate('/laporan', { state: { initialReport: 'Faktur Pajak Hal 1 & 2 (A4)' } })}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            <FileText size={14} /> Report
          </button>
          <div className="w-px h-6 bg-slate-600 mx-0.5 self-center"></div>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            Create FP Pengganti
          </button>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            e-Faktur
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Main Header Area */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-4 mb-4 shrink-0">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="col-span-6 flex flex-col gap-2">
              <div className="flex items-center">
                <label className={labelClass}>Penomoran</label>
                <div className="flex gap-1 flex-1">
                  <select className={inputClass}>
                    <option>000.26-00000001 - 000.26-00099999</option>
                  </select>
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Plus size={16}/></button>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>No. Faktur Pajak</label>
                <div className="flex gap-1 w-64">
                  <input type="text" className={`${inputClass} bg-cyan-50 font-semibold`} defaultValue="010.000-26.00000005" />
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={16}/></button>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Tgl Faktur Pajak</label>
                <div className="flex gap-4 flex-1">
                  <input type="date" className={`${inputClass} w-40`} defaultValue="2026-06-06" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">Mata Uang</span>
                    <select className={`${inputClass} w-24`} defaultValue="IDR"><option>IDR</option></select>
                    <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Plus size={16}/></button>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Nama Pembeli</label>
                <div className="flex gap-1 flex-1">
                  <select className={inputClass} defaultValue="PT SARI WANGI">
                    <option>PT SARI WANGI</option>
                  </select>
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Plus size={16}/></button>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Alamat Pembeli</label>
                <input type="text" className={`${inputClass} bg-cyan-50`} defaultValue="Jl. Sukabumi No. 123, Menteng" />
              </div>
              <div className="flex items-center">
                <label className={labelClass}>NPWP</label>
                <input type="text" className={`${inputClass} bg-cyan-50`} defaultValue="01.234.478.3-032.000" />
              </div>
              <div className="flex items-center">
                <label className={labelClass}>FP Yang Diganti</label>
                <div className="flex gap-2 flex-1">
                  <div className="flex gap-1 flex-1">
                    <input type="text" className={inputClass} />
                    <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200"><Search size={16}/></button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-semibold text-slate-700">Tgl</span>
                    <input type="date" className={`${inputClass} w-32`} />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Jenis Transaksi</label>
                <select className={inputClass}>
                  <option>Kepada Bukan Pemungut PPN (01)</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-6 flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center">
                  <label className={labelClassSmall}>Jenis Status</label>
                  <input type="text" className={`${inputClass} bg-cyan-50`} defaultValue="Normal" readOnly />
                </div>
                <div className="flex items-center">
                  <label className={labelClassSmall}>No. Invoice</label>
                  <input type="text" className={inputClass} defaultValue="FT/002/12/2026" />
                </div>
                <div className="flex items-center">
                  <label className={labelClassSmall}>Tarif PPN</label>
                  <div className="flex gap-2 items-center w-24">
                    <input type="text" className={`${inputClass} text-right`} defaultValue="10" />
                    <span className="text-xs font-bold">%</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className={labelClassSmall}>Kurs Pajak</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" className={`${inputClass} w-32 text-right`} defaultValue="1.00" />
                    <span className="text-xs font-semibold">/</span>
                    <button className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold hover:bg-slate-200">1 RP</button>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className={labelClassSmall}>Tanda Tangan</label>
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
                  <label className={labelClassSmall}>Jabatan</label>
                  <input type="text" className={`${inputClass} bg-slate-100`} value={selectedTtd?.jabatan || 'Manager Accounting'} readOnly />
                </div>
                <div className="flex items-center mt-2 pt-2 border-t border-slate-200">
                  <label className={labelClassSmall}>Ket Tambahan</label>
                  <select className={inputClass}><option></option></select>
                </div>
              </div>
              
              {/* Record Info Box */}
              <div className="w-48 shrink-0">
                <div className="border border-slate-300 rounded-sm p-2 mb-2 bg-slate-50">
                  <div className="text-[10px] text-slate-500 font-semibold mb-1 border-b border-slate-200 pb-1">Record Created</div>
                  <div className="text-xs mb-1">6/7/2026 12:05:42 PM</div>
                  <div className="text-xs border border-slate-300 bg-white px-1">System</div>
                </div>
                <div className="border border-slate-300 rounded-sm p-2 bg-slate-50">
                  <div className="text-[10px] text-slate-500 font-semibold mb-1 border-b border-slate-200 pb-1">Record Modified</div>
                  <div className="h-4 bg-white border border-slate-300 mb-1"></div>
                  <div className="h-4 bg-white border border-slate-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[250px] overflow-hidden mb-4">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="w-10 px-3 py-2 text-center border-r border-blue-800">No.</th>
                  <th className="w-40 px-3 py-2 text-left border-r border-blue-800">Kode Barang</th>
                  <th className="px-3 py-2 text-left border-r border-blue-800">Nama Barang Kena Pajak/Jasa Kena Pajak</th>
                  <th className="w-24 px-3 py-2 text-center border-r border-blue-800">Satuan</th>
                  <th className="w-24 px-3 py-2 text-center border-r border-blue-800">Kuantum</th>
                  <th className="w-32 px-3 py-2 text-right border-r border-blue-800">Harga Satuan</th>
                  <th className="w-32 px-3 py-2 text-right border-r border-blue-800">Harga Jual</th>
                  <th className="w-24 px-3 py-2 text-center">Disc Footer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="px-3 py-1 border-r border-slate-200 text-center">
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
                    <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm" />
                  </td>
                  <td className="px-3 py-1 border-r border-slate-200">
                    <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm text-right" />
                  </td>
                  <td className="px-3 py-1 border-r border-slate-200">
                    <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm text-right" />
                  </td>
                  <td className="px-3 py-1 border-r border-slate-200">
                    <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm text-right bg-slate-100" disabled />
                  </td>
                  <td className="px-3 py-1">
                    <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer section */}
        <div className="bg-cyan-50 rounded-md shadow-sm border border-slate-200 p-4 shrink-0 flex justify-between gap-8">
          {/* Left Footer Table */}
          <div className="w-1/3">
            <table className="w-full text-xs bg-white border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="py-1 px-2 border-r border-slate-300">Tarif</th>
                  <th className="py-1 px-2 border-r border-slate-300">DPP</th>
                  <th className="py-1 px-2">PPn BM</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-2 border-r border-slate-300 text-center">%</td>
                  <td className="py-1 px-2 border-r border-slate-300"><input type="text" className="w-full outline-none" /></td>
                  <td className="py-1 px-2"><input type="text" className="w-full outline-none" /></td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-2 border-r border-slate-300 text-center">%</td>
                  <td className="py-1 px-2 border-r border-slate-300"><input type="text" className="w-full outline-none" /></td>
                  <td className="py-1 px-2"><input type="text" className="w-full outline-none" /></td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="py-1 px-2 border-r border-slate-300 text-center">%</td>
                  <td className="py-1 px-2 border-r border-slate-300"><input type="text" className="w-full outline-none" /></td>
                  <td className="py-1 px-2"><input type="text" className="w-full outline-none" /></td>
                </tr>
                <tr className="bg-cyan-100">
                  <td className="py-1 px-2 border-r border-slate-300 font-bold">Jumlah</td>
                  <td className="py-1 px-2 border-r border-slate-300"></td>
                  <td className="py-1 px-2 font-bold text-right">0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Footer Calculations */}
          <div className="flex-1 max-w-lg flex flex-col gap-1 text-sm">
            <div className="flex items-center justify-between">
              <select className="border border-slate-300 px-1 py-0.5 text-xs"><option>Harga Jual</option></select>
              <div className="flex gap-2 w-48 items-center">
                <span className="text-xs font-semibold w-6">IDR</span>
                <input type="text" className="flex-1 text-right bg-cyan-100 border border-slate-300 px-2 py-0.5" defaultValue="0.00" readOnly />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Dikurangi Potongan Harga</span>
              <div className="flex gap-2 w-48 items-center">
                <span className="text-xs font-semibold w-6">IDR</span>
                <input type="text" className="flex-1 text-right border border-slate-300 px-2 py-0.5" defaultValue="20,000.00" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Dikurangi Uang Muka Yang Telah Diterima</span>
              <div className="flex gap-2 w-48 items-center">
                <span className="text-xs font-semibold w-6">IDR</span>
                <input type="text" className="flex-1 text-right border border-slate-300 px-2 py-0.5" defaultValue="0.00" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs">Dasar Pengenaan Pajak Valas</span>
                <input type="checkbox" className="w-3 h-3" />
                <span className="text-xs">100/110</span>
              </div>
              <div className="flex gap-2 w-48 items-center">
                <span className="text-xs font-semibold w-6">IDR</span>
                <input type="text" className="flex-1 text-right border border-slate-300 px-2 py-0.5" defaultValue="-20,000.00" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Dasar Pengenaan Pajak</span>
              <div className="flex gap-2 w-48 items-center">
                <span className="text-xs font-semibold w-6">IDR</span>
                <input type="text" className="flex-1 text-right border border-slate-300 px-2 py-0.5" defaultValue="-20,000.00" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">PPN = 10% x Dasar Pengenaan Pajak</span>
              <div className="flex gap-2 w-48 items-center">
                <span className="text-xs font-semibold w-6">IDR</span>
                <input type="text" className="flex-1 text-right bg-white border border-slate-300 px-2 py-0.5 font-semibold" defaultValue="-2,000.00" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4 shrink-0">
          <button 
            onClick={() => navigate('/invoice')}
            className={btnSecondary}
          >
            <X size={16} /> Batal
          </button>
          <button className={btnPrimary}><Save size={16} /> Simpan Faktur Pajak</button>
        </div>
      </div>
    </div>
  );
};

export default FakturPajak;
