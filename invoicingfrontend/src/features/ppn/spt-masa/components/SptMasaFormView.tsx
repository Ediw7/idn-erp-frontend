import React, { useState } from "react";
import {
  Save,
  Trash2,
  ArrowLeft,
  Lock,
  Unlock,
  Printer,
  FilePlus,
} from "lucide-react";
import { SptMasa1111Data } from "../api";

interface FormViewProps {
  form: SptMasa1111Data;
  setForm: (v: SptMasa1111Data) => void;
  isNew: boolean;
  calculated: any;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const SptMasaFormView: React.FC<FormViewProps> = ({
  form,
  setForm,
  isNew,
  calculated,
  onSave,
  onDelete,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"i" | "ii" | "iii">("i");

  const { totalDppA, totalPpnA, totalDppC, iiA, iiD, iiF } = calculated;

  const inputClass =
    "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm disabled:bg-slate-100 disabled:text-slate-500 transition-colors";
  const numInputClass =
    "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm text-right font-mono disabled:bg-slate-50 disabled:text-slate-500 transition-colors";
  const readOnlyNumClass =
    "w-full px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-300 focus:outline-none rounded-sm text-sm text-right font-mono font-bold";
  const labelClass = "text-xs font-semibold text-slate-700 shrink-0";

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Mirip Sales Order */}
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
              SPT Masa PPN 1111
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setForm({ ...form, is_locked: !form.is_locked })}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors rounded-sm shadow-sm ${form.is_locked ? "bg-red-600 text-white hover:bg-red-700" : "bg-slate-600 text-white hover:bg-slate-700"}`}
          >
            {form.is_locked ? <Lock size={14} /> : <Unlock size={14} />}{" "}
            {form.is_locked ? "UNLOCK SPT" : "LOCK SPT"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
            <Printer size={14} /> CETAK
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {/* Mini Header Mirip Sales Order (Dengan Input) */}
        <div className="bg-white border-l-4 border-l-blue-600 border-y border-r border-slate-300 rounded-sm shadow-sm p-4 shrink-0 flex justify-between items-center">
          <div className="flex gap-12 items-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Tahun Pajak
              </span>
              <input
                type="text"
                className={`${inputClass} w-24 font-mono font-bold text-base py-1`}
                disabled={form.is_locked}
                value={form.tahun}
                onChange={(e) => setForm({ ...form, tahun: e.target.value })}
              />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Masa Pajak
              </span>
              <div className="flex items-center gap-2">
                <select
                  className={`${inputClass} w-20 py-1 font-bold`}
                  disabled={form.is_locked}
                  value={form.masa_awal}
                  onChange={(e) =>
                    setForm({ ...form, masa_awal: e.target.value })
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const m = (i + 1).toString().padStart(2, "0");
                    return (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    );
                  })}
                </select>
                <span className="text-xs font-semibold text-slate-500">
                  s/d
                </span>
                <select
                  className={`${inputClass} w-20 py-1 font-bold`}
                  disabled={form.is_locked}
                  value={form.masa_akhir}
                  onChange={(e) =>
                    setForm({ ...form, masa_akhir: e.target.value })
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const m = (i + 1).toString().padStart(2, "0");
                    return (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Pembetulan Ke
              </span>
              <input
                type="number"
                className={`${inputClass} w-16 text-center font-bold py-1`}
                disabled={form.is_locked}
                value={form.pembetulan_ke}
                onChange={(e) =>
                  setForm({ ...form, pembetulan_ke: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Tanggal SPT
              </span>
              <input
                type="date"
                className={`${inputClass} w-40 font-bold py-1`}
                disabled={form.is_locked}
                value={form.tanggal_spt}
                onChange={(e) =>
                  setForm({ ...form, tanggal_spt: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-3">
            {form.is_locked && (
              <span className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-sm border border-red-200 flex items-center gap-1">
                <Lock size={12} /> LOCKED
              </span>
            )}
            {!form.is_locked && (
              <span className="px-3 py-1 bg-green-100 text-green-700 font-bold text-xs rounded-sm border border-green-200">
                OPEN
              </span>
            )}
          </div>
        </div>

        {/* Tabs Mirip Sales Order */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0 flex-1">
          <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1">
            {[
              { id: "i", label: "I. Penyerahan Barang & Jasa" },
              { id: "ii", label: "II. Penghitungan PPN" },
              { id: "iii", label: "III. Membangun Sendiri" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === tab.id ? "bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm" : "bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            {activeTab === "i" && (
              <div className="p-6 shrink-0 max-w-5xl">
                <div className="grid grid-cols-[1fr_200px_200px_350px] gap-6 mb-4 border-b border-slate-200 pb-2">
                  <div></div>
                  <div className="text-center text-xs font-bold text-slate-600">
                    Dasar Pengenaan Pajak (DPP)
                  </div>
                  <div className="text-center text-xs font-bold text-slate-600">
                    PPN Terutang
                  </div>
                  <div className="text-center text-xs font-bold text-white bg-slate-800 rounded-sm py-1">
                    Akumulasi (Read Only)
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-700 mb-4">
                  A. Terutang PPN
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    {
                      no: "1.",
                      label: "Ekspor",
                      dpp: "dpp_ekspor",
                      ppn: "ppn_ekspor",
                    },
                    {
                      no: "2.",
                      label: "Penyerahan yang PPN-nya harus dipungut sendiri",
                      dpp: "dpp_dipungut_sendiri",
                      ppn: "ppn_dipungut_sendiri",
                    },
                    {
                      no: "3.",
                      label: "Penyerahan yang PPN-nya dipungut oleh Pemungut",
                      dpp: "dpp_dipungut_pemungut",
                      ppn: "ppn_dipungut_pemungut",
                    },
                    {
                      no: "4.",
                      label: "Penyerahan yang PPN-nya tidak dipungut",
                      dpp: "dpp_tidak_dipungut",
                      ppn: "ppn_tidak_dipungut",
                    },
                    {
                      no: "5.",
                      label: "Penyerahan yang dibebaskan dari pengenaan PPN",
                      dpp: "dpp_dibebaskan",
                      ppn: "ppn_dibebaskan",
                    },
                  ].map((row) => (
                    <div
                      key={row.no}
                      className="grid grid-cols-[1fr_200px_200px_165px_165px] gap-x-6 items-center"
                    >
                      <div className="text-sm text-slate-700 flex gap-2 pl-4">
                        <span className="w-4 font-semibold">{row.no}</span>
                        <span>{row.label}</span>
                      </div>
                      <input
                        type="number"
                        disabled={form.is_locked}
                        className={numInputClass}
                        value={(form as any)[row.dpp] || 0}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [row.dpp]: Number(e.target.value),
                          })
                        }
                      />
                      <input
                        type="number"
                        disabled={form.is_locked}
                        className={numInputClass}
                        value={(form as any)[row.ppn] || 0}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [row.ppn]: Number(e.target.value),
                          })
                        }
                      />
                      <input
                        type="text"
                        className={`${readOnlyNumClass} bg-green-50 text-green-700`}
                        readOnly
                        value={((form as any)[row.dpp] || 0).toLocaleString(
                          "en-US",
                        )}
                      />
                      <input
                        type="text"
                        className={`${readOnlyNumClass} bg-green-50 text-green-700`}
                        readOnly
                        value={((form as any)[row.ppn] || 0).toLocaleString(
                          "en-US",
                        )}
                      />
                    </div>
                  ))}

                  {/* Jumlah I.A */}
                  <div className="grid grid-cols-[1fr_200px_200px_165px_165px] gap-x-6 items-center mt-4 border-t border-slate-200 pt-4">
                    <div className="text-sm font-bold text-slate-700 pl-4">
                      Jumlah (I.A.1 + I.A.2 + I.A.3 + I.A.4 + I.A.5)
                    </div>
                    <input
                      type="text"
                      className={readOnlyNumClass}
                      readOnly
                      value={totalDppA.toLocaleString("en-US")}
                    />
                    <input
                      type="text"
                      className={readOnlyNumClass}
                      readOnly
                      value={totalPpnA.toLocaleString("en-US")}
                    />
                    <input
                      type="text"
                      className={`${readOnlyNumClass} bg-green-100 text-green-800 border-green-300`}
                      readOnly
                      value={totalDppA.toLocaleString("en-US")}
                    />
                    <input
                      type="text"
                      className={`${readOnlyNumClass} bg-green-100 text-green-800 border-green-300`}
                      readOnly
                      value={totalPpnA.toLocaleString("en-US")}
                    />
                  </div>

                  {/* B. Tidak Terutang PPN */}
                  <div className="grid grid-cols-[1fr_200px_200px_165px_165px] gap-x-6 items-center mt-6">
                    <div className="text-sm font-bold text-slate-700">
                      B. Tidak Terutang PPN
                    </div>
                    <input
                      type="number"
                      disabled={form.is_locked}
                      className={numInputClass}
                      value={form.dpp_tidak_terutang || 0}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          dpp_tidak_terutang: Number(e.target.value),
                        })
                      }
                    />
                    <div className="text-center text-slate-400 font-bold">
                      -
                    </div>
                    <input
                      type="text"
                      className={`${readOnlyNumClass} bg-green-50 text-green-700`}
                      readOnly
                      value={(form.dpp_tidak_terutang || 0).toLocaleString(
                        "en-US",
                      )}
                    />
                    <div></div>
                  </div>

                  {/* C. Jumlah Seluruh Penyerahan */}
                  <div className="grid grid-cols-[1fr_200px_200px_165px_165px] gap-x-6 items-center mt-4 border-t border-slate-200 pt-4">
                    <div className="text-sm font-bold text-slate-700">
                      C. Jumlah Seluruh Penyerahan (I.A + I.B)
                    </div>
                    <input
                      type="text"
                      className={`${readOnlyNumClass} bg-blue-50 border-blue-300 text-blue-800 text-base`}
                      readOnly
                      value={totalDppC.toLocaleString("en-US")}
                    />
                    <div></div>
                    <input
                      type="text"
                      className={`${readOnlyNumClass} bg-green-100 border-green-300 text-green-800 text-base`}
                      readOnly
                      value={totalDppC.toLocaleString("en-US")}
                    />
                    <div></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ii" && (
              <div className="p-6 shrink-0 max-w-4xl flex flex-col gap-5">
                <div className="grid grid-cols-[1fr_200px] gap-6 items-center">
                  <div className="text-sm font-semibold text-slate-700">
                    A. Pajak Keluaran yang harus dipungut sendiri (Jumlah PPN
                    pada I.A.2)
                  </div>
                  <input
                    type="text"
                    className={readOnlyNumClass}
                    readOnly
                    value={iiA.toLocaleString("en-US")}
                  />
                </div>
                <div className="grid grid-cols-[1fr_200px] gap-6 items-center">
                  <div className="text-sm font-semibold text-slate-700">
                    B. PPN Disetor Dimuka Dalam Masa Pajak Yang Sama
                  </div>
                  <input
                    type="number"
                    disabled={form.is_locked}
                    className={numInputClass}
                    value={form.ppn_disetor_dimuka || 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        ppn_disetor_dimuka: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-[1fr_200px_200px] gap-6 items-center">
                  <div className="text-sm font-semibold text-slate-700">
                    C. Pajak Masukan yang dapat diperhitungkan
                  </div>
                  <input
                    type="number"
                    disabled={form.is_locked}
                    className={numInputClass}
                    value={form.pajak_masukan_diperhitungkan || 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pajak_masukan_diperhitungkan: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    type="text"
                    className={`${readOnlyNumClass} bg-green-50 text-green-800`}
                    readOnly
                    value={(
                      form.pajak_masukan_diperhitungkan || 0
                    ).toLocaleString("en-US")}
                  />
                </div>
                <div className="grid grid-cols-[1fr_200px] gap-6 items-center mt-2 border-t border-slate-200 pt-4">
                  <div className="text-sm font-bold text-slate-800">
                    D. PPN yang kurang atau (lebih) bayar (II.A - II.B - II.C)
                  </div>
                  <input
                    type="text"
                    className={`${readOnlyNumClass} text-base ${iiD < 0 ? "text-red-700 bg-red-50 border-red-300" : "text-blue-800 bg-blue-50 border-blue-300"}`}
                    readOnly
                    value={iiD.toLocaleString("en-US")}
                  />
                </div>
                <div className="grid grid-cols-[1fr_200px] gap-6 items-center">
                  <div className="text-sm font-semibold text-slate-700">
                    E. PPN yang kurang atau (lebih) bayar pada SPT yang
                    dibetulkan
                  </div>
                  <input
                    type="number"
                    disabled={form.is_locked}
                    className={numInputClass}
                    value={form.ppn_spt_dibetulkan || 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        ppn_spt_dibetulkan: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-[1fr_200px] gap-6 items-center mt-2 border-t border-slate-200 pt-4">
                  <div className="text-sm font-bold text-slate-800">
                    F. PPN yang kurang atau (lebih) bayar karena pembetulan
                    (II.D - II.E)
                  </div>
                  <input
                    type="text"
                    className={`${readOnlyNumClass} text-base ${iiF < 0 ? "text-red-700 bg-red-50 border-red-300" : "text-blue-800 bg-blue-50 border-blue-300"}`}
                    readOnly
                    value={iiF.toLocaleString("en-US")}
                  />
                </div>

                <div className="flex gap-4 items-center mt-4 bg-slate-100 p-4 rounded-sm border border-slate-200">
                  <div className="text-sm font-semibold text-slate-700">
                    G. PPN yang kurang dibayar dilunasi tanggal
                  </div>
                  <input
                    type="date"
                    disabled={form.is_locked}
                    className={`${inputClass} w-40`}
                    value={form.tgl_lunas_kurang_bayar || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tgl_lunas_kurang_bayar: e.target.value,
                      })
                    }
                  />
                  <div className="text-sm text-slate-700 font-bold ml-6">
                    NTPN
                  </div>
                  <input
                    type="text"
                    disabled={form.is_locked}
                    className={`${inputClass} w-64`}
                    value={form.ntpn_kurang_bayar || ""}
                    onChange={(e) =>
                      setForm({ ...form, ntpn_kurang_bayar: e.target.value })
                    }
                  />
                </div>

                {/* H. PPN Lebih Dibayar pada: */}
                <div className="mt-6 border border-slate-300 rounded-sm">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
                    <span className="text-sm font-bold text-slate-800">
                      H. PPN Lebih Dibayar pada:
                    </span>
                  </div>
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm font-bold text-slate-500 w-6">
                          1.1
                        </span>
                        <input
                          type="radio"
                          disabled={form.is_locked}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                          name="lebih_bayar_pada"
                          checked={form.lebih_bayar_pada === "1.1"}
                          onChange={() =>
                            setForm({ ...form, lebih_bayar_pada: "1.1" })
                          }
                        />
                        <span className="text-sm text-slate-700 font-medium">
                          Butir II.D (Disi dalam hal SPT Bukan Pembetulan)
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm font-bold text-slate-500 w-6">
                          1.2
                        </span>
                        <input
                          type="radio"
                          disabled={form.is_locked}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                          name="lebih_bayar_pada"
                          checked={form.lebih_bayar_pada === "1.2"}
                          onChange={() =>
                            setForm({ ...form, lebih_bayar_pada: "1.2" })
                          }
                        />
                        <span className="text-sm text-slate-700 font-medium">
                          Butir II.D atau II.F (Disi dalam hal SPT Pembetulan)
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center gap-8">
                      <span className="text-sm font-semibold text-slate-700 w-10">
                        Oleh
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm font-bold text-slate-500 w-6">
                          2.1
                        </span>
                        <input
                          type="radio"
                          disabled={form.is_locked}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                          name="lebih_bayar_oleh"
                          checked={form.lebih_bayar_oleh === "2.1"}
                          onChange={() =>
                            setForm({ ...form, lebih_bayar_oleh: "2.1" })
                          }
                        />
                        <span className="text-sm text-slate-700 font-medium">
                          PKP Pasal 9 ayat (4b) PPN
                        </span>
                      </label>
                      <span className="text-sm text-slate-400 font-medium italic">
                        atau
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm font-bold text-slate-500 w-6">
                          2.2
                        </span>
                        <input
                          type="radio"
                          disabled={form.is_locked}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                          name="lebih_bayar_oleh"
                          checked={form.lebih_bayar_oleh === "2.2"}
                          onChange={() =>
                            setForm({ ...form, lebih_bayar_oleh: "2.2" })
                          }
                        />
                        <span className="text-sm text-slate-700 font-medium">
                          Selain PKP Pasal 9 ayat (4b) PPN
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <span className="text-sm font-semibold text-slate-700 w-24 pt-0.5">
                        Diminta untuk:
                      </span>
                      <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-500 w-6">
                            3.1
                          </span>
                          <input
                            type="radio"
                            disabled={form.is_locked}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                            name="lebih_bayar_diminta_untuk"
                            checked={form.lebih_bayar_diminta_untuk === "3.1"}
                            onChange={() =>
                              setForm({
                                ...form,
                                lebih_bayar_diminta_untuk: "3.1",
                              })
                            }
                          />
                          <span className="text-sm text-slate-700 font-medium">
                            Dikompensasikan ke Masa Pajak berikutnya;
                          </span>
                          <span className="text-sm text-slate-400 font-medium italic px-2">
                            atau
                          </span>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              disabled={form.is_locked}
                              className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                              checked={!!form.kompensasi_masa}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  kompensasi_masa: e.target.checked ? "ya" : "",
                                })
                              }
                            />
                            <span className="text-sm text-slate-700 font-medium">
                              Dikompensasikan ke Masa Pajak
                            </span>
                          </label>
                          <select
                            className={`${inputClass} w-24`}
                            disabled={form.is_locked || !form.kompensasi_masa}
                            value={form.kompensasi_masa || ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                kompensasi_masa: e.target.value,
                              })
                            }
                          >
                            <option value="">-</option>
                            {Array.from({ length: 12 }, (_, i) => {
                              const m = (i + 1).toString().padStart(2, "0");
                              return (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              );
                            })}
                          </select>
                          <span className="text-sm font-semibold text-slate-700 ml-2">
                            Tahun:
                          </span>
                          <input
                            type="text"
                            className={`${inputClass} w-24`}
                            disabled={form.is_locked || !form.kompensasi_masa}
                            value={form.kompensasi_tahun || ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                kompensasi_tahun: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex items-start gap-3 mt-2">
                          <span className="text-sm font-bold text-slate-500 w-6 pt-0.5">
                            3.2
                          </span>
                          <input
                            type="radio"
                            disabled={form.is_locked}
                            className="w-4 h-4 mt-1 text-blue-600 focus:ring-blue-500 border-slate-300"
                            name="lebih_bayar_diminta_untuk"
                            checked={form.lebih_bayar_diminta_untuk === "3.2"}
                            onChange={() =>
                              setForm({
                                ...form,
                                lebih_bayar_diminta_untuk: "3.2",
                              })
                            }
                          />
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-700 font-bold">
                              Dikembalikan (Restitusi)
                            </span>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-sm w-fit">
                              Khusus Restitusi untuk PKP:
                            </span>

                            <div className="flex items-center gap-3">
                              <span className="text-sm text-slate-400 font-medium italic w-10 text-right">
                                atau
                              </span>
                              <input
                                type="checkbox"
                                disabled={form.is_locked}
                                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                                checked={!!form.restitusi_pasal_17c}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    restitusi_pasal_17c: e.target.checked
                                      ? "biasa"
                                      : "",
                                  })
                                }
                              />
                              <span className="text-sm text-slate-700 font-medium w-64">
                                Pasal 17C KUP dilakukan dengan:
                              </span>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  disabled={
                                    form.is_locked || !form.restitusi_pasal_17c
                                  }
                                  name="17c"
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                  checked={form.restitusi_pasal_17c === "biasa"}
                                  onChange={() =>
                                    setForm({
                                      ...form,
                                      restitusi_pasal_17c: "biasa",
                                    })
                                  }
                                />
                                <span className="text-sm text-slate-700 font-medium">
                                  Prosedur biasa
                                </span>
                              </label>
                              <span className="text-sm text-slate-400 font-medium italic mx-2">
                                atau
                              </span>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  disabled={
                                    form.is_locked || !form.restitusi_pasal_17c
                                  }
                                  name="17c"
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                  checked={
                                    form.restitusi_pasal_17c === "pendahuluan"
                                  }
                                  onChange={() =>
                                    setForm({
                                      ...form,
                                      restitusi_pasal_17c: "pendahuluan",
                                    })
                                  }
                                />
                                <span className="text-sm text-slate-700 font-medium">
                                  Pengembalian Pendahuluan
                                </span>
                              </label>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm text-slate-400 font-medium italic w-10 text-right">
                                atau
                              </span>
                              <input
                                type="checkbox"
                                disabled={form.is_locked}
                                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                                checked={!!form.restitusi_pasal_17d}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    restitusi_pasal_17d: e.target.checked
                                      ? "biasa"
                                      : "",
                                  })
                                }
                              />
                              <span className="text-sm text-slate-700 font-medium w-64">
                                Pasal 17D KUP dilakukan dengan:
                              </span>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  disabled={
                                    form.is_locked || !form.restitusi_pasal_17d
                                  }
                                  name="17d"
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                  checked={form.restitusi_pasal_17d === "biasa"}
                                  onChange={() =>
                                    setForm({
                                      ...form,
                                      restitusi_pasal_17d: "biasa",
                                    })
                                  }
                                />
                                <span className="text-sm text-slate-700 font-medium">
                                  Prosedur biasa
                                </span>
                              </label>
                              <span className="text-sm text-slate-400 font-medium italic mx-2">
                                atau
                              </span>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  disabled={
                                    form.is_locked || !form.restitusi_pasal_17d
                                  }
                                  name="17d"
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                  checked={
                                    form.restitusi_pasal_17d === "pendahuluan"
                                  }
                                  onChange={() =>
                                    setForm({
                                      ...form,
                                      restitusi_pasal_17d: "pendahuluan",
                                    })
                                  }
                                />
                                <span className="text-sm text-slate-700 font-medium">
                                  Pengembalian Pendahuluan
                                </span>
                              </label>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm text-slate-400 font-medium italic w-10 text-right">
                                atau
                              </span>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  disabled={form.is_locked}
                                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                                  checked={form.restitusi_pasal_9_4c}
                                  onChange={(e) =>
                                    setForm({
                                      ...form,
                                      restitusi_pasal_9_4c: e.target.checked,
                                    })
                                  }
                                />
                                <span className="text-sm text-slate-700 font-medium">
                                  Pasal 9 ayat (4c) PPN dilakukan dengan
                                  Pengembalian Pendahuluan
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "iii" && (
              <div className="p-6 shrink-0 max-w-2xl">
                <div className="grid grid-cols-[1fr_200px] gap-6 items-center mb-4">
                  <div className="text-sm font-semibold text-slate-700">
                    A. Jumlah Dasar Pengenaan Pajak
                  </div>
                  <input
                    type="number"
                    disabled={form.is_locked}
                    className={numInputClass}
                    value={form.membangun_dpp || 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        membangun_dpp: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-[1fr_200px] gap-6 items-center">
                  <div className="text-sm font-semibold text-slate-700">
                    B. PPN Terutang
                  </div>
                  <input
                    type="number"
                    disabled={form.is_locked}
                    className={numInputClass}
                    value={form.membangun_ppn || 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        membangun_ppn: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
            <button
              disabled={form.is_locked || isNew}
              onClick={onDelete}
              className="px-6 py-2.5 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-50"
            >
              <Trash2 size={16} /> HAPUS SPT
            </button>
            <button
              disabled={form.is_locked}
              onClick={onSave}
              className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md"
            >
              <Save size={16} /> SIMPAN SPT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
