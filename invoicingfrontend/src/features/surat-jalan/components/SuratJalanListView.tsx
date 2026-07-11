import React from "react";
import { FilePlus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface SuratJalanListViewProps {
  dataList: any[];
  pelanggans: any[];
  gudangs: any[];
  periode: string;
  setPeriode: (p: string) => void;
  onOpenForm: () => void;
  onEdit: (item: any) => void;
  onDelete: (no_sj: string) => void;
}

export const SuratJalanListView: React.FC<SuratJalanListViewProps> = ({
  dataList,
  pelanggans,
  gudangs,
  periode,
  setPeriode,
  onOpenForm,
  onEdit,
  onDelete,
}) => {
  const [searchPelanggan, setSearchPelanggan] = React.useState("");

  const filteredData = dataList.filter((item) => {
    if (searchPelanggan && String(item.pelanggan_id) !== searchPelanggan)
      return false;
    return true;
  });

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Surat Jalan</h2>
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
                Pelanggan:
              </span>
              <select
                value={searchPelanggan}
                onChange={(e) => setSearchPelanggan(e.target.value)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-48"
              >
                <option value="">-- Semua Pelanggan --</option>
                {pelanggans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
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

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  Kode Gudang
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  No. SJ
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">Tgl</th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  Nama Pelanggan
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  Alamat
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  No. PO
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  No. SO
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  No. Invoice
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  Kendaraan
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700">
                  Keterangan
                </th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-slate-500 italic"
                  >
                    Belum ada data Surat Jalan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => {
                  const pelanggan = pelanggans.find(
                    (p) => String(p.id) === String(item.pelanggan_id),
                  );
                  const pelangganNama = pelanggan?.nama || item.pelanggan_id;
                  const alamat = item.alamat_kirim || pelanggan?.alamat || "";
                  const gudang = gudangs.find(
                    (g) => String(g.id) === String(item.gudang_id),
                  );
                  const gudangKode =
                    gudang?.kode_gudang || item.gudang_id || "-";

                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-800">{gudangKode}</td>
                      <td className="px-3 py-2 font-mono text-slate-800 font-medium">
                        {item.no_sj}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {item.tanggal}
                      </td>
                      <td className="px-3 py-2 text-slate-800">
                        {pelangganNama}
                      </td>
                      <td
                        className="px-3 py-2 text-slate-600 truncate max-w-[150px]"
                        title={alamat}
                      >
                        {alamat}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {item.no_po || "-"}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600">
                        {item.no_so || "-"}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600">
                        {item.no_invoice || "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {item.no_kendaraan || "-"}
                      </td>
                      <td
                        className="px-3 py-2 text-slate-600 truncate max-w-[100px]"
                        title={item.keterangan}
                      >
                        {item.keterangan || "-"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              if (item.no_invoice) {
                                toast.error(
                                  `Surat Jalan ini tidak bisa diedit karena sudah memiliki Invoice (${item.no_invoice}).`,
                                );
                                return;
                              }
                              onEdit(item);
                            }}
                            className={`p-1 rounded-sm transition-colors ${item.no_invoice ? "text-slate-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}
                            title={
                              item.no_invoice
                                ? "Terkunci (Sudah ada Invoice)"
                                : "Edit"
                            }
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (item.no_invoice) {
                                toast.error(
                                  `Surat Jalan ini tidak bisa dihapus karena sudah memiliki Invoice (${item.no_invoice}).`,
                                );
                                return;
                              }
                              onDelete(item.no_sj);
                            }}
                            className={`p-1 rounded-sm transition-colors ${item.no_invoice ? "text-slate-400 cursor-not-allowed" : "text-red-600 hover:bg-red-50"}`}
                            title={
                              item.no_invoice
                                ? "Terkunci (Sudah ada Invoice)"
                                : "Hapus"
                            }
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
    </div>
  );
};
