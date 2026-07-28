import React from "react";
import { X, Save, Calculator } from "lucide-react";

interface FakturPajakNewModalProps {
  newForm: any;
  setNewForm: (f: any) => void;
  pelanggans: any[];
  mataUangs: any[];
  penjatahans: any[];
  invoices?: any[];
  inputClass: string;
  onClose: () => void;
  onSubmit: () => void;
  onOpenPenjatahan?: () => void;
  onAutoGenerate?: () => void;
  onAutoNoFp?: (penomoran: string) => Promise<string>;
}

export const FakturPajakNewModal: React.FC<FakturPajakNewModalProps> = ({
  newForm,
  setNewForm,
  pelanggans,
  mataUangs,
  penjatahans,
  invoices,
  inputClass,
  onClose,
  onSubmit,
  onOpenPenjatahan,
  onAutoGenerate,
  onAutoNoFp,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-md shadow-xl flex flex-col overflow-hidden border border-slate-700 my-8">
        {/* Modal Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-semibold">Buat Faktur Pajak Baru</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Isi informasi dasar sebelum mengisi detail Faktur Pajak.
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
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Penomoran
              </label>
              <div className="flex gap-1">
                <select
                  className={inputClass + " flex-1"}
                  value={newForm.penomoran || ""}
                  onChange={async (e) => {
                    const val = e.target.value;
                    setNewForm({ ...newForm, penomoran: val });
                    if (val && onAutoNoFp) {
                      const noFp = await onAutoNoFp(val);
                      if (noFp) {
                        setNewForm((prev: any) => ({ ...prev, penomoran: val, no_fp: noFp }));
                      }
                    }
                  }}
                >
                  <option value="">-- Manual --</option>
                  {penjatahans.map((p) => (
                    <option key={p.id} value={`${p.no_seri_awal} - ${p.no_seri_akhir}`}>
                      {p.no_seri_awal} - {p.no_seri_akhir}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onOpenPenjatahan}
                  className="px-2 py-1 text-xs font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm shadow-sm shrink-0"
                  title="Kelola Penjatahan NSFP"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                No. Faktur Pajak
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  className={inputClass + " flex-1"}
                  value={newForm.no_fp || ""}
                  onChange={(e) => setNewForm({ ...newForm, no_fp: e.target.value })}
                  placeholder="Contoh: 010.000-20.00000001"
                  maxLength={19}
                  pattern="\d{3}\.\d{3}-\d{2}\.\d{8}"
                  title="Format: XXX.XXX-XX.XXXXXXXX"
                />
                <button
                  type="button"
                  onClick={onAutoGenerate}
                  className="px-3 border border-slate-300 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-sm flex items-center justify-center"
                  title="Auto Generate No FP dari Penomoran"
                >
                  <Calculator size={16} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Tgl Faktur Pajak
              </label>
              <input
                type="date"
                className={inputClass}
                value={newForm.tgl_fp || ""}
                onChange={(e) =>
                  setNewForm({ ...newForm, tgl_fp: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                No. Invoice
              </label>
              <select
                className={inputClass}
                value={newForm.no_invoice || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const inv = invoices?.find((i) => i.no_invoice === val);
                  if (inv) {
                    setNewForm({
                      ...newForm,
                      no_invoice: val,
                      pembeli_id: inv.pembeli_id || newForm.pembeli_id,
                      lines: inv.lines && inv.lines.length > 0 ? inv.lines : newForm.lines,
                    });
                  } else {
                    setNewForm({ ...newForm, no_invoice: val });
                  }
                }}
              >
                <option value="">-- Pilih Invoice --</option>
                {invoices?.map((inv) => (
                  <option key={inv.id} value={inv.no_invoice}>
                    {inv.no_invoice}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Mata Uang
              </label>
              <select
                className={inputClass}
                value={newForm.mata_uang || "IDR"}
                onChange={(e) =>
                  setNewForm({
                    ...newForm,
                    mata_uang: e.target.value,
                  })
                }
              >
                {mataUangs.map((m) => (
                  <option key={m.id} value={m.kode}>
                    {m.kode}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Nama Pembeli
              </label>
              <select
                className={inputClass}
                value={newForm.pembeli_id || ""}
                onChange={(e) =>
                  setNewForm({
                    ...newForm,
                    pembeli_id: e.target.value,
                  })
                }
              >
                <option value="">-- Pilih --</option>
                {pelanggans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
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
            <Save size={16} /> BUAT FAKTUR PAJAK
          </button>
        </div>
      </div>
    </div>
  );
};
