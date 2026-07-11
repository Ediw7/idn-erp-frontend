import React, { useState } from "react";
import { FilePlus, Trash2, Printer, Save, Plus, ArrowLeft } from "lucide-react";
import { NotaReturPembelianData, NotaReturPembelianLine } from "../api";
import {
  SupplierData,
  MataUangData,
  ItemData,
  GudangData,
} from "../../../setup/api";

interface FormViewProps {
  form: NotaReturPembelianData;
  setForm: (v: NotaReturPembelianData) => void;
  isNew: boolean;
  suppliers: SupplierData[];
  mataUangs: MataUangData[];
  items: ItemData[];
  gudangs: GudangData[];

  dpp: number;
  ppnAmount: number;

  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  onNew: () => void;

  handleSupplierChange: (id: number | "") => void;
  addLine: () => void;
  removeLine: (idx: number) => void;
  updateLine: (
    idx: number,
    field: keyof NotaReturPembelianLine,
    value: any,
  ) => void;
}

export const NotaReturPembelianFormView: React.FC<FormViewProps> = ({
  form,
  setForm,
  isNew,
  suppliers,
  mataUangs,
  items,
  gudangs,
  dpp,
  ppnAmount,
  onSave,
  onDelete,
  onClose,
  onNew,
  handleSupplierChange,
  addLine,
  removeLine,
  updateLine,
}) => {
  const [activeTab, setActiveTab] = useState<"umum" | "detail">("umum");

  const inputClass =
    "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm disabled:bg-slate-100 disabled:text-slate-500 transition-colors";
  const readOnlyClass =
    "w-full px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-300 focus:outline-none rounded-sm text-sm";
  const labelClass = "w-36 text-xs font-semibold text-slate-700 shrink-0 mt-2";

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors"
              title="Kembali ke Daftar"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-white">
              Nota Retur Pembelian
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
          >
            <FilePlus size={14} /> + TAMBAH RETUR
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
            <Printer size={14} /> CETAK
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {/* Mini Header */}
        <div className="bg-white border-l-4 border-l-blue-600 border-y border-r border-slate-300 rounded-sm shadow-sm p-4 shrink-0 flex justify-between items-center">
          <div className="flex gap-12">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                No. Nota Retur
              </span>
              <span className="font-mono text-base font-bold text-slate-800">
                {form.no_nota || "DRAFT"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                Penjual
              </span>
              <span className="text-base font-bold text-slate-800">
                {suppliers.find((p) => p.id === form.supplier_id)?.nama || "-"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                Tanggal
              </span>
              <span className="text-base font-bold text-slate-800">
                {form.tgl_nota || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0 flex-1">
          <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1">
            <button
              onClick={() => setActiveTab("umum")}
              className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === "umum" ? "bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm" : "bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors"}`}
            >
              Informasi Umum
            </button>
            <button
              onClick={() => setActiveTab("detail")}
              className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === "detail" ? "bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm" : "bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors"}`}
            >
              Detail Barang Retur
            </button>
          </div>

          <div className="overflow-x-auto min-h-[350px]">
            {activeTab === "umum" ? (
              <div className="p-6 shrink-0">
                <div className="flex gap-12">
                  {/* Left Column */}
                  <div className="flex-1 flex flex-col gap-3 max-w-lg">
                    <div className="flex items-start">
                      <label className={labelClass}>No. Nota Retur</label>
                      <div className="flex gap-1 flex-1">
                        <input
                          type="text"
                          className={`${inputClass} font-semibold`}
                          value={form.no_nota || ""}
                          onChange={(e) =>
                            setForm({ ...form, no_nota: e.target.value })
                          }
                        />
                        <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap">
                          Auto No
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <label className={labelClass}>Tgl Nota Retur</label>
                      <input
                        type="date"
                        className={`${inputClass} w-40`}
                        value={form.tgl_nota || ""}
                        onChange={(e) =>
                          setForm({ ...form, tgl_nota: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-start mt-2">
                      <label className={labelClass}>Nama Penjual</label>
                      <select
                        className={inputClass}
                        value={form.supplier_id || ""}
                        onChange={(e) =>
                          handleSupplierChange(Number(e.target.value))
                        }
                      >
                        <option value="">- Pilih Penjual -</option>
                        {suppliers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-start">
                      <label className={labelClass}>Alamat Penjual</label>
                      <textarea
                        className={`${readOnlyClass} h-16 resize-none`}
                        readOnly
                        value={form.alamat_penjual || ""}
                      />
                    </div>
                    <div className="flex items-start mt-2">
                      <label className={labelClass}>Jenis Retur</label>
                      <select
                        className={`${inputClass} w-56`}
                        value={form.jenis_retur || ""}
                        onChange={(e) =>
                          setForm({ ...form, jenis_retur: e.target.value })
                        }
                      >
                        <option>Barang Kena Pajak</option>
                        <option>Non BKP</option>
                      </select>
                    </div>
                    <div className="flex items-start">
                      <label className={labelClass}>Gudang</label>
                      <select
                        className={`${inputClass} w-48`}
                        value={form.gudang_id || ""}
                        onChange={(e) =>
                          setForm({ ...form, gudang_id: e.target.value })
                        }
                      >
                        <option value="">- Pilih Gudang -</option>
                        {gudangs.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.nama_gudang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex-1 flex flex-col gap-3 max-w-lg">
                    <div className="flex items-start">
                      <label className={labelClass}>Atas No. FP</label>
                      <div className="flex gap-2 flex-1 items-center">
                        <input
                          type="text"
                          className={`${inputClass} flex-1`}
                          value={form.atas_no_fp || ""}
                          onChange={(e) =>
                            setForm({ ...form, atas_no_fp: e.target.value })
                          }
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          Tgl
                        </span>
                        <input
                          type="date"
                          className={`${inputClass} w-36`}
                          value={form.tgl_fp || ""}
                          onChange={(e) =>
                            setForm({ ...form, tgl_fp: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-start">
                      <label className={labelClass}>Mata Uang</label>
                      <select
                        className={`${inputClass} w-32`}
                        value={form.mata_uang_id || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            mata_uang_id: Number(e.target.value) || null,
                          })
                        }
                      >
                        <option value="">--</option>
                        {mataUangs.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.kode}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-start">
                      <label className={labelClass}>Tarif PPN</label>
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          className={`${inputClass} w-20 text-center`}
                          value={form.tarif_ppn ?? 11}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              tarif_ppn: Number(e.target.value),
                            })
                          }
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          %
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <label className={labelClass}>Kurs Pajak</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          className={`${inputClass} w-32 text-right`}
                          value={form.kurs_pajak || 1}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              kurs_pajak: Number(e.target.value),
                            })
                          }
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          / 1 RP
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start mt-2">
                      <label className={labelClass}>Jenis Transaksi</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={form.jenis_transaksi || ""}
                        onChange={(e) =>
                          setForm({ ...form, jenis_transaksi: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-start mt-2">
                      <label className={labelClass}>Status</label>
                      <select
                        className={`${inputClass} w-48`}
                        value={form.status || ""}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option value="">- Status -</option>
                        <option value="draft">Draft</option>
                        <option value="posted">Posted</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Tabel Rincian Barang */}
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-xs whitespace-nowrap">
                    <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="w-10 px-2 py-2 text-center border-r border-slate-200 font-semibold">
                          No
                        </th>
                        <th className="w-48 px-3 py-2 text-left border-r border-slate-200 font-semibold">
                          Kode Barang
                        </th>
                        <th className="px-3 py-2 text-left border-r border-slate-200 min-w-[300px] font-semibold">
                          Nama Barang Kena Pajak / Barang Mewah Yang
                          Dikembalikan
                        </th>
                        <th className="w-20 px-3 py-2 text-center border-r border-slate-200 font-semibold">
                          Satuan
                        </th>
                        <th className="w-24 px-3 py-2 text-right border-r border-slate-200 font-semibold">
                          Kuantum
                        </th>
                        <th className="w-32 px-3 py-2 text-right border-r border-slate-200 font-semibold">
                          Harga Satuan
                        </th>
                        <th className="w-32 px-3 py-2 text-right border-r border-slate-200 font-semibold">
                          Harga Jual
                        </th>
                        <th className="w-12 px-3 py-2 text-center font-semibold">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(form.lines || []).map((line, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-2 py-1.5 text-center border-r border-slate-200 font-medium text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="px-2 py-1.5 border-r border-slate-200">
                            <select
                              className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs focus:outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              value={line.item_id || ""}
                              onChange={(e) =>
                                updateLine(
                                  idx,
                                  "item_id",
                                  Number(e.target.value) || null,
                                )
                              }
                            >
                              <option value="">- Pilih -</option>
                              {items.map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.kode}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-1.5 border-r border-slate-200">
                            <input
                              type="text"
                              className={`${readOnlyClass} !px-2 !py-1`}
                              readOnly
                              value={line.nama_barang || ""}
                            />
                          </td>
                          <td className="px-2 py-1.5 border-r border-slate-200">
                            <input
                              type="text"
                              className={`${readOnlyClass} !px-2 !py-1 text-center`}
                              readOnly
                              value={line.satuan || ""}
                            />
                          </td>
                          <td className="px-2 py-1.5 border-r border-slate-200 text-right">
                            <input
                              type="number"
                              className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              value={line.kuantum || ""}
                              onChange={(e) =>
                                updateLine(
                                  idx,
                                  "kuantum",
                                  Number(e.target.value),
                                )
                              }
                            />
                          </td>
                          <td className="px-2 py-1.5 border-r border-slate-200 text-right">
                            <input
                              type="number"
                              className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              value={line.harga_satuan || ""}
                              onChange={(e) =>
                                updateLine(
                                  idx,
                                  "harga_satuan",
                                  Number(e.target.value),
                                )
                              }
                            />
                          </td>
                          <td className="px-2 py-1.5 border-r border-slate-200 text-right bg-slate-50">
                            <span className="font-semibold text-slate-800">
                              {(line.harga_jual || 0).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            <button
                              onClick={() => removeLine(idx)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-sm transition-colors hover:bg-red-50"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="px-2 py-2 text-center border-r border-slate-200 text-slate-400 font-bold">
                          *
                        </td>
                        <td colSpan={7} className="px-3 py-2">
                          <button
                            onClick={addLine}
                            className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition-colors"
                          >
                            <Plus size={14} /> Tambah Baris
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer Totals */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col lg:flex-row gap-8 justify-between shrink-0">
            {/* Kiri: Informasi Pelaporan */}
            <div className="flex-1 max-w-xl">
              <div className="flex items-center mb-2">
                <label className={labelClass}>Tanda Tangan</label>
                <input
                  type="text"
                  className={`${inputClass} flex-1`}
                  value={form.tanda_tangan || ""}
                  onChange={(e) =>
                    setForm({ ...form, tanda_tangan: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Jabatan</label>
                <input
                  type="text"
                  className={`${inputClass} flex-1`}
                  value={form.jabatan || ""}
                  onChange={(e) =>
                    setForm({ ...form, jabatan: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Kanan: Kalkulasi Pajak & Buttons */}
            <div className="w-full lg:w-[500px] flex flex-col">
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">
                    Jumlah Harga Jual Yang Dikembalikan
                  </span>
                  <div className="flex items-center gap-1 w-64">
                    <span className="w-16 text-center text-slate-500 font-medium">
                      IDR
                    </span>
                    <span className="flex-1 text-right font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1.5 border border-slate-300 rounded-sm">
                      {dpp.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">
                    Dikurangi Potongan Harga
                  </span>
                  <div className="flex items-center gap-1 w-64">
                    <span className="w-16 text-center text-slate-500 font-medium">
                      IDR
                    </span>
                    <input
                      type="text"
                      className={`${inputClass} flex-1 text-right font-mono font-semibold`}
                      value="0.00"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">
                    Dasar Pengenaan Pajak Valas
                  </span>
                  <div className="flex items-center gap-1 w-64">
                    <span className="w-16 text-center text-slate-500 font-medium">
                      IDR
                    </span>
                    <span className="flex-1 text-right font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1.5 border border-slate-300 rounded-sm">
                      {dpp.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">
                    Dasar Pengenaan Pajak
                  </span>
                  <div className="flex items-center gap-1 w-64">
                    <span className="w-16 text-center text-slate-500 font-medium">
                      IDR
                    </span>
                    <span className="flex-1 text-right font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1.5 border border-blue-200 rounded-sm">
                      {dpp.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-sm font-bold text-slate-800 border-t border-slate-200 pt-2">
                  Jumlah Pajak Yang Dikurangkan
                </div>
                <div className="flex justify-between items-center text-sm pl-4">
                  <span className="font-semibold text-slate-700">
                    a. Pajak Pertambahan Nilai
                  </span>
                  <div className="flex items-center gap-1 w-64">
                    <span className="w-16 text-center text-slate-500 font-medium">
                      IDR
                    </span>
                    <span className="flex-1 text-right font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1.5 border border-blue-200 rounded-sm">
                      {ppnAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm pl-4">
                  <span className="font-semibold text-slate-700">
                    b. Pajak Penjualan Atas Barang Mewah
                  </span>
                  <div className="flex items-center gap-1 w-64">
                    <span className="w-16 text-center text-slate-500 font-medium">
                      IDR
                    </span>
                    <input
                      type="text"
                      className={`${inputClass} flex-1 text-right font-mono font-semibold`}
                      value="0.00"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  disabled={isNew}
                  onClick={onDelete}
                  className="px-6 py-3 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-50"
                >
                  <Trash2 size={16} /> HAPUS RETUR
                </button>
                <button
                  onClick={onSave}
                  className="px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md w-full"
                >
                  <Save size={16} /> SIMPAN RETUR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
