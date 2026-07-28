import React, { useState, useMemo } from "react";
import { X } from "lucide-react";

interface CariFakturPajakModalProps {
  dataList: any[];
  onClose: () => void;
  onSelect: (fp: any) => void;
}

export const CariFakturPajakModal: React.FC<CariFakturPajakModalProps> = ({
  dataList,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return dataList.filter(
      (d) =>
        (d.no_fp || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.pembeli_nama || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.no_invoice || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [dataList, search]);

  const totalPpn = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.ppn_rp || 0), 0);
  }, [filteredData]);

  const inputClass =
    "w-full text-xs border border-slate-300 rounded-sm px-2 py-1 outline-none focus:border-blue-500 bg-white";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4">
      <div className="bg-white w-full max-w-4xl rounded-md shadow-xl flex flex-col overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center cursor-default">
          <div>
            <h3 className="text-white font-semibold">
              Cari Faktur Pajak Standar
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Pilih faktur pajak yang akan diganti
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Area */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Cari No FP / Nama Pembeli / Invoice..."
                className={inputClass}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-sm shadow-sm"
            >
              Batal
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="p-6 overflow-hidden flex flex-col">
          <div className="border border-slate-200 rounded-sm bg-white flex-1 overflow-auto max-h-[400px]">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-700 border-r border-slate-200">
                    No. Faktur Pajak
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 border-r border-slate-200">
                    Tgl
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 border-r border-slate-200">
                    No. Invoice
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 border-r border-slate-200">
                    Curr
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 border-r border-slate-200 text-right">
                    DPP
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 border-r border-slate-200 text-right">
                    DPP Rp
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                    PPN Rp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d, i) => (
                  <tr
                    key={d.id}
                    className="hover:bg-blue-50 cursor-pointer"
                    onClick={() => onSelect(d)}
                  >
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700">
                      {d.no_fp}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-600">
                      {d.tgl_fp}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700">
                      {d.no_invoice}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-600">
                      {d.mata_uang}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-right">
                      {d.dpp_rp?.toLocaleString("en-US")}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700 text-right">
                      {d.dpp_rp?.toLocaleString("en-US")}
                    </td>
                    <td className="px-3 py-2 text-slate-700 text-right">
                      {d.ppn_rp?.toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-6 text-center text-slate-500 italic"
                    >
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-slate-500">
              Menampilkan {filteredData.length} records
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-600">
                Total PPN:
              </span>
              <span className="text-base font-bold text-slate-900">
                {totalPpn.toLocaleString("en-US")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
