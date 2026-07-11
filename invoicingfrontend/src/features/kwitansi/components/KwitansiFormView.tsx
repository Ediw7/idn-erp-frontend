import React from "react";
import { Save, Search, Printer, Trash2, ArrowLeft } from "lucide-react";
import { formatTerbilang } from "./useKwitansiLogic";
import { getKwitansiAutoNo } from "../../transactionsApi";

interface KwitansiFormViewProps {
  form: any;
  setForm: (form: any) => void;
  pelanggans: any[];
  invoices: any[];
  loadingData: boolean;
  signatureData: any;
  handleJumlahChange: (val: string) => void;
  handlePembeliChange: (id: number | "") => void;
  handleInvoiceChange: (no: string) => void;
  handleSave: () => void;
  handleDelete: (no_kwitansi: string) => void;
  onBack: () => void;
  onPrint: (no_kwitansi: string) => void;
}

export const KwitansiFormView: React.FC<KwitansiFormViewProps> = ({
  form,
  setForm,
  pelanggans,
  invoices,
  loadingData,
  signatureData,
  handleJumlahChange,
  handlePembeliChange,
  handleInvoiceChange,
  handleSave,
  handleDelete,
  onBack,
  onPrint,
}) => {
  const inputClass =
    "w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white";
  const readOnlyClass =
    "w-full px-3 py-2 border border-slate-200 rounded-sm text-sm bg-slate-50 text-slate-500 cursor-not-allowed";
  const labelClass =
    "block text-xs font-semibold text-slate-700 mb-1 shrink-0 w-40";
  const btnClass =
    "px-4 py-1.5 text-sm font-semibold rounded-sm transition-colors flex items-center justify-center gap-2";

  return (
    <div className="bg-slate-50 flex flex-col h-[calc(100vh-8rem)]">
      {/* Action Header */}
      <div className="bg-slate-800 px-6 py-3 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-white">
            Kwitansi: {form.no_kwitansi || "Baru"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {form.no_kwitansi && (
            <button
              onClick={() => onPrint(form.no_kwitansi)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
            >
              <Printer size={14} /> CETAK
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-12 max-w-5xl">
          {/* Kolom Kiri */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center">
              <label className={labelClass}>No. Kwitansi</label>
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  className={`${inputClass} font-mono`}
                  value={form.no_kwitansi || ""}
                  onChange={(e) =>
                    setForm({ ...form, no_kwitansi: e.target.value })
                  }
                />
                <button
                  onClick={async () => {
                    const autoNo = await getKwitansiAutoNo();
                    setForm({ ...form, no_kwitansi: autoNo });
                  }}
                  className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  Auto No
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className={labelClass}>Jenis Kwitansi</label>
              <select
                className={`${inputClass} w-32`}
                value={form.jenis || "VAT"}
                onChange={(e) => setForm({ ...form, jenis: e.target.value })}
              >
                <option value="VAT">VAT</option>
                <option value="Non-VAT">Non-VAT</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className={labelClass}>Tgl Kwitansi</label>
              <input
                type="date"
                className={`${inputClass} w-40`}
                value={form.tgl_kwitansi || ""}
                onChange={(e) =>
                  setForm({ ...form, tgl_kwitansi: e.target.value })
                }
              />
            </div>

            <div className="flex items-center">
              <label className={labelClass}>No. Invoice</label>
              <div className="flex gap-2 flex-1">
                <select
                  className={`${inputClass} font-mono`}
                  value={form.no_invoice || ""}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                >
                  <option value="">- Tanpa Invoice / Isi Manual -</option>
                  {invoices
                    .filter((inv) =>
                      form.pembeli_id
                        ? Number(inv.pelanggan_id) === Number(form.pembeli_id)
                        : true,
                    )
                    .map((inv) => (
                      <option key={inv.id} value={inv.no_invoice}>
                        {inv.no_invoice} (Rp{" "}
                        {inv.total?.toLocaleString("id-ID")})
                      </option>
                    ))}
                </select>
                {/* Fallback input jika user ingin mengetik manual yg tidak ada di list */}
                {form.no_invoice &&
                  !invoices.find((i) => i.no_invoice === form.no_invoice) && (
                    <input
                      type="text"
                      className={`${inputClass} font-mono`}
                      placeholder="No Invoice..."
                      value={form.no_invoice || ""}
                      onChange={(e) => handleInvoiceChange(e.target.value)}
                    />
                  )}
              </div>
            </div>

            <div className="flex items-center mt-2">
              <label className={labelClass}>Sudah Terima Dari</label>
              <div className="flex gap-2 flex-1">
                <select
                  className={inputClass}
                  value={form.pembeli_id || ""}
                  onChange={(e) =>
                    handlePembeliChange(
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                >
                  <option value="">
                    {loadingData ? "Loading..." : "-- Pilih Pelanggan --"}
                  </option>
                  {pelanggans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-start mt-1">
              <label className={labelClass}></label>
              <textarea
                className={`${readOnlyClass} h-20 resize-none`}
                readOnly
                value={form.alamat || ""}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center">
              <label className={labelClass}>Jumlah (IDR)</label>
              <div className="flex gap-2 flex-1">
                <select
                  className={`${inputClass} w-24`}
                  value={form.mata_uang || "IDR"}
                  onChange={(e) =>
                    setForm({ ...form, mata_uang: e.target.value })
                  }
                >
                  <option value="IDR">IDR</option>
                  <option value="USD">USD</option>
                </select>
                <input
                  type="number"
                  className={`${inputClass} text-right font-mono font-bold text-blue-900 bg-blue-50/50`}
                  value={form.jumlah || ""}
                  onChange={(e) => handleJumlahChange(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center mt-1">
              <label className={labelClass}>Terbilang</label>
              <input
                type="text"
                className={`${readOnlyClass} italic`}
                readOnly
                value={form.terbilang || ""}
              />
            </div>

            <div className="flex items-start mt-2">
              <label className={labelClass}>Untuk Pembayaran</label>
              <textarea
                className={`${inputClass} h-20 resize-none`}
                value={form.untuk_pembayaran || ""}
                onChange={(e) =>
                  setForm({ ...form, untuk_pembayaran: e.target.value })
                }
              />
            </div>

            <div className="flex items-start mt-2">
              <label className={labelClass}>Keterangan Footer</label>
              <textarea
                className={`${inputClass} h-24 resize-none font-mono text-xs`}
                value={form.keterangan_footer || ""}
                onChange={(e) =>
                  setForm({ ...form, keterangan_footer: e.target.value })
                }
              />
            </div>

            <div className="flex items-start mt-2">
              <label className={labelClass}>Tanda Tangan</label>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Nama Penandatangan"
                  className={`${inputClass}`}
                  value={form.penandatangan || ""}
                  onChange={(e) =>
                    setForm({ ...form, penandatangan: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Jabatan"
                  className={`${inputClass}`}
                  value={form.jabatan || ""}
                  onChange={(e) =>
                    setForm({ ...form, jabatan: e.target.value })
                  }
                />
                {signatureData && signatureData.ttd_image && (
                  <div className="mt-2 p-2 bg-white border border-slate-200 rounded-sm inline-block">
                    <img
                      src={`data:image/png;base64,${signatureData.ttd_image}`}
                      alt="Tanda Tangan"
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3">
          {form.no_kwitansi && (
            <button
              onClick={() => handleDelete(form.no_kwitansi)}
              className={`${btnClass} bg-white text-red-600 hover:bg-red-50 border border-red-200`}
            >
              <Trash2 size={16} /> Hapus
            </button>
          )}
          <button
            onClick={handleSave}
            className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm px-6`}
          >
            <Save size={16} /> Simpan Kwitansi
          </button>
        </div>
      </div>
    </div>
  );
};
