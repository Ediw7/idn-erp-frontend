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
          <h2 className="text-lg font-semibold text-white">Kwitansi</h2>
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
            <div className="h-4 w-px bg-slate-600"></div>
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
        <button onClick={onOpenForm} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
          <FilePlus size={14} /> + BUKA FORM
        </button>
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">No</th>
                <th className="px-3 py-2 font-semibold text-slate-700">No. Kwitansi</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Jenis</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Tgl Kwitansi</th>
                <th className="px-3 py-2 font-semibold text-slate-700">No Invoice</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Terima Dari</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Curr</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">Jumlah</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Keterangan</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? filteredData.map((item, idx) => {
                const p = pelanggans.find(x => String(x.id) === String(item.pembeli_id));
                return (
                  <tr 
                    key={idx} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onDoubleClick={() => onEdit(item.no_kwitansi)}
                  >
                    <td className="px-3 py-2 text-slate-500 text-center">{idx + 1}</td>
                    <td className="px-3 py-2 font-mono text-slate-800 font-medium">{item.no_kwitansi}</td>
                    <td className="px-3 py-2 text-slate-600">{item.jenis || 'VAT'}</td>
                    <td className="px-3 py-2 text-slate-600">{item.tgl_kwitansi}</td>
                    <td className="px-3 py-2 text-slate-600">{item.no_invoice || '-'}</td>
                    <td className="px-3 py-2 text-slate-800">{item.pelanggan_nama || p?.nama || item.pembeli_id || '-'}</td>
                    <td className="px-3 py-2 text-slate-600">{item.mata_uang || 'IDR'}</td>
                    <td className="px-3 py-2 font-mono text-slate-800 text-right">{Number(item.jumlah || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td className="px-3 py-2 text-slate-600 truncate max-w-[200px]" title={item.untuk_pembayaran}>{item.untuk_pembayaran || '-'}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(item.no_kwitansi); }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(item.no_kwitansi); }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
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
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500 italic">
                    Belum ada data kwitansi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
