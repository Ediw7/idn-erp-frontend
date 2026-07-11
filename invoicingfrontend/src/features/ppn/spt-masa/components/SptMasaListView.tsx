import React from "react";
import { FilePlus, Edit2, Trash2, Lock } from "lucide-react";
import { SptMasa1111Data } from "../api";

interface ListViewProps {
  dataList: SptMasa1111Data[];
  loadingData: boolean;
  onOpenForm: () => void;
  onEdit: (item: SptMasa1111Data) => void;
  onDelete: (id: number) => void;
}

export const SptMasaListView: React.FC<ListViewProps> = ({
  dataList,
  loadingData,
  onOpenForm,
  onEdit,
  onDelete,
}) => {
  const [searchTahun, setSearchTahun] = React.useState("");

  const filteredData = dataList.filter((item) => {
    if (searchTahun && !item.tahun.includes(searchTahun)) return false;
    return true;
  });

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">
            SPT Masa PPN 1111
          </h2>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                Cari Tahun:
              </span>
              <input
                type="text"
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-20"
                value={searchTahun}
                onChange={(e) => setSearchTahun(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          onClick={onOpenForm}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
        >
          <FilePlus size={14} /> + BUAT SPT BARU
        </button>
      </div>

      {/* Grid Table */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                  Tahun
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                  Masa Pajak
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                  Pembetulan Ke
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                  Tgl SPT
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                  Total DPP
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                  Total PPN
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                  Status
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingData ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-6 italic text-slate-500"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-6 italic text-slate-500"
                  >
                    Tidak ada data SPT.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => {
                  const dpp =
                    (item.dpp_ekspor || 0) +
                    (item.dpp_dipungut_sendiri || 0) +
                    (item.dpp_dipungut_pemungut || 0) +
                    (item.dpp_tidak_dipungut || 0) +
                    (item.dpp_dibebaskan || 0);
                  const ppn =
                    (item.ppn_ekspor || 0) +
                    (item.ppn_dipungut_sendiri || 0) +
                    (item.ppn_dipungut_pemungut || 0) +
                    (item.ppn_tidak_dipungut || 0) +
                    (item.ppn_dibebaskan || 0);
                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-2 font-mono text-center font-bold text-slate-700">
                        {item.tahun}
                      </td>
                      <td className="px-3 py-2 text-center text-slate-700 font-medium">
                        {item.masa_awal} s/d {item.masa_akhir}
                      </td>
                      <td className="px-3 py-2 text-center text-slate-700 font-mono">
                        {item.pembetulan_ke}
                      </td>
                      <td className="px-3 py-2 text-center text-slate-600">
                        {item.tanggal_spt}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-medium text-slate-800">
                        {dpp.toLocaleString("en-US")}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-blue-700">
                        {ppn.toLocaleString("en-US")}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {item.is_locked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-300">
                            <Lock size={10} /> LOCKED
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                            OPEN
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                            title={item.is_locked ? "Lihat" : "Edit"}
                          >
                            <Edit2 size={14} />
                          </button>
                          {!item.is_locked && (
                            <button
                              onClick={() => {
                                if (item.id) onDelete(item.id);
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
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

      {/* Footer Navigation */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-600">
            Total Records: {filteredData.length}
          </span>
        </div>
      </div>
    </div>
  );
};
