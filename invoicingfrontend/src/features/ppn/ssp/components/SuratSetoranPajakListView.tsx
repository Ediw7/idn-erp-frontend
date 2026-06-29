import React, { useState } from 'react';
import { FilePlus, Edit2, Trash2, Printer } from 'lucide-react';
import { SuratSetoranPajakData } from '../api';

interface ListViewProps {
  dataList: SuratSetoranPajakData[];
  loadingData: boolean;
  onOpenForm: () => void;
  onEdit: (item: SuratSetoranPajakData) => void;
  onDelete: (id: number) => void;
}

export const SuratSetoranPajakListView: React.FC<ListViewProps> = ({
  dataList, loadingData,
  onOpenForm, onEdit, onDelete
}) => {
  const [searchTahun, setSearchTahun] = useState(new Date().getFullYear().toString());
  const [searchBulan, setSearchBulan] = useState('');
  const [searchJenisPajak, setSearchJenisPajak] = useState('');
  const [searchJenisSetoran, setSearchJenisSetoran] = useState('');

  const filteredData = dataList.filter(item => {
    if (searchTahun && !item.tahun.includes(searchTahun)) return false;
    if (searchBulan && item.bulan !== searchBulan) return false;
    if (searchJenisPajak && !item.kode_jenis_pajak.includes(searchJenisPajak)) return false;
    if (searchJenisSetoran && !item.kode_jenis_setoran.includes(searchJenisSetoran)) return false;
    return true;
  });

  const totalSsp = filteredData.reduce((acc, curr) => acc + (curr.jumlah || 0), 0);

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Surat Setoran Pajak (SSP)</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium w-16">Tahun:</span>
              <input type="text" className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-1 outline-none focus:border-slate-400 w-20" value={searchTahun} onChange={e => setSearchTahun(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Jenis Pajak:</span>
              <input type="text" className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-1 outline-none focus:border-slate-400 w-32" value={searchJenisPajak} onChange={e => setSearchJenisPajak(e.target.value)} placeholder="Kode MAP..." />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium w-16">Bulan:</span>
              <select className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-1 outline-none focus:border-slate-400 w-20" value={searchBulan} onChange={e => setSearchBulan(e.target.value)}>
                <option value="">Semua</option>
                {Array.from({length: 12}, (_, i) => {
                  const m = (i+1).toString().padStart(2, '0');
                  return <option key={m} value={m}>{m}</option>
                })}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Jenis Setoran:</span>
              <input type="text" className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-1 outline-none focus:border-slate-400 w-32" value={searchJenisSetoran} onChange={e => setSearchJenisSetoran(e.target.value)} placeholder="Kode Setoran..." />
            </div>
          </div>
        </div>
        <button onClick={onOpenForm} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
           <FilePlus size={14} /> + BUAT SSP BARU
        </button>
      </div>

      {/* Grid Table */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1 flex flex-col">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center border-r border-slate-200">Tanggal</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-left border-r border-slate-200">Nama WP</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center border-r border-slate-200">Thn</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center border-r border-slate-200">Bln</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center border-r border-slate-200">Jenis Pajak</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center border-r border-slate-200">Jenis Setoran</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-left border-r border-slate-200">Uraian Pembayaran</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right border-r border-slate-200">Jumlah</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingData ? (
                <tr><td colSpan={9} className="text-center p-6 italic text-slate-500">Memuat data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={9} className="text-center p-6 italic text-slate-500">Tidak ada data SSP.</td></tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-center text-slate-600 border-r border-slate-100">{item.tanggal}</td>
                    <td className="px-3 py-2 text-left font-semibold text-slate-800 border-r border-slate-100">{item.nama_wp}</td>
                    <td className="px-3 py-2 text-center font-mono text-slate-700 border-r border-slate-100">{item.tahun}</td>
                    <td className="px-3 py-2 text-center text-slate-700 border-r border-slate-100">{item.bulan}</td>
                    <td className="px-3 py-2 text-center font-mono text-slate-700 border-r border-slate-100">{item.kode_jenis_pajak}</td>
                    <td className="px-3 py-2 text-center font-mono text-slate-700 border-r border-slate-100">{item.kode_jenis_setoran}</td>
                    <td className="px-3 py-2 text-left text-slate-600 border-r border-slate-100 truncate max-w-xs" title={item.uraian_pembayaran}>{item.uraian_pembayaran || '-'}</td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-blue-700 border-r border-slate-100">
                      {item.jumlah.toLocaleString('en-US')}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEdit(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => { if(item.id) onDelete(item.id); }} className="p-1 text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
           <span className="text-xs font-semibold text-slate-600">Total Records: {filteredData.length}</span>
         </div>
         <div className="flex items-center gap-3">
           <span className="text-sm font-bold text-slate-800 bg-slate-200 px-3 py-1 rounded-sm border border-slate-300">Total SSP:</span>
           <span className="text-sm font-bold text-white bg-slate-800 px-6 py-1 rounded-sm font-mono border border-slate-700">{totalSsp.toLocaleString('en-US')}</span>
         </div>
      </div>
    </div>
  );
};
