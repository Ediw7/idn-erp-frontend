import React, { useState } from "react";
import { FilePlus, Trash2, Printer, Save, Plus, ArrowLeft, X } from "lucide-react";
import { NotaReturData, NotaReturLine } from "../api";
import { PageLayout } from "../../../../components/layouts/PageLayout";
import { CariFakturPajakModal } from "../../faktur-pajak/components/CariFakturPajakModal";
import { useConfirm } from "../../../../contexts/ConfirmContext";
import {
  PelangganData,
  MataUangData,
  ItemData,
  GudangData,
} from "../../../setup/api";

interface FormViewProps {
  form: NotaReturData;
  setForm: (v: NotaReturData) => void;
  isNew: boolean;
  pelanggans: PelangganData[];
  mataUangs: MataUangData[];
  items: ItemData[];
  gudangs: GudangData[];
  invoices: any[];
  fakturPajaks: any[];
  tandaTangans: any[];

  dpp: number;
  ppnAmount: number;

  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  onNew: () => void;
  onAutoGenerate?: () => void;

  handlePelangganChange: (id: number | "") => void;
  addLine: () => void;
  removeLine: (idx: number) => void;
  updateLine: (idx: number, field: keyof NotaReturLine, value: any) => void;
}

export const NotaReturPenjualanFormView: React.FC<FormViewProps> = ({
  form,
  setForm,
  isNew,
  pelanggans,
  mataUangs,
  items,
  gudangs,
  invoices,
  fakturPajaks,
  tandaTangans,
  dpp,
  ppnAmount,
  onSave,
  onDelete,
  onClose,
  onNew,
  onAutoGenerate,
  handlePelangganChange,
  addLine,
  removeLine,
  updateLine,
}) => {
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState<"umum" | "detail">("umum");
  const [showCariFp, setShowCariFp] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  const inputClass =
    "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm disabled:bg-slate-100 disabled:text-slate-500 transition-colors";
  const readOnlyClass =
    "w-full px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-300 focus:outline-none rounded-sm text-sm";
  const labelClass = "w-36 text-xs font-semibold text-slate-700 shrink-0 mt-2";

  return (
    <PageLayout
      title="Nota Retur Penjualan"
      onBack={onClose}
      actions={
        <>
          <button
            onClick={() => {
              if (onAutoGenerate) onAutoGenerate();
              else onNew();
              setShowNewModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
          >
            <FilePlus size={14} /> + TAMBAH RETUR
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
            <Printer size={14} /> CETAK
          </button>
        </>
      }
    >
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
                Pelanggan
              </span>
              <span className="text-base font-bold text-slate-800">
                {pelanggans.find((p) => p.id === form.pelanggan_id)?.nama ||
                  "-"}
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
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-16 gap-y-4 max-w-7xl">
                  {/* Left Column */}
                  <div className="space-y-3">
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
                        <button 
                          onClick={onAutoGenerate}
                          className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap"
                        >
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
                      <label className={labelClass}>Nama Pembeli</label>
                      <select
                        className={inputClass}
                        value={form.pelanggan_id || ""}
                        onChange={(e) =>
                          handlePelangganChange(Number(e.target.value))
                        }
                      >
                        <option value="">- Pilih Pelanggan -</option>
                        {pelanggans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-start">
                      <label className={labelClass}>Alamat Pembeli</label>
                      <textarea
                        className={`${readOnlyClass} h-16 resize-none`}
                        readOnly
                        value={form.alamat_pembeli || ""}
                      />
                    </div>
                    <div className="flex items-start mt-2">
                      <label className={labelClass}>Jenis Transaksi</label>
                      <select
                        className={inputClass}
                        value={form.jenis_transaksi || ""}
                        onChange={(e) =>
                          setForm({ ...form, jenis_transaksi: e.target.value })
                        }
                      >
                        <option>Kepada Bukan Pemungut PPN (01)</option>
                        <option>Kepada Pemungut PPN (02)</option>
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
                  <div className="space-y-3">
                    <div className="flex items-start">
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
                      <label className={labelClass}>Atas No. FP</label>
                      <div className="flex gap-2 flex-1 items-center min-w-0">
                        <select
                          className={inputClass.replace("w-full", "flex-1 min-w-0")}
                          value={form.atas_no_fp || ""}
                          onChange={(e) => {
                            const fp = fakturPajaks?.find(f => f.no_fp === e.target.value);
                            if (fp) {
                              const inv = invoices?.find((i: any) => i.no_invoice === fp.no_invoice);
                              const applyFakturPajak = () => {
                                setForm({
                                  ...form,
                                  atas_no_fp: fp.no_fp || "",
                                  tgl_fp: fp.tgl_fp || "",
                                  atas_no_invoice: fp.no_invoice || "",
                                  pelanggan_id: fp.pembeli_id || form.pelanggan_id,
                                  alamat_pembeli: fp.alamat || form.alamat_pembeli,
                                  mata_uang_id: fp.mata_uang_id || form.mata_uang_id,
                                  tarif_ppn: fp.tarif_ppn || form.tarif_ppn,
                                  kurs_pajak: fp.kurs_pajak || form.kurs_pajak,
                                  gudang_id: inv?.gudang_id || form.gudang_id,
                                  tanda_tangan: fp.penandatangan || form.tanda_tangan,
                                  jabatan: fp.jabatan || form.jabatan,
                                  lines: fp.lines && fp.lines.length > 0 ? fp.lines.map((l: any) => ({
                                    ...l,
                                    item_id: l.item_id,
                                    nama_barang: l.nama_barang,
                                    satuan: l.satuan,
                                    kuantum: l.kuantum,
                                    harga_satuan: l.harga_satuan,
                                    harga_jual: l.harga_jual,
                                  })) : form.lines,
                                });
                              };
                              if (form.lines && form.lines.length > 0 && fp.lines && fp.lines.length > 0) {
                                confirm.show(
                                  "Apakah Anda yakin ingin mengganti detail barang dengan data dari Faktur Pajak ini?",
                                  "Semua baris barang yang sudah diinput akan diganti.",
                                  "warning",
                                  () => applyFakturPajak()
                                );
                              } else {
                                applyFakturPajak();
                              }
                            } else {
                              setForm({
                                ...form,
                                atas_no_fp: "",
                                tgl_fp: "",
                                atas_no_invoice: "",
                                lines: []
                              });
                            }
                          }}
                        >
                          <option value="">- Pilih Faktur Pajak -</option>
                          {fakturPajaks?.map((fp, idx) => (
                            <option key={idx} value={fp.no_fp}>{fp.no_fp} - {fp.pembeli_nama}</option>
                          ))}
                        </select>
                        <span className="text-xs font-semibold text-slate-700 ml-2">
                          Tgl
                        </span>
                        <input
                          type="date"
                          className={inputClass.replace("w-full", "w-32")}
                          value={form.tgl_fp || ""}
                          onChange={(e) =>
                            setForm({ ...form, tgl_fp: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-start mt-2">
                      <label className={labelClass}>Atas No. Invoice</label>
                      <select
                        className={inputClass}
                        value={form.atas_no_invoice || ""}
                        onChange={(e) => {
                          const invNo = e.target.value;
                          const fp = fakturPajaks?.find(f => f.no_invoice === invNo);
                          const inv = invoices?.find((i: any) => (i.no_invoice || i.id) === invNo);
                          
                          if (fp) {
                            const applyFakturPajak = () => {
                              setForm({
                                ...form,
                                atas_no_fp: fp.no_fp || "",
                                tgl_fp: fp.tgl_fp || "",
                                atas_no_invoice: invNo,
                                pelanggan_id: fp.pembeli_id || form.pelanggan_id,
                                alamat_pembeli: fp.alamat || form.alamat_pembeli,
                                mata_uang_id: fp.mata_uang_id || form.mata_uang_id,
                                tarif_ppn: fp.tarif_ppn || form.tarif_ppn,
                                kurs_pajak: fp.kurs_pajak || form.kurs_pajak,
                                gudang_id: inv?.gudang_id || form.gudang_id,
                                tanda_tangan: fp.penandatangan || form.tanda_tangan,
                                jabatan: fp.jabatan || form.jabatan,
                                lines: fp.lines && fp.lines.length > 0 ? fp.lines.map((l: any) => ({
                                  ...l,
                                  item_id: l.item_id,
                                  nama_barang: l.nama_barang,
                                  satuan: l.satuan,
                                  kuantum: l.kuantum,
                                  harga_satuan: l.harga_satuan,
                                  harga_jual: l.harga_jual,
                                })) : form.lines,
                              });
                            };
                            if (form.lines && form.lines.length > 0 && fp.lines && fp.lines.length > 0) {
                              confirm.show(
                                "Apakah Anda yakin ingin mengganti detail barang dengan data dari Invoice/Faktur ini?",
                                "Semua baris barang yang sudah diinput akan diganti.",
                                "warning",
                                () => applyFakturPajak()
                              );
                            } else {
                              applyFakturPajak();
                            }
                          } else {
                            setForm({ 
                              ...form, 
                              atas_no_invoice: invNo,
                              pelanggan_id: inv ? inv.pelanggan_id : form.pelanggan_id,
                              gudang_id: inv ? inv.gudang_id : form.gudang_id,
                            });
                          }
                        }}
                      >
                        <option value="">- Pilih Invoice -</option>
                        {invoices
                          .filter(
                            (i: any) =>
                              !form.pelanggan_id ||
                              i.pelanggan_id === form.pelanggan_id,
                          )
                          .map((inv: any) => (
                            <option
                              key={inv.no_invoice || inv.id}
                              value={inv.no_invoice || inv.id}
                            >
                              {inv.no_invoice || inv.id}
                            </option>
                          ))}
                      </select>
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
                        <th className="px-3 py-2 text-left border-r border-slate-200 min-w-[250px] font-semibold">
                          Nama Barang Kena Pajak Yang Dikembalikan
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
                        <th className="w-28 px-3 py-2 text-right border-r border-slate-200 font-semibold">
                          HPP
                        </th>
                        <th className="w-32 px-3 py-2 text-right border-r border-slate-200 font-semibold">
                          Total HPP
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
                          <td className="px-2 py-1.5 border-r border-slate-200 text-right">
                            <input
                              type="number"
                              className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              value={line.hpp || ""}
                              onChange={(e) =>
                                updateLine(idx, "hpp", Number(e.target.value))
                              }
                            />
                          </td>
                          <td className="px-2 py-1.5 border-r border-slate-200 text-right bg-slate-50">
                            <span className="text-slate-600">
                              {(line.total_hpp || 0).toLocaleString("en-US", {
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
                        <td colSpan={9} className="px-3 py-2">
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
                <label className={labelClass}>Lokasi Pelaporan</label>
                <input
                  type="text"
                  className={`${inputClass} flex-1`}
                  value={form.lokasi_pelaporan || ""}
                  onChange={(e) =>
                    setForm({ ...form, lokasi_pelaporan: e.target.value })
                  }
                />
              </div>
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
              
              <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-200">
                <div className="w-1/2 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={`${labelClass} w-32 mb-0`}>Lokasi Pelaporan</label>
                    <input
                      type="text"
                      className={`${inputClass} w-48`}
                      value={form.lokasi_pelaporan || ""}
                      onChange={(e) => setForm({ ...form, lokasi_pelaporan: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className={`${labelClass} w-32 mb-0`}>Tanda Tangan</label>
                    <select
                      className={`${inputClass} w-48`}
                      value={form.tanda_tangan || ""}
                      onChange={(e) => {
                        const selected = tandaTangans?.find(t => t.nama === e.target.value);
                        setForm({
                          ...form,
                          tanda_tangan: e.target.value,
                          jabatan: selected ? selected.jabatan : form.jabatan
                        });
                      }}
                    >
                      <option value="">-- Pilih --</option>
                      {tandaTangans?.map((t) => (
                        <option key={t.id} value={t.nama}>
                          {t.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className={`${labelClass} w-32 mb-0`}>Jabatan</label>
                    <input
                      type="text"
                      className={`${inputClass} w-48`}
                      value={form.jabatan || ""}
                      onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                    />
                  </div>
                  {tandaTangans?.find(t => t.nama === form.tanda_tangan)?.ttd_image && (
                    <div className="ml-34 mt-2">
                      <img 
                        src={`data:image/png;base64,${tandaTangans.find(t => t.nama === form.tanda_tangan)?.ttd_image}`} 
                        alt="Tanda Tangan" 
                        className="h-16 object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={isNew}
                    onClick={onDelete}
                    className="px-6 py-3 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-50"
                  >
                    <Trash2 size={16} /> HAPUS RETUR
                  </button>
                  <button
                    onClick={onSave}
                    className="px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md"
                  >
                    <Save size={16} /> SIMPAN RETUR
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      {showCariFp && (
        <CariFakturPajakModal
          dataList={fakturPajaks || []}
          onClose={() => setShowCariFp(false)}
          onSelect={(fp: any) => {
            const applyFakturPajak = () => {
              setForm({
                ...form,
                atas_no_fp: fp.no_fp || "",
                tgl_fp: fp.tgl_fp || "",
                atas_no_invoice: fp.no_invoice || "",
                pelanggan_id: fp.pembeli_id || form.pelanggan_id,
                alamat_pembeli: fp.alamat || form.alamat_pembeli,
                mata_uang_id: fp.mata_uang_id || form.mata_uang_id,
                tarif_ppn: fp.tarif_ppn || form.tarif_ppn,
                kurs_pajak: fp.kurs_pajak || form.kurs_pajak,
                lines: fp.lines && fp.lines.length > 0 ? fp.lines.map((l: any) => ({
                  ...l,
                  item_id: l.item_id,
                  nama_barang: l.nama_barang,
                  satuan: l.satuan,
                  kuantum: l.kuantum,
                  harga_satuan: l.harga_satuan,
                  harga_jual: l.harga_jual,
                })) : form.lines,
              });
              setShowCariFp(false);
            };

            if (form.lines && form.lines.length > 0 && fp.lines && fp.lines.length > 0) {
              confirm.show(
                "Apakah Anda yakin ingin mengganti detail barang dengan data dari Faktur Pajak ini?",
                "Semua baris barang yang sudah diinput akan diganti.",
                "warning",
                () => applyFakturPajak()
              );
            } else {
              applyFakturPajak();
            }
          }}
        />
      )}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-md shadow-xl flex flex-col overflow-hidden border border-slate-700 my-8">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h3 className="text-white font-semibold">Buat Nota Retur Penjualan</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Isi detail dokumen header sebelum menambahkan rincian barang.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNewModal(false);
                  onClose();
                }}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">No. Nota Retur</label>
                  <div className="flex gap-2">
                    <input type="text" className={`${inputClass} flex-1 font-bold`} value={form.no_nota || ""} readOnly />
                    <button
                      className="px-3 py-1.5 text-xs font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm shadow-sm"
                      onClick={onAutoGenerate}
                    >
                      Auto No
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Tgl Retur</label>
                  <input 
                    type="date" 
                    className={inputClass} 
                    value={form.tgl_nota || ""} 
                    onChange={(e) => setForm({...form, tgl_nota: e.target.value})} 
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Faktur Pajak</label>
                  <select
                    className={inputClass}
                    value={form.atas_no_fp || ""}
                    onChange={(e) => {
                      const fp = fakturPajaks?.find(f => f.no_fp === e.target.value);
                      if (fp) {
                        const inv = invoices?.find((i: any) => i.no_invoice === fp.no_invoice);
                        setForm({
                          ...form,
                          atas_no_fp: fp.no_fp || "",
                          tgl_fp: fp.tgl_fp || "",
                          atas_no_invoice: fp.no_invoice || "",
                          pelanggan_id: fp.pembeli_id || form.pelanggan_id,
                          alamat_pembeli: fp.alamat || form.alamat_pembeli,
                          mata_uang_id: fp.mata_uang_id || form.mata_uang_id,
                          tarif_ppn: fp.tarif_ppn || form.tarif_ppn,
                          kurs_pajak: fp.kurs_pajak || form.kurs_pajak,
                          gudang_id: inv?.gudang_id || form.gudang_id,
                          tanda_tangan: fp.penandatangan || form.tanda_tangan,
                          jabatan: fp.jabatan || form.jabatan,
                          lines: fp.lines && fp.lines.length > 0 ? fp.lines.map((l: any) => ({
                            ...l,
                            item_id: l.item_id,
                            nama_barang: l.nama_barang,
                            satuan: l.satuan,
                            kuantum: l.kuantum,
                            harga_satuan: l.harga_satuan,
                            harga_jual: l.harga_jual,
                          })) : form.lines,
                        });
                      } else {
                        setForm({
                          ...form,
                          atas_no_fp: "",
                          tgl_fp: "",
                          atas_no_invoice: "",
                          lines: []
                        });
                      }
                    }}
                  >
                    <option value="">- Pilih Faktur Pajak -</option>
                    {fakturPajaks?.map((fp, idx) => (
                      <option key={idx} value={fp.no_fp}>{fp.no_fp} - {fp.pembeli_nama}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">No. Invoice</label>
                  <input type="text" className={`${inputClass} bg-slate-100`} value={form.atas_no_invoice || ""} readOnly />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Nama Pembeli</label>
                  <input 
                    type="text" 
                    className={`${inputClass} bg-slate-100`} 
                    value={pelanggans.find(p => p.id === form.pelanggan_id)?.nama || ""} 
                    readOnly 
                  />
                </div>

              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button
                onClick={() => {
                  setShowNewModal(false);
                  onClose();
                }}
                className="px-5 py-2 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 font-semibold rounded-sm text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => setShowNewModal(false)}
                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-sm text-sm shadow-sm flex items-center gap-2"
              >
                <Save size={16} /> Buat
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
