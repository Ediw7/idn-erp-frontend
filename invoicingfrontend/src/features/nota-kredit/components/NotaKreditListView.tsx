import React, { useState } from "react";
import { FilePlus, Edit2, Trash2 } from "lucide-react";
import { PageLayout } from "../../../components/layouts/PageLayout";
import Pagination from "../../../components/ui/Pagination";
import { getAutoNo } from "../api";

interface NotaKreditListViewProps {
  dataList: any[];
  pelanggans: any[];
  periode: string;
  setPeriode: (p: string) => void;
  onOpenForm: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  pagination: any;
  onPageChange: (page: number) => void;
  emptyForm: any;
  setModalForm: (form: any) => void;
  setShowNewModal: (show: boolean) => void;
}

export const NotaKreditListView: React.FC<NotaKreditListViewProps> = ({
  dataList,
  pelanggans,
  periode,
  setPeriode,
  onOpenForm,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  emptyForm,
  setModalForm,
  setShowNewModal,
}) => {
  const [searchPelanggan, setSearchPelanggan] = useState("");
  const [searchNo, setSearchNo] = useState("");

  const filteredData = dataList.filter((item) => {
    if (searchPelanggan && String(item.pelanggan_id) !== searchPelanggan)
      return false;
    if (
      searchNo &&
      !item.no_nota_kredit.toLowerCase().includes(searchNo.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <PageLayout
      title="Pencarian Nota Kredit"
      contentClassName="flex-1 p-0 overflow-hidden flex flex-col"
      filters={
        <>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">No. NK:</span>
            <input
              type="text"
              value={searchNo}
              onChange={(e) => setSearchNo(e.target.value)}
              className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">Bulan:</span>
            <select
              value={periode.substring(4)}
              onChange={(e) =>
                setPeriode(`${periode.substring(0, 4)}${e.target.value}`)
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
              value={periode.substring(0, 4)}
              onChange={(e) =>
                setPeriode(`${e.target.value}${periode.substring(4)}`)
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
        </>
      }
      actions={
        <button
          onClick={onOpenForm}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
        >
          <FilePlus size={14} /> + BUAT BARU
        </button>
      }
    >
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-800">
                  No. Nota Kredit
                </th>
                <th className="px-4 py-3 font-bold text-slate-800">Tgl</th>
                <th className="px-4 py-3 font-bold text-slate-800">
                  Nama Pelanggan
                </th>
                <th className="px-4 py-3 font-bold text-slate-800">
                  No. Invoice
                </th>
                <th className="px-4 py-3 font-bold text-slate-800">
                  No. Referensi
                </th>
                <th className="px-4 py-3 font-bold text-slate-800 text-center">
                  Ccy
                </th>
                <th className="px-4 py-3 font-bold text-slate-800 text-right">
                  Nilai Nota Kredit
                </th>
                <th className="px-4 py-3 font-bold text-slate-800 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Tidak ada data nota kredit.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onClick={() => onEdit(item.id)}
                  >
                    <td className="px-4 py-3 font-mono font-medium text-slate-700">
                      {item.no_nota_kredit}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.tgl_nota_kredit}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {item.pelanggan_nama}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.no_invoice || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.no_referensi || "-"}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {item.mata_uang_nama || "IDR"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-800">
                      {item.nilai_nota_kredit?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div
                        className="flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onEdit(item.id)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.last_page}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </PageLayout>
  );
};
