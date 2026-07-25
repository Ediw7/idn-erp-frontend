import React, { useState } from "react";
import { Save, ArrowLeft, Trash2, Plus, Calculator } from "lucide-react";

interface FakturPajakFormViewProps {
  form: any;
  setForm: (f: any) => void;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  pelanggans: any[];
  mataUangs: any[];
  invoices: any[];
  items: any[];
  onAddLine: (line: any) => void;
  onUpdateLine: (idx: number, line: any) => void;
  onRemoveLine: (idx: number) => void;
}

export const FakturPajakFormView: React.FC<FakturPajakFormViewProps> = ({
  form,
  setForm,
  isSaving,
  onSave,
  onCancel,
  pelanggans,
  mataUangs,
  invoices,
  items,
  onAddLine,
  onUpdateLine,
  onRemoveLine,
}) => {
  const inputClass =
    "w-full text-xs border border-slate-300 rounded-sm px-2 py-1 outline-none focus:border-blue-500 bg-white";
  const labelClass = "text-[11px] font-semibold text-slate-700 mb-1 block";

  const selectedPelanggan = pelanggans.find(
    (p) => p.id === Number(form.pembeli_id),
  );

  const calculateTotal = () => {
    let totalDpp = 0;
    (form.lines || []).forEach((line: any) => {
      totalDpp += (line.kuantum || 0) * (line.harga_satuan || 0);
    });

    // Potongan dan Uang muka
    const dppSetelahPotongan =
      totalDpp - (form.potongan || 0) - (form.uang_muka || 0);
    const ppn = dppSetelahPotongan * (form.tarif_ppn / 100);

    setForm({
      ...form,
      dpp_rp: dppSetelahPotongan,
      ppn_rp: ppn,
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      {/* Top Header Actions */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              {form.id ? "Edit Faktur Pajak" : "Buat Faktur Pajak Baru"}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>No: {form.no_fp || "(Draft)"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={calculateTotal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-sm"
          >
            <Calculator size={16} /> Kalkulasi Total
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm shadow-sm"
          >
            <Save size={16} />
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Form */}
          <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
              Informasi Utama
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {/* Kolom Kiri */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>Penomoran</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      className={inputClass}
                      value={form.penomoran || ""}
                      onChange={(e) =>
                        setForm({ ...form, penomoran: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>
                    No. Faktur Pajak
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      className={inputClass}
                      value={form.no_fp || ""}
                      onChange={(e) =>
                        setForm({ ...form, no_fp: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>
                    Tgl Faktur Pajak
                  </label>
                  <div className="col-span-2 flex gap-2">
                    <input
                      type="date"
                      className={inputClass}
                      value={form.tgl_fp || ""}
                      onChange={(e) =>
                        setForm({ ...form, tgl_fp: e.target.value })
                      }
                    />
                    <select
                      className={inputClass + " w-24"}
                      value={form.mata_uang || "IDR"}
                      onChange={(e) =>
                        setForm({ ...form, mata_uang: e.target.value })
                      }
                    >
                      {mataUangs.map((mu) => (
                        <option key={mu.id} value={mu.kode}>
                          {mu.kode}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-start">
                  <label className={labelClass + " mt-1.5"}>Nama Pembeli</label>
                  <div className="col-span-2 space-y-2">
                    <select
                      className={inputClass}
                      value={form.pembeli_id || ""}
                      onChange={(e) =>
                        setForm({ ...form, pembeli_id: e.target.value })
                      }
                    >
                      <option value="">-- Pilih Pembeli --</option>
                      {pelanggans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nama}
                        </option>
                      ))}
                    </select>
                    <textarea
                      readOnly
                      rows={2}
                      className={inputClass + " bg-slate-50"}
                      value={
                        selectedPelanggan?.alamat ||
                        selectedPelanggan?.alamat_wp ||
                        ""
                      }
                      placeholder="Alamat Pembeli"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>NPWP</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      readOnly
                      className={inputClass + " bg-slate-50"}
                      value={selectedPelanggan?.npwp || ""}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>
                    FP Yang Diganti
                  </label>
                  <div className="col-span-2 flex gap-2">
                    <input
                      type="text"
                      className={inputClass}
                      value={form.fp_diganti || ""}
                      onChange={(e) =>
                        setForm({ ...form, fp_diganti: e.target.value })
                      }
                    />
                    <input
                      type="date"
                      className={inputClass}
                      value={form.tgl_fp_diganti || ""}
                      onChange={(e) =>
                        setForm({ ...form, tgl_fp_diganti: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>
                    Jenis Transaksi
                  </label>
                  <div className="col-span-2">
                    <select
                      className={inputClass}
                      value={form.jenis_transaksi || ""}
                      onChange={(e) =>
                        setForm({ ...form, jenis_transaksi: e.target.value })
                      }
                    >
                      <option value="01 - Kepada Bukan Pemungut PPN">
                        01 - Kepada Bukan Pemungut PPN
                      </option>
                      <option value="02 - Kepada Pemungut Bendaharawan">
                        02 - Kepada Pemungut Bendaharawan
                      </option>
                      <option value="03 - Kepada Pemungut Selain Bendaharawan">
                        03 - Kepada Pemungut Selain Bendaharawan
                      </option>
                      <option value="04 - DPP Nilai Lain">
                        04 - DPP Nilai Lain
                      </option>
                      <option value="06 - Penyerahan Lainnya">
                        06 - Penyerahan Lainnya
                      </option>
                      <option value="07 - Penyerahan Tidak Dipungut PPN">
                        07 - Penyerahan Tidak Dipungut PPN
                      </option>
                      <option value="08 - Penyerahan Dibebaskan PPN">
                        08 - Penyerahan Dibebaskan PPN
                      </option>
                      <option value="09 - Penyerahan Aktiva Pasal 16D">
                        09 - Penyerahan Aktiva Pasal 16D
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>Jenis Status</label>
                  <div className="col-span-2">
                    <select
                      className={inputClass}
                      value={form.jenis_status || "Normal"}
                      onChange={(e) =>
                        setForm({ ...form, jenis_status: e.target.value })
                      }
                    >
                      <option value="Normal">Normal</option>
                      <option value="Pengganti">Pengganti</option>
                      <option value="Batal">Batal</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>No. Invoice</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      className={inputClass}
                      value={form.no_invoice || ""}
                      onChange={(e) =>
                        setForm({ ...form, no_invoice: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>Tarif PPN</label>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="number"
                      className={inputClass + " w-20"}
                      value={form.tarif_ppn || 0}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          tarif_ppn: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-xs font-bold">%</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>Kurs Pajak</label>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="number"
                      className={inputClass + " w-32"}
                      value={form.kurs_pajak || 0}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          kurs_pajak: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-xs font-bold">
                      1 {form.mata_uang || "IDR"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>Tanda Tangan</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      className={inputClass}
                      value={form.penandatangan || ""}
                      onChange={(e) =>
                        setForm({ ...form, penandatangan: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className={labelClass + " mb-0"}>Jabatan</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      className={inputClass}
                      value={form.jabatan || ""}
                      onChange={(e) =>
                        setForm({ ...form, jabatan: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-start">
                  <label className={labelClass + " mt-1.5"}>Ket Tambahan</label>
                  <div className="col-span-2">
                    <textarea
                      rows={2}
                      className={inputClass}
                      value={form.ket_tambahan || ""}
                      onChange={(e) =>
                        setForm({ ...form, ket_tambahan: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lines */}
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Detail Barang / Jasa
              </h3>
              <button
                onClick={() =>
                  onAddLine({
                    item_id: null,
                    kuantum: 1,
                    harga_satuan: 0,
                    harga_jual: 0,
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors rounded-sm"
              >
                <Plus size={14} /> Tambah Baris
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-bold text-slate-700 w-10 text-center">
                      No.
                    </th>
                    <th className="px-3 py-2 font-bold text-slate-700 w-64">
                      Barang
                    </th>
                    <th className="px-3 py-2 font-bold text-slate-700 w-24">
                      Kuantum
                    </th>
                    <th className="px-3 py-2 font-bold text-slate-700 w-32">
                      Harga Satuan
                    </th>
                    <th className="px-3 py-2 font-bold text-slate-700 w-32">
                      Harga Jual
                    </th>
                    <th className="px-3 py-2 font-bold text-slate-700 w-16 text-center">
                      Hapus
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(!form.lines || form.lines.length === 0) && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-6 text-center text-slate-500 italic"
                      >
                        Belum ada detail barang. Klik "Tambah Baris" untuk
                        menambahkan.
                      </td>
                    </tr>
                  )}
                  {(form.lines || []).map((line: any, idx: number) => (
                    <tr key={idx} className="group hover:bg-slate-50/50">
                      <td className="px-3 py-2 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2">
                        <select
                          className={inputClass}
                          value={line.item_id || ""}
                          onChange={(e) => {
                            const selectedItem = items.find(
                              (i) => i.id === Number(e.target.value),
                            );
                            onUpdateLine(idx, {
                              ...line,
                              item_id: selectedItem?.id || null,
                              harga_satuan: selectedItem?.harga_jual || 0,
                              harga_jual:
                                (selectedItem?.harga_jual || 0) *
                                (line.kuantum || 1),
                            });
                          }}
                        >
                          <option value="">-- Pilih Barang --</option>
                          {items.map((i) => (
                            <option key={i.id} value={i.id}>
                              [{i.kode}] {i.nama}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className={inputClass + " text-right"}
                          value={line.kuantum || 0}
                          onChange={(e) => {
                            const qty = parseFloat(e.target.value) || 0;
                            onUpdateLine(idx, {
                              ...line,
                              kuantum: qty,
                              harga_jual: qty * (line.harga_satuan || 0),
                            });
                          }}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className={inputClass + " text-right"}
                          value={line.harga_satuan || 0}
                          onChange={(e) => {
                            const price = parseFloat(e.target.value) || 0;
                            onUpdateLine(idx, {
                              ...line,
                              harga_satuan: price,
                              harga_jual: price * (line.kuantum || 0),
                            });
                          }}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          readOnly
                          className={
                            inputClass + " text-right bg-slate-50 font-semibold"
                          }
                          value={line.harga_jual || 0}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => onRemoveLine(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            <div></div>
            <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">
                    Dikurangi Potongan Harga
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-400">
                      {form.mata_uang || "IDR"}
                    </span>
                    <input
                      type="number"
                      className={inputClass + " w-32 text-right"}
                      value={form.potongan || 0}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          potongan: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Dikurangi Uang Muka</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-400">
                      {form.mata_uang || "IDR"}
                    </span>
                    <input
                      type="number"
                      className={inputClass + " w-32 text-right"}
                      value={form.uang_muka || 0}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          uang_muka: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="h-px bg-slate-200 my-2"></div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>Dasar Pengenaan Pajak (DPP)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-400">
                      {form.mata_uang || "IDR"}
                    </span>
                    <input
                      type="number"
                      readOnly
                      className={
                        inputClass + " w-32 text-right bg-blue-50 font-bold"
                      }
                      value={form.dpp_rp || 0}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>
                    PPN = {form.tarif_ppn || 11}% x Dasar Pengenaan Pajak
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-400">
                      {form.mata_uang || "IDR"}
                    </span>
                    <input
                      type="number"
                      readOnly
                      className={
                        inputClass + " w-32 text-right bg-blue-50 font-bold"
                      }
                      value={form.ppn_rp || 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
