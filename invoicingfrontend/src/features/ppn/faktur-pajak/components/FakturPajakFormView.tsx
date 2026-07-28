import React, { useState } from "react";
import { Save, ArrowLeft, Trash2, Plus, Calculator, FilePlus } from "lucide-react";
import { PageLayout } from "../../../../components/layouts/PageLayout";
import { useConfirm } from "../../../../contexts/ConfirmContext";

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
  penjatahans: any[];
  tandaTangans: any[];
  onAddLine: (line: any) => void;
  onUpdateLine: (idx: number, line: any) => void;
  onRemoveLine: (idx: number) => void;
  onOpenFpPenggantiModal?: () => void;
  onNew: () => void;
  onDelete: () => void;
  onOpenPenjatahan?: () => void;
  onAutoGenerate?: () => void;
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
  penjatahans,
  tandaTangans,
  onAddLine,
  onUpdateLine,
  onRemoveLine,
  onOpenFpPenggantiModal,
  onNew,
  onDelete,
  onOpenPenjatahan,
  onAutoGenerate,
}) => {
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState<"umum" | "detail">("umum");
  
  const inputClass =
    "w-full text-xs border border-slate-300 rounded-sm px-2 py-1 outline-none focus:border-blue-500 bg-white";
  const labelClass = "text-[11px] font-semibold text-slate-700 mb-1 block";

  const selectedPelanggan = pelanggans.find((p) => p.id === Number(form.pembeli_id));

  let totalHargaJual = 0;
  (form.lines || []).forEach((line: any) => {
    totalHargaJual += ((line.kuantum || 0) * (line.harga_satuan || 0)) - (line.disc_footer || 0);
  });
  
  // Potongan dan Uang muka
  let dppSetelahPotongan = totalHargaJual - (form.potongan || 0) - (form.uang_muka || 0);
  if (form.is_dpp_valas) {
    dppSetelahPotongan = dppSetelahPotongan * (100 / 110);
  }
  const ppn = dppSetelahPotongan * ((form.tarif_ppn || 11) / 100);

  return (
    <PageLayout
      title="Faktur Pajak"
      onBack={onCancel}
      actions={
        <>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
          >
            <FilePlus size={14} /> + TAMBAH FP
          </button>
        </>
      }
    >
      {/* Mini Header */}
      <div className="bg-white border-l-4 border-l-blue-600 border-y border-r border-slate-300 rounded-sm shadow-sm p-4 shrink-0 flex justify-between items-center">
        <div className="flex gap-12">
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase">
              No. Faktur Pajak
            </span>
            <span className="font-mono text-base font-bold text-slate-800">
              {form.no_fp || "DRAFT"}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase">
              Pembeli
            </span>
            <span className="text-base font-bold text-slate-800">
              {selectedPelanggan?.nama || "-"}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase">
              Tanggal
            </span>
            <span className="text-base font-bold text-slate-800">
              {form.tgl_fp || "-"}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {form.jenis_status === "Batal" && (
            <span className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-sm border border-red-200">
              BATAL
            </span>
          )}
          {form.jenis_status === "Pengganti" && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 font-bold text-xs rounded-sm border border-orange-200">
              PENGGANTI
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0 flex-1">
        <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1 shrink-0">
          {(["umum", "detail"] as const).map((tab) => {
            const labels = {
              umum: "Informasi Umum",
              detail: "Detail Barang/Jasa",
            };
            return (
              <button
                key={tab}
                className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${
                  activeTab === tab
                    ? "bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm"
                    : "bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto min-h-[350px]">
          {activeTab === "umum" && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-16 gap-y-4 max-w-7xl">
                {/* Kolom Kiri */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className={labelClass + " mb-0"}>Penomoran</label>
                    <div className="col-span-2 flex gap-1">
                      <select
                        className={inputClass + " flex-1"}
                        value={form.penomoran || ""}
                        onChange={(e) => setForm({ ...form, penomoran: e.target.value })}
                      >
                        <option value="">-- Pilih Penomoran --</option>
                        {penjatahans?.map((p) => (
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
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className={labelClass}>No. Faktur Pajak</label>
                    <div className="col-span-2 flex gap-1">
                      <input
                        type="text"
                        className={inputClass + " flex-1"}
                        value={form.no_fp || ""}
                        onChange={(e) => setForm({ ...form, no_fp: e.target.value })}
                        placeholder="Contoh: 010.000-20.00000001"
                        maxLength={19}
                        pattern="\d{3}\.\d{3}-\d{2}\.\d{8}"
                        title="Format: XXX.XXX-XX.XXXXXXXX"
                      />
                      <button
                        type="button"
                        onClick={onAutoGenerate}
                        className="px-2 border border-slate-300 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-sm"
                        title="Auto Generate No FP dari Penomoran"
                      >
                        <Calculator size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className={labelClass + " mb-0"}>Tgl Faktur Pajak</label>
                    <div className="col-span-2 flex gap-2">
                      <input
                        type="date"
                        className={inputClass}
                        value={form.tgl_fp || ""}
                        onChange={(e) => setForm({ ...form, tgl_fp: e.target.value })}
                      />
                      <select
                        className={inputClass + " w-24"}
                        value={form.mata_uang || "IDR"}
                        onChange={(e) => setForm({ ...form, mata_uang: e.target.value })}
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
                        onChange={(e) => setForm({ ...form, pembeli_id: e.target.value })}
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
                        className={inputClass + " bg-slate-50 text-slate-500"}
                        value={selectedPelanggan?.alamat || selectedPelanggan?.alamat_wp || ""}
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
                        className={inputClass + " bg-slate-50 text-slate-500"}
                        value={selectedPelanggan?.npwp || ""}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className={labelClass + " mb-0"}>FP Yang Diganti</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="flex relative flex-1">
                        <input
                          type="text"
                          className={inputClass + " pr-8 w-full"}
                          value={form.fp_diganti || ""}
                          onChange={(e) => setForm({ ...form, fp_diganti: e.target.value })}
                        />
                        <button 
                          onClick={onOpenFpPenggantiModal}
                          type="button"
                          className="absolute right-1 top-0.5 bottom-0.5 px-2 text-slate-400 hover:text-blue-600 bg-white flex items-center justify-center"
                          title="Cari Faktur Pajak"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-slate-700 shrink-0">Tgl</label>
                        <input
                          type="date"
                          className={inputClass + " w-[130px]"}
                          value={form.tgl_fp_diganti || ""}
                          onChange={(e) => setForm({ ...form, tgl_fp_diganti: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className={labelClass + " mb-0"}>Jenis Transaksi</label>
                    <div className="col-span-2">
                      <select
                        className={inputClass}
                        value={form.jenis_transaksi || ""}
                        onChange={(e) => setForm({ ...form, jenis_transaksi: e.target.value })}
                      >
                        <option value="01 - Kepada Bukan Pemungut PPN">01 - Kepada Bukan Pemungut PPN</option>
                        <option value="02 - Kepada Pemungut Bendaharawan">02 - Kepada Pemungut Bendaharawan</option>
                        <option value="03 - Kepada Pemungut Selain Bendaharawan">03 - Kepada Pemungut Selain Bendaharawan</option>
                        <option value="04 - DPP Nilai Lain">04 - DPP Nilai Lain</option>
                        <option value="06 - Penyerahan Lainnya">06 - Penyerahan Lainnya</option>
                        <option value="07 - Penyerahan Tidak Dipungut PPN">07 - Penyerahan Tidak Dipungut PPN</option>
                        <option value="08 - Penyerahan Dibebaskan PPN">08 - Penyerahan Dibebaskan PPN</option>
                        <option value="09 - Penyerahan Aktiva Pasal 16D">09 - Penyerahan Aktiva Pasal 16D</option>
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
                        onChange={(e) => setForm({ ...form, jenis_status: e.target.value })}
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
                      <select
                        className={inputClass}
                        value={form.no_invoice || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const applyInvoice = (invoice: any) => {
                            if (invoice) {
                              setForm({
                                ...form,
                                no_invoice: val,
                                pembeli_id: invoice.pembeli_id || form.pembeli_id,
                                lines: invoice.lines && invoice.lines.length > 0 ? invoice.lines : form.lines,
                              });
                            } else {
                              setForm({ ...form, no_invoice: val });
                            }
                          };

                          const inv = invoices?.find((i) => i.no_invoice === val);
                          if (form.lines && form.lines.length > 0 && inv && inv.lines && inv.lines.length > 0) {
                            confirm.show(
                              "Apakah Anda yakin ingin mengganti detail barang dengan data dari Invoice ini?",
                              "Semua baris barang yang sudah diinput akan diganti.",
                              "warning",
                              () => applyInvoice(inv)
                            );
                          } else {
                            applyInvoice(inv);
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
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className={labelClass + " mb-0"}>Tarif PPN</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="number"
                        className={inputClass + " w-20"}
                        value={form.tarif_ppn || 0}
                        onChange={(e) => setForm({ ...form, tarif_ppn: parseFloat(e.target.value) || 0 })}
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
                        onChange={(e) => setForm({ ...form, kurs_pajak: parseFloat(e.target.value) || 0 })}
                      />
                      <span className="text-xs font-bold">1 {form.mata_uang || "IDR"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-start">
                    <label className={labelClass + " mt-1.5"}>Tanda Tangan</label>
                    <div className="col-span-2 flex flex-col gap-2">
                      <select
                        className={inputClass}
                        value={form.penandatangan || ""}
                        onChange={(e) => {
                          const selected = tandaTangans.find(t => t.nama === e.target.value);
                          setForm({ 
                            ...form, 
                            penandatangan: e.target.value,
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
                      
                      {tandaTangans?.find(t => t.nama === form.penandatangan)?.ttd_image && (
                        <div className="border border-slate-200 rounded-sm p-1 bg-white shadow-sm w-max">
                          <img 
                            src={`data:image/png;base64,${tandaTangans.find(t => t.nama === form.penandatangan)?.ttd_image}`} 
                            alt="Tanda Tangan" 
                            className="h-16 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className={labelClass + " mb-0"}>Jabatan</label>
                    <div className="col-span-2">
                      <select
                        className={inputClass}
                        value={form.jabatan || ""}
                        onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                      >
                        <option value="">-- Pilih --</option>
                        {tandaTangans?.map((t) => (
                          <option key={t.id} value={t.jabatan}>
                            {t.jabatan}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-start">
                    <label className={labelClass + " mt-1.5"}>Ket Tambahan</label>
                    <div className="col-span-2">
                      <textarea
                        rows={2}
                        className={inputClass}
                        value={form.ket_tambahan || ""}
                        onChange={(e) => setForm({ ...form, ket_tambahan: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "detail" && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-800">Detail Barang / Jasa</h3>
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
              <div className="overflow-x-auto border border-slate-200 rounded-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2 font-bold text-slate-700 w-10 text-center">No.</th>
                      <th className="px-3 py-2 font-bold text-slate-700 min-w-[200px]">Barang</th>
                      <th className="px-3 py-2 font-bold text-slate-700 w-16">Satuan</th>
                      <th className="px-3 py-2 font-bold text-slate-700 w-24">Kuantum</th>
                      <th className="px-3 py-2 font-bold text-slate-700 w-32">Harga Satuan</th>
                      <th className="px-3 py-2 font-bold text-slate-700 w-24">Disc Footer</th>
                      <th className="px-3 py-2 font-bold text-slate-700 w-32">Harga Jual</th>
                      <th className="px-3 py-2 font-bold text-slate-700 w-16 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(!form.lines || form.lines.length === 0) && (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-slate-500 italic">
                          Belum ada detail barang. Klik "Tambah Baris" untuk menambahkan.
                        </td>
                      </tr>
                    )}
                    {(form.lines || []).map((line: any, idx: number) => (
                      <tr key={idx} className="group hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-center text-slate-400 font-medium">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <select
                            className={inputClass}
                            value={line.item_id || ""}
                            onChange={(e) => {
                              const selectedItem = items.find((i) => i.id === Number(e.target.value));
                              onUpdateLine(idx, {
                                ...line,
                                item_id: selectedItem?.id || null,
                                satuan: selectedItem?.satuan || "Pcs",
                                harga_satuan: selectedItem?.harga_jual_1 || 0,
                                harga_jual: ((selectedItem?.harga_jual_1 || 0) * (line.kuantum || 1)) - (line.disc_footer || 0),
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
                            type="text"
                            className={inputClass}
                            value={line.satuan || ""}
                            onChange={(e) => {
                              onUpdateLine(idx, {
                                ...line,
                                satuan: e.target.value,
                              });
                            }}
                          />
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
                                harga_jual: (qty * (line.harga_satuan || 0)) - (line.disc_footer || 0),
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
                                harga_jual: (price * (line.kuantum || 0)) - (line.disc_footer || 0),
                              });
                            }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            className={inputClass + " text-right"}
                            value={line.disc_footer || 0}
                            onChange={(e) => {
                              const disc = parseFloat(e.target.value) || 0;
                              onUpdateLine(idx, {
                                ...line,
                                disc_footer: disc,
                                harga_jual: ((line.kuantum || 0) * (line.harga_satuan || 0)) - disc,
                              });
                            }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            readOnly
                            className={inputClass + " text-right bg-slate-50 font-semibold"}
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
          )}
        </div>

        {/* Footer Summary aligned to match Sales Order */}
        <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col lg:flex-row gap-8 justify-between shrink-0">
          <div className="flex-1 max-w-xl">
             <label className="block text-sm font-semibold text-slate-800 mb-2">Keterangan Tambahan:</label>
             <textarea
               className="w-full h-32 p-3 border border-slate-300 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm resize-none bg-white rounded-sm shadow-sm disabled:bg-slate-100 disabled:text-slate-500"
               value={form.ket_tambahan || ""}
               onChange={(e) => setForm({ ...form, ket_tambahan: e.target.value })}
             />
          </div>
          
          <div className="w-full max-w-sm space-y-3 pt-2">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
              <span>Harga Jual:</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">{form.mata_uang || "IDR"}</span>
                <span className="text-right w-32 px-2 py-1">
                  {Number(totalHargaJual || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
              <span>Dikurangi Potongan Harga:</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-400">{form.mata_uang || "IDR"}</span>
                <input
                  type="number"
                  className="w-32 border border-slate-300 rounded-sm px-2 py-1 outline-none focus:border-blue-500 text-right bg-white"
                  value={form.potongan || 0}
                  onChange={(e) => setForm({ ...form, potongan: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
              <span>Dikurangi Uang Muka:</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-400">{form.mata_uang || "IDR"}</span>
                <input
                  type="number"
                  className="w-32 border border-slate-300 rounded-sm px-2 py-1 outline-none focus:border-blue-500 text-right bg-white"
                  value={form.uang_muka || 0}
                  onChange={(e) => setForm({ ...form, uang_muka: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="h-px bg-slate-200 my-4"></div>
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-semibold">
                <input 
                  type="checkbox" 
                  checked={form.is_dpp_valas || false}
                  onChange={(e) => setForm({ ...form, is_dpp_valas: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Dasar Pengenaan Pajak Valas 100/110
              </label>
            </div>
            <div className="flex justify-between items-center text-base">
              <span className="font-bold text-slate-800">Dasar Pengenaan Pajak (DPP):</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{form.mata_uang || "IDR"}</span>
                <span className="font-mono text-lg font-bold text-slate-800 text-right w-32">
                  {Number(dppSetelahPotongan || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center text-base">
              <span className="font-bold text-slate-800">PPN ({form.tarif_ppn || 11}%):</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{form.mata_uang || "IDR"}</span>
                <span className="font-mono text-lg font-bold text-slate-800 text-right w-32">
                  {Number(ppn || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                disabled={!form.id}
                onClick={onDelete}
                className="px-6 py-3 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-50"
              >
                <Trash2 size={16} /> HAPUS FP
              </button>
              <button
                disabled={isSaving}
                onClick={onSave}
                className="px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md w-full disabled:bg-slate-400"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isSaving ? "MENYIMPAN..." : "SIMPAN FAKTUR PAJAK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
