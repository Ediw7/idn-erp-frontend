import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface SuratJalanDetailProps {
  form: any;
  handleOpenAddLine: () => void;
  handleOpenEditLine: (idx: number) => void;
  removeLine: (idx: number) => void;
}

export const SuratJalanDetail: React.FC<SuratJalanDetailProps> = ({
  form, handleOpenAddLine, handleOpenEditLine, removeLine
}) => {
  return (
    <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-300 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800">Detail Barang Surat Jalan</h3>
        <button onClick={handleOpenAddLine} className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-sm shadow-sm">
          <Plus size={14} /> TAMBAH BARANG PENGIRIMAN
        </button>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 font-semibold text-center w-12 border-r border-slate-200">No.</th>
              <th className="px-4 py-3 font-semibold w-48 border-r border-slate-200">Kode Barang</th>
              <th className="px-4 py-3 font-semibold min-w-[250px] border-r border-slate-200">Nama Barang</th>
              <th className="px-4 py-3 font-semibold text-center w-24 border-r border-slate-200">Satuan</th>
              <th className="px-4 py-3 font-semibold text-right w-32 border-r border-slate-200">Kuantum</th>
              <th className="px-4 py-3 font-semibold min-w-[200px] border-r border-slate-200">Keterangan</th>
              <th className="px-4 py-3 font-semibold text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {(form.lines || []).map((line: any, idx: number) => (
              <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-4 py-2.5 text-center font-medium text-slate-500 border-r border-slate-200">{idx + 1}</td>
                <td className="px-4 py-2.5 font-mono text-slate-700 border-r border-slate-200">{line.kode}</td>
                <td className="px-4 py-2.5 text-slate-800 font-medium border-r border-slate-200">{line.nama}</td>
                <td className="px-4 py-2.5 text-center text-slate-600 border-r border-slate-200">{line.satuan}</td>
                <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-800 border-r border-slate-200">{line.kuantum}</td>
                <td className="px-4 py-2.5 text-slate-600 border-r border-slate-200 truncate max-w-[200px]">{line.keterangan || '-'}</td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEditLine(idx)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Ubah"><Edit2 size={16} /></button>
                    <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700 transition-colors" title="Hapus"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!form.lines || form.lines.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400 bg-slate-50 italic">
                  Belum ada barang pengiriman. Klik "TAMBAH BARANG PENGIRIMAN" untuk memasukkan item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
