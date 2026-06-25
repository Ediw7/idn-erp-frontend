import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface InvoiceDetailProps {
  form: any;
  items: any[];
  handleOpenAddLine: () => void;
  handleOpenEditLine: (idx: number) => void;
  removeLine: (idx: number) => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  form, items, handleOpenAddLine, handleOpenEditLine, removeLine
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col mt-6">
      <h3 className="text-sm font-bold text-slate-800 mb-0 pt-6 px-6 pb-2 border-b border-slate-200">Detail Barang/Jasa</h3>
      <div className="flex flex-col h-full">
        <div className="p-3 bg-white border-b border-slate-200 shrink-0">
          <button onClick={handleOpenAddLine} className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-sm shadow-sm">
            <Plus size={14} /> TAMBAH BARANG
          </button>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-64">Kode / Nama Barang</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24 text-center">Satuan</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24 text-right">Kuantum</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">Harga Satuan</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-20 text-center">% Disc</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">Disc Harga</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">Harga Jual</th>
              <th className="px-3 py-2 w-16 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(!form.lines || form.lines.length === 0) ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-500 italic">
                  Belum ada barang yang ditambahkan.
                </td>
              </tr>
            ) : (
              form.lines.map((line: any, idx: number) => {
                const base = (line.kuantum || 0) * (line.harga_satuan || 0);
                const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
                const hJual = base - disc;
                const itemInfo = items.find(i => i.id === line.item_id);
                
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-center border-r border-slate-200 font-bold text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-2 border-r border-slate-200">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-semibold text-slate-800">{itemInfo?.kode || '-'}</span>
                        <span className="text-xs text-slate-600 truncate max-w-[200px]">{itemInfo?.nama || 'Item tidak ditemukan'}</span>
                        {line.keterangan && <span className="text-[10px] text-slate-400 mt-0.5 block truncate max-w-[200px]">Catatan: {line.keterangan}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 text-center text-xs">
                      {line.satuan || '-'}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 text-right font-mono text-sm">
                      {line.kuantum || 0}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 text-right font-mono text-sm">
                      {(line.harga_satuan || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 text-center font-mono text-sm">
                      {line.disc_persen || 0}%
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 text-right font-mono text-sm">
                      {(line.disc_harga || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 font-mono text-right font-bold text-blue-800">
                      {hJual.toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleOpenEditLine(idx)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="Ubah">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => removeLine(idx)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
