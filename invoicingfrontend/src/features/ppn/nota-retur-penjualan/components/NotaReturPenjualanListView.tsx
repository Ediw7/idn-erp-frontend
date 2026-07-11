import React from "react";
import { FilePlus, Edit2, Trash2 } from "lucide-react";
import { NotaReturData } from "../api";

interface ListViewProps {
  dataList: NotaReturData[];
  loadingData: boolean;

  periode: string;
  setPeriode: (v: string) => void;

  onOpenForm: () => void;
  onEdit: (item: NotaReturData) => void;
  onDelete: (id: number) => void;
}

export const NotaReturPenjualanListView: React.FC<ListViewProps> = ({
  dataList,
  loadingData,
  periode,
  setPeriode,
  onOpenForm,
  onEdit,
  onDelete,
}) => {
  const [searchNoNota, setSearchNoNota] = React.useState("");
  const [searchPembeli, setSearchPembeli] = React.useState("");

  const filteredData = dataList.filter((item) => {
    if (
      searchNoNota &&
      !item.no_nota?.toLowerCase().includes(searchNoNota.toLowerCase())
    )
      return false;
    if (
      searchPembeli &&
      !item.pelanggan_nama?.toLowerCase().includes(searchPembeli.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">
            Nota Retur Penjualan
          </h2>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Bulan:</span>
              <select
                value={periode.split("-")[1]}
                onChange={(e) =>
                  setPeriode(`${periode.split("-")[0]}-${e.target.value}`)
                }
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
              <span className="text-xs text-slate-300 font-medium ml-1">
                Tahun:
              </span>
              <select
                value={periode.split("-")[0]}
                onChange={(e) =>
                  setPeriode(`${e.target.value}-${periode.split("-")[1]}`)
                }
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                No Retur:
              </span>
              <input
                type="text"
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-28"
                value={searchNoNota}
                onChange={(e) => setSearchNoNota(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                Pembeli:
              </span>
              <input
                type="text"
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-28"
                value={searchPembeli}
                onChange={(e) => setSearchPembeli(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          onClick={onOpenForm}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
        >
          <FilePlus size={14} /> + BUKA FORM
        </button>
      </div>

      {/* Grid Table */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  No. Nota Retur
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">Tgl</th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  No Faktur Pajak
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  Nama Pembeli
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                  Mata Uang
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                  DPP Rp
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                  PPN Rp
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
                    Tidak ada data Nota Retur.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => {
                  const dpp = (item.lines || []).reduce(
                    (acc, l) => acc + (l.harga_jual || 0),
                    0,
                  );
                  const ppn = (dpp * (item.tarif_ppn || 11)) / 100;
                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-2 font-mono text-blue-600 font-medium">
                        {item.no_nota}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {item.tgl_nota}
                      </td>
                      <td className="px-3 py-2 text-slate-800 font-mono text-[10px]">
                        {item.atas_no_fp || ""}
                      </td>
                      <td className="px-3 py-2 text-slate-800 truncate max-w-[200px]">
                        {item.pelanggan_nama || ""}
                      </td>
                      <td className="px-3 py-2 text-center text-slate-600 font-medium">
                        {item.mata_uang_kode || "IDR"}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-slate-800">
                        {dpp.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-slate-800">
                        {ppn.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (item.id) onDelete(item.id);
                            }}
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
