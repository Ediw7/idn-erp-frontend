import React, { useState, useEffect, useRef } from "react";
import { setupApi } from "../api";
import toast from "react-hot-toast";

const SetupPreferensi: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"sistem" | "pajak" | "akuntansi">(
    "sistem",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const backupFolderRef = useRef<HTMLInputElement>(null);
  const csvFolderRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<any>({
    folderDatabase: "postgresql://db-cluster-01.ediaccounting.internal:5432",
    fileDatabase: "edi_accounting_production",

    logoTercetak: false,
    ttdTercetak: false,
    tglSistemPajak: "2026-06-09",
    hariJatuhTempo: "30",
    toleransiKredit: "10",
    mataUangDasar: "IDR",
    formatPenomoran: "INV/[YY]/[MM]/[000]",
    pembulatan: "0",
    namaPencetak: "Administrator",
    jabatanPencetak: "Finance Manager",
    namaPemeriksa: "Supervisor",
    jabatanPemeriksa: "Finance SPV",
    namaPenyetuju: "Direktur Utama",
    jabatanPenyetuju: "Director",
    tglSistem: "2026-06-09",
    batasWaktuEdit: "7",
    folderBackupData: "s3://ediaccounting-enterprise-backup/daily",
    folderCsvFaktur: "s3://ediaccounting-efaktur-EKSPOR/csv",
    namaFileLogo: "https://cdn.ediaccounting.com/assets/corporate_logo.png",
    lebarLogo: 0.9,
    tinggiLogo: 0.75,
    dokumenPemotonganInventory: "Surat Jalan",
    validasiQtyMinusSj: true,
    validasiQtyMinusSo: true,
    tarifPpn: 10.0,
    tarifPph22: 0.0,
    kodeCabangFp: "000",
    selisihHariInvoiceFaktur: 0,
    notifSisaFakturKurangDari: 5,
    desimalKuantum: 2,
    desimalHargaSatuan: 2,
    desimalJumlah: 2,
    umurPiutang1Sd: 30,
    umurPiutang2Mulai: 31,
    umurPiutang2Sd: 60,
    umurPiutang3Mulai: 61,
    umurPiutang3Sd: 90,
    umurPiutang4Mulai: 91,
    umurPiutang4Sd: 120,
    umurPiutang5Mulai: 121,
    ketLembar3Fp: "Lembar Ke-3 : Untuk Arsip",
    ketLembar4Fp: "Lembar Ke-4 : Untuk Arsip",
    perkPiutang: "1104",
    perkPenjualan: "4101",
    perkUangMukaPenj: "2102",
    perkDiscPenjualan: "4103",
    perkPpn: "2109005",
    perkPph22: "2109004",
    footerInvoiceVat:
      "Pembayaran untuk invoice ini mohon ditransfer ke rekening :\nBank BCA Cab. Sudirman\nNo. Rekening : 035-0123456\nAtas Nama PT EDI Accounting System",
    footerInvoiceNonVat:
      "Pembayaran untuk invoice ini mohon ditransfer ke rekening :\nBank BCA Cab. KPO Asemka\nNo. Rekening : 001-0123456\nAtas Nama EDI Accounting",
    footerKwitansiVat:
      "Catatan :\n1. Pembayaran untuk invoice ini mohon ditransfer ke rekening :\n   Bank BCA Cab. Sudirman\n   No. Rekening : 035-0123456\n   Atas Nama PT EDI Accounting System",
    footerKwitansiNonVat:
      "Catatan :\n1. Pembayaran untuk invoice ini mohon ditransfer ke rekening :\n   Bank BCA Cab. KPO Asemka\n   No. Rekening : 001-0123456\n   Atas Nama EDI Accounting",
  });

  useEffect(() => {
    const fetchPreferensi = async () => {
      try {
        const data = await setupApi.getPreferensi();
        if (data && Object.keys(data).length > 0) {
          setFormData((prev: any) => ({ ...prev, ...data }));
        }
      } catch (error) {
        toast.error("Gagal memuat data preferensi dari server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferensi();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      finalValue = parseFloat(value) || 0;
    }

    setFormData({ ...formData, [name]: finalValue });
  };

  const handleBackupFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // @ts-ignore
      const path =
        file.path ||
        (file.webkitRelativePath
          ? file.webkitRelativePath.split("/")[0]
          : file.name);
      setFormData((prev: any) => ({ ...prev, folderBackupData: path }));
    }
  };

  const handleCsvFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // @ts-ignore
      const path =
        file.path ||
        (file.webkitRelativePath
          ? file.webkitRelativePath.split("/")[0]
          : file.name);
      setFormData((prev: any) => ({ ...prev, folderCsvFaktur: path }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({
          ...prev,
          namaFileLogo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await setupApi.updatePreferensi(formData);
      toast.success(response.message || "Data preferensi berhasil disimpan!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm transition-colors";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1";

  return (
    <div className="bg-white shadow-sm border border-slate-300">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Preferensi</h2>
          <p className="text-xs text-slate-300 mt-1">
            Konfigurasi pengaturan sistem, database, pajak, dan parameter dasar
            aplikasi.
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("sistem")}
            className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${activeTab === "sistem" ? "text-slate-800 border-b-2 border-slate-800" : "text-slate-500 hover:text-slate-700"}`}
          >
            Sistem & Database
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pajak")}
            className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${activeTab === "pajak" ? "text-slate-800 border-b-2 border-slate-800" : "text-slate-500 hover:text-slate-700"}`}
          >
            Pajak & Format
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("akuntansi")}
            className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${activeTab === "akuntansi" ? "text-slate-800 border-b-2 border-slate-800" : "text-slate-500 hover:text-slate-700"}`}
          >
            Akuntansi & Cetakan
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: Sistem & Database */}
          {activeTab === "sistem" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4">
                  Pengaturan Direktori
                </h3>
                <div>
                  <label className={labelClass}>Folder Database</label>
                  <input
                    type="text"
                    name="folderDatabase"
                    value={formData.folderDatabase}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>File Database</label>
                  <input
                    type="text"
                    name="fileDatabase"
                    value={formData.fileDatabase}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Folder Backup Data</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="folderBackupData"
                      value={formData.folderBackupData}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Pilih folder backup..."
                    />
                    <button
                      type="button"
                      onClick={() => backupFolderRef.current?.click()}
                      className="px-3 bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 transition-colors font-bold rounded-sm"
                    >
                      ...
                    </button>
                    {/* @ts-ignore */}
                    <input
                      type="file"
                      ref={backupFolderRef}
                      onChange={handleBackupFolderChange}
                      webkitdirectory="true"
                      directory="true"
                      className="hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Folder File CSV e-Faktur</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="folderCsvFaktur"
                      value={formData.folderCsvFaktur}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Pilih folder ekspor..."
                    />
                    <button
                      type="button"
                      onClick={() => csvFolderRef.current?.click()}
                      className="px-3 bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 transition-colors font-bold rounded-sm"
                    >
                      ...
                    </button>
                    {/* @ts-ignore */}
                    <input
                      type="file"
                      ref={csvFolderRef}
                      onChange={handleCsvFolderChange}
                      webkitdirectory="true"
                      directory="true"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4">
                  Pengaturan Aplikasi
                </h3>
                <div>
                  <label className={labelClass}>Logo Perusahaan</label>
                  <div className="flex items-start gap-4 p-3 border border-dashed border-slate-300 bg-slate-50 rounded-sm">
                    <div className="flex-1 flex flex-col justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-400 mt-2">
                        Maksimal ukuran file 2MB. Format: JPG, PNG.
                      </p>
                    </div>
                    {formData.namaFileLogo && (
                      <div className="w-24 h-24 border border-slate-200 bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
                        <img
                          src={formData.namaFileLogo}
                          alt="Logo Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Lebar Logo (inch)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="lebarLogo"
                      value={formData.lebarLogo}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tinggi Logo (inch)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="tinggiLogo"
                      value={formData.tinggiLogo}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>
                    Dokumen Pemotongan Inventory
                  </label>
                  <select
                    name="dokumenPemotonganInventory"
                    value={formData.dokumenPemotonganInventory}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Surat Jalan">Surat Jalan</option>
                    <option value="Invoice">Invoice</option>
                  </select>
                </div>
                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="validasiQtyMinusSj"
                      name="validasiQtyMinusSj"
                      checked={formData.validasiQtyMinusSj}
                      onChange={handleChange}
                      className="w-4 h-4 text-slate-800 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <label
                      htmlFor="validasiQtyMinusSj"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Validasi Qty Stok Minus di Surat Jalan
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="validasiQtyMinusSo"
                      name="validasiQtyMinusSo"
                      checked={formData.validasiQtyMinusSo}
                      onChange={handleChange}
                      className="w-4 h-4 text-slate-800 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <label
                      htmlFor="validasiQtyMinusSo"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Validasi Qty Stok Minus di Sales Order
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Pajak & Format */}
          {activeTab === "pajak" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4">
                  Pengaturan Perpajakan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Tarif PPN (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="tarifPpn"
                      value={formData.tarifPpn}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tarif PPh 22 (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="tarifPph22"
                      value={formData.tarifPph22}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Kode Cabang Faktur Pajak</label>
                  <input
                    type="text"
                    name="kodeCabangFp"
                    value={formData.kodeCabangFp}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Selisih Hari Tgl Invoice dengan Tgl Faktur Pajak
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="selisihHariInvoiceFaktur"
                      value={formData.selisihHariInvoiceFaktur}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <span className="text-sm text-slate-600">Hari</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>
                    Tampilkan Notifikasi Jika Sisa No Faktur Pajak Kurang Dari
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="notifSisaFakturKurangDari"
                      value={formData.notifSisaFakturKurangDari}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <span className="text-sm text-slate-600">Nomor</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4">
                  Pengaturan Desimal
                </h3>
                <div>
                  <label className={labelClass}>Desimal Kuantum (Digit)</label>
                  <input
                    type="number"
                    name="desimalKuantum"
                    value={formData.desimalKuantum}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Desimal Harga Satuan (Digit)
                  </label>
                  <input
                    type="number"
                    name="desimalHargaSatuan"
                    value={formData.desimalHargaSatuan}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Desimal Jumlah (Digit)</label>
                  <input
                    type="number"
                    name="desimalJumlah"
                    value={formData.desimalJumlah}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Akuntansi & Cetakan */}
          {activeTab === "akuntansi" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4">
                  Pengelompokan Umur Piutang
                </h3>
                <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="w-1/2">Kelompok 1 (Mulai dari - s/d)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">-</span>
                      <input
                        type="number"
                        name="umurPiutang1Sd"
                        value={formData.umurPiutang1Sd}
                        onChange={handleChange}
                        className={`${inputClass} w-20 text-center py-1`}
                      />
                      <span className="text-slate-500 w-8">hari</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="w-1/2">Kelompok 2 (Mulai dari - s/d)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="umurPiutang2Mulai"
                        value={formData.umurPiutang2Mulai}
                        onChange={handleChange}
                        className={`${inputClass} w-20 text-center py-1`}
                      />
                      <input
                        type="number"
                        name="umurPiutang2Sd"
                        value={formData.umurPiutang2Sd}
                        onChange={handleChange}
                        className={`${inputClass} w-20 text-center py-1`}
                      />
                      <span className="text-slate-500 w-8">hari</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="w-1/2">Kelompok 3 (Mulai dari - s/d)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="umurPiutang3Mulai"
                        value={formData.umurPiutang3Mulai}
                        onChange={handleChange}
                        className={`${inputClass} w-20 text-center py-1`}
                      />
                      <input
                        type="number"
                        name="umurPiutang3Sd"
                        value={formData.umurPiutang3Sd}
                        onChange={handleChange}
                        className={`${inputClass} w-20 text-center py-1`}
                      />
                      <span className="text-slate-500 w-8">hari</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="w-1/2">Kelompok 4 (Mulai dari - s/d)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="umurPiutang4Mulai"
                        value={formData.umurPiutang4Mulai}
                        onChange={handleChange}
                        className={`${inputClass} w-20 text-center py-1`}
                      />
                      <input
                        type="number"
                        name="umurPiutang4Sd"
                        value={formData.umurPiutang4Sd}
                        onChange={handleChange}
                        className={`${inputClass} w-20 text-center py-1`}
                      />
                      <span className="text-slate-500 w-8">hari</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="w-1/2">Kelompok 5 (Mulai dari - dst)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="umurPiutang5Mulai"
                        value={formData.umurPiutang5Mulai}
                        onChange={handleChange}
                        className={`${inputClass} w-20 text-center py-1`}
                      />
                      <span className="text-slate-500 w-20 text-center">
                        seterusnya
                      </span>
                      <span className="text-slate-500 w-8"></span>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4 mt-6">
                  Pemetaan Perkiraan Akun
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Perk. Piutang</label>
                    <select
                      name="perkPiutang"
                      value={formData.perkPiutang}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="1104">1104</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Perk. Penjualan</label>
                    <select
                      name="perkPenjualan"
                      value={formData.perkPenjualan}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="4101">4101</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Perk. Uang Muka Penj</label>
                    <select
                      name="perkUangMukaPenj"
                      value={formData.perkUangMukaPenj}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="2102">2102</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Perk. Disc Penjualan</label>
                    <select
                      name="perkDiscPenjualan"
                      value={formData.perkDiscPenjualan}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="4103">4103</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Perk. PPN</label>
                    <select
                      name="perkPpn"
                      value={formData.perkPpn}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="2109005">2109005</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Perk. PPh 22</label>
                    <select
                      name="perkPph22"
                      value={formData.perkPph22}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="2109004">2109004</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4">
                  Pengaturan Cetakan
                </h3>
                <div>
                  <label className={labelClass}>
                    Ket. Lembar ke-3 Faktur Pajak
                  </label>
                  <input
                    type="text"
                    name="ketLembar3Fp"
                    value={formData.ketLembar3Fp}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Ket. Lembar ke-4 Faktur Pajak
                  </label>
                  <input
                    type="text"
                    name="ketLembar4Fp"
                    value={formData.ketLembar4Fp}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="pt-2">
                  <label className={labelClass}>
                    Keterangan Footer Invoice VAT
                  </label>
                  <textarea
                    name="footerInvoiceVat"
                    value={formData.footerInvoiceVat}
                    onChange={handleChange}
                    rows={3}
                    className={`${inputClass} resize-none text-xs`}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Keterangan Footer Invoice Non-VAT
                  </label>
                  <textarea
                    name="footerInvoiceNonVat"
                    value={formData.footerInvoiceNonVat}
                    onChange={handleChange}
                    rows={3}
                    className={`${inputClass} resize-none text-xs`}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Keterangan Footer Kwitansi VAT
                  </label>
                  <textarea
                    name="footerKwitansiVat"
                    value={formData.footerKwitansiVat}
                    onChange={handleChange}
                    rows={3}
                    className={`${inputClass} resize-none text-xs`}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Keterangan Footer Kwitansi Non-VAT
                  </label>
                  <textarea
                    name="footerKwitansiNonVat"
                    value={formData.footerKwitansiNonVat}
                    onChange={handleChange}
                    rows={3}
                    className={`${inputClass} resize-none text-xs`}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 mt-8 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 text-xs font-semibold text-white bg-slate-800 border border-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? "MENYIMPAN..." : "SIMPAN PENGATURAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupPreferensi;
