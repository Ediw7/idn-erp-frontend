import React, { useState } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";

interface PenjatahanNsfpModalProps {
  penjatahans: any[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onRefresh: () => void;
}

export const PenjatahanNsfpModal: React.FC<PenjatahanNsfpModalProps> = ({
  penjatahans,
  onClose,
  onSave,
  onDelete,
  onRefresh,
}) => {
  const emptyRow = {
    no_surat: "",
    tgl_surat: "",
    tgl_awal: "",
    tgl_akhir: "",
    no_seri_awal: "",
    no_seri_akhir: "",
  };

  const [newRow, setNewRow] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const inputClass =
    "w-full text-xs border border-slate-300 rounded-sm px-2 py-1 outline-none focus:border-blue-500 bg-white";

  const handleSaveNew = async () => {
    if (!newRow?.no_surat || !newRow?.no_seri_awal || !newRow?.no_seri_akhir) {
      alert("Nomor Surat, No Seri Awal, dan No Seri Akhir wajib diisi!");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(newRow);
      setNewRow(null);
      onRefresh();
    } catch (e) {
      // error handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus penjatahan ini?")) return;
    try {
      await onDelete(id);
      onRefresh();
    } catch (e) {
      // error handled by parent
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4">
      <div className="bg-white w-full max-w-4xl rounded-md shadow-xl flex flex-col overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-semibold">
              Penjatahan No Seri Faktur Pajak
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Kelola nomor seri faktur pajak dari KPP.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setNewRow(emptyRow)}
            disabled={!!newRow}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-sm shadow-sm disabled:bg-slate-400"
          >
            <Plus size={14} /> New
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-sm shadow-sm"
          >
            Close
          </button>
        </div>

        {/* Table */}
        <div className="p-6 overflow-auto max-h-[400px]">
          <div className="border border-slate-200 rounded-sm overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 font-bold text-slate-700 min-w-[160px]">
                    Nomor Surat dari KPP
                  </th>
                  <th className="px-3 py-2.5 font-bold text-slate-700 w-28">
                    Tgl Surat
                  </th>
                  <th className="px-3 py-2.5 font-bold text-slate-700 w-28">
                    Tgl FP Awal
                  </th>
                  <th className="px-3 py-2.5 font-bold text-slate-700 w-28">
                    Tgl FP Akhir
                  </th>
                  <th className="px-3 py-2.5 font-bold text-slate-700 min-w-[160px]">
                    No Seri FP Awal
                  </th>
                  <th className="px-3 py-2.5 font-bold text-slate-700 min-w-[160px]">
                    No Seri FP Akhir
                  </th>
                  <th className="px-3 py-2.5 font-bold text-slate-700 w-16 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {penjatahans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 text-slate-700 font-medium">
                      {p.no_surat}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{p.tgl_surat}</td>
                    <td className="px-3 py-2 text-slate-600">{p.tgl_awal}</td>
                    <td className="px-3 py-2 text-slate-600">{p.tgl_akhir}</td>
                    <td className="px-3 py-2 text-slate-700 font-mono">
                      {p.no_seri_awal}
                    </td>
                    <td className="px-3 py-2 text-slate-700 font-mono">
                      {p.no_seri_akhir}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* New Row Input */}
                {newRow && (
                  <tr className="bg-blue-50/50">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Nomor Surat"
                        value={newRow.no_surat}
                        onChange={(e) =>
                          setNewRow({ ...newRow, no_surat: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        className={inputClass}
                        value={newRow.tgl_surat}
                        onChange={(e) =>
                          setNewRow({ ...newRow, tgl_surat: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        className={inputClass}
                        value={newRow.tgl_awal}
                        onChange={(e) =>
                          setNewRow({ ...newRow, tgl_awal: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        className={inputClass}
                        value={newRow.tgl_akhir}
                        onChange={(e) =>
                          setNewRow({ ...newRow, tgl_akhir: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="No Seri Awal"
                        value={newRow.no_seri_awal}
                        onChange={(e) =>
                          setNewRow({ ...newRow, no_seri_awal: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="No Seri Akhir"
                        value={newRow.no_seri_akhir}
                        onChange={(e) =>
                          setNewRow({ ...newRow, no_seri_akhir: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={handleSaveNew}
                          disabled={isSaving}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                          title="Simpan"
                        >
                          <Save size={14} />
                        </button>
                        <button
                          onClick={() => setNewRow(null)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Batal"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {penjatahans.length === 0 && !newRow && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-6 text-center text-slate-500 italic"
                    >
                      Belum ada data penjatahan. Klik "New" untuk menambahkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Records: {penjatahans.length}
          </span>
        </div>
      </div>
    </div>
  );
};
