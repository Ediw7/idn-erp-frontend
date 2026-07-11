import React from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface SalesOrderDetailProps {
  form: any;
  isReadOnly: boolean;
  items: any[];
  handleOpenAddLine: () => void;
  handleOpenEditLine: (idx: number) => void;
  removeLine: (idx: number) => void;
}

export const SalesOrderDetail: React.FC<SalesOrderDetailProps> = ({
  form,
  isReadOnly,
  items,
  handleOpenAddLine,
  handleOpenEditLine,
  removeLine,
}) => {
  return (
    <div className="flex flex-col h-full">
      {!isReadOnly && (
        <div className="p-3 bg-white border-b border-slate-200 shrink-0">
          <button
            onClick={handleOpenAddLine}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-sm shadow-sm"
          >
            <Plus size={14} /> TAMBAH BARANG
          </button>
        </div>
      )}
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
          <tr>
            <th className="px-3 py-2 border-r border-slate-300 font-semibold w-12 text-center">
              No.
            </th>
            <th className="px-3 py-2 border-r border-slate-300 font-semibold w-64">
              Kode / Nama Barang
            </th>
            <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24 text-center">
              Satuan
            </th>
            <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24 text-right">
              Kuantum
            </th>
            <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">
              Harga Satuan
            </th>
            <th className="px-3 py-2 border-r border-slate-300 font-semibold w-20 text-center">
              % Disc
            </th>
            <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">
              Disc Harga
            </th>
            <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">
              Harga Jual
            </th>
            <th className="px-3 py-2 border-r border-slate-300 font-semibold">
              Keterangan
            </th>
            <th className="px-3 py-2 w-16 text-center font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {(form.lines || []).map((line: any, idx: number) => {
            const base = (line.kuantum || 0) * (line.harga_satuan || 0);
            const disc =
              (base * (line.disc_persen || 0)) / 100 + (line.disc_harga || 0);
            const hJual = base - disc;
            const itemInfo = items.find((i) => i.id === line.item_id);
            return (
              <tr
                key={idx}
                className="hover:bg-blue-50 transition-colors border-b border-slate-200"
              >
                <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">
                  {idx + 1}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200">
                  {itemInfo ? `${itemInfo.kode} - ${itemInfo.nama}` : "-"}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center">
                  {line.satuan || "-"}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right">
                  {line.kuantum}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right">
                  {(line.harga_satuan || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-center">
                  {line.disc_persen || 0}%
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right">
                  {(line.disc_harga || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-right font-semibold text-slate-800 bg-slate-50">
                  {hJual.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200">
                  {line.keterangan || "-"}
                </td>
                <td className="px-3 py-1.5 text-center flex justify-center gap-1">
                  <button
                    disabled={isReadOnly}
                    onClick={() => handleOpenEditLine(idx)}
                    className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    disabled={isReadOnly}
                    onClick={() => removeLine(idx)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
          {(!form.lines || form.lines.length === 0) && (
            <tr>
              <td
                colSpan={10}
                className="px-4 py-8 text-center text-slate-500 italic bg-slate-50"
              >
                Belum ada barang. Klik tombol Tambah Barang di atas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
