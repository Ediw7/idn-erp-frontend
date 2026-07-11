import React from "react";
import { X, Save } from "lucide-react";

interface SuratJalanLineModalProps {
  editLineIndex: number | null;
  lineForm: any;
  setLineForm: (f: any) => void;
  items: any[];
  onClose: () => void;
  handleSaveLine: () => void;
}

export const SuratJalanLineModal: React.FC<SuratJalanLineModalProps> = ({
  editLineIndex,
  lineForm,
  setLineForm,
  items,
  onClose,
  handleSaveLine,
}) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 bg-slate-800 text-white shrink-0">
          <h3 className="font-semibold text-base">
            {editLineIndex !== null ? "Ubah" : "Tambah"} Barang Pengiriman
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
              className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm"
              value={lineForm.item_id || ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                const item = items.find((i) => i.id === id);
                setLineForm({
                  ...lineForm,
                  item_id: id,
                  kode: item?.kode || lineForm.kode,
                  nama: item?.nama || lineForm.nama,
                  satuan: item?.satuan || lineForm.satuan,
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Satuan
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 focus:outline-none rounded-sm text-sm cursor-not-allowed"
                readOnly
                value={lineForm.satuan || ""}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kuantum Pengiriman
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm text-right font-mono text-blue-700 font-bold"
                value={lineForm.kuantum === 0 ? "" : lineForm.kuantum}
                onChange={(e) =>
                  setLineForm({ ...lineForm, kuantum: Number(e.target.value) })
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
              className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm"
              placeholder="Catatan tambahan (contoh: kondisi barang, dus no 1)..."
              value={lineForm.keterangan || ""}
              onChange={(e) =>
                setLineForm({ ...lineForm, keterangan: e.target.value })
              }
            />
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
            onClick={handleSaveLine}
            className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors flex items-center gap-2"
          >
            <Save size={14} /> Simpan Barang
          </button>
        </div>
      </div>
    </div>
  );
};
