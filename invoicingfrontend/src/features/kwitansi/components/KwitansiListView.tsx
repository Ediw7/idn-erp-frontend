import React from 'react';
import { FilePlus, Search, Edit2, Trash2 } from 'lucide-react';
import { formatTerbilang } from './useKwitansiLogic';

interface KwitansiListViewProps {
  dataList: any[];
  filteredData: any[];
  pelanggans: any[];
  filter: any;
  setFilter: (f: any) => void;
  handleResetFilter: () => void;
  onOpenForm: () => void;
  onEdit: (kwitansi: string) => void;
  onDelete: (kwitansi: string) => void;
}

export const KwitansiListView: React.FC<KwitansiListViewProps> = ({
  filteredData, pelanggans, filter, setFilter, handleResetFilter, onOpenForm, onEdit, onDelete
}) => {
  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Daftar Kwitansi</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Bulan:</span>
              <select 
                value={filter.periode.split('-')[1]} 
                onChange={e => setFilter({...filter, periode: `${filter.periode.split('-')[0]}-${e.target.value}`})}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
              <span className="text-xs text-slate-300 font-medium ml-1">Tahun:</span>
              <select 
                value={filter.periode.split('-')[0]} 
                onChange={e => setFilter({...filter, periode: `${e.target.value}-${filter.periode.split('-')[1]}`})}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Pelanggan:</span>
              <select 
                value={filter.pelanggan_id} 
                onChange={e => setFilter({...filter, pelanggan_id: e.target.value})}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-48"
              >
                <option value="">-- Semua Pelanggan --</option>
                {pelanggans.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onOpenForm} 
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
          >
            <FilePlus size={14} /> + BUKA FORM
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300 w-12 text-center">No</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300">No. Kwitansi</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300">Jenis</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300">Tgl Kwitansi</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300">No Invoice</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300">Terima Dari</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300">Curr</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300 text-right">Jumlah</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300">Keterangan</th>
              <th className="py-2 px-4 text-xs font-semibold text-slate-700 border-b border-slate-300 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredData.length > 0 ? filteredData.map((item, idx) => {
              const p = pelanggans.find(x => x.id === Number(item.pembeli_id));
              return (
                <tr 
                  key={idx} 
                  className="hover:bg-blue-50/50 cursor-pointer border-b border-slate-100 group transition-colors"
                  onDoubleClick={() => onEdit(item.no_kwitansi)}
                >
                  <td className="py-1.5 px-4 text-xs text-slate-500 text-center">{idx + 1}</td>
                  <td className="py-1.5 px-4 text-xs font-medium text-blue-600 group-hover:text-blue-800">{item.no_kwitansi}</td>
                  <td className="py-1.5 px-4 text-xs text-slate-600">{item.jenis || 'VAT'}</td>
                  <td className="py-1.5 px-4 text-xs text-slate-600">{item.tgl_kwitansi}</td>
                  <td className="py-1.5 px-4 text-xs text-slate-600">{item.no_invoice || '-'}</td>
                  <td className="py-1.5 px-4 text-xs text-slate-800">{p?.nama || '-'}</td>
                  <td className="py-1.5 px-4 text-xs text-slate-600">{item.mata_uang}</td>
                  <td className="py-1.5 px-4 text-xs text-slate-800 text-right font-mono">{Number(item.jumlah).toLocaleString()}</td>
                  <td className="py-1.5 px-4 text-xs text-slate-500 truncate max-w-[200px]" title={item.untuk_pembayaran}>{item.untuk_pembayaran || '-'}</td>
                  <td className="py-1.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item.no_kwitansi); }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.no_kwitansi); }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-sm text-slate-500 bg-slate-50">
                  Tidak ada data kwitansi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
