import React, { useEffect } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";

interface InvoiceLineModalProps {
  editLineIndex: number | null;
  lineForm: any;
  setLineForm: (f: any) => void;
  items: any[];
  onClose: () => void;
  onSave: () => void;
}

export const InvoiceLineModal: React.FC<InvoiceLineModalProps> = ({
  editLineIndex,
  lineForm,
  setLineForm,
  items,
  onClose,
  onSave,
}) => {
  const inputCls =
    "w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    if ((lineForm.kuantum || 0) <= 0) {
      toast.error("Kuantitas tidak boleh kurang dari atau sama dengan 0");
      return;
    }
    if (
      (lineForm.harga_satuan || 0) < 0 ||
      (lineForm.disc_persen || 0) < 0 ||
      (lineForm.disc_harga || 0) < 0
    ) {
      toast.error("Nilai harga dan diskon tidak boleh negatif");
      return;
    }
    if (!lineForm.item_id) {
      toast.error("Item harus dipilih");
      return;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 bg-slate-800 text-white shrink-0">
          <h3 className="font-semibold text-base">
            {editLineIndex !== null ? "Ubah" : "Tambah"} Barang
          </h3>
          <button
            onClick={onClose}
            className="hover:text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-slate-50 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Item / Barang *
            </label>
            <select
              className={inputCls}
              value={lineForm.item_id || ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                const item = items.find((i) => i.id === id);
                setLineForm({
                  ...lineForm,
                  item_id: id,
                  satuan: item?.satuan || lineForm.satuan,
                  harga_satuan: item?.harga_jual_1 || lineForm.harga_satuan,
                });
              }}
            >
              <option value="">-- Pilih Item --</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.kode} - {i.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Satuan
              </label>
              <input
                type="text"
                className={inputCls}
                value={lineForm.satuan || ""}
                onChange={(e) =>
                  setLineForm({ ...lineForm, satuan: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kuantum
              </label>
              <input
                type="number"
                min="0"
                className={`${inputCls} text-right font-mono`}
                value={lineForm.kuantum === 0 ? "" : lineForm.kuantum}
                onChange={(e) =>
                  setLineForm({ ...lineForm, kuantum: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Harga Satuan
              </label>
              <input
                type="number"
                min="0"
                className={`${inputCls} text-right font-mono`}
                value={lineForm.harga_satuan === 0 ? "" : lineForm.harga_satuan}
                onChange={(e) =>
                  setLineForm({
                    ...lineForm,
                    harga_satuan: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diskon (%)
              </label>
              <input
                type="number"
                min="0"
                className={`${inputCls} text-right font-mono`}
                value={lineForm.disc_persen === 0 ? "" : lineForm.disc_persen}
                onChange={(e) =>
                  setLineForm({
                    ...lineForm,
                    disc_persen: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diskon Harga (Nominal)
              </label>
              <input
                type="number"
                min="0"
                className={`${inputCls} text-right font-mono`}
                value={lineForm.disc_harga === 0 ? "" : lineForm.disc_harga}
                onChange={(e) =>
                  setLineForm({
                    ...lineForm,
                    disc_harga: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan Baris
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="Catatan tambahan untuk item ini..."
              value={lineForm.keterangan || ""}
              onChange={(e) =>
                setLineForm({ ...lineForm, keterangan: e.target.value })
              }
            />
          </div>

          <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-sm flex justify-between items-center">
            <span className="text-sm font-semibold text-blue-800">
              Total Harga Jual:
            </span>
            <span className="text-lg font-bold font-mono text-blue-900">
              {(
                (lineForm.kuantum || 0) * (lineForm.harga_satuan || 0) -
                ((lineForm.kuantum || 0) *
                  (lineForm.harga_satuan || 0) *
                  (lineForm.disc_persen || 0)) /
                  100 -
                (lineForm.disc_harga || 0)
              ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors flex items-center gap-2"
          >
            <Save size={14} /> Simpan Barang
          </button>
        </div>
      </div>
    </div>
  );
};
