import React from "react";

interface SalesOrderOutstandingProps {
  form: any;
  items: any[];
}

export const SalesOrderOutstanding: React.FC<SalesOrderOutstandingProps> = ({
  form,
  items,
}) => {
  return (
    <table className="w-full text-sm text-left whitespace-nowrap">
      <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
        <tr>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-12 text-center">
            No.
          </th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-40">
            Kode Barang
          </th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-64">
            Nama Barang
          </th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-24 text-center">
            Satuan
          </th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32 text-right">
            Quantity Order
          </th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32 text-right">
            Quantity Kirim
          </th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32 text-right">
            Sisa Order
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {(form.lines || []).map((line: any, idx: number) => {
          const itemInfo = items.find((i) => i.id === line.item_id);
          if (!line.item_id) return null;
          const qtyKirim = (line as any).qty_kirim || 0;
          const sisaOrder = line.kuantum - qtyKirim;
          return (
            <tr key={idx} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-2 border-r border-slate-200 text-center font-medium">
                {idx + 1}
              </td>
              <td className="px-4 py-2 border-r border-slate-200">
                {itemInfo?.kode || "-"}
              </td>
              <td className="px-4 py-2 border-r border-slate-200">
                {itemInfo?.nama || "-"}
              </td>
              <td className="px-4 py-2 border-r border-slate-200 text-center">
                {line.satuan}
              </td>
              <td className="px-4 py-2 border-r border-slate-200 text-right font-mono text-blue-700">
                {line.kuantum}
              </td>
              <td className="px-4 py-2 border-r border-slate-200 text-right font-mono text-green-700">
                {qtyKirim}
              </td>
              <td
                className={`px-4 py-2 border-r border-slate-200 text-right font-mono font-bold ${sisaOrder <= 0 ? "text-slate-400 line-through" : "text-slate-900"}`}
              >
                {sisaOrder}
              </td>
            </tr>
          );
        })}
        {(!form.lines ||
          form.lines.filter((l: any) => l.item_id).length === 0) && (
          <tr>
            <td
              colSpan={7}
              className="px-4 py-8 text-center text-slate-500 italic bg-slate-50"
            >
              Silakan isi Detail Barang terlebih dahulu.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
