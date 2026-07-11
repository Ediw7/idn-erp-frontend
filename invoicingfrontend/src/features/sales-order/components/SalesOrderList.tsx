import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { PelangganData, MataUangData } from "../../setup/api";

interface SalesOrderListProps {
  salesOrders: any[];
  loadingList: boolean;
  pelanggans: PelangganData[];
  mataUangs: MataUangData[];
  salesmans: any[];
  wajibPpnbm: boolean;
  onEdit: (item: any, idx: number) => void;
  onDelete: (id: number) => void;
}

export const SalesOrderList: React.FC<SalesOrderListProps> = ({
  salesOrders,
  loadingList,
  pelanggans,
  mataUangs,
  salesmans,
  wajibPpnbm,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex-1 p-6 overflow-hidden flex flex-col">
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
        <table className="w-full text-xs text-left whitespace-nowrap">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2 font-semibold text-slate-700">No. SO</th>
              <th className="px-3 py-2 font-semibold text-slate-700">Tgl</th>
              <th className="px-3 py-2 font-semibold text-slate-700">
                Nama Pelanggan
              </th>
              <th className="px-3 py-2 font-semibold text-slate-700">No. PO</th>
              <th className="px-3 py-2 font-semibold text-slate-700">
                Tgl Kirim
              </th>
              <th className="px-3 py-2 font-semibold text-slate-700">
                Salesman
              </th>
              <th className="px-3 py-2 font-semibold text-slate-700">Ccy</th>
              <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                Nilai SO
              </th>
              <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                Void
              </th>
              <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                Closed
              </th>
              <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loadingList ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-8 text-center text-slate-500 italic"
                >
                  Loading data...
                </td>
              </tr>
            ) : salesOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-8 text-center text-slate-500 italic"
                >
                  Belum ada data Sales Order.
                </td>
              </tr>
            ) : (
              salesOrders.map((item, idx) => {
                const pelangganNama =
                  pelanggans.find(
                    (p) => String(p.id) === String(item.pelanggan_id),
                  )?.nama || item.pelanggan_id;
                const ccy =
                  mataUangs.find(
                    (m) => String(m.id) === String(item.mata_uang_id),
                  )?.kode || "IDR";
                const salesman =
                  salesmans.find(
                    (s) => String(s.id) === String(item.salesman_id),
                  )?.nama || "";

                const itemSubtotal = (item.lines || []).reduce(
                  (acc: number, line: any) => {
                    const base = (line.kuantum || 0) * (line.harga_satuan || 0);
                    const disc =
                      (base * (line.disc_persen || 0)) / 100 +
                      (line.disc_harga || 0);
                    return acc + (base - disc);
                  },
                  0,
                );
                const itemDpp = itemSubtotal - (item.potongan_harga || 0);
                const itemPpnAmount = (itemDpp * (item.ppn_persen || 0)) / 100;
                const itemPpnbmAmount = wajibPpnbm
                  ? (itemDpp * (item.ppnbm_persen || 0)) / 100
                  : 0;
                const nilaiSO =
                  itemDpp +
                  itemPpnAmount +
                  itemPpnbmAmount +
                  (item.ongkos_angkut || 0);

                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-slate-800 font-medium">
                      {item.no_so}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{item.tgl_so}</td>
                    <td className="px-3 py-2 text-slate-800">
                      {pelangganNama}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {item.no_po || "-"}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {item.tgl_kirim || "-"}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {salesman || "-"}
                    </td>
                    <td className="px-3 py-2 text-slate-600 font-medium">
                      {ccy}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-800 text-right">
                      {nilaiSO.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        readOnly
                        checked={!!item.is_void}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-default"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        readOnly
                        checked={!!item.is_closed}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-default"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(item, idx)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => item.id && onDelete(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                          title="Hapus"
                        >
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
