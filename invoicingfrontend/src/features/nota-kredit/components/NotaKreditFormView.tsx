import React from "react";
import { Save, X, Trash2, Plus } from "lucide-react";
import { PageLayout } from "../../../components/layouts/PageLayout";

interface NotaKreditFormViewProps {
  form: any;
  setForm: (form: any) => void;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  pelanggans: any[];
  mataUangs: any[];
  invoices: any[];
  onAddLine: (line: any) => void;
  onUpdateLine: (idx: number, line: any) => void;
  onRemoveLine: (idx: number) => void;
}

export const NotaKreditFormView: React.FC<NotaKreditFormViewProps> = ({
  form,
  setForm,
  isSaving,
  onSave,
  onCancel,
  pelanggans,
  mataUangs,
  invoices,
  onAddLine,
  onUpdateLine,
  onRemoveLine,
}) => {
  const selectedPelanggan = pelanggans.find(
    (p) => String(p.id) === String(form.pelanggan_id),
  );

  return (
    <PageLayout
      title="Transaksi Nota Kredit"
      contentClassName="flex-1 p-6 overflow-y-auto bg-slate-50"
      actions={
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-sm shadow-sm disabled:opacity-50"
          >
            <Save size={14} /> {isSaving ? "Menyimpan..." : "SIMPAN"}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-sm shadow-sm"
          >
            <X size={14} /> BATAL
          </button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Form */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-[130px_1fr] items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                Pilih Periode
              </label>
              <input
                type="text"
                value={form.periode}
                disabled
                className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 bg-slate-100"
              />
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                No. Nota Kredit
              </label>
              <input
                type="text"
                value={form.no_nota_kredit}
                onChange={(e) =>
                  setForm({ ...form, no_nota_kredit: e.target.value })
                }
                className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                Tgl Nota Kredit
              </label>
              <input
                type="date"
                value={form.tgl_nota_kredit}
                onChange={(e) =>
                  setForm({ ...form, tgl_nota_kredit: e.target.value })
                }
                className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                Nama Pelanggan
              </label>
              <select
                value={form.pelanggan_id}
                onChange={(e) =>
                  setForm({ ...form, pelanggan_id: e.target.value })
                }
                className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Pilih --</option>
                {pelanggans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-[130px_1fr] items-start gap-2">
              <label className="text-xs font-medium text-slate-700 pt-1">
                Alamat
              </label>
              <textarea
                value={selectedPelanggan?.alamat || ""}
                disabled
                rows={2}
                className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 bg-slate-100"
              />
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                Nilai Nota Kredit
              </label>
              <div className="flex gap-2">
                <select
                  value={form.mata_uang_id}
                  onChange={(e) =>
                    setForm({ ...form, mata_uang_id: e.target.value })
                  }
                  className="text-xs border border-slate-300 rounded-sm px-2 py-1.5 w-20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="">IDR</option>
                  {mataUangs.map((mu) => (
                    <option key={mu.id} value={mu.id}>
                      {mu.nama}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={form.lines
                    ?.reduce(
                      (sum: number, line: any) =>
                        sum + (parseFloat(line.jumlah) || 0),
                      0,
                    )
                    .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  disabled
                  className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 bg-green-50 text-right font-mono flex-1 text-slate-800 font-semibold"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-sm">
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                Atas No. Invoice
              </label>
              <select
                value={form.invoice_id}
                onChange={(e) =>
                  setForm({ ...form, invoice_id: e.target.value })
                }
                className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Kosong --</option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.no_invoice} (Sisa:{" "}
                    {inv.saldo_piutang?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                No. Referensi
              </label>
              <input
                type="text"
                value={form.no_referensi}
                onChange={(e) =>
                  setForm({ ...form, no_referensi: e.target.value })
                }
                className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                Tanda Tangan
              </label>
              <input
                type="text"
                value={form.tanda_tangan}
                onChange={(e) =>
                  setForm({ ...form, tanda_tangan: e.target.value })
                }
                className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                Jabatan
              </label>
              <input
                type="text"
                value={form.jabatan}
                onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                className="text-xs border border-slate-300 rounded-sm px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Lines */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden flex flex-col min-h-[300px]">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-[#1e1e1e] border-b border-slate-300">
              <tr>
                <th className="px-3 py-2 font-semibold text-white w-10 text-center">
                  No.
                </th>
                <th className="px-3 py-2 font-semibold text-white w-12 text-center">
                  Aksi
                </th>
                <th className="px-3 py-2 font-semibold text-white">
                  Keterangan
                </th>
                <th className="px-3 py-2 font-semibold text-white text-right w-48">
                  Jumlah
                </th>
                <th className="px-3 py-2 font-semibold text-white w-48">
                  No Perkiraan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {form.lines?.map((line: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2 text-center text-slate-500 font-medium">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => onRemoveLine(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={line.keterangan || ""}
                      onChange={(e) =>
                        onUpdateLine(idx, {
                          ...line,
                          keterangan: e.target.value,
                        })
                      }
                      className="w-full text-xs border border-slate-200 rounded-sm px-2 py-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={line.jumlah || ""}
                      onChange={(e) =>
                        onUpdateLine(idx, { ...line, jumlah: e.target.value })
                      }
                      className="w-full text-xs border border-slate-200 rounded-sm px-2 py-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right font-mono"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={line.no_perkiraan || ""}
                      onChange={(e) =>
                        onUpdateLine(idx, {
                          ...line,
                          no_perkiraan: e.target.value,
                        })
                      }
                      className="w-full text-xs border border-slate-200 rounded-sm px-2 py-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() =>
                onAddLine({ keterangan: "", jumlah: 0, no_perkiraan: "" })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-sm transition-colors border border-blue-200"
            >
              <Plus size={14} /> TAMBAH BARIS
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
