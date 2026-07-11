import React from "react";
import { X, Send } from "lucide-react";

interface SalesOrderSjModalProps {
  sjForm: {
    pelanggan_id: string;
    alamat_kirim: string;
    no_so: string;
    gudang_id: string;
    tanggal: string;
  };
  setSjForm: (f: any) => void;
  pelanggans: any[];
  gudangs: any[];
  dataList: any[];
  onClose: () => void;
  onSubmit: () => void;
}

export const SalesOrderSjModal: React.FC<SalesOrderSjModalProps> = ({
  sjForm,
  setSjForm,
  pelanggans,
  gudangs,
  dataList,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-md shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-semibold text-base">Buat Surat Jalan Baru</h3>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 bg-slate-50 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              Nama Pelanggan
            </label>
            <select
              className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm"
              value={sjForm.pelanggan_id}
              onChange={(e) => {
                const p = pelanggans.find(
                  (x) => String(x.id) === e.target.value,
                );
                setSjForm({
                  ...sjForm,
                  pelanggan_id: e.target.value,
                  alamat_kirim: p?.alamat_kirim || p?.alamat || "",
                });
              }}
            >
              <option value="">-- Pilih Pelanggan --</option>
              {pelanggans.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              Dikirim ke Alamat
            </label>
            <textarea
              className="w-full h-20 p-2 bg-slate-100 border border-slate-300 rounded-sm text-sm resize-none text-slate-600 cursor-not-allowed"
              readOnly
              value={sjForm.alamat_kirim}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Dari No. SO
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 focus:outline-none rounded-sm text-sm font-mono cursor-not-allowed text-slate-600"
                value={sjForm.no_so}
                disabled
              >
                <option value="">-- Pilih SO --</option>
                {dataList.map((so) => (
                  <option key={so.id} value={so.no_so}>
                    {so.no_so}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Tgl Surat Jalan
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm"
                value={sjForm.tanggal}
                onChange={(e) =>
                  setSjForm({ ...sjForm, tanggal: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">
              Pilih Gudang Pengiriman
            </label>
            <select
              className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm"
              value={sjForm.gudang_id}
              onChange={(e) =>
                setSjForm({ ...sjForm, gudang_id: e.target.value })
              }
            >
              <option value="">-- Pilih Gudang --</option>
              {gudangs.map((g) => (
                <option key={g.id} value={String(g.id)}>
                  {g.nama_gudang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 border border-transparent rounded-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Send size={14} /> Lanjut Buat Surat Jalan
          </button>
        </div>
      </div>
    </div>
  );
};
