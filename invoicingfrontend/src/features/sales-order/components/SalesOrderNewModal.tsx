import React from "react";
import { X, Save } from "lucide-react";
import { salesOrderApi, SalesOrderData } from "../api";

interface SalesOrderNewModalProps {
  newSoForm: Partial<SalesOrderData>;
  setNewSoForm: (f: any) => void;
  pelanggans: any[];
  mataUangs: any[];
  pembayarans: any[];
  salesmans: any[];
  inputClass: string;
  onClose: () => void;
  onSubmit: () => void;
}

export const SalesOrderNewModal: React.FC<SalesOrderNewModalProps> = ({
  newSoForm,
  setNewSoForm,
  pelanggans,
  mataUangs,
  pembayarans,
  salesmans,
  inputClass,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-md shadow-xl flex flex-col overflow-hidden border border-slate-700 my-8">
        {/* Modal Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-semibold">Buat Sales Order Baru</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Isi detail dokumen header sebelum menambahkan rincian barang.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Kolom 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  No. Sales Order
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={`${inputClass} flex-1`}
                    value={newSoForm.no_so || ""}
                    onChange={(e) =>
                      setNewSoForm({ ...newSoForm, no_so: e.target.value })
                    }
                  />
                  <button
                    className="px-3 py-1.5 text-xs font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm shadow-sm"
                    onClick={async () => {
                      const res = await salesOrderApi.autoNo();
                      setNewSoForm({ ...newSoForm, no_so: res.no_so });
                    }}
                  >
                    Auto No
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Tgl Sales Order
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={newSoForm.tgl_so || ""}
                  onChange={(e) =>
                    setNewSoForm({ ...newSoForm, tgl_so: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Nama Pelanggan
                </label>
                <select
                  className={inputClass}
                  value={newSoForm.pelanggan_id || ""}
                  onChange={(e) => {
                    const pid = Number(e.target.value);
                    const p = pelanggans.find((x) => x.id === pid);
                    setNewSoForm({
                      ...newSoForm,
                      pelanggan_id: pid,
                      alamat_kirim: p?.alamat_kirim || p?.alamat || "",
                    });
                  }}
                >
                  <option value="">-- Pilih --</option>
                  {pelanggans.map((p) => (
                    <option key={p.id} value={p.id}>
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
                  className={`${inputClass} h-20 resize-none`}
                  value={newSoForm.alamat_kirim || ""}
                  onChange={(e) =>
                    setNewSoForm({ ...newSoForm, alamat_kirim: e.target.value })
                  }
                />
              </div>
            </div>
            {/* Kolom 2 */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    No. PO Pelanggan
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={newSoForm.no_po || ""}
                    onChange={(e) =>
                      setNewSoForm({ ...newSoForm, no_po: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Tgl PO
                  </label>
                  <input
                    type="date"
                    className={inputClass}
                    value={newSoForm.tgl_po || ""}
                    onChange={(e) =>
                      setNewSoForm({ ...newSoForm, tgl_po: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Mata Uang
                  </label>
                  <select
                    className={inputClass}
                    value={newSoForm.mata_uang_id || ""}
                    onChange={(e) =>
                      setNewSoForm({
                        ...newSoForm,
                        mata_uang_id: Number(e.target.value) || null,
                      })
                    }
                  >
                    <option value="">-- Pilih --</option>
                    {mataUangs.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.kode}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Cara Pembayaran
                  </label>
                  <select
                    className={inputClass}
                    value={newSoForm.pembayaran_id || ""}
                    onChange={(e) =>
                      setNewSoForm({
                        ...newSoForm,
                        pembayaran_id: Number(e.target.value) || null,
                      })
                    }
                  >
                    <option value="">-- Pilih --</option>
                    {pembayarans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Salesman
                </label>
                <select
                  className={inputClass}
                  value={newSoForm.salesman_id || ""}
                  onChange={(e) =>
                    setNewSoForm({
                      ...newSoForm,
                      salesman_id: Number(e.target.value) || null,
                    })
                  }
                >
                  <option value="">-- Pilih --</option>
                  {salesmans.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Tgl Kirim
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={newSoForm.tgl_kirim || ""}
                  onChange={(e) =>
                    setNewSoForm({ ...newSoForm, tgl_kirim: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Dipesan Oleh
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={newSoForm.dipesan_oleh || ""}
                  onChange={(e) =>
                    setNewSoForm({ ...newSoForm, dipesan_oleh: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-sm shadow-sm hover:bg-slate-50 transition-colors"
          >
            BATAL
          </button>
          <button
            onClick={onSubmit}
            className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={16} /> BUAT SO
          </button>
        </div>
      </div>
    </div>
  );
};
