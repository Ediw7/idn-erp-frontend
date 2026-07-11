import React, { useState, useEffect } from "react";
import { X, Save, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { setupApi, FakturPajakData } from "../api";
import { useConfirm } from "../../../contexts/ConfirmContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const emptyRow: Partial<FakturPajakData> = {
  no_surat: "",
  tgl_surat: new Date().toISOString().split("T")[0],
  tgl_awal: new Date().toISOString().split("T")[0],
  tgl_akhir: new Date().toISOString().split("T")[0],
  no_seri_awal: "",
  no_seri_akhir: "",
};

export const PenjatahanNSFPModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [dataList, setDataList] = useState<FakturPajakData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const confirm = useConfirm();

  const [newRow, setNewRow] = useState<Partial<FakturPajakData>>(emptyRow);
  const [isEditingNew, setIsEditingNew] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await setupApi.getFakturPajak();
      setDataList(res || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data NSFP");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const isConfirmed = await confirm("Yakin ingin menghapus data ini?");
    if (!isConfirmed) return;

    try {
      await setupApi.deleteFakturPajak(selectedId);
      toast.success("Data NSFP berhasil dihapus");
      setSelectedId(null);
      fetchData();
      onSaved(); // trigger refetch di parent
    } catch (error) {
      toast.error("Gagal menghapus data NSFP");
    }
  };

  const handleSaveNewRow = async () => {
    if (!newRow.no_surat || !newRow.no_seri_awal || !newRow.no_seri_akhir) {
      toast.error("Harap lengkapi No Surat, No Seri Awal, dan No Seri Akhir!");
      return;
    }
    try {
      await setupApi.saveFakturPajak(newRow as FakturPajakData);
      toast.success("Penjatahan NSFP berhasil disimpan!");
      setNewRow(emptyRow);
      setIsEditingNew(false);
      fetchData();
      onSaved(); // trigger refetch di parent
    } catch (error) {
      toast.error("Gagal menyimpan NSFP");
    }
  };

  if (!isOpen) return null;

  const btnClass =
    "px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2";
  const inputClass =
    "w-full px-2 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 bg-white";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60  p-4">
      <div className="bg-white w-full max-w-5xl rounded-md shadow-2xl flex flex-col overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-slate-800 px-5 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-white">
            Penjatahan No Seri Faktur Pajak
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingNew(true)}
              className={`${btnClass} bg-blue-600 text-white border border-transparent hover:bg-blue-700 shadow-sm`}
            >
              <Plus size={16} /> TAMBAH DATA
            </button>
            <button
              onClick={handleDelete}
              disabled={!selectedId}
              className={`${btnClass} ${selectedId ? "bg-white text-red-600 border-red-500 hover:bg-red-50" : "bg-slate-200 text-slate-400 border-transparent cursor-not-allowed"}`}
            >
              <Trash2 size={16} /> HAPUS
            </button>
            <button
              onClick={onClose}
              className="ml-2 text-slate-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <tr>
                  <th className="px-4 py-3 border-r border-slate-300 font-semibold w-12 text-center">
                    No.
                  </th>
                  <th className="px-4 py-3 border-r border-slate-300 font-semibold">
                    Nomor Surat dari KPP
                  </th>
                  <th className="px-4 py-3 border-r border-slate-300 font-semibold w-32">
                    Tgl Surat
                  </th>
                  <th className="px-4 py-3 border-r border-slate-300 font-semibold w-32">
                    Tgl FP Awal
                  </th>
                  <th className="px-4 py-3 border-r border-slate-300 font-semibold w-32">
                    Tgl FP Akhir
                  </th>
                  <th className="px-4 py-3 border-r border-slate-300 font-semibold">
                    No Seri FP Awal
                  </th>
                  <th className="px-4 py-3 border-r border-slate-300 font-semibold">
                    No Seri FP Akhir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading && dataList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-500 italic"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : (
                  dataList.map((row, idx) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedId(row.id!)}
                      className={`cursor-pointer transition-colors ${selectedId === row.id ? "bg-blue-100" : "hover:bg-blue-50/50"}`}
                    >
                      <td className="px-4 py-2.5 border-r border-slate-200 text-center font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-200">
                        {row.no_surat}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-200">
                        {row.tgl_surat}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-200">
                        {row.tgl_awal}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-200">
                        {row.tgl_akhir}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-200 font-mono">
                        {row.no_seri_awal}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-200 font-mono">
                        {row.no_seri_akhir}
                      </td>
                    </tr>
                  ))
                )}

                {/* Inline Form Row */}
                {isEditingNew && (
                  <tr className="bg-yellow-50">
                    <td className="px-3 py-2 border-r border-slate-200 text-center">
                      <button
                        onClick={handleSaveNewRow}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm"
                      >
                        <Save size={14} />
                      </button>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200">
                      <input
                        type="text"
                        autoFocus
                        className={inputClass}
                        value={newRow.no_surat || ""}
                        onChange={(e) =>
                          setNewRow({ ...newRow, no_surat: e.target.value })
                        }
                        placeholder="Nomor Surat KPP"
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200">
                      <input
                        type="date"
                        className={inputClass}
                        value={newRow.tgl_surat || ""}
                        onChange={(e) =>
                          setNewRow({ ...newRow, tgl_surat: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200">
                      <input
                        type="date"
                        className={inputClass}
                        value={newRow.tgl_awal || ""}
                        onChange={(e) =>
                          setNewRow({ ...newRow, tgl_awal: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200">
                      <input
                        type="date"
                        className={inputClass}
                        value={newRow.tgl_akhir || ""}
                        onChange={(e) =>
                          setNewRow({ ...newRow, tgl_akhir: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200">
                      <input
                        type="text"
                        className={`${inputClass} font-mono`}
                        value={newRow.no_seri_awal || ""}
                        onChange={(e) =>
                          setNewRow({ ...newRow, no_seri_awal: e.target.value })
                        }
                        placeholder="13 Digit"
                        maxLength={13}
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200">
                      <input
                        type="text"
                        className={`${inputClass} font-mono`}
                        value={newRow.no_seri_akhir || ""}
                        onChange={(e) =>
                          setNewRow({
                            ...newRow,
                            no_seri_akhir: e.target.value,
                          })
                        }
                        placeholder="13 Digit"
                        maxLength={13}
                      />
                    </td>
                  </tr>
                )}
                {!isEditingNew && dataList.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-500 italic"
                    >
                      Belum ada data NSFP. Klik Tambah Data untuk memulai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className={`${btnClass} bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 shadow-sm`}
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};
